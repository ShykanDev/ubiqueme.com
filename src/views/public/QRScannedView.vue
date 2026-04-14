<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { collectionGroup, getDocs, getFirestore, query, where } from 'firebase/firestore'
import { db } from '@/firebase'
import CloudLoader from '@/components/ui/CloudLoader.vue'
import HomeLayout from '@/layouts/HomeLayout.vue'

const route = useRoute()
const qrId = route.params.qrId as string

interface IQRScannedData {
  name: string
  isActive: boolean
  isBanned: boolean
  banReason: string
  status: string
  scans: number
  lastScan: string
  createdAt: any
  link: string
}

const loading = ref(true)
const qrData = ref<IQRScannedData | null>(null)
const errorMsg = ref('')

onMounted(async () => {
  try {
    // Si tienes el docId del QR en la ruta (ej. /qr/:qrId)
    // Buscamos en el collectionGroup 'qrs'
    if (qrId) {
      // Como Firestore no permite buscar fácilmente por document ID en un collectionGroup a menos que sea muy específico,
      // lo ideal sería asegurarnos que cada doc guarde un campo 'docId' internamente.
      // Aquí buscamos por docId guardado como campo:
      const qrsRef = collectionGroup(db, 'qrs')
      // asumiendo que los QRs nuevos tienen un campo llamado "docId" o podemos probar buscando los que existen
      const q = query(qrsRef)
      const querySnapshot = await getDocs(q)

      let found = null;
      querySnapshot.forEach((doc) => {
        if (doc.id === qrId || doc.data().docId === qrId) {
          found = doc.data()
        }
      })

      if (found) {
        qrData.value = found as IQRScannedData
      } else {
        errorMsg.value = 'El código QR escaneado no existe o fue eliminado.'
      }
    } else {
      // Mock data for testing the UI
      qrData.value = {
        name: 'MacBook Pro de Juan',
        isActive: true,
        isBanned: false,
        banReason: '',
        status: 'Active',
        scans: 42,
        lastScan: new Date().toISOString(),
        createdAt: new Date(),
        link: 'https://ubiqueme.com/xyz',
      }
    }
  } catch (error) {
    console.error('Error fetching scanned QR:', error)
    errorMsg.value = 'Ocurrió un error al cargar la información del QR.'
  } finally {
    setTimeout(() => {
      loading.value = false
    }, 1000) // fake delay for the awesome loader
  }
})
</script>

<template>

  <HomeLayout>
    <template #main>

      <section class="min-h-screen bg-surface font-body flex items-center justify-center p-4 pt-20">
        <!-- Loader -->
        <div v-if="loading" class="flex flex-col items-center justify-center space-y-4">
          <CloudLoader />
          <p class="text-on-surface-variant font-medium tracking-wide ">Obteniendo información...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="errorMsg"
          class="w-full max-w-md bg-surface-container rounded-3xl p-8 border border-outline-variant/20 shadow-2xl text-center">
          <div class="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span class="material-symbols-outlined text-red-500 text-4xl">error</span>
          </div>
          <h2 class="text-2xl font-headline font-bold text-on-surface mb-2">QR No Encontrado</h2>
          <p class="text-on-surface-variant mb-6 text-sm">{{ errorMsg }}</p>
          <RouterLink to="/"
            class="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-bold hover:bg-primary-fixed transition-colors">
            <span class="material-symbols-outlined">home</span>
            Volver al inicio
          </RouterLink>
        </div>

        <!-- Success / QR Info State -->
        <div v-else-if="qrData" class="w-full max-w-lg">
          <div
            class="bg-surface-container-low rounded-[2rem] overflow-hidden border border-outline-variant/10 shadow-2xl relative">

            <!-- Header Background with Gradients -->
            <div class="h-32 bg-obsidian-gradient relative overflow-hidden flex items-center justify-center">
              <div class="absolute inset-0 opacity-30">
                <div class="absolute top-[-50%] left-[-20%] w-full h-full bg-primary/20 rounded-full blur-[60px]"></div>
              </div>
              <span
                class="material-symbols-outlined text-white/20 text-8xl absolute -right-4 -bottom-6 rotate-12">qr_code_2</span>
            </div>

            <div class="px-8 pb-8 -mt-12 relative z-10">

              <!-- Avatar/Icon of the item -->
              <div
                class="w-24 h-24 bg-surface rounded-2xl p-2 shadow-xl border border-outline-variant/20 mx-auto flex items-center justify-center mb-6">
                <div class="w-full h-full bg-primary/10 rounded-xl flex items-center justify-center">
                  <span class="material-symbols-outlined text-primary text-4xl">devices</span>
                </div>
              </div>

              <!-- Main Info -->
              <div class="text-center mb-8">
                <h1 class="text-3xl font-headline font-extrabold text-on-surface mb-2 tracking-tight">{{ qrData.name }}
                </h1>

                <div class="flex items-center justify-center gap-2 mb-4">
                  <span v-if="qrData.isActive && !qrData.isBanned"
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider border border-green-500/20">
                    <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Activo
                  </span>
                  <span v-else-if="qrData.isBanned"
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-wider border border-red-500/20">
                    <span class="material-symbols-outlined text-[14px]">block</span>
                    Bloqueado
                  </span>
                  <span v-else
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold uppercase tracking-wider border border-orange-500/20">
                    <span class="material-symbols-outlined text-[14px]">pause_circle</span>
                    Inactivo
                  </span>
                </div>

                <p v-if="qrData.isBanned"
                  class="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20 inline-block">
                  Motivo: {{ qrData.banReason || 'Incumplimiento de políticas' }}
                </p>
              </div>

              <!-- Divider -->
              <div class="w-full h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent mb-8">
              </div>

              <!-- Stats Grid -->
              <div class="grid grid-cols-2 gap-4 mb-8">
                <div
                  class="bg-surface p-4 rounded-2xl border border-outline-variant/10 shadow-sm flex items-center gap-4 hover:border-primary/30 transition-colors">
                  <div class="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <span class="material-symbols-outlined">visibility</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Escaneos</span>
                    <span class="text-xl font-headline font-black text-on-surface">{{ qrData.scans }}</span>
                  </div>
                </div>

                <div
                  class="bg-surface p-4 rounded-2xl border border-outline-variant/10 shadow-sm flex items-center gap-4 hover:border-primary/30 transition-colors">
                  <div class="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                    <span class="material-symbols-outlined">schedule</span>
                  </div>
                  <div class="flex flex-col">
                    <span
                      class="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider whitespace-nowrap">Último
                      Escaneo</span>
                    <span class="text-sm font-bold text-on-surface mt-0.5 truncate max-w-[80px]"
                      :title="qrData.lastScan">
                      {{ qrData.lastScan ? new Date(qrData.lastScan).toLocaleDateString() : 'Nunca' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Action Button -->
              <div class="space-y-3">
                <button
                  class="w-full bg-primary hover:bg-primary-fixed text-on-primary py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group">
                  <span class="material-symbols-outlined group-hover:animate-bounce">chat</span>
                  Contactar al Propietario
                </button>
                <p class="text-center text-xs text-on-surface-variant/60 font-medium">
                  Protegido por Ubiqueme. Comunícate de forma segura.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </template>

  </HomeLayout>

</template>

<style scoped>
.font-headline {
  font-family: 'Manrope', sans-serif;
}

.font-body {
  font-family: 'Inter', sans-serif;
}

.bg-obsidian-gradient {
  background: radial-gradient(circle at 50% 0%, #151b2d 0%, #0c1324 100%);
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
