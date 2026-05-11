<script lang="ts" setup>
import { useUserStore } from '@/stores/user';
import { RouterLink, useRouter } from 'vue-router'
import { onMounted, onUnmounted, ref } from 'vue';

const navLinks = [
  { name: 'Inicio', pathName: 'home', icon: 'home' },
  { name: 'Ayuda', pathName: 'help', icon: 'help' },
  { name: 'Precios', pathName: 'pricing', icon: 'payments' },
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

        <!-- Logo con animación (Match Home) -->
        <RouterLink :to="{ name: 'home' }" class="flex items-center gap-2 group cursor-pointer z-50">
          <span
            class="material-symbols-outlined text-orange-500 text-[2.5rem] group-hover:rotate-12 transition-transform">location_on</span>
          <div class="hidden sm:flex flex-col justify-center h-10 overflow-hidden relative min-w-[220px]">
            <Transition name="slide-up">
              <div :key="currentDomainIndex"
                class="absolute left-0 flex items-baseline text-[#dce7ff] font-black tracking-tighter text-[22px] lowercase leading-none whitespace-nowrap">
                <span>{{ domains[currentDomainIndex]?.split('.com')[0] }}</span>
                <span class="text-orange-500">.com</span>
              </div>
            </Transition>
          </div>
        </RouterLink>

        <!-- Menu -->
        <div class="hidden lg:flex items-center space-x-2 tracking-tight">
          <RouterLink v-for="link in navLinks" :key="link.name" :to="{ name: link.pathName }"
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

        <!-- Opciones de Usuario Autenticado -->
        <div class="flex items-center space-x-4 z-50">
          <RouterLink :to="{ name: 'home' }"
            class="bg-white/5 border border-white/10 text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-[#09090b] hover:border-orange-500 transition-all duration-300 cursor-pointer flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">logout</span>
            Salir del Panel
          </RouterLink>
        </div>

      </div>
    </nav>

    <!-- Main -->
    <main class="scrollbar-hide">
      <slot name="main"></slot>
    </main>

  </div>
</template>

<style scoped>
.font-google-sans {
  font-family: 'Google Sans', sans-serif;
}

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

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
