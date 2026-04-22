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

const route = useRoute()
const qrId = route.params.qrId as string
const userStore = useUserStore()
// Base & UI State
const loading = ref(true)
const sending = ref(false)
const isSuccess = ref(false)
const qrData = ref<IPublicQR | null>(null)
const errorMsg = ref('')
const showContactForm = ref(false)

// Interaction State
const selectedReason = ref('')
const messageText = ref('')
const capturedImage = ref<string | null>(null)
const imagePreviewUrl = ref('')
const processingImage = ref(false)

const QRName = computed(() => qrData.value?.ownerName || 'objeto')
const reasons = ref<any[]>([]);
const ownerPlan = userStore.getPlan || 'epsilon';

type plan = 'alpha' | 'beta' | 'epsilon';

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
    console.error(err)
    processingImage.value = false
  }
}

const getMetrics = async (typePlan: string) => {
  const metrics: IQRScanMetrics = { country: "", city: "", region: "" };
  try {
    const res = await fetch('https://ipapi.co/json/')
    const d = await res.json()

    //Default minimal metrics
    metrics.country = d.country_name || "";
    metrics.city = d.city || "";
    metrics.region = d.region || "";

    if (typePlan === 'alpha') {
      return metrics;
    }
    if (typePlan === 'beta' || typePlan === 'epsilon') {
      metrics.lat = d.latitude || "";
      metrics.lon = d.longitude || "";
      metrics.postal = d.postal || "";
      metrics.timezone = d.timezone || "";
      return metrics;
    }
  } catch {
    //Default minimal metrics
    return metrics;
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
      interaction: { reason: selectedReason.value, message: messageText.value, type: 'contact_request' },
      img: capturedImage.value
    })

    await batch.commit()
    isSuccess.value = true
    if (qrData.value) qrData.value.totalScans++
  } catch (e) {
    alert("Error al enviar el mensaje. Intenta de nuevo.")
  } finally {
    sending.value = false
  }
}

//Function that calls the updateReasons method when the component is mounted so that way is handled the logic of the reasons
const updateReasons = () => {
  if (showContactForm.value) return;
  showContactForm.value = true;
  reasons.value = [
    {
      id: 'emergency',
      label: 'Emergencia',
      icon: 'emergency',
      presets: [
        `¡Atención! He localizado tu "${QRName.value.trim()}" y requiere atención inmediata.`,
        `Situación urgente: tu "${QRName.value.trim()}" se encuentra en un estado que necesita tu intervención.`,
        `Necesito comunicarme contigo de inmediato. Tu "${QRName.value.trim()}" podría estar en riesgo. Por favor responde.`
      ]
    },
    {
      id: 'communication',
      label: 'Comunicación',
      icon: 'chat',
      presets: [
        `Hola, he encontrado tu "${QRName.value.trim()}" y está a salvo. ¿Cómo podemos coordinar su devolución?`,
        `Tu "${QRName.value.trim()}" está en mis manos y en buen estado. Escríbeme o llámame para ponernos de acuerdo.`,
        `Me gustaría devolverle su "${QRName.value.trim()}" .`
      ]
    },
    {
      id: 'informative',
      label: 'Informativo',
      icon: 'info',
      presets: [
        `Solo paso a avisar que tu "${QRName.value.trim()}" está visible y aparentemente en buen estado.`,
        `Escaneo de verificación: todo parece estar en orden con este registro.`,
        `Qué buena idea proteger tus bienes así. ¡Un saludo desde donde me encuentro!`
      ]
    },
    {
      id: 'other',
      label: 'Personalizado',
      icon: 'edit_note',
      presets: []
    }
  ]
}

onMounted(loadQRData)
onUnmounted(clearImage)
</script>

<template>

  <HomeLayout>
    <template #main>
      <main
        class="relative min-h-screen bg-[#070b14] pt-32 md:pt-40 overflow-hidden flex flex-col items-center justify-center p-6 md:p-12 font-google-sans">

        <!-- 📐 BACKGROUND GRID (Lightweight architectural feel) -->
        <div class="absolute inset-0 z-0 opacity-[0.03]"
          style="background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 40px 40px;">
        </div>
        <div class="absolute inset-0 z-0 bg-linear-to-b from-primary/5 via-transparent to-transparent"></div>

        <!-- 💠 ORNAMENTAL LIGHT SOURCE -->


        <!-- ☁️ LOADING STATE -->
        <CloudLoader v-if="loading" />

        <!-- ❌ ERROR STATE -->
        <div v-else-if="errorMsg" class="relative z-10 w-full max-w-md flex flex-col items-center text-center gap-6">
          <div class="relative">

            <div
              class="relative w-24 h-24 bg-red-500/10 border border-red-500/30 flex items-center justify-center rounded-3xl">
              <span class="material-symbols-outlined text-red-500 text-5xl">error</span>
            </div>
          </div>

          <div class="space-y-3">
            <h1 class="text-3xl font-black text-white">QR No Encontrado</h1>
            <p class="text-white/50 text-sm leading-relaxed px-4">
              {{ errorMsg }}. Te recomendamos verificar los datos, escanear nuevamente o intentarlo más tarde.
            </p>
          </div>

          <button @click="$router.push('/')"
            class="mt-4 px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors uppercase tracking-widest text-xs">
            Volver al Inicio
          </button>
        </div>

        <!-- 🚀 MAIN CONTENT CONTAINER -->
        <div v-else class="relative z-10 w-full max-w-6xl px-4 md:px-8">

          <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">

            <!-- 👤 LEFT COLUMN: IDENTITY & HERO -->
            <div class="md:col-span-5 flex flex-col gap-8 md:sticky md:top-32">

              <div class="space-y-6 text-center md:text-left">
                <!-- Large verification icon with intense glow -->
                <div class="relative inline-flex mx-auto md:mx-0">

                  <div
                    class="relative w-24 h-24 md:w-32 md:h-32 bg-primary flex items-center justify-center rounded-[2.5rem] border-4 border-[#070b14]">
                    <span
                      class="material-symbols-outlined text-on-primary text-5xl md:text-7xl! font-bold">qr_code</span>
                  </div>
                </div>

                <div class="space-y-4">
                  <div
                    class="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                    <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    <span class="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Propiedad
                      Confirmada</span>
                  </div>

                  <h1 class="text-4xl md:text-6xl font-black text-white leading-[0.9] tracking-tighter">
                    {{ qrData?.ownerName || '---' }}
                  </h1>

                  <p class="text-white/40 text-sm md:text-lg max-w-sm font-medium leading-relaxed mx-auto md:mx-0">
                    Este perfil ha sido validado a través de la red segura de Ubiqueme. Pertenencia verificada
                    exitosamente.
                  </p>
                </div>

                <!-- Technical Footer for Identity -->
                <div class="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
                  <div class="px-5 py-2.5 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3 ">
                    <span class="w-2.5 h-2.5 rounded-full bg-green-500 border border-green-400"></span>
                    <span class="text-[10px] text-white/80 font-black uppercase tracking-widest">Servicio Activo</span>
                  </div>
                  <div class="flex -space-x-3">
                    <div
                      class="w-10 h-10 rounded-full border-2 border-[#070b14] bg-white/10 overflow-hidden flex items-center justify-center ">
                      <span class="material-symbols-outlined text-sm text-white">person</span>
                    </div>
                    <div
                      class="w-10 h-10 rounded-full border-2 border-[#070b14] bg-primary flex items-center justify-center">
                      <span class="material-symbols-outlined text-sm text-black font-bold">check</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 🛠️ RIGHT COLUMN: ACTIONS & DATA -->
            <div class="md:col-span-7 space-y-8 pb-20 font-google-sans">

              <!-- TECH STATS BAR -->
              <div class="grid grid-cols-2 gap-4">
                <div
                  class="group relative bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20">
                  <span class="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Total
                    Escaneos</span>
                  <div class="flex items-baseline gap-2">
                    <span
                      class="text-[10px] font-bold text-white/30 italic uppercase material-symbols-outlined">mobile_sound</span>
                    <span class="text-4xl font-black text-white">{{ qrData?.totalScans || 0 }}</span>
                  </div>
                </div>
                <div
                  class="group relative bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20">
                  <span class="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">ID
                    Registro</span>
                  <div class="flex items-baseline gap-2">
                    <span class="text-lg md:text-2xl font-black text-white tracking-widest font-mono">{{
                      qrData?.id?.substring(0, 8).toUpperCase() || '---' }}</span>
                  </div>
                </div>
              </div>

              <!-- INTERACTIVE ACTION PANEL -->
              <div class="relative group">
                <!-- Background subtle glow used as a highlight -->


                <div class="relative bg-white/10 border border-white/10 rounded-[2.5rem] p-4 md:p-8  overflow-hidden">

                  <Transition name="fade-slide" mode="out-in">
                    <!-- 1. INITIAL STATE -->
                    <div v-if="!showContactForm && !isSuccess" class="py-8 text-center space-y-8">
                      <div class="space-y-2">
                        <h3 class="text-2xl font-black text-white tracking-tight">¿Deseas contactar al dueño?</h3>
                        <p class="text-white/40 text-sm max-w-xs mx-auto">Selecciona una opción para entablar una
                          comunicación segura y anónima.</p>
                      </div>

                      <button @click="updateReasons"
                        class="group relative w-full max-w-xs h-16 rounded-2xl bg-white text-black font-black text-lg overflow-hidden mx-auto transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                        <div class="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        </div>
                        <div class="relative z-10 flex items-center justify-center gap-3">
                          <span>Contactar Propietario</span>
                          <span
                            class="material-symbols-outlined font-black transition-transform group-hover:translate-x-1">arrow_forward</span>
                        </div>
                      </button>
                    </div>

                    <!-- 2. MESSAGING FLOW -->
                    <div v-else-if="showContactForm && !isSuccess && !loading && qrData?.ownerName" class="space-y-8">
                      <!-- REASON SELECTION -->
                      <div class="space-y-4">
                        <label class="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] ml-2">Motivo del
                          Mensaje</label>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <button v-for="reason in reasons" :key="reason.id" @click="selectedReason = reason.id" :class="[
                            'h-14 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1.5 px-2 relative overflow-hidden',
                            selectedReason === reason.id
                              ? 'bg-primary border-primary text-black'
                              : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                          ]">
                            <span class="material-symbols-outlined text-lg">{{ reason.icon }}</span>
                            {{ reason.label }}
                          </button>
                        </div>
                      </div>

                      <!-- PRESET MESSAGES AREA -->
                      <Transition name="fade-slide">
                        <div v-if="selectedReason && reasons.find(r => r.id === selectedReason)?.presets.length"
                          class="space-y-4">
                          <label
                            class="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] ml-2">Sugerencias
                            Rápidas</label>
                          <div class="flex flex-col gap-2">
                            <button v-for="(preset, index) in reasons.find(r => r.id === selectedReason)?.presets"
                              :key="index" @click="selectPreset(preset)" :class="[
                                'px-4 py-3 rounded-xl border text-[11px] font-bold text-left transition-all ',
                                selectedReason === 'emergency'
                                  ? 'bg-red-500/5 border-red-500/20 text-red-100 hover:bg-red-500/10 hover:border-red-500/40'
                                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/30'
                              ]">
                              {{ preset }}
                            </button>
                          </div>
                        </div>
                      </Transition>

                      <!-- MANUAL MESSAGE TEXTAREA -->
                      <div class="space-y-4">
                        <label class="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] ml-2">Mensaje
                          Personalizado</label>
                        <textarea v-model="messageText"
                          placeholder="Si el motivo es 'Personalizado', especifica aquí los detalles del mensaje..."
                          class="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-sm focus:outline-none focus:border-primary/50 transition-all min-h-[140px] resize-none  shadow-inner"></textarea>
                      </div>


                      <!-- 📸 IMAGE CAPTURE AREA -->
                      <div class="space-y-4 relative">
                        <div class="flex items-center justify-between ml-2">
                          <label class="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">
                            Evidencia Fotográfica (Opcional)
                          </label>
                          <Transition name="fade-slide">
                            <button v-if="imagePreviewUrl" @click="clearImage"
                              class="text-red-500 text-[10px] font-black uppercase tracking-[0.2em] bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg px-3 py-1 transition-all flex items-center gap-1.5 active:scale-95 leading-none">
                              Eliminar
                              <span class="material-symbols-outlined text-sm!">close</span>
                            </button>
                          </Transition>
                        </div>

                        <div class="relative group/upload min-h-[160px] cursor-pointer group">
                          <input type="file" accept="image/*" @change="handleImageGet" capture="environment"
                            class="absolute inset-0 opacity-0 cursor-pointer z-20" />

                          <!-- 1. PREVIEW STATE -->
                          <div v-if="imagePreviewUrl"
                            class="relative w-full aspect-video rounded-3xl overflow-hidden border-2 border-primary/20 group-hover:border-primary/40 transition-all duration-500">
                            <img :src="imagePreviewUrl" alt="Preview" class="w-full h-full object-cover" />
                            <div
                              class="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                              <div class="flex items-center gap-2">
                                <div class="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                <p class="text-[10px] font-black text-white uppercase tracking-[0.2em]">Captura Lista
                                </p>
                              </div>
                              <p class="text-[9px] font-medium text-white/40 uppercase tracking-widest mt-1">Toque para
                                reemplazar la fotografía</p>
                            </div>
                          </div>

                          <!-- 2. UPLOAD PROMPT STATE -->
                          <div v-else
                            class="w-full h-40 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-4 group-hover/upload:border-primary/30 group-hover/upload:bg-white/2 transition-all duration-300">
                            <div
                              class="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover/upload:bg-primary/10 group-hover/upload:scale-110 transition-all duration-500">
                              <span
                                class="material-symbols-outlined text-white/20 text-3xl group-hover/upload:text-primary transition-colors">add_a_photo</span>
                            </div>
                            <div class="text-center space-y-1">
                              <span
                                class="block text-[11px] font-black text-white/40 uppercase tracking-[0.2em] group-hover/upload:text-white/60 transition-colors">Tocar
                                para capturar</span>
                              <span class="block text-[8px] font-bold text-white/10 uppercase tracking-tight">Formatos:
                                JPG, PNG • Max 5MB</span>
                            </div>
                          </div>
                        </div>
                      </div>


                      <!-- ACTIONS FOOTER -->
                      <div class="flex flex-col md:flex-row gap-4 pt-4">
                        <button @click="showContactForm = false"
                          class="flex-1 h-14 rounded-2xl border border-white/10 text-white/40 font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-colors order-2 md:order-1">
                          Cancelar
                        </button>
                        <button @click="handleSubmitMessage" :disabled="!selectedReason || sending || processingImage"
                          class="flex-2 h-14 rounded-2xl bg-primary text-black font-black text-xs uppercase tracking-widest disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center gap-3 order-1 md:order-2">
                          <span v-if="sending || processingImage"
                            class="w-5 h-5 border-3 border-black/20 border-t-black rounded-full animate-spin"></span>
                          <span v-else>Enviar Mensaje Directo</span>
                          <span v-if="!sending && !processingImage"
                            class="material-symbols-outlined text-lg">send</span>
                        </button>
                      </div>
                    </div>

                    <!-- 3. SUCCESS STATE -->
                    <div v-else-if="isSuccess" class="py-12 text-center space-y-6">
                      <div class="relative inline-flex mx-auto">

                        <div
                          class="relative w-20 h-20 bg-green-500 rounded-full flex items-center justify-center border border-green-400">
                          <span class="material-symbols-outlined text-black text-4xl font-black">check_circle</span>
                        </div>
                      </div>
                      <div class="space-y-2">
                        <h3 class="text-3xl font-black text-white tracking-tight italic uppercase">Mensaje Enviado</h3>
                        <p class="text-white/50 text-sm max-w-xs mx-auto font-medium">El propietario ha recibido tu
                          notificación de forma segura. Gracias por tu responsabilidad.</p>
                      </div>
                      <button @click="$router.push('/')"
                        class="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                        Finalizar Sesión
                      </button>
                    </div>
                  </Transition>
                </div>
              </div>

              <!-- PRIVACY INFO CARD -->
              <div class="relative overflow-hidden bg-white/5 border border-white/10 rounded-[2.5rem] p-8  group">

                <div class="flex items-start gap-6">
                  <div
                    class="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-primary text-2xl">security</span>
                  </div>
                  <div class="space-y-2 pt-1">
                    <h4 class="text-white font-black text-lg">Privacidad de Identidad</h4>
                    <p class="text-white/50 text-xs leading-relaxed font-medium">
                      Utilizamos protocolos de comunicación de grado militar. Al contactar, no compartiremos tu
                      información personal unless lo autorices.
                    </p>
                  </div>
                </div>
              </div>

              <!-- DISCLAIMER & FOOTER -->
              <div class="space-y-4 text-center">
                <p v-if="!isSuccess" class="text-[9px] text-white/20 uppercase tracking-[0.2em] px-8 font-black">
                  Registramos métricas de sesión anónimas para estadística y seguridad del propietario.
                </p>
                <div class="flex items-center justify-center gap-6 text-white/10">
                  <span class="material-symbols-outlined text-lg">vpn_key</span>
                  <span class="material-symbols-outlined text-lg">eco</span>
                  <span class="material-symbols-outlined text-lg">bolt</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- 🏷️ BRAND WATERMARK -->
        <div class="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none">
          <p class="text-white text-[10px] font-black uppercase tracking-[0.8em]">Ubiqueme.com</p>
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
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Custom smooth easing for interactions */
button {
  transition: all 0.2s ease;
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
