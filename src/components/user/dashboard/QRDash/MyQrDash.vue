<script lang="ts" setup>
import VentoCard from '../homeDash/VentoCard.vue';
import QRCard from './QRCard.vue';

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
    status: 'Process',
    scans: 5,
    lastScan: 'Mar 15',
    statusClass: 'bg-yellow-500/10 text-yellow-400'
  },
  {
    id: 'LMN456',
    name: 'Mochila',
    status: 'Error',
    scans: 34,
    lastScan: 'Apr 2',
    statusClass: 'bg-red-500/10 text-red-400'
  }
];



</script>

<template>
  <!--Section principal-->
  <section class="mb-12">
    <h1 class="text-6xl font-bold  text-on-surface mb-6  font-google-sans">
      Gestión de<br />
      <span class="bg-linear-to-r from-sky-500 to-primary bg-clip-text text-transparent">
        Códigos QR
      </span>
    </h1>
    <p class="text-md text-on-surface-variant max-w-2xl font-google-sans">
      Cree, administre y monitoree el rendimiento de sus etiquetas QR en tiempo real.
      Toda la información y control centralizados en un solo lugar.
    </p>
  </section>
  <!-- Welcome Banner -->
  <div class="mb-12 flex justify-between items-end">
    <div>
      <p class="text-primary font-semibold tracking-widest uppercase text-xs mb-2 font-google-sans">Resumen de su sesión
      </p>
      <h2 class="text-4xl font-bold font-headline text-on-surface font-google-sans">Bienvenido de nuevo, Alejandro</h2>
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
      <QRCard v-for="qr in userQRs" :key="qr.id" :id="qr.id" :name="qr.name" :status="qr.status" :scans="qr.scans"
        :lastScan="qr.lastScan" />
    </div>
  </div>

</template>

<style scoped></style>
