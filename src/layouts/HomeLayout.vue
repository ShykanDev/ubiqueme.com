<script lang="ts" setup>
import { RouterLink } from 'vue-router'

const navLinks = [
  { name: 'Inicio', pathName: 'home' },
  { name: 'Dashboard', pathName: 'dashboard' },
  { name: 'Ayuda', pathName: 'home' },
  { name: 'Precios', pathName: 'pricing' },
]
</script>

<template>
  <div class="font-google-sans">
    <!-- TopNavBar -->
    <nav class="fixed top-0 w-full z-50 bg-slate-950/60 shadow-2xl shadow-slate-950/50">
      <div class="flex justify-between items-center h-20 px-8 md:px-24 w-full max-w-screen-2xl mx-auto">

        <!-- Logo -->
        <div class="text-xl font-bold text-slate-100 font-headline tracking-tight">
          Ubiqueme.com
        </div>

        <!-- Menu -->
        <div class="hidden md:flex items-center space-x-10 tracking-tight font-rubik">
          <RouterLink v-for="link in navLinks" :key="link.name" :to="{ name: link.pathName }"
            class="text-slate-400 hover:text-white transition-all duration-300 hover:-translate-y-0.5 p-1 px-2 rounded-full relative z-20 group">
            {{ link.name }}
          </RouterLink>
        </div>

        <!-- Buttons -->
        <div class="flex items-center space-x-6 font-rubik">
          <RouterLink :to="{ name: 'login' }"
            class="text-slate-400 hover:text-slate-100 transition-all text-sm font-semibold">
            Iniciar Sesión
          </RouterLink>

          <RouterLink :to="{ name: 'register' }"
            class="bg-sky-400 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:opacity-80 active:scale-95 transition-all">
            Registrarse
          </RouterLink>
        </div>

      </div>
    </nav>

    <main>
      <slot name="main"></slot>
    </main>

    <footer
      class="bg-slate-950 shadow-2xl shadow-slate-950/50 w-full flex justify-center gap-8 px-12 py-8 z-40 text-blue-400 dark:text-sky-300">
      <div
        class="flex flex-col md:flex-row gap-4 md:gap-12 items-center opacity-80 hover:opacity-100 transition-opacity">

        <span class="font-body text-xs uppercase tracking-widest text-slate-500">
          ©{{ new Date().getFullYear() }} ubiqueme.com
        </span>

        <div class="flex gap-6">
          <a class="font-body text-xs uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors"
            href="#">
            Política de Privacidad
          </a>
          <a class="font-body text-xs uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors"
            href="#">
            Términos de Servicio
          </a>
          <a class="font-body text-xs uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors"
            href="#">
            Contacto
          </a>
        </div>

      </div>
    </footer>
  </div>
</template>

<style scoped></style>
