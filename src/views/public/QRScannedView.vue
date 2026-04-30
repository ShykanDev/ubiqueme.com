<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { collection, doc, getDoc, Timestamp, writeBatch, increment } from 'firebase/firestore'
import { db } from '@/firebase'
import CloudLoader from '@/components/ui/CloudLoader.vue'
import HomeLayout from '@/layouts/HomeLayout.vue'
import type { IPublicQR, IQRScanMetrics } from '@/interfaces/IPublicQR'
import imageCompression from 'browser-image-compression'
import { useUserStore } from '@/stores/user'
import { toast } from 'vue-sonner'

const route = useRoute()
const qrId = route.params.qrId as string
const userStore = useUserStore()

// State
const loading = ref(true)
const sending = ref(false)
const isSuccess = ref(false)
const qrData = ref<IPublicQR | null>(null)
const errorMsg = ref('')
const showContactForm = ref(false)

// Form State
const selectedReason = ref('')
const messageText = ref('')
const capturedImage = ref<string | null>(null)
const imagePreviewUrl = ref('')
const processingImage = ref(false)
const contactEmail = ref('')
const contactPhone = ref('')
const contactMethod = ref<'email' | 'phone'>('email')

const QRName = computed(() => qrData.value?.name || 'objeto')
const reasons = ref<any[]>([])
const ownerPlan = userStore.getPlan || 'epsilon'

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

const clearImage = () => {
  if (imagePreviewUrl.value) URL.revokeObjectURL(imagePreviewUrl.value)
  imagePreviewUrl.value = ''
  capturedImage.value = null
}

const handleImageGet = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  clearImage()
  imagePreviewUrl.value = URL.createObjectURL(file)
  try {
    processingImage.value = true
    const compressed = await imageCompression(file, { maxSizeMB: 0.14, maxWidthOrHeight: 900, useWebWorker: true })
    const reader = new FileReader()
    reader.readAsDataURL(compressed)
    reader.onloadend = () => {
      capturedImage.value = reader.result as string
      processingImage.value = false
    }
  } catch (err) {
    toast.error(`Error procesando la imagen: ${err}`)
    processingImage.value = false
  }
}

const selectPreset = (preset: string) => {
  messageText.value = preset
}

const getMetrics = async (typePlan: string) => {
  const metrics: IQRScanMetrics = { country: "", city: "", region: "" }
  try {
    const res = await fetch('https://ipapi.co/json/')
    const d = await res.json()
    metrics.country = d.country_name || ""
    metrics.city = d.city || ""
    metrics.region = d.region || ""
    if (typePlan !== 'alpha') {
      metrics.lat = d.latitude || ""
      metrics.lon = d.longitude || ""
      metrics.postal = d.postal || ""
      metrics.timezone = d.timezone || ""
    }
    return metrics
  } catch {
    return metrics
  }
}

const handleSubmitMessage = async () => {
  if (!selectedReason.value) return
  sending.value = true
  try {
    const metricData = await getMetrics(ownerPlan)
    const batch = writeBatch(db)
    const QRDoc = doc(db, 'publicQR', qrId)
    const logDoc = doc(collection(db, 'publicQR', qrId, 'logs'), Date.now().toString())

    batch.update(QRDoc, { totalScans: increment(1), lastScan: Timestamp.now() })
    batch.set(logDoc, {
      scanDate: Timestamp.now(),
      scanMetrics: metricData,
      interaction: {
        reason: selectedReason.value,
        message: messageText.value,
        type: 'contact_request',
        email: contactEmail.value,
        phone: contactPhone.value
      },
      img: capturedImage.value
    })

    await batch.commit()
    isSuccess.value = true
    if (qrData.value) qrData.value.totalScans = (qrData.value.totalScans || 0) + 1
  } catch (e) {
    toast.error("Error al enviar el mensaje. Intenta de nuevo.")
  } finally {
    sending.value = false
  }
}

const initReasons = () => {
  reasons.value = [
    { id: 'emergency', label: 'Urgente', icon: 'priority_high', color: '#ff5252', presets: [`He encontrado su "${QRName.value}" en riesgo.`, `¡Atención! Acción inmediata requerida para su "${QRName.value}".`] },
    { id: 'return', label: 'Devolución', icon: 'handshake', color: '#ff9500', presets: [`Tengo su "${QRName.value}". ¿Cómo coordinamos la entrega?`, `He resguardado su "${QRName.value}". Está a salvo.`] },
    { id: 'info', label: 'Aviso', icon: 'notifications', color: '#4facfe', presets: [`He visto su "${QRName.value}" y parece estar bien.`, `Escaneo de verificación de rutina.`] },
    { id: 'other', label: 'Otro', icon: 'more_horiz', color: '#ffffff', presets: [] }
  ]
}

onMounted(() => {
  loadQRData()
  initReasons()
})
onUnmounted(clearImage)
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
                  <div v-if="!showContactForm && !isSuccess" class="py-10 text-center space-y-8">
                    <div class="space-y-2">
                      <h3 class="text-xl font-black italic uppercase tracking-tighter">¿Encontró este objeto?</h3>
                      <p class="text-white/40 text-sm max-w-xs mx-auto">Notifique al propietario de forma segura y
                        anónima para coordinar la recuperación.</p>
                    </div>
                    <button @click="showContactForm = true"
                      class="w-full max-w-xs h-16 bg-white text-[#09090b] rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)]">Contactar
                      Ahora</button>
                  </div>

                  <!-- STEP 2: THE FORM (Google Style) -->
                  <div v-else-if="showContactForm && !isSuccess" class="space-y-10">

                    <!-- Chips Selection -->
                    <div class="space-y-4">
                      <label class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">¿Cuál es el
                        motivo?</label>
                      <div class="flex flex-wrap gap-2">
                        <button v-for="reason in reasons" :key="reason.id" @click="selectedReason = reason.id" :class="[
                          'px-5 py-3 rounded-xl cursor-pointer border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2',
                          selectedReason === reason.id ? 'bg-[#ff9500] border-[#ff9500] text-black' : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30'
                        ]">
                          <span class="material-symbols-outlined text-base">{{ reason.icon }}</span>
                          {{ reason.label }}
                        </button>
                      </div>
                    </div>

                    <!-- Contact Method Toggle -->
                    <div class="space-y-4">
                      <label class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Método de contacto preferido</label>
                      <div class="flex items-center p-1 bg-white/5 border border-white/10 rounded-2xl w-full max-w-xs relative overflow-hidden h-14">
                        <div class="absolute inset-y-1 transition-all duration-300 bg-orange-500 rounded-xl w-[calc(50%-4px)]"
                             :class="contactMethod === 'email' ? 'left-1' : 'left-[calc(50%+3px)]'"></div>
                        <button @click="contactMethod = 'email'" 
                                class="flex-1 h-full text-[10px] font-black uppercase tracking-widest relative z-10 transition-colors"
                                :class="contactMethod === 'email' ? 'text-[#09090b]' : 'text-white/40'">Correo</button>
                        <button @click="contactMethod = 'phone'" 
                                class="flex-1 h-full text-[10px] font-black uppercase tracking-widest relative z-10 transition-colors"
                                :class="contactMethod === 'phone' ? 'text-[#09090b]' : 'text-white/40'">Teléfono</button>
                      </div>
                    </div>

                    <!-- Modern Inputs -->
                    <div class="space-y-6">
                      <div class="space-y-2 animate-in fade-in slide-in-from-left-4 duration-500" v-if="contactMethod === 'email'">
                        <label class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-4">Su Correo Electrónico</label>
                        <input v-model="contactEmail" type="email" autocomplete="email"
                          placeholder="nombre@ejemplo.com"
                          class="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-sm text-white focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.08] transition-all" />
                      </div>
                      <div class="space-y-2 animate-in fade-in slide-in-from-right-4 duration-500" v-else>
                        <label class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-4">Su Número de Teléfono</label>
                        <input v-model="contactPhone" type="tel" autocomplete="tel" placeholder="+52 ..."
                          class="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-sm text-white focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.08] transition-all" />
                      </div>

                      <div class="space-y-2">
                        <label class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-4">Mensaje Adicional (Opcional)</label>
                        <textarea v-model="messageText" placeholder="Escriba aquí sus comentarios..."
                          class="w-full bg-white/5 border border-white/10 rounded-3xl py-5 px-6 text-sm text-white focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.08] transition-all min-h-[120px] resize-none"></textarea>
                      </div>
                    </div>

                    <!-- Footer Actions -->
                    <div class="flex flex-col gap-4">
                      <button @click="handleSubmitMessage"
                        :disabled="!selectedReason || sending || (contactMethod === 'email' ? !contactEmail : !contactPhone)"
                        class="w-full h-16 bg-orange-500 text-[#09090b] rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-20 transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(249,115,22,0.2)]">
                        <span v-if="sending"
                          class="w-5 h-5 border-3 border-black/20 border-t-black rounded-full animate-spin"></span>
                        <span v-else>Enviar Notificación</span>
                      </button>
                      <button @click="showContactForm = false"
                        class="text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-white/40 transition-colors">Cancelar Operación</button>
                    </div>
                  </div>

                  <!-- STEP 3: SUCCESS -->
                  <div v-else-if="isSuccess" class="py-12 text-center space-y-8 animate-in zoom-in duration-500">
                    <div
                      class="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                      <span class="material-symbols-outlined text-[#09090b] text-5xl font-black">done_all</span>
                    </div>
                    <div class="space-y-2">
                      <h3 class="text-3xl font-black italic uppercase tracking-tighter text-[#dce7ff]">¡Enviado!</h3>
                      <p class="text-white/40 text-sm max-w-xs mx-auto">Gracias por su honestidad. El propietario ha
                        sido notificado de su hallazgo.</p>
                    </div>
                    <button @click="$router.push('/')"
                      class="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all">Finalizar</button>
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
