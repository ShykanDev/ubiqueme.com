<script lang="ts" setup>
import { useUserStore } from '@/stores/user';
import { RouterLink } from 'vue-router'

const navLinks = [
  {
    name: 'Inicio',
    pathName: 'home',
  },
  {
    name: 'Mis Códigos',
    pathName: 'home', // ← pon aquí tu ruta real
  },
  {
    name: 'Avisos',
    pathName: 'home',
  },
]
</script>

<template>
  <div>
    <!-- TopNavBar -->
    <nav class="fixed top-0 w-full z-50 bg-[#09090b] border-b border-white/5">
      <div class="flex justify-between items-center h-20 px-8 md:px-24 w-full max-w-screen-2xl mx-auto">
        <!-- Logo -->
        <div class="text-xl font-bold text-slate-100 tracking-tight">
          Ubiqueme.com
        </div>

        <!-- Menu -->
        <div class="hidden md:flex items-center space-x-10 tracking-tight">
          <RouterLink v-for="link in navLinks" :key="link.name" :to="{ name: link.pathName }"
            class="text-slate-400 hover:text-white transition-all duration-300 hover:-translate-y-0.5 p-1 px-2 rounded-full">
            {{ link.name }}
          </RouterLink>
        </div>


        <!-- Buttons -->
        <div class="flex items-center space-x-6 font-rubik" v-if="!useUserStore().getUserId">
          <RouterLink :to="{ name: 'login' }" class="text-slate-400 hover:text-slate-100 transition-all text-sm ">
            Iniciar Sesión
          </RouterLink>

          <RouterLink :to="{ name: 'register' }"
            class="bg-sky-950 border-white/30 border text-white px-6 py-2.5 rounded-full text-sm  hover:opacity-80 active:scale-95 transition-all">
            Registrarse
          </RouterLink>
        </div>
      </div>
    </nav>

    <!-- Main -->
    <main class="scrollbar-hide">
      <slot name="main"></slot>
    </main>

    <!-- Footer -->
    <footer
      class="bg-slate-950 hidden border-t border-white/5 w-full justify-center gap-8 px-12 py-8 z-40 text-sky-300">
      <div
        class="flex flex-col md:flex-row gap-4 md:gap-12 items-center opacity-80 hover:opacity-100 transition-opacity">
        <span class="text-xs uppercase tracking-widest text-slate-500">
          ©{{ new Date().getFullYear() }} ubiqueme.com
        </span>

        <div class="flex gap-6">
          <a class="text-xs uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors" href="#">
            Política de Privacidad
          </a>
          <a class="text-xs uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors" href="#">
            Términos de Servicio
          </a>
          <a class="text-xs uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors" href="#">
            Contacto
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
