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
    icon: 'crown',
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
      <div class="bg-surface-container-lowest font-inter pt-32 pb-20 px-6 min-h-screen text-on-surface">
        <div class="max-w-7xl mx-auto">

          <!-- Hero Section -->
          <header class="text-center mb-24 space-y-6">
            <div class="inline-flex items-center px-4 py-1.5 rounded-full glass-panel border border-[#45464d]/20">
              <span class="text-xs font-bold tracking-widest text-[#7bd0ff] uppercase">Planes de Protección</span>
            </div>
            <h1 class="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter text-on-surface">
              Invierta en su <span class="text-gradient-primary">Tranquilidad.</span>
            </h1>
            <p class="max-w-2xl mx-auto text-on-surface/80 text-lg font-body leading-relaxed">
              Elija el nivel de blindaje que mejor se adapte a sus necesidades. Sin contratos forzosos.
            </p>
          </header>

          <!-- Pricing Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
            <div v-for="plan in plans" :key="plan.id" :class="[
              'transition-all duration-500 flex flex-col h-full group',
              plan.featured
                ? 'relative bg-[#191f31] p-12 rounded-xl scale-105  hover:-translate-y-3 glow-border border border-[#7bd0ff]/30'
                : 'bg-[#151b2d] p-10 rounded-xl hover:-translate-y-2 border border-[#45464d]/10'
            ]">

              <!-- Badge for Featured -->
              <div v-if="plan.featured"
                class="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#7bd0ff] px-4 py-1 rounded-full">
                <span class="text-[10px] font-black uppercase tracking-tighter text-[#00354a]">Recomendado</span>
              </div>

              <!-- Content -->
              <div class="mb-8">
                <span class="material-symbols-outlined mb-4"
                  :class="plan.featured ? 'text-5xl text-[#7bd0ff]' : 'text-4xl'"
                  :style="plan.featured ? { fontVariationSettings: '\'FILL\' 1' } : { color: plan.color === '#ffffff' ? '#c6c6cd' : plan.color }">
                  {{ plan.icon }}
                </span>
                <h3 :class="[
                  'font-headline text-[#dce1fb]',
                  plan.featured ? 'text-3xl font-extrabold' : 'text-2xl font-bold'
                ]">{{ plan.name }}</h3>
                <p :class="[
                  'mb-6',
                  plan.featured ? 'text-base text-[#7bd0ff] font-semibold' : 'text-sm text-[#c6c6cd] font-medium'
                ]">{{ plan.tagline }}</p>
                <div class="flex items-baseline gap-1">
                  <span v-if="plan.currency" :class="[
                    'font-headline font-black text-[#dce1fb]',
                    plan.featured ? 'text-5xl' : 'text-4xl'
                  ]">${{ plan.price }}</span>
                  <span v-else :class="[
                    'font-headline font-black text-[#dce1fb]',
                    plan.featured ? 'text-5xl' : 'text-4xl'
                  ]">{{ plan.price }}</span>
                  <span v-if="plan.period" class="text-[#c6c6cd] font-medium">{{ plan.currency }} {{ plan.period
                  }}</span>
                </div>
              </div>

              <ul :class="[
                'flex-grow mb-12',
                plan.featured ? 'space-y-6' : 'space-y-5'
              ]">
                <li v-for="feature in plan.features" :key="feature" :class="[
                  'flex items-center gap-3 transition-colors',
                  plan.featured ? 'text-[#dce1fb]' : 'text-[#c6c6cd] group-hover:text-[#dce1fb]'
                ]">
                  <span class="material-symbols-outlined text-xl" :class="plan.featured ? 'text-[#7bd0ff]' : ''"
                    :style="!plan.featured ? { color: plan.color === '#ffffff' ? '#7bd0ff' : plan.color } : {}">
                    check_circle
                  </span>
                  <span :class="plan.featured ? 'font-medium' : 'text-sm'">{{ feature }}</span>
                </li>
              </ul>

              <!-- Button -->
              <button @click="handleSelect(plan.id)" :class="[
                'w-full rounded-lg font-headline transition-all active:scale-95',
                plan.featured
                  ? 'py-5 bg-gradient-to-r from-[#7bd0ff] to-[#008abb] text-[#00354a] font-black shadow-lg shadow-[#7bd0ff]/20 hover:brightness-110'
                  : 'py-4 bg-[#2e3447] text-[#dce1fb] font-bold hover:bg-[#33394c]',
                plan.id === 'epsilon' ? 'border border-[#ffd264]/20' : ''
              ]">
                Seleccionar Plan
              </button>
            </div>
          </div>

          <!-- Decorative Map/Visual element -->
          <section class="mt-24 relative overflow-hidden rounded-xl h-[400px] border border-[#45464d]/10 shadow-inner">
            <div class="absolute inset-0 z-0">
              <img class="w-full h-full object-cover opacity-30 grayscale" alt="abstract architectural blueprint"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJydQWXb7WCm-6EPB-f3obKCWFjLVZrZl4R7xYn3FoM--yh7PaCjY_m1use6ENd31Sp847utuJXFeEKvB1BQHWp47MCLJ3TMf72zZ0bibc05pPWlrbr4RA3Nt1JBggcDWjqi17qHcD3prMiXr4Hqcys-cqD2qT1un1sbt88uQCzojztoo7p9Absk71AQmugehnnpmmQVnKCR9xISzfXavxCRn9Z8WM5WTZyFvTBdNnT3YfwFJ1RPbwBHdJ1aVYbBCjU2RzrXU2M_m7" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-[#0c1324] to-transparent z-10"></div>
            <div class="relative z-20 h-full flex flex-col justify-end p-12 max-w-3xl">
              <h4 class="text-3xl font-headline font-bold mb-4 text-[#dce1fb]">Arquitectura de Confianza</h4>
              <p class="text-[#c6c6cd] text-base leading-relaxed mb-6">
                Nuestra infraestructura obsidian está diseñada para transiciones seguras. Cada QR generado está
                respaldado por protocolos de encriptación de grado bancario y monitoreo en tiempo real.
              </p>
              <div class="flex gap-4">
                <div
                  class="px-4 py-2 glass-panel rounded-lg border border-[#45464d]/10 text-xs font-bold text-[#7bd0ff]">
                  AES-256 BIT</div>
                <div
                  class="px-4 py-2 glass-panel rounded-lg border border-[#45464d]/10 text-xs font-bold text-[#7bd0ff]">
                  SCANLOC ENABLED</div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </template>
  </HomeLayout>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');

.font-inter {
  font-family: 'Inter', sans-serif;
}

.font-headline {
  font-family: 'Manrope', sans-serif;
}

.font-body {
  font-family: 'Inter', sans-serif;
}

.glass-panel {
  background: rgba(51, 57, 76, 0.6);

}

.text-gradient-primary {
  background: linear-gradient(135deg, #7bd0ff 0%, #008abb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.glow-border {
  position: relative;
}

.glow-border::after {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, #7bd0ff, transparent, #008abb);
  z-index: -1;
  border-radius: inherit;
  opacity: 0.5;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
