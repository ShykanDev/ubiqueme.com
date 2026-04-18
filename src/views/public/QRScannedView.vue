<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { collection, collectionGroup, doc, getDoc, getDocs, getFirestore, onSnapshot, query, Timestamp, where, writeBatch, increment } from 'firebase/firestore'
import { db } from '@/firebase'
import CloudLoader from '@/components/ui/CloudLoader.vue'
import HomeLayout from '@/layouts/HomeLayout.vue'
import type { IPublicQR } from '@/interfaces/IPublicQR'
import imageCompression from 'browser-image-compression'

const route = useRoute()
const qrId = route.params.qrId as string

const loading = ref(true)
const sending = ref(false)
const isSuccess = ref(false)
const qrData = ref<IPublicQR | null>(null)
const errorMsg = ref('')

// Messaging state
const showContactForm = ref(false)
const selectedReason = ref('')
const messageText = ref('')
const capturedImage = ref<string | null>(null)
const reasons = [
  {
    id: 'emergency',
    label: 'Emergencia',
    icon: 'emergency',
    color: 'red',
    presets: [
      '¡AYUDA! He encontrado tu pertenencia en una situación crítica.',
      'Emergencia: Tu objeto está en riesgo de seguridad.',
      'He encontrado esto y necesito contactarte de inmediato.',
      'Por favor responde rápido, es un asunto urgente.',
      'Situación de riesgo detectada con tu pertenencia.'
    ]
  },
  {
    id: 'communication',
    label: 'Comunicación',
    icon: 'chat',
    color: 'primary',
    presets: [
      'Hola, tengo tu objeto a salvo. ¿Cómo podemos coordinar?',
      'He encontrado tu pertenencia. Llámame o escríbeme aquí.',
      '¿Podemos agendar una entrega? Tengo tu objeto conmigo.',
      'Buen día, encontré esto en la zona. Está seguro.',
      'Te contacto para devolverte lo que encontré.'
    ]
  },
  {
    id: 'informative',
    label: 'Informativo',
    icon: 'info',
    color: 'gray',
    presets: [
      'Solo informo que tu objeto está visible y seguro aquí.',
      'Verificación de estado: Todo parece estar en orden.',
      'Escaneo de cortesía para confirmar que el QR funciona.',
      'He visto tu objeto, solo quería validar el sistema.',
      'Excelente forma de proteger tus cosas, ¡saludos!'
    ]
  },
  {
    id: 'other',
    label: 'Personalizado',
    icon: 'edit_note',
    color: 'white',
    presets: []
  }
]

const selectPreset = (text: string) => {
  messageText.value = text
}

const loadQRData = async () => {
  if (!qrId || typeof qrId !== 'string') {
    errorMsg.value = "QR no válido";
    loading.value = false;
    return;
  }

  try {
    const QRDoc = doc(db, 'publicQR', qrId);
    const docSnapshot = await getDoc(QRDoc);

    if (!docSnapshot.exists()) {
      errorMsg.value = "No se encontró información sobre este QR";
      loading.value = false;
      return
    }

    qrData.value = docSnapshot.data() as IPublicQR;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    errorMsg.value = "Error al obtener la información del QR";
    console.error(`Error loading QR data:`, error);
  }
}

const imageSelected = ref<File | undefined>(undefined);

const handleImageGet = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    imageSelected.value = target.files[0];
    console.log(imageSelected.value);
  }
}

function handleImageUpload(event) {

  const imageFile = event.target.files[0];
  console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
  console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

  const options = {
    maxSizeMB: .4,
    maxWidthOrHeight: 1200,
    useWebWorker: true
  }
  imageCompression(imageFile, options)
    .then(function (compressedFile) {
      console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
      console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

      return compressedFile;
    })
    .catch(function (error) {
      console.log(error.message);
    });
}

const handleSubmitMessage = async () => {
  if (!selectedReason.value) return;

  sending.value = true;
  const QRDoc = doc(db, 'publicQR', qrId);
  const batch = writeBatch(db);

  const metricData = {
    country: "",
    city: "",
    region: ""
  };

  try {
    // Collect metrics only when user interacts
    const ipRes = await fetch('https://ipapi.co/json/');
    if (ipRes.ok) {
      const data = await ipRes.json();
      metricData.country = data.country_name || "";
      metricData.city = data.city || "";
      metricData.region = data.region || "";
    }
  } catch (err) {
    console.warn('Metricas no disponibles:', err);
  }

  try {
    // Update scan counters
    batch.update(QRDoc, {
      totalScans: increment(1),
      lastScan: Timestamp.now(),
    });

    // Create log with message interaction
    const logsCollection = collection(db, 'publicQR', qrId, 'logs');
    const logDoc = doc(logsCollection, Timestamp.now().toMillis().toString());

    batch.set(logDoc, {
      scanDate: Timestamp.now(),
      scanMetrics: metricData,
      interaction: {
        reason: selectedReason.value,
        message: messageText.value,
        type: 'contact_request'
      },
      img: capturedImage.value
    });

    await batch.commit();
    isSuccess.value = true;

    // Optional: increment local counter for immediate feedback
    if (qrData.value) qrData.value.totalScans++;

  } catch (error) {
    console.error(`Error saving interaction:`, error);
    alert("Hubo un problema al enviar tu mensaje. Por favor intenta de nuevo.");
  } finally {
    sending.value = false;
  }
}

onMounted(() => {
  loadQRData()
})

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
        <div
          class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[300px] bg-primary/20 blur-[120px] rounded-full opacity-50 z-0 pointer-events-none">
        </div>

        <!-- ☁️ LOADING STATE -->
        <CloudLoader v-if="loading" />

        <!-- ❌ ERROR STATE -->
        <div v-else-if="errorMsg" class="relative z-10 w-full max-w-md flex flex-col items-center text-center gap-6">
          <div class="relative">
            <div class="absolute inset-0 bg-red-500/20 blur-xl rounded-full scale-110"></div>
            <div
              class="relative w-24 h-24 bg-red-500/10 border border-red-500/30 flex items-center justify-center rounded-3xl shadow-[0_0_40px_rgba(239,68,68,0.2)]">
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
                  <div class="absolute inset-0 bg-primary/30 blur-sm rounded-full scale-125"></div>
                  <div
                    class="relative w-24 h-24 md:w-32 md:h-32 bg-primary flex items-center justify-center rounded-[2.5rem] shadow-[0_0_60px_rgba(123,208,255,0.5)] border-4 border-[#070b14]">
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

                  <h1 class="text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter drop-shadow-2xl">
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
                    <span class="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]"></span>
                    <span class="text-[10px] text-white/80 font-black uppercase tracking-widest">Servicio Activo</span>
                  </div>
                  <div class="flex -space-x-3">
                    <div
                      class="w-10 h-10 rounded-full border-2 border-[#070b14] bg-white/10 overflow-hidden flex items-center justify-center ">
                      <span class="material-symbols-outlined text-sm text-white">person</span>
                    </div>
                    <div
                      class="w-10 h-10 rounded-full border-2 border-[#070b14] bg-primary flex items-center justify-center shadow-lg">
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
                <div
                  class="absolute -inset-1 bg-linear-to-r from-primary/20 to-purple-500/20 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity">
                </div>

                <div class="relative bg-white/10 border border-white/10 rounded-[2.5rem] p-4 md:p-8  overflow-hidden">

                  <Transition name="fade-slide" mode="out-in">
                    <!-- 1. INITIAL STATE -->
                    <div v-if="!showContactForm && !isSuccess" class="py-8 text-center space-y-8">
                      <div class="space-y-2">
                        <h3 class="text-2xl font-black text-white tracking-tight">¿Deseas contactar al dueño?</h3>
                        <p class="text-white/40 text-sm max-w-xs mx-auto">Selecciona una opción para entablar una
                          comunicación segura y anónima.</p>
                      </div>

                      <button @click="showContactForm = true"
                        class="group relative w-full max-w-xs h-16 rounded-2xl bg-white text-black font-black text-lg overflow-hidden mx-auto transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-2xl">
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
                    <div v-else-if="showContactForm && !isSuccess" class="space-y-8">
                      <!-- REASON SELECTION -->
                      <div class="space-y-4">
                        <label class="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] ml-2">Motivo del
                          Mensaje</label>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <button v-for="reason in reasons" :key="reason.id" @click="selectedReason = reason.id" :class="[
                            'h-14 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1.5 px-2 relative overflow-hidden',
                            selectedReason === reason.id
                              ? 'bg-primary border-primary text-black shadow-[0_0_20px_rgba(123,208,255,0.4)]'
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
                      <div class="space-y-4">
                        <label class="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] ml-2">Evidencia
                          Fotográfica (Opcional)</label>
                        <div class="relative group/upload">
                          <input type="file" accept="image/*" @change="handleImageGet" capture="environment"
                            class="absolute inset-0 opacity-0 cursor-pointer z-10" />
                          <div
                            class="w-full h-24 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 group-hover/upload:border-primary/30 group-hover/upload:bg-white/[0.02] transition-all">
                            <span
                              class="material-symbols-outlined text-white/30 text-2xl group-hover/upload:text-primary transition-colors">add_a_photo</span>
                            <span class="text-[9px] font-black text-white/20 uppercase tracking-widest">Tocar para tomar
                              fotografía</span>
                          </div>
                        </div>
                      </div>

                      <!-- ACTIONS FOOTER -->
                      <div class="flex flex-col md:flex-row gap-4 pt-4">
                        <button @click="showContactForm = false"
                          class="flex-1 h-14 rounded-2xl border border-white/10 text-white/40 font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-colors order-2 md:order-1">
                          Cancelar
                        </button>
                        <button @click="handleSubmitMessage" :disabled="!selectedReason || sending"
                          class="flex-2 h-14 rounded-2xl bg-primary text-black font-black text-xs uppercase tracking-widest disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center gap-3 order-1 md:order-2 shadow-xl shadow-primary/10">
                          <span v-if="sending"
                            class="w-5 h-5 border-3 border-black/20 border-t-black rounded-full animate-spin"></span>
                          <span v-else>Enviar Mensaje Directo</span>
                          <span v-if="!sending" class="material-symbols-outlined text-lg">send</span>
                        </button>
                      </div>
                    </div>

                    <!-- 3. SUCCESS STATE -->
                    <div v-else-if="isSuccess" class="py-12 text-center space-y-6">
                      <div class="relative inline-flex mx-auto">
                        <div class="absolute inset-0 bg-green-500/30 blur-2xl rounded-full scale-150"></div>
                        <div
                          class="relative w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.5)]">
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
                <div
                  class="absolute -bottom-12 -right-12 w-48 h-48 bg-primary/10 blur-[60px] rounded-full opacity-50 transition-all group-hover:scale-110">
                </div>
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
