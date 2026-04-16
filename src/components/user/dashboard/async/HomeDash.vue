<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import VentoCard from '../homeDash/VentoCard.vue'
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

const userStore = useUserStore()
</script>

<template>
  <div class="font-google-sans">
    <!-- Welcome Banner -->
    <div class="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
      <div>
        <p class="text-primary font-semibold tracking-widest text-[10px] uppercase mb-2">Protocol: Home</p>
        <h2 class="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">
          Bienvenido, {{ userStore.getFirstName || 'Usuario' }}
        </h2>
      </div>
      <button
        class="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-white text-black font-black uppercase tracking-widest text-xs shadow-xl hover:bg-primary transition-all active:scale-95"
      >
        <span class="material-symbols-outlined font-black">add</span>
        Nuevo Nodo QR
      </button>
    </div>
    
    <!-- Bento Grid Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      <VentoCard
        v-for="(card, index) in ventoCards"
        :key="index"
        :icon="card.icon"
        :title="card.title"
        :value="card.value"
        :trendIcon="card.trendIcon"
        :trendText="card.trendText"
      >
      </VentoCard>
    </div>
  </div>
</template>

<style scoped></style>
