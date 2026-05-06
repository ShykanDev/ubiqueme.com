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

const defaultBody = computed(() => {
  return `Hola, acabo de encontrar tu artículo protegido por Ubiqueme: "${QRName.value}".\n\nPor favor contáctame respondiendo a este correo para ponernos de acuerdo y devolvértelo.\n\n[Añade tus datos de contacto adicionales aquí si lo deseas]`
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

        <div class="relative z-10 flex flex-col items-center pt-28 pb-20 px-6 max-w-2xl mx-auto w-full">

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
          <div v-else class="w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">

            <!-- 🆔 SECURITY DOSSIER CARD (Redesigned) -->
            <div
              class="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-6 md:p-8 space-y-6 relative overflow-hidden group shadow-2xl">
              <!-- Subtle Scanline Effect -->
              <div
                class="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent h-2 w-full animate-scanline opacity-20 pointer-events-none">
              </div>

              <!-- Header Info -->
              <div class="flex justify-between items-center border-b border-white/10 pb-4">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span class="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Reporte de Seguridad</span>
                </div>
                <span class="text-[9px] font-mono text-orange-500/60 tracking-widest">v4.0.2 // UBIQUEME</span>
              </div>

              <div class="flex flex-col md:flex-row items-center gap-8 py-4">
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
              class="bg-white/5 border border-white/10 rounded-[3rem] p-1 md:p-2 overflow-hidden shadow-2xl relative">
              <div class="bg-[#09090b] rounded-[2.8rem] p-6 md:p-10 space-y-10 relative z-10">

                <Transition name="fade-slide" mode="out-in">

                  <!-- MESSAGE FORM HOOK -->
                  <div v-if="!hasSent" class="space-y-6 text-center animate-in fade-in duration-500 w-full">
                    <div class="space-y-2">
                      <h3 class="text-xl font-black italic uppercase tracking-tighter">Enviar Mensaje</h3>
                      <p class="text-white/40 text-sm max-w-xs mx-auto">Notifique al propietario de forma segura para coordinar la recuperación.</p>
                    </div>

                    <div class="space-y-4">
                      <div class="text-left w-full">
                        <label class="text-[9px] font-black text-orange-500 uppercase tracking-widest ml-2">Tu Mensaje</label>
                        <textarea v-model="customMessage" rows="5" :disabled="isSending || isAuthenticating"
                          class="w-full mt-1 p-4 bg-[#09090b] border border-white/20 hover:border-white/30 rounded-2xl text-sm text-white/80 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors resize-none placeholder:text-white/20"
                          placeholder="Escribe tu mensaje aquí..."></textarea>
                      </div>

                      <button @click="handleSendClick" :disabled="isAuthenticating || isSending"
                        class="w-full h-16 bg-white text-[#09090b] rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2">
                        <span v-if="isAuthenticating || isSending" class="material-symbols-outlined animate-spin">refresh</span>
                        <span v-else class="material-symbols-outlined">send</span>
                        {{ buttonText }}
                      </button>
                    </div>
                  </div>

                  <!-- SUCCESS STATE -->
                  <div v-else class="py-10 text-center space-y-6 animate-in zoom-in duration-500">
                    <div class="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-[2rem] flex items-center justify-center mx-auto">
                      <span class="material-symbols-outlined text-green-500 text-5xl">check_circle</span>
                    </div>
                    <div class="space-y-2">
                      <h3 class="text-2xl font-black italic uppercase tracking-tighter text-green-400">Mensaje Enviado</h3>
                      <p class="text-white/60 text-sm max-w-xs mx-auto">El propietario ha sido notificado exitosamente. Le responderá a su correo.</p>
                    </div>
                    <button @click="$router.push('/')"
                      class="px-10 py-4 mt-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all">Volver al Inicio</button>
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
