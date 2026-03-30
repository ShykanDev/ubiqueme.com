<script lang="ts" setup>
import { RouterLink } from 'vue-router';

const navLinks = [
  {
    name: 'Inicio',
    pathName: 'home',
    href: '#',
  },
  {
    name: 'Como funciona',
    pathName: 'home',
    href: '#',
  },
  {
    name: 'Ayuda',
    pathName: 'home',
    href: '#',
  },
  {
    name: 'Precios',
    pathName: 'home',
    href: '#',
  },
]
</script>

<template>
  <div>
    <!-- TopNavBar -->
    <nav class="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-xl shadow-2xl shadow-slate-950/50 ">
      <div class="flex justify-between items-center h-20 px-8 md:px-24 w-full max-w-screen-2xl mx-auto">

        <!-- Logo -->
        <div class="text-xl font-bold text-slate-100 font-headline tracking-tight">
          Ubiqueme
        </div>

        <!-- Menu -->
        <div class="hidden md:flex items-center space-x-10  tracking-tight font-rubik">
          <router-link v-for="link in navLinks" :key="link.name" :to="{ 'name': link.pathName }"
            class="text-slate-400 hover:text-white transition-all duration-300 hover:-translate-y-0.5 p-1 px-2 rounded-full relative z-20 group hover:">{{
              link.name
            }}
            <div
              class="absolute inset-0 w-full h-full bg-sky-900 rounded-2xl -z-10 blur-md opacity-0 group-hover:opacity-100 transition-all duration-200">
            </div>
          </router-link>
        </div>

        <!-- Buttons -->
        <div class="flex items-center space-x-6 font-rubik">
          <button class="text-slate-400  hover:text-slate-100 transition-all text-sm font-semibold">
            Sign In
          </button>
          <button
            class="bg-sky-400 text-on-primary-fixed  px-6 py-2.5 rounded-full text-sm font-bold hover:opacity-80 active:scale-95 transition-all">
            Get Started
          </button>
        </div>

      </div>
    </nav>

    <main>
      <slot name="main"></slot>
    </main>

    <footer>

    </footer>
  </div>
</template>

<style scoped></style>
