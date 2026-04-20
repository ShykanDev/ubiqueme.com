<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import VentoCard from '../homeDash/VentoCard.vue'
import { collection, onSnapshot, query, getFirestore } from 'firebase/firestore'
import { onMounted, onUnmounted, ref, computed } from 'vue'

const userStore = useUserStore()
const db = getFirestore()
const qrs = ref<any[]>([])

let unsubscribe: any

onMounted(() => {
  const userId = userStore.getUserId
  if (!userId) return

  const qrsRef = collection(db, `users/${userId}/qrs`)
  unsubscribe = onSnapshot(qrsRef, (snapshot) => {
    qrs.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

const stats = computed(() => {
  const total = qrs.value.length
  const scans = qrs.value.reduce((acc, qr) => acc + (qr.scans || 0), 0)
  const active = qrs.value.filter(qr => qr.status === 'Active').length
  const inactive = total - active
  const average = total > 0 ? (scans / total).toFixed(1) : '0'

  // Find top QR
  const topQR = [...qrs.value].sort((a, b) => (b.scans || 0) - (a.scans || 0))[0]

  // Find most recently created QR
  const newestQR = [...qrs.value].sort((a, b) => {
    const dateA = a.createdAt?.seconds || 0
    const dateB = b.createdAt?.seconds || 0
    return dateB - dateA
  })[0]

  // Find last scan overall
  const mostRecentScan = [...qrs.value]
    .filter(qr => qr.lastScan)
    .sort((a, b) => b.lastScan?.seconds - a.lastScan?.seconds)[0]

  const lastTime = mostRecentScan?.lastScan
    ? mostRecentScan.lastScan.toDate().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    : '---'

  const securityAlerts = qrs.value.filter(qr => qr.status === 'Error' || qr.isBanned).length

  return [
    {
      icon: 'qr_code_scanner',
      title: 'Códigos QR',
      value: total.toString(),
      trendIcon: 'apps',
      trendText: 'Total registrados',
    },
    {
      icon: 'notifications_active',
      title: 'Escaneos Totales',
      value: scans.toLocaleString(),
      trendIcon: 'bolt',
      trendText: 'Actividad global',
    },
    {
      icon: 'star',
      title: 'Código más Popular',
      value: topQR?.name?.substring(0, 10) || 'N/A',
      trendIcon: 'trending_up',
      trendText: `${topQR?.scans || 0} visitas`,
    },
    {
      icon: 'update',
      title: 'Actividad Reciente',
      value: lastTime,
      trendIcon: 'history',
      trendText: mostRecentScan?.name?.substring(0, 12) || 'Sin escaneos',
    },
    {
      icon: 'add_circle',
      title: 'Último Creado',
      value: newestQR?.name?.substring(0, 12) || '---',
      trendIcon: 'fiber_new',
      trendText: 'Código más nuevo',
    },
    {
      icon: 'pause_circle',
      title: 'Códigos Inactivos',
      value: inactive.toString(),
      trendIcon: 'do_not_disturb_on',
      trendText: 'Pausados o cancelados',
    },
    {
      icon: 'analytics',
      title: 'Popularidad Promedio',
      value: average,
      trendIcon: 'equalizer',
      trendText: 'Escaneos por código',
    },
    {
      icon: 'security',
      title: 'Alertas y Reportes',
      value: securityAlerts.toString(),
      trendIcon: securityAlerts > 0 ? 'warning' : 'verified_user',
      trendText: securityAlerts > 0 ? 'Revisión necesaria' : 'Sistema seguro',
    },
  ]
})


const handleGreeting = (): string => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 18) return 'Buenas tardes'
  return 'Buenas noches'
}
</script>

<template>
  <div class="font-google-sans">
    <!-- Welcome Banner -->
    <div class="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
      <div>
        <p class="text-primary font-black tracking-[0.4em] text-[10px] uppercase mb-2">Resumen Operativo</p>
        <h2 class="text-4xl md:text-4xl font-black text-white tracking-tighter leading-[0.9] italic">
          {{ handleGreeting() }}, {{ userStore.getFirstName || 'Usuario' }}
        </h2>
      </div>
      <button
        class="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-white text-black font-black uppercase tracking-widest text-xs shadow-xl hover:bg-primary transition-all active:scale-95 font-google-sans">
        <span class="material-symbols-outlined font-black">add</span>
        Nuevo Código QR
      </button>
    </div>

    <!-- Bento Grid Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 animate-fade-in animate-duration-700">
      <VentoCard v-for="(card, index) in stats" :key="index" :icon="card.icon" :title="card.title" :value="card.value"
        :trendIcon="card.trendIcon" :trendText="card.trendText">
      </VentoCard>
    </div>
  </div>
</template>

<style scoped></style>
