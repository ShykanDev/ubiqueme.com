<script lang="ts" setup>
import { useUserStore } from '@/stores/user';
import { RouterLink } from 'vue-router'

const navLinks = [
  { name: 'Inicio', pathName: 'home' },
  { name: 'Dashboard', pathName: 'dashboard' },
  { name: 'Ayuda', pathName: 'help' },
  { name: 'Precios', pathName: 'pricing' },
]
</script>

<template>
  <div class="font-google-sans">
    <!-- TopNavBar -->
    <nav
      class="fixed top-0 w-full z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-white/5 shadow-md transition-all duration-300">
      <div class="flex justify-between items-center h-20 px-8 md:px-24 w-full max-w-screen-2xl mx-auto">

        <!-- Logo -->
        <div class="text-xl font-bold text-slate-100 font-headline tracking-tight relative">
          <div class="absolute bottom-0 right-0 h-2 w-7 bg-[#09090b]"></div>
        </div>

        <!-- Menu -->
        <div class="hidden md:flex items-center space-x-10 tracking-tight font-rubik">
          <RouterLink v-for="link in navLinks" :key="link.name" :to="{ name: link.pathName }"
            class="text-slate-400 hover:text-amber-500 transition-all duration-300 hover:-translate-y-0.5 p-1 px-2 rounded-full relative z-20 group cursor-pointer hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
            {{ link.name }}
          </RouterLink>
        </div>

        <!-- Buttons -->
        <div class="flex items-center space-x-6 font-rubik" v-if="!useUserStore().getUserId">
          <RouterLink :to="{ name: 'login' }"
            class="text-slate-400 hover:text-amber-500 transition-colors duration-300 text-sm cursor-pointer hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
            Iniciar Sesión
          </RouterLink>

          <RouterLink :to="{ name: 'register' }"
            class="bg-orange-500/10 border-orange-500/30 border text-orange-500 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-orange-500 hover:text-[#09090b] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] active:scale-95 transition-all duration-300 cursor-pointer">
            Registrarse
          </RouterLink>
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

<style scoped></style>
