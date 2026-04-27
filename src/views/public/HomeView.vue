<script lang="ts" setup>
import FeaturesComponent from '@/components/home/Features/FeaturesComponent.vue'
import HowItWorks from '@/components/home/HowItWorks/HowItWorks.vue'
import PricingPlans from '@/components/home/Pricing/PricingPlans.vue'
import StepByStep from '@/components/home/StepByStep/StepByStep.vue'
import VideoGrid from '@/components/home/VideoGrid/VideoGrid.vue'
import HomeLayout from '@/layouts/HomeLayout.vue'
import { useUserStore } from '@/stores/user';
</script>

<template>
  <HomeLayout>
    <template #main>
      <main class="relative bg-[#070b14] overflow-hidden font-google-sans">

        <!-- 📐 BACKGROUND ORNAMENTATION (Blueprint Style) -->
        <div class="absolute inset-0 z-0">
          <div
            class="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none">
          </div>
          <div
            class="absolute top-[-5%] right-[-5%] w-[400px] h-[400px] border border-white/5 rounded-full pointer-events-none">
          </div>
          <div class="absolute inset-0 z-0 opacity-[0.02]"
            style="background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 100px 100px;">
          </div>
        </div>

        <!-- 🚀 HERO SECTION (Modern, Lightweight, Typography-Driven) -->
        <section
          class="relative z-10 px-6 sm:px-8 pt-32 pb-24 mx-auto max-w-5xl flex flex-col items-center text-center">

          <!-- Subtle Badge -->
          <div
            class="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/20 mb-8 transition-colors hover:bg-primary/10 cursor-default">
            <span class="material-symbols-outlined text-primary text-sm">enhanced_encryption</span>
            <span class="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Privacidad Absoluta</span>
          </div>

          <!-- Main Headline -->
          <h1 class="text-5xl sm:text-7xl lg:text-[5.5rem] font-black text-white leading-[1.05] tracking-tight mb-6">
            Códigos QR inteligentes para<br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">su familia y
              pertenencias.</span>
          </h1>

          <!-- Sub-headline (Formal tone) -->
          <p class="text-white/50 text-lg sm:text-xl font-medium leading-relaxed max-w-3xl mx-auto mb-10">
            Etiquetas físicas y pulseras que permiten a cualquiera reportar sus artículos perdidos o asistir a sus
            mascotas, niños y adultos mayores al instante, manteniendo su información de contacto 100% oculta.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <router-link :to="{ name: 'pricing' }"
              class="w-full sm:w-auto px-8 py-4 bg-white text-[#070b14] font-black text-base rounded-2xl transition-all duration-300 hover:bg-primary hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(123,208,255,0.3)]">
              Obtener mi Código QR
            </router-link>
            <router-link v-if="!useUserStore().getUserId" :to="{ name: 'login' }"
              class="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold text-base rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              Iniciar Sesión
            </router-link>
          </div>

          <!-- Lightweight Features Grid -->
          <div
            class="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 mt-20 pt-10 border-t border-white/5 w-full max-w-3xl">
            <div class="flex flex-col items-center gap-2 text-white/40">
              <span class="material-symbols-outlined text-2xl mb-1 text-white/80">notifications_active</span>
              <span class="text-xs font-black uppercase tracking-widest text-white/60">Alertas Inmediatas</span>
            </div>
            <div class="flex flex-col items-center gap-2 text-white/40">
              <span class="material-symbols-outlined text-2xl mb-1 text-white/80">vpn_key</span>
              <span class="text-xs font-black uppercase tracking-widest text-white/60">Cero Datos Expuestos</span>
            </div>
            <div class="flex flex-col items-center gap-2 text-white/40">
              <span class="material-symbols-outlined text-2xl mb-1 text-white/80">public</span>
              <span class="text-xs font-black uppercase tracking-widest text-white/60">Cobertura Global</span>
            </div>
          </div>

        </section>

        <HowItWorks />
        <VideoGrid />
        <StepByStep />
        <FeaturesComponent />
        <PricingPlans />
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

button {
  transition: all 0.2s ease;
}
</style>
