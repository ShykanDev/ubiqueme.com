<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import CloudLoader from '@/components/ui/CloudLoader.vue'
import HomeLayout from '@/layouts/HomeLayout.vue'
import type { IPublicQR } from '@/interfaces/IPublicQR'
import { toast } from 'vue-sonner'

const route = useRoute()
const qrId = route.params.qrId as string

// State
const loading = ref(true)
const qrData = ref<IPublicQR | null>(null)
const errorMsg = ref('')
const showContactForm = ref(false)

const QRName = computed(() => qrData.value?.name || 'objeto')

const mailtoData = computed(() => {
  const email = 'soporte@ubiqueme.com'
  const subject = `ID:[${qrId}]`
  const body = `Hola, acabo de encontrar tu artículo protegido por Ubiqueme: "${QRName.value}".\n\nPor favor contáctame respondiendo a este correo para ponernos de acuerdo y devolvértelo.\n\n[Añade tus datos de contacto adicionales aquí si lo deseas]`
  
  return {
    email,
    subject,
    body,
    link: `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }
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

onMounted(() => {
  loadQRData()
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

                  <!-- STEP 1: INITIAL BUTTON -->
                  <div v-if="!showContactForm" class="py-10 text-center space-y-8">
                    <div class="space-y-2">
                      <h3 class="text-xl font-black italic uppercase tracking-tighter">¿Encontró este objeto?</h3>
                      <p class="text-white/40 text-sm max-w-xs mx-auto">Notifique al propietario de forma segura y
                        anónima para coordinar la recuperación.</p>
                    </div>
                    <button @click="showContactForm = true"
                      class="w-full max-w-xs h-16 bg-white text-[#09090b] rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)]">Contactar
                      Ahora</button>
                  </div>

                  <!-- STEP 2: MAILTO & FALLBACK OPTIONS -->
                  <div v-else class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    
                    <div class="space-y-4">
                      <h3 class="text-xl font-black italic uppercase tracking-tighter text-center">Contactar al Propietario</h3>
                      <p class="text-white/40 text-sm max-w-xs mx-auto text-center">
                        Elija su método preferido para enviar el mensaje. Su privacidad está protegida.
                      </p>
                    </div>

                    <!-- Option 1: Direct Mailto App -->
                    <a :href="mailtoData.link"
                      class="w-full h-16 bg-orange-500 text-[#09090b] rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(249,115,22,0.2)]">
                      <span class="material-symbols-outlined">mail</span>
                      Abrir App de Correo
                    </a>

                    <div class="relative flex py-4 items-center">
                      <div class="flex-grow border-t border-white/10"></div>
                      <span class="flex-shrink-0 mx-4 text-white/30 text-[10px] font-black uppercase tracking-widest">O enviar manualmente</span>
                      <div class="flex-grow border-t border-white/10"></div>
                    </div>

                    <!-- Option 2: Copy Data Manually -->
                    <div class="space-y-4 bg-white/5 border border-white/10 rounded-[2rem] p-6">
                      <p class="text-[10px] font-black text-white/40 uppercase tracking-widest text-center mb-4">
                        Si usa otro proveedor web (Proton, Outlook, Yahoo), copie estos datos y envíe un correo:
                      </p>

                      <div class="space-y-3">
                        <div class="flex items-center justify-between bg-black/40 rounded-xl p-3 border border-white/5 group">
                          <div class="overflow-hidden">
                            <label class="text-[9px] font-black text-orange-500 uppercase tracking-widest block mb-1">Para (Destinatario)</label>
                            <span class="text-sm text-white/80 font-mono truncate block">{{ mailtoData.email }}</span>
                          </div>
                          <button @click="copyToClipboard(mailtoData.email, 'Correo')" class="p-3 bg-white/5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                            <span class="material-symbols-outlined text-sm">content_copy</span>
                          </button>
                        </div>

                        <div class="flex items-center justify-between bg-black/40 rounded-xl p-3 border border-white/5 group">
                          <div class="overflow-hidden">
                            <label class="text-[9px] font-black text-orange-500 uppercase tracking-widest block mb-1">Asunto (¡Importante!)</label>
                            <span class="text-sm text-white/80 font-mono truncate block">{{ mailtoData.subject }}</span>
                          </div>
                          <button @click="copyToClipboard(mailtoData.subject, 'Asunto')" class="p-3 bg-white/5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                            <span class="material-symbols-outlined text-sm">content_copy</span>
                          </button>
                        </div>

                        <div class="flex items-start justify-between bg-black/40 rounded-xl p-3 border border-white/5 group">
                          <div class="overflow-hidden w-full pr-4">
                            <label class="text-[9px] font-black text-orange-500 uppercase tracking-widest block mb-1">Mensaje Sugerido</label>
                            <p class="text-xs text-white/60 line-clamp-3">{{ mailtoData.body }}</p>
                          </div>
                          <button @click="copyToClipboard(mailtoData.body, 'Mensaje')" class="p-3 bg-white/5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors mt-2">
                            <span class="material-symbols-outlined text-sm">content_copy</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div class="pt-2">
                      <button @click="showContactForm = false"
                        class="w-full text-center text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-white/40 transition-colors">
                        Volver
                      </button>
                    </div>
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
