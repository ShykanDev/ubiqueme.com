<script lang="ts" setup>
import { ref } from 'vue'

const hoveredPlan = ref<string | null>(null)

const plans = [
  {
    id: 'alpha',
    name: 'Alpha',
    tagline: 'Para empezar a proteger',
    price: 'Gratis',
    priceNote: 'Sin tarjeta requerida',
    accent: 'rgba(255,255,255,0.15)',
    accentBorder: 'rgba(255,255,255,0.1)',
    accentText: '#ffffff',
    badge: null,
    cta: 'Comenzar Gratis',
    features: [
      { label: 'Hasta 3 códigos QR activos', included: true },
      { label: 'Contador de escaneos básico', included: true },
      { label: 'Página pública de contacto', included: true },
      { label: 'Mensajes predefinidos de contacto', included: true },
      { label: 'Pausar o reactivar QR', included: false },
      { label: 'Historial de escaneos', included: false },
      { label: 'Ubicación con Mapa dinámico', included: false },
      { label: 'Evidencia fotográfica adjunta', included: false },
      { label: 'Notificaciones por correo', included: false },
    ]
  },
  {
    id: 'beta',
    name: 'Beta',
    tagline: 'Para quienes toman en serio sus bienes',
    price: '$79',
    priceNote: 'MXN / mes · Cancela cuando quieras',
    accent: 'rgba(123,208,255,0.12)',
    accentBorder: 'rgba(123,208,255,0.35)',
    accentText: '#7bd0ff',
    badge: 'Más Popular',
    cta: 'Activar Beta',
    features: [
      { label: 'Hasta 15 códigos QR activos', included: true },
      { label: 'Contador de escaneos en tiempo real', included: true },
      { label: 'Página pública de contacto', included: true },
      { label: '3 Regeneraciones digitales sin costo', included: true },
      { label: 'Pausar o reactivar QR', included: true },
      { label: 'Historial de escaneos (últimos 30 días)', included: true },
      { label: 'Ubicación aproximada del escaneo', included: true },
      { label: 'Evidencia fotográfica adjunta', included: true },
      { label: 'Notificaciones por correo', included: true },
    ]
  },
  {
    id: 'epsilon',
    name: 'Epsilon',
    tagline: 'Control total. Sin compromisos.',
    price: '$199',
    priceNote: 'MXN / mes · Facturación mensual',
    accent: 'rgba(255,210,100,0.08)',
    accentBorder: 'rgba(255,210,100,0.3)',
    accentText: '#ffd264',
    badge: 'Premium',
    cta: 'Activar Epsilon',
    features: [
      { label: 'Códigos QR ilimitados', included: true },
      { label: 'Ubicación con Mapa dinámico incluido', included: true },
      { label: 'Ubicación aproximada del escaneo', included: true },
      { label: '5 Regeneraciones digitales sin costo', included: true },
      { label: 'Mensajes predefinidos y personalizados', included: true },
      { label: 'Pausar o reactivar QR', included: true },
      { label: 'Historial de escaneos ilimitado', included: true },
      { label: 'Evidencia fotográfica adjunta', included: true },
      { label: 'Notificaciones por correo prioritarias', included: true },
    ]
  }
]
</script>

<template>
  <section class="relative z-10 px-6 md:px-24 py-28 mx-auto max-w-7xl">

    <!-- Section Header -->
    <div class="text-center space-y-6 mb-20">
      <div class="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-lg border border-primary/20">
        <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
        <span class="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Planes de Protección</span>
      </div>
      <h2 class="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter uppercase">
        Elige tu<br /><span class="text-primary">Nivel</span>
      </h2>
      <p class="text-white/40 text-lg max-w-xl mx-auto font-medium leading-relaxed">
        Desde protección básica hasta control total de tus bienes. Sin contratos, sin complicaciones.
      </p>
    </div>

    <!-- Plans Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
      <div
        v-for="plan in plans"
        :key="plan.id"
        @mouseenter="hoveredPlan = plan.id"
        @mouseleave="hoveredPlan = null"
        :class="[
          'relative flex flex-col rounded-[2.5rem] border p-8 transition-all duration-500 cursor-default',
          plan.id === 'beta' ? 'md:-translate-y-4 md:scale-[1.03]' : '',
          hoveredPlan === plan.id ? 'shadow-2xl' : ''
        ]"
        :style="{
          background: plan.accent,
          borderColor: plan.accentBorder,
          boxShadow: hoveredPlan === plan.id ? `0 0 60px ${plan.accentBorder}` : 'none'
        }"
      >

        <!-- Badge -->
        <div v-if="plan.badge" class="absolute -top-4 left-1/2 -translate-x-1/2">
          <div
            class="px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border"
            :style="{ color: plan.accentText, borderColor: plan.accentBorder, background: '#070b14' }"
          >
            {{ plan.badge }}
          </div>
        </div>

        <!-- Plan Identity -->
        <div class="space-y-2 mb-8">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-[10px] font-black uppercase tracking-[0.4em] mb-1"
                :style="{ color: plan.accentText }">
                Plan
              </p>
              <h3 class="text-4xl font-black text-white tracking-tight leading-none">{{ plan.name }}</h3>
            </div>
            <div
              class="w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0"
              :style="{ borderColor: plan.accentBorder, background: plan.accent }"
            >
              <span class="material-symbols-outlined text-xl" :style="{ color: plan.accentText }">
                {{ plan.id === 'alpha' ? 'shield' : plan.id === 'beta' ? 'verified_user' : 'military_tech' }}
              </span>
            </div>
          </div>
          <p class="text-white/40 text-sm font-medium">{{ plan.tagline }}</p>
        </div>

        <!-- Price -->
        <div class="mb-8 pb-8 border-b border-white/[0.06]">
          <div class="flex items-baseline gap-2">
            <span class="text-5xl font-black text-white tracking-tighter">{{ plan.price }}</span>
            <span v-if="plan.id !== 'alpha'" class="text-white/20 text-xs font-black uppercase tracking-widest">/mo</span>
          </div>
          <p class="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">{{ plan.priceNote }}</p>
        </div>

        <!-- Features -->
        <ul class="flex-1 space-y-4 mb-10">
          <li v-for="(feat, i) in plan.features" :key="i" class="flex items-start gap-3">
            <div
              class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              :style="feat.included
                ? { background: plan.accentBorder, boxShadow: `0 0 10px ${plan.accentBorder}` }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }"
            >
              <span
                class="material-symbols-outlined text-[12px]! font-black"
                :style="feat.included ? { color: plan.accentText } : { color: 'rgba(255,255,255,0.15)' }"
              >
                {{ feat.included ? 'check' : 'remove' }}
              </span>
            </div>
            <span
              class="text-sm font-medium leading-snug"
              :class="feat.included ? 'text-white/80' : 'text-white/20 line-through decoration-white/10'"
            >
              {{ feat.label }}
            </span>
          </li>
        </ul>

        <!-- CTA Button -->
        <button
          @click="$router.push({ name: 'checkout', params: { planId: plan.id } })"
          class="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 active:scale-[0.97] border"
          :style="plan.id === 'alpha'
            ? { background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }
            : { background: plan.accentText, borderColor: plan.accentText, color: '#070b14' }"
        >
          {{ plan.cta }}
        </button>

      </div>
    </div>

    <!-- Bottom Note -->
    <p class="text-center text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mt-16">
      Todos los planes incluyen encriptación de extremo a extremo · Sin contratos forzosos · Cancela cuando quieras
    </p>

  </section>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 1, 'wght' 700, 'GRAD' 0, 'opsz' 20;
}
</style>
