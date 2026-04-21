<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import HomeLayout from '@/layouts/HomeLayout.vue'
import Qrcode from 'qrcode.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const selectedPlan = ref(route.params.planId as string || 'Beta')
const isSubmitting = ref(false)
const isSuccess = ref(false)

const formData = ref({
  fullName: userStore.getFullName || '',
  email: userStore.getEmail || 'No registrado',
  phone: '',
  qrQuantity: 1,
  qrNames: ['Nombre de su QR'] as string[],
  specialNotes: '',
  firebaseUid: userStore.getUserId || ''
})

// Sincronizar nombres de QR con la cantidad seleccionada
watch(() => formData.value.qrQuantity, (newVal) => {
  const currentLen = formData.value.qrNames.length
  if (newVal > currentLen) {
    for (let i = 0; i < newVal - currentLen; i++) {
      formData.value.qrNames.push(``)
    }
  } else {
    formData.value.qrNames = formData.value.qrNames.slice(0, newVal)
  }
})

const plans = [
  {
    id: 'alpha',
    name: 'Alpha',
    price: 'Gratis',
    icon: 'shield',
    color: '#ffffff',
    features: [
      { t: 'Capacidad', v: 'Hasta 3 QRs Activos', c: '#ffffff' },
      { t: 'Métricas', v: 'Contador de Escaneos', c: '#ffffff' },
      { t: 'Privacidad', v: 'Registro Básico', c: '#ffffff' }
    ]
  },
  {
    id: 'beta',
    name: 'Beta',
    price: '$79 MXN',
    icon: 'verified_user',
    color: '#7bd0ff',
    features: [
      { t: 'Capacidad', v: '15 QRs Protegidos', c: '#7bd0ff' },
      { t: 'Historial', v: 'Logs por 30 días', c: '#7bd0ff' },
      { t: 'Regeneración', v: '3 Reposiciones Digitales', c: '#7bd0ff' },
      { t: 'Evidencia', v: 'Captura Fotográfica', c: '#7bd0ff' },
      { t: 'Alertas', v: 'Notificación vía Email', c: '#7bd0ff' }
    ]
  },
  {
    id: 'epsilon',
    name: 'Epsilon',
    price: '$199 MXN',
    icon: 'military_tech',
    color: '#ffd264',
    features: [
      { t: 'Capacidad', v: 'QRs Ilimitados', c: '#ffd264' },
      { t: 'Tracking', v: 'Mapa Interactivo (ScanLoc)', c: '#ffd264' },
      { t: 'Regeneración', v: '5 Reposiciones Digitales', c: '#ffd264' },
      { t: 'Historial', v: 'Logs Ilimitados', c: '#ffd264' },
      { t: 'Soporte', v: 'Prioridad Grupo Chimex', c: '#ffd264' }
    ]
  }
]

const accumulatedFeatures = computed(() => {
  const currentPlanId = selectedPlan.value.toLowerCase()
  const currentPlanIndex = plans.findIndex(p => p.id === currentPlanId)
  if (currentPlanIndex === -1) return []

  let allFeats: any[] = []
  
  // Alpha always included
  allFeats.push(...plans[0].features.map(f => ({ ...f, plan: 'alpha' })))

  // Beta features if selected plan is Beta or higher
  if (currentPlanIndex >= 1) {
    allFeats.push(...plans[1].features.map(f => ({ ...f, plan: 'beta' })))
  }

  // Epsilon features if selected plan is Epsilon
  if (currentPlanIndex >= 2) {
    allFeats.push(...plans[2].features.map(f => ({ ...f, plan: 'epsilon' })))
  }

  return allFeats
})

const handleSubmit = async () => {
  isSubmitting.value = true
  await new Promise(resolve => setTimeout(resolve, 2000))

  console.log('Datos del pedido:', {
    plan: `Plan ${selectedPlan.value}`,
    ...formData.value,
    destination: 'informes@grupochimex.com'
  })

  isSubmitting.value = false
  isSuccess.value = true
}

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <HomeLayout>
    <template #main>
      <main class="relative min-h-screen bg-[#070b14] pt-20 pb-12 overflow-hidden font-google-sans">

        <!-- Background Grid -->
        <div class="absolute inset-0 z-0 opacity-[0.03]"
          style="background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 40px 40px;">
        </div>

        <div class="relative z-10 max-w-6xl mx-auto px-6">

          <!-- Header -->
          <div class="mb-8 space-y-3">
            <button @click="router.back()"
              class="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest group">
              <span
                class="material-symbols-outlined text-xs transition-transform group-hover:-translate-x-1">arrow_back</span>
              Volver
            </button>
            <h1 class="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
              Configura tu <span class="text-primary">Orden</span>
            </h1>
            <p class="text-white/40 text-[11px] font-medium">Completa los detalles para recibir tu cotización formal de
              <span class="text-white">informes@grupochimex.com</span>
            </p>
          </div>

          <div v-if="!isSuccess" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            <!-- FORM COLUMN -->
            <form @submit.prevent="handleSubmit" class="lg:col-span-7 space-y-6">

              <!-- Plan Selection Toggle -->
              <div class="space-y-3">
                <label class="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] ml-2">Nivel de
                  protección</label>
                <div class="grid grid-cols-3 gap-3">
                  <button v-for="plan in plans" :key="plan.id" type="button" @click="selectedPlan = plan.id" :class="[
                    'relative h-20 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1.5 overflow-hidden',
                    selectedPlan === plan.id
                      ? 'bg-white/5 border-primary shadow-[0_0_15px_rgba(123,208,255,0.1)]'
                      : 'bg-white/[0.02] border-white/5 border-dashed grayscale opacity-40 hover:opacity-100 hover:grayscale-0'
                  ]">
                    <span class="material-symbols-outlined text-xl"
                      :style="{ color: selectedPlan === plan.id ? plan.color : 'white' }">
                      {{ plan.icon }}
                    </span>
                    <span class="text-[9px] font-black uppercase tracking-widest text-white">{{ plan.name }}</span>
                  </button>
                </div>
              </div>

              <!-- Personal/Org Details -->
              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">Nombre
                      Completo</label>
                    <input disabled v-model="formData.fullName" required type="text"
                      class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white/45 focus:outline-none focus:border-primary/50 transition-all shadow-inner" />
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">Correo
                      Electrónico</label>
                    <input disabled v-model="formData.email" required type="email"
                      class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white/45 focus:outline-none focus:border-primary/50 transition-all shadow-inner" />
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">Teléfono de
                      Contacto</label>
                    <input v-model="formData.phone" required type="tel" placeholder="+52 ..."
                      class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none  focus:border-primary/50 transition-all shadow-inner" />
                  </div>
                </div>

                <div class="px-5 py-3 bg-primary/5 rounded-xl border border-primary/10 flex gap-3 items-center">
                  <span class="material-symbols-outlined text-primary text-[14px]">security</span>
                  <p class="text-[9px] text-primary/60 font-black uppercase tracking-widest">Sus datos están protegidos
                    bajo protocolos de encriptación.</p>
                </div>
              </div>

              <!-- Order Details -->
              <div class="space-y-5 bg-white/[0.02] border border-white/5 p-6 rounded-[2rem]">
                <div class="flex items-center justify-between pb-4 border-b border-white/5">
                  <div class="space-y-0.5">
                    <h3 class="text-white font-black uppercase text-xs tracking-widest">Configuración de QRs</h3>
                    <p class="text-white/20 text-[9px] font-medium uppercase tracking-widest">Cantidad de bienes a
                      proteger</p>
                  </div>
                  <div class="flex items-center gap-3 bg-white/5 p-1.5 rounded-xl border border-white/10">
                    <button type="button" @click="formData.qrQuantity = Math.max(1, formData.qrQuantity - 1)"
                      class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10">
                      <span class="material-symbols-outlined text-xs">remove</span>
                    </button>
                    <span class="text-lg font-black text-white w-6 text-center">{{ formData.qrQuantity }}</span>
                    <button type="button" @click="formData.qrQuantity++"
                      class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-black hover:scale-105 transition-transform">
                      <span class="material-symbols-outlined text-xs font-black">add</span>
                    </button>
                  </div>
                </div>

                <!-- QR Names Inputs -->
                <div class="space-y-4">
                  <div class="flex items-center justify-between ml-2">
                    <label
                      class="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                      Identificación
                      <span class="text-red-500 text-[7px] animate-pulse">(Público)</span>
                    </label>
                  </div>

                  <div class="relative min-h-[80px]">
                    <TransitionGroup name="list" tag="div" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div v-for="(name, index) in formData.qrNames" :key="index"
                        class="group/qr-card relative flex items-center gap-3 bg-white/[0.01] border border-white/5 p-3 rounded-xl hover:bg-white/[0.03] transition-all">
                        <div
                          class="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                          <Qrcode :value="`https://ubiqueme.com/qr/${formData.qrNames[index]}`" :size="32" level="M"
                            background="transparent" foreground="#ffffff" class="opacity-50" />
                        </div>
                        <div class="flex-1">
                          <span class="text-[7px] font-black text-white/20 uppercase">QR#0{{ index + 1 }}</span>
                          <input v-model="formData.qrNames[index]" type="text"
                            class="w-full bg-transparent border-none py-0.5 text-xs text-white placeholder:text-white/10 focus:outline-none font-bold"
                            placeholder="Nombre del bien..." />
                        </div>
                      </div>
                    </TransitionGroup>
                  </div>

                  <div class="p-3 bg-white/[0.03] rounded-xl border border-white/5 flex gap-3 items-start">
                    <span class="material-symbols-outlined text-red-500/40 text-xs">warning</span>
                    <p class="text-[8px] text-white/30 font-bold uppercase tracking-widest leading-normal">
                      Atención: Estos nombres serán <span class="text-white/60">visibles públicamente</span>. Evite
                      incluir datos sensibles.
                    </p>
                  </div>
                </div>

                <div class="pt-2 space-y-1.5">
                  <label class="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">Notas
                    Especiales</label>
                  <textarea v-model="formData.specialNotes" placeholder="Requerimientos técnicos..."
                    class="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none min-h-[80px] resize-none"></textarea>
                </div>
              </div>

              <button type="submit" :disabled="isSubmitting"
                class="relative w-full h-14 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl overflow-hidden group transition-all">
                <div class="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="relative z-10 flex items-center justify-center gap-3">
                  <span v-if="isSubmitting"
                    class="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
                  <span v-else>Agendar Cotización</span>
                  <span v-if="!isSubmitting"
                    class="material-symbols-outlined text-sm font-black transition-transform group-hover:translate-x-1">send</span>
                </div>
              </button>

            </form>

            <!-- SUMMARY COLUMN (Unified Master Card) -->
            <div class="lg:col-span-5 lg:sticky lg:top-24">
              <div
                class="bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden group/master relative">

                <!-- 3D BOX SECTION -->
                <div
                  class="relative h-[240px] flex items-center justify-center perspective-container bg-gradient-to-b from-white/[0.02] to-transparent border-b border-white/5">
                  <div class="product-box scale-100 transition-transform duration-700">
                    <div
                      class="face front bg-black/80 border border-white/20 flex flex-col p-4 shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
                      <div class="flex justify-between items-start mb-2">
                        <span class="text-[6px] font-black uppercase tracking-widest"
                          :style="{ color: plans.find(p => p.id === selectedPlan)?.color }">Package Tier</span>
                        <span class="material-symbols-outlined text-[8px] text-white/90">verified</span>
                      </div>
                      <div class="flex-1 flex items-center justify-center">
                        <span class="material-symbols-outlined text-4xl"
                          :style="{ color: plans.find(p => p.id === selectedPlan)?.color }">
                          {{plans.find(p => p.id === selectedPlan)?.icon}}
                        </span>
                      </div>
                      <div
                        class="mt-2 pt-2 border-t border-white/10 text-center font-black text-[10px] text-white uppercase italic tracking-widest">
                        Plan {{ selectedPlan }}
                      </div>
                    </div>
                    <div class="face right bg-black flex items-center justify-center border-y border-r border-white/20">
                      <span class="text-[5px] font-bold text-white/20 rotate-90 tracking-widest">UBIQUEME.COM</span>
                    </div>
                    <div class="face top bg-white/5 border-x border-t border-white/20"></div>
                  </div>
                </div>

                <!-- DETAILS BOX -->
                <div class="p-6 space-y-6">
                  <div class="space-y-3">
                    <div class="flex justify-between items-end border-b border-white/5 pb-2">
                      <span class="text-[9px] font-black text-white/20 uppercase tracking-widest">Unitario</span>
                      <span class="text-base font-black text-white italic tracking-tighter">{{plans.find(p => p.id ===
                        selectedPlan)?.price}}</span>
                    </div>
                    <div class="flex justify-between items-end border-b border-white/5 pb-2">
                      <span class="text-[9px] font-black text-white/20 uppercase tracking-widest">Cantidad</span>
                      <span class="text-base font-black text-white italic tracking-tighter">x{{ formData.qrQuantity
                        }}</span>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 gap-3">
                    <div v-for="feat in accumulatedFeatures" :key="feat.t + feat.plan"
                      class="flex items-center gap-3 group/item transition-all duration-300">
                      <div class="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover/item:border-white/20">
                        <span class="material-symbols-outlined text-[12px]"
                          :style="{ color: feat.c }">verified</span>
                      </div>
                      <div class="flex flex-col">
                        <span class="text-[7px] font-black opacity-30 uppercase tracking-widest" :style="{ color: feat.c }">{{ feat.t }}</span>
                        <span class="text-[11px] font-bold text-white/70 tracking-tight leading-tight">{{ feat.v }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- SUCCESS STATE -->
          <div v-else
            class="max-w-2xl mx-auto py-20 text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div class="relative inline-flex mx-auto">
              <div class="absolute inset-0 bg-green-500/20  rounded-full"></div>
              <div
                class="relative w-24 h-24 bg-green-500 rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                <span class="material-symbols-outlined text-black text-5xl font-black">mark_email_read</span>
              </div>
            </div>

            <div class="space-y-4">
              <h2 class="text-5xl font-black text-white tracking-tighter uppercase italic">Solicitud Enviada</h2>
              <p class="text-white/40 text-lg font-medium leading-relaxed">
                Hemos recibido tus datos con éxito. En breve, un asesor de <span class="text-white">Grupo Chimex</span>
                te enviará la cotización formal a <span class="text-primary font-bold">{{ formData.email }}</span>.
              </p>
            </div>

            <div class="pt-8 flex flex-col md:flex-row gap-4 justify-center">
              <button @click="router.push('/')"
                class="px-10 py-5 bg-white text-black font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-primary transition-all">
                Volver al Inicio
              </button>
              <button @click="isSuccess = false"
                class="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-white/10 transition-all">
                Realizar otra solicitud
              </button>
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
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Transiciones de entrada */
.animate-in {
  animation-duration: 0.7s;
  animation-fill-mode: both;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slide-in-from-bottom {
  from {
    transform: translateY(20px);
  }

  to {
    transform: translateY(0);
  }
}

/* 3D Box Styling */
.perspective-container {
  perspective: 1200px;
}

.product-box {
  position: relative;
  width: 140px;
  height: 180px;
  transform-style: preserve-3d;
  transform: rotateY(-20deg) rotateX(10deg);
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.group\/box:hover .product-box {
  transform: rotateY(10deg) rotateX(5deg);
}

.face {
  position: absolute;
  border-radius: 4px;
}

.face.front {
  width: 140px;
  height: 180px;
  transform: translateZ(20px);
}

.face.right {
  width: 40px;
  height: 180px;
  left: 120px;
  transform: rotateY(90deg);
}

.face.top {
  width: 140px;
  height: 40px;
  top: -20px;
  transform: rotateX(90deg);
}

.list-move,
/* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
