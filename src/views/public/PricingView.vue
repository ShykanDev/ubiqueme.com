<script lang="ts" setup>
import { useRouter } from 'vue-router'
import HomeLayout from '@/layouts/HomeLayout.vue'

const router = useRouter()

const plans = [
  {
    id: 'alpha',
    name: 'Alpha',
    price: 'Gratis',
    tagline: 'Seguridad Esencial',
    description: 'Para proteger tus objetos cotidianos sin costo alguno.',
    icon: 'shield',
    color: '#ffffff',
    features: [
      'Hasta 3 QRs Activos',
      'Contador de Escaneos',
      'Registro Básico',
      'Alertas en Dashboard'
    ]
  },
  {
    id: 'beta',
    name: 'Beta',
    price: '79',
    currency: 'MXN',
    period: '/mes',
    tagline: 'Protección Avanzada',
    description: 'Ideal para usuarios activos que buscan trazabilidad real.',
    icon: 'verified_user',
    color: '#7bd0ff',
    featured: true,
    features: [
      '15 QRs Protegidos',
      'Logs por 30 días',
      '3 Reposiciones Digitales',
      'Captura Fotográfica',
      'Notificaciones Email'
    ]
  },
  {
    id: 'epsilon',
    name: 'Epsilon',
    price: '199',
    currency: 'MXN',
    period: '/mes',
    tagline: 'Control Total',
    description: 'El estándar máximo de seguridad para activos críticos.',
    icon: 'military_tech',
    color: '#ffd264',
    features: [
      'QRs Ilimitados',
      'Mapa Interactivo (ScanLoc)',
      '5 Reposiciones Digitales',
      'Logs Ilimitados',
      'Soporte Prioritario'
    ]
  }
]

const handleSelect = (id: string) => {
  router.push({ name: 'checkout', params: { planId: id } })
}
</script>

<template>
  <HomeLayout>
    <template #main>
      <div class="relative min-h-screen bg-[#070b14] pt-32 pb-24 overflow-hidden font-google-sans">

        <!-- Background Accents -->
        <div
          class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none">
        </div>
        <div
          class="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none">
        </div>

        <div class="relative z-10 max-w-7xl mx-auto px-6">

          <!-- Header -->
          <div class="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span class="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Planes de Protección</span>
            </div>
            <h1 class="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">
              Invierta en su <br />
              <span class="text-primary italic">Tranquilidad.</span>
            </h1>
            <p class="text-white/40 text-lg font-medium">
              Elija el nivel de blindaje que mejor se adapte a sus necesidades. Sin contratos forzosos.
            </p>
          </div>

          <!-- Pricing Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            <div v-for="plan in plans" :key="plan.id" :class="[
              'relative flex flex-col p-8 rounded-[2.5rem] border transition-all duration-500 group',
              plan.featured
                ? 'bg-white/5 border-primary/30 shadow-[0_20px_50px_rgba(123,208,255,0.1)] scale-105 z-10'
                : 'bg-white/[0.02] border-white/5 hover:border-white/20'
            ]">

              <!-- Badge for Featured -->
              <div v-if="plan.featured"
                class="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary rounded-full shadow-xl">
                <span class="text-[10px] font-black text-black uppercase tracking-widest">Más Popular</span>
              </div>

              <!-- Content -->
              <div class="space-y-6 flex-1">
                <div class="flex items-center justify-between">
                  <div
                    class="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors">
                    <span class="material-symbols-outlined text-3xl transition-transform group-hover:scale-110"
                      :style="{ color: plan.color }">
                      {{ plan.icon }}
                    </span>
                  </div>
                  <h3 class="text-2xl font-black text-white uppercase tracking-tighter">{{ plan.name }}</h3>
                </div>

                <div>
                  <p class="text-[10px] font-black uppercase tracking-widest" :style="{ color: plan.color }">{{
                    plan.tagline }}</p>
                  <div class="flex items-baseline gap-1 mt-1">
                    <span v-if="plan.currency" class="text-white/40 text-lg font-bold">{{ plan.currency }}</span>
                    <span class="text-5xl font-black text-white tracking-tighter">{{ plan.price }}</span>
                    <span v-if="plan.period" class="text-white/40 text-sm font-bold">{{ plan.period }}</span>
                  </div>
                  <p class="text-white/40 text-xs mt-3 leading-relaxed">{{ plan.description }}</p>
                </div>

                <div class="space-y-4 pt-6">
                  <div v-for="feature in plan.features" :key="feature" class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-sm" :style="{ color: plan.color }">check_circle</span>
                    <span class="text-sm text-white/70 font-medium tracking-tight">{{ feature }}</span>
                  </div>
                </div>
              </div>

              <!-- Button -->
              <button @click="handleSelect(plan.id)" :class="[
                'mt-10 w-full h-16 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 active:scale-95',
                plan.featured
                  ? 'bg-primary text-black shadow-lg shadow-primary/20 hover:shadow-primary/40'
                  : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20'
              ]">
                Seleccionar Plan
              </button>
            </div>
          </div>

          <!-- Footer Note -->
          <div class="mt-20 text-center py-12 border-t border-white/5">
            <p class="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">
              Seguridad y privacidad <span class="text-white/40">ubiqueme.com</span>
            </p>
          </div>

        </div>
      </div>
    </template>
  </HomeLayout>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
