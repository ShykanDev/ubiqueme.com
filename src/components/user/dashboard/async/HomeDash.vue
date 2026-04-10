<script lang="ts" setup>
import VentoCard from '../homeDash/VentoCard.vue';
const ventoCards = [
  {
    icon: 'qr_code_scanner',
    title: 'Total de Códigos QR',
    value: '0',
    trendIcon: 'trending_up',
    trendText: 'Sus Códigos QR',
  },
  {
    icon: 'notifications_active',
    title: 'Escaneos Totales',
    value: '0',
    trendIcon: 'bolt',
    trendText: 'Información en Tiempo Real',
  },
  {
    icon: 'verified',
    title: 'Códigos QR Activos',
    value: '0',
    trendIcon: 'check_circle',
    trendText: 'Excelente',
  },
  {
    icon: 'history',
    title: 'Tasa de Respuesta',
    value: '0%',
    trendIcon: 'check_circle',
    trendText: 'Excellent health',
  },
]

</script>

<template>

  <!-- Welcome Banner -->
  <div class="mb-12 flex justify-between items-end">
    <div>
      <p class="text-primary font-semibold tracking-widest text-xs mb-2 font-google-sans">Inicio
      </p>
      <h2 class="text-3xl font-bold font-headline text-on-surface font-google-sans">Bienvenido de nuevo, Alexander</h2>
    </div>
    <button
      class="flex items-center gap-2 px-8 py-4 rounded-lg bg-linear-to-br from-primary to-sky-600 cursor-pointer text-on-primary font-bold shadow-xl hover:brightness-110 transition-all active:scale-95">
      <span class="material-symbols-outlined">add</span>
      Crear Nuevo QR
    </button>
  </div>
  <!-- Bento Grid Stats -->
  <div class="grid grid-cols-12 gap-6 mb-16">
    <VentoCard v-for="(card, index) in ventoCards" :key="index" :icon="card.icon" :title="card.title"
      :value="card.value" :trendIcon="card.trendIcon" :trendText="card.trendText">
    </VentoCard>

  </div>
</template>

<style scoped></style>
