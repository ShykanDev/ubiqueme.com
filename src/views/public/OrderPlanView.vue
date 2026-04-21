<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import HomeLayout from '@/layouts/HomeLayout.vue'
import Qrcode from 'qrcode.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const selectedPlan = ref(route.params.planId as string || 'beta')
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
  { id: 'alpha', name: 'Alpha', price: 'Gratis', icon: 'shield', color: '#ffffff' },
  { id: 'beta', name: 'Beta', price: '$79 MXN', icon: 'verified_user', color: '#7bd0ff' },
  { id: 'epsilon', name: 'Epsilon', price: '$199 MXN', icon: 'military_tech', color: '#ffd264' }
]

const handleSubmit = async () => {
  isSubmitting.value = true
  await new Promise(resolve => setTimeout(resolve, 2000))

  console.log('Datos del pedido:', {
    plan: selectedPlan.value,
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
      <main class="relative min-h-screen bg-[#070b14] pt-32 pb-20 overflow-hidden font-google-sans">

        <!-- Background Grid -->
        <div class="absolute inset-0 z-0 opacity-[0.03]"
          style="background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 40px 40px;">
        </div>

        <div class="relative z-10 max-w-6xl mx-auto px-6">

          <!-- Header -->
          <div class="mb-12 space-y-4">
            <button @click="router.back()"
              class="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-black uppercase tracking-widest group">
              <span
                class="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1">arrow_back</span>
              Volver
            </button>
            <h1 class="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
              Configura tu <span class="text-primary">Orden</span>
            </h1>
            <p class="text-white/40 text-sm font-medium">Completa los detalles para recibir tu cotización formal de
              <span class="text-white">informes@grupochimex.com</span>
            </p>
          </div>

          <div v-if="!isSuccess" class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            <!-- FORM COLUMN -->
            <form @submit.prevent="handleSubmit" class="lg:col-span-7 space-y-8">

              <!-- Plan Selection Toggle -->
              <div class="space-y-4">
                <label class="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] ml-2">Selecciona tu nivel
                  de protección</label>
                <div class="grid grid-cols-3 gap-4">
                  <button v-for="plan in plans" :key="plan.id" type="button" @click="selectedPlan = plan.id" :class="[
                    'relative h-24 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 overflow-hidden',
                    selectedPlan === plan.id
                      ? 'bg-white/5 border-primary shadow-[0_0_20px_rgba(123,208,255,0.1)]'
                      : 'bg-white/[0.02] border-white/5 border-dashed grayscale opacity-40 hover:opacity-100 hover:grayscale-0'
                  ]">
                    <span class="material-symbols-outlined text-2xl"
                      :style="{ color: selectedPlan === plan.id ? plan.color : 'white' }">
                      {{ plan.icon }}
                    </span>
                    <span class="text-[10px] font-black uppercase tracking-widest text-white">{{ plan.name }}</span>
                    <div v-if="selectedPlan === plan.id" class="absolute top-2 right-2">
                      <span class="material-symbols-outlined text-primary text-sm font-black">check_circle</span>
                    </div>
                  </button>
                </div>
              </div>

              <!-- Personal/Org Details -->
              <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] ml-2">Nombre
                      Completo</label>
                    <input disabled v-model="formData.fullName" required type="text" placeholder="Ej. Juan Pérez"
                      class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white/45 focus:outline-none focus:border-primary/50 transition-all shadow-inner" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] ml-2">Correo
                      Electrónico</label>
                    <input disabled v-model="formData.email" required type="email" placeholder="email@ejemplo.com"
                      class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white/45 focus:outline-none focus:border-primary/50 transition-all shadow-inner" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] ml-2">Teléfono de
                      Contacto</label>
                    <input v-model="formData.phone" required type="tel" placeholder="+52 ..."
                      class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none  focus:border-primary/50 transition-all shadow-inner" />
                  </div>
                </div>

                <!-- Data Protection Disclaimer -->
                <div class="px-6 py-4 bg-primary/10 rounded-2xl border border-primary/20 flex gap-4 items-center">
                  <span class="material-symbols-outlined text-primary text-sm">security</span>
                  <p class="text-[10px] text-primary/80 font-black uppercase tracking-widest leading-none">
                    Tus datos personales están 100% protegidos y resguardados bajo protocolos de encriptación.
                  </p>
                </div>
              </div>

              <!-- Order Details -->
              <div class="space-y-6 bg-white/[0.03] border border-white/5 p-8 rounded-[2.5rem]">
                <div class="flex items-center justify-between pb-6 border-b border-white/5">
                  <div class="space-y-1">
                    <h3 class="text-white font-black uppercase text-sm tracking-widest">Configuración de QRs</h3>
                    <p class="text-white/30 text-[10px] font-medium uppercase tracking-widest">Selecciona cuántos QRs
                      deseas agregar</p>
                  </div>
                  <div class="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
                    <button type="button" @click="formData.qrQuantity = Math.max(1, formData.qrQuantity - 1)"
                      class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                      <span class="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span class="text-xl font-black text-white w-8 text-center">{{ formData.qrQuantity }}</span>
                    <button type="button" @click="formData.qrQuantity++"
                      class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-black hover:scale-105 transition-transform">
                      <span class="material-symbols-outlined text-sm font-black">add</span>
                    </button>
                  </div>
                </div>

                <!-- QR Names Inputs -->
                <div class="space-y-6">
                  <div class="flex items-center justify-between ml-2">
                    <label
                      class="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] flex items-center gap-2">
                      Identificación de Bienes
                      <span class="text-red-500 text-[8px] animate-pulse font-black">(Público)</span>
                    </label>
                    <span class="text-[9px] text-white/20 font-bold uppercase tracking-widest">Total: {{
                      formData.qrQuantity }} Unidades</span>
                  </div>

                  <div class="relative min-h-[100px]">
                    <TransitionGroup name="list" tag="div" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div v-for="(name, index) in formData.qrNames" :key="index"
                        class="group/qr-card relative flex items-center gap-4 bg-white/[0.02] border border-white/5 hover:border-primary/30 hover:bg-white/[0.04] p-4 rounded-2xl transition-all duration-300">

                        <!-- Mini QR Preview Container -->
                        <div
                          class="relative shrink-0 w-16 h-16 bg-white/[0.05] rounded-xl border border-white/10 flex items-center justify-center overflow-hidden group-hover/qr-card:border-primary/20 transition-colors shadow-inner">
                          <div
                            class="absolute inset-0 bg-primary/5 opacity-0 group-hover/qr-card:opacity-100 transition-opacity">
                          </div>
                          <Qrcode :value="`https://ubiqueme.com/qr/${formData.qrNames[index]}` || 'Ubiqueme'" :size="48"
                            level="M" background="transparent" foreground="#ffffff"
                            class="relative z-10 opacity-60 group-hover/qr-card:opacity-100 group-hover/qr-card:scale-105 transition-all duration-500"
                            render-as="svg" />
                        </div>

                        <!-- Input Area -->
                        <div class="flex-1 space-y-1">
                          <div class="flex justify-between items-center px-1">
                            <span class="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">QR#{{
                              index + 1 }}</span>
                            <span class="material-symbols-outlined text-[12px] text-primary/40">qr_code_2</span>
                          </div>
                          <input v-model="formData.qrNames[index]" type="text"
                            class="w-full bg-transparent border-b border-white/10 py-1.5 text-xs text-white placeholder:text-white/10 focus:outline-none focus:border-primary transition-all font-bold"
                            placeholder="Ej. MacBook Pro..." />
                        </div>

                        <!-- Side Accent -->
                        <div
                          class="absolute right-0 top-0 bottom-0 w-1 bg-primary/0 group-hover/qr-card:bg-primary/40 rounded-r-2xl transition-all">
                        </div>
                      </div>
                    </TransitionGroup>
                  </div>

                  <!-- Public Warning -->
                  <div class="p-4 bg-white/5 rounded-2xl border border-white/5 flex gap-4 items-start">
                    <span class="material-symbols-outlined text-red-500/50 text-sm">warning</span>
                    <p class="text-[9px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">
                      Atención: Los nombres que elijas para tus QR serán <span class="text-white">visibles
                        públicamente</span> al ser escaneados. <span class="text-red-500/80">Evita incluir datos
                        personales directos</span> (como tu dirección o número de teléfono) en estos nombres.
                    </p>
                  </div>
                </div>

                <div class="pt-4 space-y-2">
                  <label class="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] ml-2">Notas
                    Especiales</label>
                  <textarea v-model="formData.specialNotes"
                    placeholder="Indica si necesitas medidas especiales o requerimientos técnicos..."
                    class="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-sm focus:outline-none focus:border-primary/50 transition-all min-h-[100px] resize-none shadow-inner"></textarea>
                </div>
              </div>

              <button type="submit" :disabled="isSubmitting"
                class="relative w-full h-18 bg-white text-black font-black uppercase tracking-[0.2em] text-sm rounded-3xl overflow-hidden group transition-all active:scale-[0.98] disabled:opacity-50">
                <div class="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="relative z-10 flex items-center justify-center gap-4">
                  <span v-if="isSubmitting"
                    class="w-5 h-5 border-3 border-black/20 border-t-black rounded-full animate-spin"></span>
                  <span v-else>Solicitar Cotización Formal</span>
                  <span v-if="!isSubmitting"
                    class="material-symbols-outlined font-black transition-transform group-hover:translate-x-1">send</span>
                </div>
              </button>

            </form>

            <!-- SUMMARY COLUMN -->
            <div class="lg:col-span-5 lg:sticky lg:top-32 space-y-6">
              <div
                class="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center group mb-8">
                <div
                  class="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent z-0 opacity-50">
                </div>

                <!-- Dynamic Plan Icon -->
                <div
                  class="relative z-10 flex flex-col items-center gap-4 transition-transform duration-500 group-hover:scale-110">
                  <span class="material-symbols-outlined text-7xl md:text-8xl transition-all duration-700"
                    :style="{ color: plans.find(p => p.id === selectedPlan)?.color, filter: `drop-shadow(0 0 20px ${plans.find(p => p.id === selectedPlan)?.color}40)` }">
                    {{plans.find(p => p.id === selectedPlan)?.icon}}
                  </span>
                  <div
                    class="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-lg border border-primary/30">
                    <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    <span class="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Nivel
                      Seleccionado</span>
                  </div>
                  <h4 class="text-3xl font-black text-white italic uppercase tracking-tighter">{{ selectedPlan }} Tier
                  </h4>
                </div>
              </div>

              <div class="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 space-y-6">
                <div class="space-y-4">
                  <div class="flex justify-between items-end border-b border-white/5 pb-4">
                    <span class="text-[10px] font-black text-white/30 uppercase tracking-widest">Plan Unitario</span>
                    <span class="text-xl font-black text-white">{{plans.find(p => p.id === selectedPlan)?.price
                      }}</span>
                  </div>
                  <div class="flex justify-between items-end border-b border-white/5 pb-4">
                    <span class="text-[10px] font-black text-white/30 uppercase tracking-widest">Cantidad</span>
                    <span class="text-xl font-black text-white">x{{ formData.qrQuantity }}</span>
                  </div>
                </div>

                <div class="space-y-4 pt-2">
                  <div v-for="feat in [
                    { t: 'Seguridad', v: 'Encriptación SSL' },
                    { t: 'User ID', v: formData.firebaseUid.substring(0, 16) + '...' },
                    { t: 'Entrega', v: 'Digital Inmediata' },
                    { t: 'Soporte', v: 'Grupo Chimex' }
                  ]" :key="feat.t" class="flex items-center gap-4">
                    <span class="material-symbols-outlined text-primary text-sm">verified</span>
                    <div class="flex flex-col">
                      <span class="text-[8px] font-black text-white/20 uppercase tracking-widest">{{ feat.t }}</span>
                      <span class="text-xs font-bold text-white/60 tracking-wide">{{ feat.v }}</span>
                    </div>
                  </div>
                </div>

                <div class="pt-6">
                  <div class="p-4 bg-primary/10 rounded-2xl border border-primary/20 flex gap-4 items-start">
                    <span class="material-symbols-outlined text-primary">info</span>
                    <p class="text-[10px] text-primary/80 font-medium leading-relaxed">
                      Esta solicitud no requiere pago inmediato. Recibirás un documento PDF con los detalles y métodos
                      de pago en tu correo.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- SUCCESS STATE -->
          <div v-else
            class="max-w-2xl mx-auto py-20 text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div class="relative inline-flex mx-auto">
              <div class="absolute inset-0 bg-green-500/20 blur-3xl rounded-full"></div>
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

input::placeholder,
textarea::placeholder {
  color: rgba(255, 255, 255, 0.2);
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
