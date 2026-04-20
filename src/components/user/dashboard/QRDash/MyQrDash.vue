<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import QRCard from './QRCard.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { collection, getFirestore, onSnapshot, Timestamp } from 'firebase/firestore'
import QRCardSkeleton from '@/components/ui/user/dashboard/QRCardSkeleton.vue'
import { useImageStore } from '@/stores/imageStore'

type TStatus = 'Active' | 'Canceled' | 'Process' | 'Error'

interface IMyQR {
  link: string,
  name: string,
  isActive: boolean,
  isBanned: boolean,
  banReason: string,
  status: TStatus,
  scans: number,
  lastScan: string,
  planPurchasedAt: null,
  planEndDate: null,
  id: string,
  createdAt: Timestamp,
  docId: string,
}

const userQRsDemo: IMyQR[] = [
  {
    id: 'ABC123',
    name: 'MacBook Pro',
    status: 'Active',
    scans: 12,
    lastScan: 'Apr 8',
    statusClass: 'bg-green-500/10 text-green-400',
  },
  {
    id: 'XYZ789',
    name: 'Llaves del auto',
    status: 'Process',
    scans: 5,
    lastScan: 'Mar 15',
    statusClass: 'bg-yellow-500/10 text-yellow-400',
  },
  {
    id: 'LMN456',
    name: 'Mochila',
    status: 'Error',
    scans: 34,
    lastScan: 'Apr 2',
    statusClass: 'bg-red-500/10 text-red-400',
  },
]
const userQRs = ref<IMyQR[]>([])
const userStore = useUserStore()
const isLoading = ref(true);
const noQRsFound = ref(false);
//Firebase data
const db = getFirestore();
const userId = userStore.getUserId ?? '';
const userQrsCollection = collection(db, `users/${userId}/qrs`);


//listener to user QRs
let unsub: any;

onMounted(() => {

  unsub = onSnapshot(userQrsCollection, (snapshot) => {
    if (snapshot.empty) {
      console.log('No Qrs were found');
      noQRsFound.value = true;
      isLoading.value = false;
      return;
    }
    userQRs.value = [];
    snapshot.docs.forEach(doc => {
      userQRs.value.push({
        docId: doc.id,
        ...doc.data()
      } as IMyQR);
    })
    noQRsFound.value = false;
    setTimeout(() => {
      isLoading.value = false;
    }, 600);
  },
    (error) => {
      console.log('Error while getting data', error);
      isLoading.value = false;
    }
  )

})

onUnmounted(() => {
  if (unsub) unsub();
  isLoading.value = true;
})

const imageStore = useImageStore();
const images = imageStore.getImages;



</script>

<template>
  <div class="space-y-12 font-google-sans ">
    <!-- component -->
    <viewer :images="images">
      <img v-for="(src, index) in images" :key="index" :src="src.href">
    </viewer>
    <!-- Header Section -->
    <header class="max-w-3xl mx-auto text-center space-y-4">
      <div class="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-lg border border-primary/20">
        <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
        <span class="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Gestión de Activos</span>
      </div>
      <h1 class="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
        Códigos <span class="text-primary italic">QR</span>
      </h1>
      <p class="text-white/40 text-sm font-medium leading-relaxed">
        Administre y monitoree el rendimiento de sus etiquetas QR en tiempo real.
      </p>
    </header>

    <!-- Content Section -->
    <div class="space-y-10">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white border-dotted">
        <div>
          <p class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Visión General</p>
          <h2 class="text-2xl font-black text-white tracking-tight uppercase">Mis Registros</h2>
        </div>
        <button
          class="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-white text-black font-black uppercase tracking-widest text-xs shadow-xl hover:bg-primary transition-all active:scale-95">
          <span class="material-symbols-outlined font-black">add</span>
          Vincular Nuevo Código
        </button>
      </div>

      <div class="relative min-h-[400px]">
        <Transition name="fade">
          <div v-if="isLoading" key="loading"
            class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 absolute inset-0 w-full z-10">
            <QRCardSkeleton v-for="(_, i) in 3" :key="i" />
          </div>

          <div v-else-if="userQRs.length > 0" key="content"
            class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 relative z-0">
            <QRCard v-for="qr in userQRs" :key="qr.id" v-memo="[qr.status, qr.name, qr.scans, qr.lastScan]" :id="qr.id"
              :name="qr.name" :status="qr.status" :scans="qr.scans" :lastScan="qr.lastScan" :docId="qr.docId"
              :link="qr.link" :isActive="qr.isActive" :isBanned="qr.isBanned" :banReason="qr.banReason"
              :planPurchasedAt="qr.planPurchasedAt" :planEndDate="qr.planEndDate" :createdAt="qr.createdAt" />
          </div>

          <div v-else-if="noQRsFound" key="empty"
            class="flex flex-col items-center justify-center py-20 text-center absolute inset-0 w-full">
            <span class="material-symbols-outlined text-6xl text-slate-500 mb-4">qr_code_2</span>
            <h3 class="text-xl font-semibold text-white mb-2">Aún no tiene códigos QR registrados</h3>
            <p class="text-slate-400">¡Cree su primer código QR para empezar!</p>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .7s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
