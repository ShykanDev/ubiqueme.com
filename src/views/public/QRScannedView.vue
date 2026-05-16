<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/firebase'
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth'
import CloudLoader from '@/components/ui/CloudLoader.vue'
import HomeLayout from '@/layouts/HomeLayout.vue'
import type { IPublicQR } from '@/interfaces/IPublicQR'
import { toast } from 'vue-sonner'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const userStore = useUserStore()
const qrId = route.params.qrId as string

// State
const loading = ref(true)
const isAuthenticating = ref(false)
const qrData = ref<IPublicQR | null>(null)
const errorMsg = ref('')
const QRName = computed(() => qrData.value?.name || 'objeto')
const customMessage = ref('')
const isSending = ref(false)
const hasSent = ref(false)

// Configurar el número oficial de Meta WhatsApp en tu archivo .env
const whatsappNumber = '+15556322742'

const defaultBody = computed(() => {
  return `Hola, acabo de encontrar su artículo protegido por Ubiqueme: "${QRName.value}".`
})

watch(QRName, () => {
  if (!customMessage.value || customMessage.value.startsWith('Hola, acabo de encontrar tu artículo protegido por Ubiqueme: "objeto"')) {
    customMessage.value = defaultBody.value
  }
})

const buttonText = computed(() => {
  if (isAuthenticating.value) return 'Identificando...'
  if (isSending.value) return 'Enviando...'
  if (hasSent.value) return '¡Enviado!'
  return 'Enviar Mensaje'
})

const copyToClipboard = async (text: string, field: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(`${field} copiado al portapapeles`)
  } catch (err) {
    toast.error('Error al copiar al portapapeles')
  }
}

const loadQRData = async () => {
  try {
    if (!qrId) throw new Error()
    const docSnap = await getDoc(doc(db, 'publicQR', qrId))
    if (!docSnap.exists()) throw new Error()
    qrData.value = docSnap.data() as IPublicQR
  } catch (e) {
    errorMsg.value = "No se encontró información sobre este QR"
  } finally {
    loading.value = false
  }
}

const handleCredentialResponse = async (response: any) => {
  try {
    isAuthenticating.value = true
    const credential = GoogleAuthProvider.credential(response.credential)
    const userCredential = await signInWithCredential(auth, credential)
    const user = userCredential.user

    // Register scanner in DB silently
    const userRef = doc(db, 'users', user.uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || 'Usuario QR',
        email: user.email,
        phone: '',
        role: 'scanner', // Mantenemos 'scanner' para diferenciar el origen
        isActive: true,
        isBanned: false,
        banReason: '',
        plan: 'alpha',
        subscriptionStatus: 'active',
        planPurchasedAt: serverTimestamp(),
        planEndDate: null,
        paymentProviderId: '',
        totalQRs: 0,
        preferences: {
          emailNotifications: false,
          smsNotifications: false,
          whatsappNotifications: false
        },
        lastLoginAt: serverTimestamp(),
        createdAt: serverTimestamp()
      })
    }

    toast.success(`Identificado como ${user.email}`)
    await sendMessageToAPI()
  } catch (error: any) {
    console.error("One Tap Error:", error)
    if (error.code === 'auth/account-exists-with-different-credential') {
      toast.error('Este correo ya está registrado con contraseña. Por favor inicie sesión tradicionalmente.')
    } else {
      toast.error('Error al identificar la cuenta. Intente de nuevo.')
    }
  } finally {
    isAuthenticating.value = false
  }
}

const sendMessageToAPI = async () => {
  try {
    isSending.value = true
    const workerUrl = import.meta.env.VITE_WORKER_URL || 'http://127.0.0.1:8787'
    const res = await fetch(`${workerUrl}/api/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        qrId,
        message: customMessage.value,
        scannerEmail: userStore.email
      })
    })

    if (!res.ok) throw new Error('Error en el servidor')

    hasSent.value = true
    toast.success('Mensaje enviado exitosamente. El propietario ha sido notificado.')
  } catch (error) {
    console.error(error)
    toast.error('Ocurrió un error al enviar el mensaje. Intente de nuevo.')
  } finally {
    isSending.value = false
  }
}

const handleSendClick = async () => {
  if (!customMessage.value.trim()) {
    toast.error('Por favor escribe un mensaje.')
    return
  }

  if (userStore.isAuthenticated) {
    await sendMessageToAPI()
    return
  }

  // @ts-ignore
  if (window.google && window.google.accounts && window.google.accounts.id) {
    // @ts-ignore
    window.google.accounts.id.prompt()
  } else {
    toast.error('Error al cargar autenticación. Refresque la página.')
  }
}

onMounted(() => {
  customMessage.value = defaultBody.value
  loadQRData()

  // Si NO está autenticado, pre-inicializamos Google One Tap
  if (!userStore.isAuthenticated) {
    setTimeout(() => {
      // @ts-ignore
      if (window.google && window.google.accounts && window.google.accounts.id) {
        // @ts-ignore
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
        })
      }
    }, 1000)
  }
})
</script>

<template>
  <HomeLayout>
    <template #main>
      <main class="relative min-h-screen bg-[#09090b] overflow-x-hidden font-google-sans text-white">

        <!-- 🎨 BACKGROUND ORNAMENTATION (Blueprint Style) -->
        <div class="fixed inset-0 z-0 pointer-events-none">
          <!-- Circular shapes -->
          <div
            class="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none">
          </div>
          <div
            class="absolute top-[20%] left-[-5%] w-[300px] h-[300px] border border-orange-500/5 rounded-full pointer-events-none">
          </div>
          <div
            class="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] border border-white/5 rounded-full pointer-events-none">
          </div>

          <!-- Grid Pattern -->
          <div class="absolute inset-0 z-0 opacity-[0.22]"
            style="background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 100px 100px;">
          </div>

          <!-- Decorative Icons -->
          <div class="absolute inset-0 opacity-[0.05] select-none">
            <span
              class="material-symbols-outlined absolute top-[15%] left-[5%] text-8xl animate-float-slow">qr_code_2</span>
            <span
              class="material-symbols-outlined absolute top-[40%] right-[8%] text-9xl animate-float-medium text-orange-500">security</span>
            <span
              class="material-symbols-outlined absolute bottom-[20%] left-[10%] text-7xl animate-float-fast">notifications_active</span>
            <span
              class="material-symbols-outlined absolute top-[10%] right-[15%] text-[12rem] animate-float-slow opacity-20">fingerprint</span>
            <span
              class="material-symbols-outlined absolute bottom-[10%] right-[12%] text-8xl animate-float-slow text-orange-500">verified_user</span>
          </div>
        </div>

        <div class="relative z-10 flex flex-col items-center pt-8 md:pt-28 pb-10 md:pb-20 px-4 md:px-6 max-w-2xl mx-auto w-full">

          <CloudLoader v-if="loading" />

          <!-- ❌ ERROR STATE -->
          <div v-else-if="errorMsg"
            class="w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div
              class="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-center justify-center mx-auto">
              <span class="material-symbols-outlined text-red-500 text-5xl">error</span>
            </div>
            <div class="space-y-2">
              <h1 class="text-3xl font-black italic uppercase tracking-tighter">QR Inexistente</h1>
              <p class="text-white/40 text-sm max-w-xs mx-auto">{{ errorMsg }}</p>
            </div>
            <button @click="$router.push('/')"
              class="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all">Volver
              al Inicio</button>
          </div>

          <!-- 🚀 MAIN CONTENT (Google Modern Redesign) -->
          <div v-else class="w-full space-y-0 md:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">

            <!-- 🆔 SECURITY DOSSIER CARD (Redesigned) -->
            <div
              class="hidden md:block w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group shadow-2xl">
              <!-- Subtle Scanline Effect -->
              <div
                class="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent h-2 w-full animate-scanline opacity-20 pointer-events-none">
              </div>

              <!-- Header Info -->
              <div class="flex justify-between items-center border-b border-white/10 pb-4">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span class="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Reporte de
                    Seguridad</span>
                </div>
                <span class="text-[9px] font-mono text-orange-500/60 tracking-widest">v4.0.2 // UBIQUEME</span>
              </div>

              <div class="flex flex-col md:flex-row items-center gap-4 md:gap-8 py-2 md:py-4">
                <!-- Icon Focus -->
                <div class="relative flex-shrink-0">
                  <div
                    class="w-32 h-32 bg-orange-500 rounded-[2rem] flex items-center justify-center border-4 border-[#09090b] shadow-[0_20px_50px_rgba(249,115,22,0.3)] group-hover:scale-105 transition-transform">
                    <span class="material-symbols-outlined text-[#09090b] text-6xl font-black">qr_code_2</span>
                  </div>
                  <div
                    class="absolute -bottom-2 -right-2 bg-green-500 text-[#09090b] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1 border-2 border-[#09090b] shadow-lg">
                    <span class="material-symbols-outlined text-[10px] font-black">check</span> Activo
                  </div>
                </div>

                <!-- Data Grid -->
                <div class="flex-grow grid grid-cols-2 gap-x-8 gap-y-4 w-full text-center md:text-left">
                  <div class="col-span-2 space-y-1">
                    <label class="text-[9px] font-black text-white/30 uppercase tracking-widest">Identificación del
                      Objeto</label>
                    <h2 class="text-3xl font-black tracking-tighter text-[#dce7ff] uppercase italic">{{ QRName }}</h2>
                  </div>

                  <div class="space-y-1">
                    <label class="text-[9px] font-black text-white/30 uppercase tracking-widest">Serial ID</label>
                    <p class="font-mono text-orange-500 text-sm tracking-widest">{{ qrId.substring(0, 10).toUpperCase()
                      }}</p>
                  </div>

                  <div class="space-y-1">
                    <label class="text-[9px] font-black text-white/30 uppercase tracking-widest">Historial</label>
                    <p class="text-white font-black text-sm uppercase italic tracking-tight">{{ qrData?.totalScans || 0
                      }} Escaneos totales</p>
                  </div>

                  <div class="col-span-2 pt-4 border-t border-white/5 flex items-center gap-4">
                    <div class="flex-1 h-[1px] bg-white/5"></div>
                    <span class="text-[8px] font-black text-white/20 uppercase tracking-[0.5em]">Protocolo de Privacidad
                      Cifrado</span>
                    <div class="flex-1 h-[1px] bg-white/5"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 📝 INTERACTION CARD (Material Focus) -->
            <div
              class="bg-transparent md:bg-white/5 border-0 md:border border-white/10 rounded-[2rem] md:rounded-[3rem] p-0 md:p-2 overflow-visible md:overflow-hidden shadow-none md:shadow-2xl relative w-full mt-4 md:mt-0">
              <div class="bg-[#09090b] md:bg-[#09090b] rounded-[2rem] md:rounded-[2.8rem] border md:border-none border-white/10 p-6 md:p-10 space-y-6 md:space-y-10 relative z-10 w-full shadow-2xl md:shadow-none">

                <Transition name="fade-slide" mode="out-in">

                  <!-- MESSAGE FORM HOOK -->
                  <div v-if="!hasSent" class="space-y-6 md:space-y-6 text-center animate-in fade-in duration-500 w-full">

                    <!-- Mobile Header (Hidden on Desktop) -->
                    <div class="block md:hidden space-y-3 mb-6 text-center animate-in zoom-in duration-500">
                      <div class="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-500/20">
                        <span class="material-symbols-outlined text-[12px]">qr_code_2</span>
                        ID: {{ qrId.substring(0, 8).toUpperCase() }}
                      </div>
                      <h2 class="text-4xl font-black tracking-tighter text-[#dce7ff] uppercase italic leading-none">{{ QRName }}</h2>
                      <p class="text-white/40 text-xs max-w-[200px] mx-auto mt-2 leading-tight">Notifica al dueño para coordinar la recuperación.</p>
                    </div>

                    <!-- Desktop Header (Hidden on Mobile) -->
                    <div class="hidden md:block space-y-2">
                      <h3 class="text-xl font-black italic uppercase tracking-tighter">Enviar Mensaje</h3>
                      <p class="text-white/40 text-sm max-w-xs mx-auto">Notifique al propietario de forma segura para
                        coordinar la recuperación.</p>
                    </div>

                    <div class="space-y-4 md:space-y-4 flex flex-col">
                      
                      <!-- WhatsApp Button (Moved to top on mobile) -->
                      <a :href="`https://wa.me/${whatsappNumber}?text=Hola,%20te%20escribo%20porque%20encontré%20tu%20artículo.%0A%0AID:%20${qrId}%0A%0AMensaje:%20${encodeURIComponent(customMessage)}`"
                        target="_blank"
                        class="w-full h-16 md:h-16 bg-[#25D366] text-[#09090b] rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-[0_10px_30px_rgba(37,211,102,0.3)] flex items-center justify-center gap-2 order-1">
                        <svg class="w-6 h-6 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Contactar por WhatsApp
                      </a>

                      <!-- Textarea -->
                      <div class="text-left w-full order-2 mt-4 md:mt-0">
                        <label class="text-[9px] md:text-[9px] font-black text-orange-500 uppercase tracking-widest ml-2">Tu
                          Mensaje (Opcional)</label>
                        <textarea v-model="customMessage" :disabled="isSending || isAuthenticating"
                          class="w-full mt-1 p-4 md:p-4 bg-[#09090b] border border-white/20 hover:border-white/30 rounded-2xl text-sm md:text-sm text-white/80 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors resize-none placeholder:text-white/20 h-20 md:h-[120px]"
                          placeholder="Escribe tu mensaje aquí..."></textarea>
                      </div>

                      <!-- Email Fallback -->
                      <button @click="handleSendClick" :disabled="isAuthenticating || isSending"
                        class="w-full h-14 md:h-14 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-[10px] md:text-xs uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-50 flex items-center justify-center gap-2 order-3 mt-1 md:mt-0">
                        <span v-if="isAuthenticating || isSending"
                          class="material-symbols-outlined animate-spin text-[18px] md:text-[18px]">refresh</span>
                        <span v-else class="material-symbols-outlined text-[18px] md:text-[18px]">mail</span>
                        O Enviar Anónimo por Correo
                      </button>
                    </div>
                  </div>

                  <!-- SUCCESS STATE -->
                  <div v-else class="py-10 text-center space-y-6 animate-in zoom-in duration-500">
                    <div
                      class="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-[2rem] flex items-center justify-center mx-auto">
                      <span class="material-symbols-outlined text-green-500 text-5xl">check_circle</span>
                    </div>
                    <div class="space-y-2">
                      <h3 class="text-2xl font-black italic uppercase tracking-tighter text-green-400">Mensaje Enviado
                      </h3>
                      <p class="text-white/60 text-sm max-w-xs mx-auto">El propietario ha sido notificado exitosamente.
                        Le responderá a su correo.</p>
                    </div>
                    <button @click="$router.push('/')"
                      class="px-10 py-4 mt-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all">Volver
                      al Inicio</button>
                  </div>

                </Transition>
              </div>
            </div>

            <!-- Footer Trust Info -->
            <div class="text-center space-y-6">
              <div class="flex items-center justify-center gap-8 text-white/10">
                <span class="material-symbols-outlined text-2xl">verified_user</span>
                <span class="material-symbols-outlined text-2xl">lock</span>
                <span class="material-symbols-outlined text-2xl">shield_with_heart</span>
              </div>
              <p class="text-[9px] text-white/20 font-black uppercase tracking-[0.6em]">Secure Protocol Ubiqueme</p>
            </div>

          </div>

        </div>
      </main>
    </template>
  </HomeLayout>
</template>

<style scoped>
.font-google-sans {
  font-family: 'Google Sans', sans-serif;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 24;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

.animate-float-slow {
  animation: float 8s ease-in-out infinite;
}

.animate-float-medium {
  animation: float 6s ease-in-out infinite;
  animation-delay: 1s;
}

.animate-float-fast {
  animation: float 4s ease-in-out infinite;
  animation-delay: 0.5s;
}

@keyframes scanline {
  0% {
    top: -100%;
  }

  100% {
    top: 100%;
  }
}

.animate-scanline {
  animation: scanline 4s linear infinite;
}
</style>
