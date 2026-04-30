<script lang="ts" setup>
import { useUserStore } from '@/stores/user';
import { RouterLink } from 'vue-router'

import { onMounted, onUnmounted, ref } from 'vue';

const navLinks = [
  { name: 'Inicio', pathName: 'home', icon: 'home', requiredLogin: false },
  { name: 'Dashboard', pathName: 'dashboard', icon: 'dashboard_customize', requiredLogin: true },
  { name: 'Ayuda', pathName: 'help', icon: 'help', requiredLogin: false },
  { name: 'Precios', pathName: 'pricing', icon: 'payments', requiredLogin: false },
]

const domains = ['ubiqueme.com', 'contactomio.com', 'localizarme.com'];
const currentDomainIndex = ref(0);
let intervalId: any;

onMounted(() => {
  intervalId = setInterval(() => {
    currentDomainIndex.value = (currentDomainIndex.value + 1) % domains.length;
  }, 5000);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<template>
  <div class="font-google-sans">
    <!-- TopNavBar -->
    <nav class="fixed top-0 w-full z-50 bg-[#09090b] border-b border-white/5 transition-all duration-300">

      <!-- Subtle Orange Top Line -->
      <div
        class="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent">
      </div>

      <div class="flex justify-between items-center h-20 px-6 md:px-16 w-full max-w-screen-2xl mx-auto">

        <!-- Logo -->
        <RouterLink :to="{ name: 'home' }" class="flex items-center gap-2 group cursor-pointer">
          <span
            class="material-symbols-outlined text-orange-500 text-[2.5rem] group-hover:rotate-12 transition-transform">location_on</span>
          <div class="hidden sm:flex flex-col justify-center h-10 overflow-hidden relative min-w-[220px]">
            <Transition name="slide-up">
              <div :key="currentDomainIndex"
                class="absolute left-0 flex items-baseline text-[#dce7ff] font-black tracking-tighter text-[22px] lowercase leading-none whitespace-nowrap">
                <span>{{ domains[currentDomainIndex].split('.com')[0] }}</span>
                <span class="text-orange-500">.com</span>
              </div>
            </Transition>
          </div>
        </RouterLink>

        <!-- Menu -->
        <div class="hidden lg:flex items-center space-x-2 tracking-tight">
          <RouterLink v-for="link in navLinks" :key="link.name" :to="{ name: link.pathName }"
            :class="{ 'hidden': !useUserStore().getUserId && link.requiredLogin }"
            class="flex items-center gap-2 text-white/40 hover:text-orange-500 px-4 py-2 rounded-xl transition-all duration-300 group relative">
            <span class="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">{{ link.icon
            }}</span>
            <span class="text-[11px] font-black uppercase tracking-widest">{{ link.name }}</span>

            <!-- Indicator Line -->
            <div
              class="absolute bottom-0 left-4 right-4 h-[2px] bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-center">
            </div>
          </RouterLink>
        </div>

        <!-- Buttons -->
        <div class="flex items-center space-x-4">
          <template v-if="!useUserStore().getUserId">
            <RouterLink :to="{ name: 'login' }"
              class="text-white/40 hover:text-white transition-colors duration-300 text-[11px] font-black uppercase tracking-widest px-4 py-2 cursor-pointer">
              Iniciar sesión
            </RouterLink>

            <RouterLink :to="{ name: 'register' }"
              class="bg-orange-500 text-[#09090b] px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-white transition-all duration-300 active:scale-95 shadow-[0_10px_20px_rgba(249,115,22,0.15)] cursor-pointer">
              Registrarse
            </RouterLink>
          </template>
          <template v-else>
            <RouterLink :to="{ name: 'dashboard' }"
              class="bg-white/5 border border-white/10 text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-[#09090b] hover:border-orange-500 transition-all duration-300 cursor-pointer flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">dashboard</span>
              Panel
            </RouterLink>
          </template>
        </div>

      </div>
    </nav>

    <main>
      <slot name="main"></slot>
    </main>

    <footer
      class="bg-[#09090b] border-t border-white/5 w-full flex justify-center gap-8 px-12 py-8 z-40 text-slate-500 relative">
      <div
        class="flex flex-col md:flex-row gap-4 md:gap-12 items-center opacity-80 hover:opacity-100 transition-opacity">

        <span class="font-body text-xs uppercase tracking-widest text-slate-500">
          ©{{ new Date().getFullYear() }} ubiqueme.com
        </span>

        <div class="flex gap-6">
          <a class="font-body text-xs uppercase tracking-widest text-slate-500 hover:text-amber-500 transition-colors duration-300 cursor-pointer"
            href="#">
            Política de Privacidad
          </a>
          <a class="font-body text-xs uppercase tracking-widest text-slate-500 hover:text-amber-500 transition-colors duration-300 cursor-pointer"
            href="#">
            Términos de Servicio
          </a>
          <a class="font-body text-xs uppercase tracking-widest text-slate-500 hover:text-amber-500 transition-colors duration-300 cursor-pointer"
            href="#">
            Contacto
          </a>
        </div>

      </div>
    </footer>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 24;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
