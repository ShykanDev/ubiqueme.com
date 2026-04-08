<script lang="ts" setup>
import VentoCard from '../homeDash/VentoCard.vue';

const userQRs = [
  {
    id: 'ABC123',
    name: 'MacBook Pro',
    status: 'Active',
    scans: 12,
    lastScan: 'Apr 8',
    statusClass: 'bg-green-500/10 text-green-400'
  },
  {
    id: 'XYZ789',
    name: 'Llaves del auto',
    status: 'Paused',
    scans: 5,
    lastScan: 'Mar 15',
    statusClass: 'bg-yellow-500/10 text-yellow-400'
  },
  {
    id: 'LMN456',
    name: 'Mochila',
    status: 'Cancelled',
    scans: 34,
    lastScan: 'Apr 2',
    statusClass: 'bg-red-500/10 text-red-400'
  }
];


</script>

<template>
  <section class="mb-20 max-w-4xl">
    <h1 class="text-6xl font-extrabold font-headline tracking-tighter text-on-surface mb-6 leading-none">
      Gestione sus Códigos QR<br />
      <span class="bg-linear-to-r from-primary to-on-secondary bg-clip-text text-transparent">
        Fácil y bajo control
      </span>
    </h1>
    <p class="text-xl text-on-surface-variant font-medium leading-relaxed max-w-2xl">
      Cree, administre y monitoree el rendimiento de sus etiquetas QR en tiempo real.
      Toda la información y control centralizados en un solo lugar.
    </p>
  </section>
  <!-- Welcome Banner -->
  <div class="mb-12 flex justify-between items-end">
    <div>
      <p class="text-primary font-semibold tracking-widest uppercase text-xs mb-2">Resumen de su sesión</p>
      <h2 class="text-4xl font-bold font-headline text-on-surface">Bienvenido de nuevo, Alexander</h2>
    </div>
    <button
      class="flex items-center gap-2 px-8 py-4 rounded-lg bg-linear-to-br from-primary to-sky-600 cursor-pointer text-on-primary font-bold shadow-xl hover:brightness-110 transition-all active:scale-95">
      <span class="material-symbols-outlined">add</span>
      Crear Nuevo QR
    </button>
  </div>

  <!-- Mis Códigos QR Section -->
  <div class="mb-6">
    <h3 class="text-2xl font-bold font-headline text-on-surface mb-6">Mis Códigos QR</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div v-for="qr in userQRs" :key="qr.id"
        class="bg-[#111324] rounded-2xl p-5 shadow-lg border border-white/5 w-full max-w-sm">

        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-white text-lg font-semibold">{{ qr.name }}</h3>
            <p class="text-xs text-gray-400 mt-1">ID: {{ qr.id }}</p>
          </div>

          <!-- Status -->
          <span :class="['text-xs px-2 py-1 rounded-full font-medium', qr.statusClass]">
            {{ qr.status }}
          </span>
        </div>

        <!-- Stats -->
        <div class="flex justify-between text-sm text-gray-400 mb-4">
          <div>
            <p class="text-xs">Scans</p>
            <p class="text-white font-semibold">{{ qr.scans }}</p>
          </div>
          <div>
            <p class="text-xs">Last scan</p>
            <p class="text-white font-semibold">{{ qr.lastScan }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between gap-2">
          <button
            class="flex-1 text-sm bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg transition cursor-pointer">
            View
          </button>
          <button
            class="flex-1 text-sm bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 py-2 rounded-lg transition cursor-pointer">
            Pause
          </button>
          <button
            class="flex-1 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 rounded-lg transition cursor-pointer">
            Report
          </button>

          <!-- Menu -->
          <button class="p-2 rounded-lg hover:bg-white/10 transition cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h.01M12 12h.01M18 12h.01" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped></style>
