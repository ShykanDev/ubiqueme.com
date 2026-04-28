<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import QRCard from './QRCard.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { collection, getFirestore, onSnapshot, Timestamp, doc, runTransaction, increment } from 'firebase/firestore'
import QRCardSkeleton from '@/components/ui/user/dashboard/QRCardSkeleton.vue'
import { useImageStore } from '@/stores/imageStore'

import type { IMyQR } from '@/interfaces/IMyQR'
import { nanoid } from 'nanoid'
import LineLoader from '@/components/ui/LineLoader.vue'
import { toast } from 'vue-sonner'

const userQRs = ref<IMyQR[]>([])
const userStore = useUserStore()
const isLoading = ref(true);
const noQRsFound = ref(false);
//Firebase data
const db = getFirestore();
const userId = userStore.getUserId ?? '';
const userQrsCollection = collection(db, `users/${userId}/qrs`);

//Add QR doc to user ATENTION THIS MUST BE ONLY FOR ADMIN ITS CREATED HERE FOR TEST PURPOUSE ONLY
const createQR = async () => {
  try {
    await runTransaction(db, async (transaction) => {
      // 1. Generamos el ID
      const newQRId = nanoid(15);

      // 2. Referencias a los documentos (Público y Privado)
      const publicQrRef = doc(db, `publicQR/${newQRId}`);
      const userQrRef = doc(db, `users/${userId}/qrs/${newQRId}`);

      // 3. Verificamos idempotencia (Que no exista en la base de datos pública globalmente)
      const qrDoc = await transaction.get(publicQrRef);
      if (qrDoc.exists()) {
        throw new Error("Colisión de ID. La transacción se cancelará y puede reintentar.");
      }

      // 4. Si no existe, creamos el documento en ambas colecciones atómicamente
      // Colección Pública (Para cuando lo escaneen)
      transaction.set(publicQrRef, {
        id: newQRId,
        name: 'Nuevo QR (Prueba)',
        status: 'Active',
        lastScan: null,
        totalScans: 0,
        isBanned: false,
        banReason: '',
        docId: newQRId,
        uid: userId,
        tier: 'free',
        createdAt: Timestamp.now()
      });

      // Subcolección del Usuario (Para su Dashboard)
      transaction.set(userQrRef, {
        id: newQRId,
        uid: userId,
        name: 'Nuevo QR (Prueba)',
        status: 'Active',
        scans: 0,
        lastScan: "",
        isActive: true,
        isBanned: false,
        banReason: '',
        planEndDate: null,
        planPurchasedAt: null,
        createdAt: Timestamp.now()
      });

      // Incrementamos el contador global de QRs en el documento PRINCIPAL del usuario
      const userRootRef = doc(db, `users/${userId}`);
      transaction.update(userRootRef, {
        totalQRs: increment(1)
      });

    });

    toast.success("¡QR creado con éxito atómicamente!");
  } catch (error) {
    toast.error(`Fallo al crear el QR: ${error}`);
  }
}




//listener to user QRs
let unsub: any;

onMounted(() => {

  unsub = onSnapshot(userQrsCollection, (snapshot) => {
    if (snapshot.empty) {
      toast.info('No Qrs were found');
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
      toast.error(`Error while getting data: ${error}`);
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
      <img v-for="(src, index) in images" :key="index" :src="src">
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
        <button @click="createQR"
          class="w-full cursor-pointer md:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl   font-black  text-xs  bg-primary-container text-primary transition-all active:scale-95">
          <span class="material-symbols-outlined font-black">add</span>
          Agregar nuevo QR
        </button>
      </div>

      <div class="relative">
        <!-- Loading Grid -->
        <div v-if="isLoading" key="loading"
          class="flex justify-center items-center  w-full z-10 absolute  left-1/2 -translate-x-1/2 -translate-y-1/2">
          <LineLoader />
        </div>

        <!-- Content Grid -->
        <div v-show="userQRs.length > 0" key="content"
          class="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-0 max-w-[1500px] mx-auto animate-fade-up">
          <QRCard v-for="qr in userQRs" :key="qr.id" v-memo="[qr.status, qr.name, qr.scans, qr.lastScan]" :id="qr.id"
            :name="qr.name" :status="qr.status" :scans="qr.scans" :lastScan="qr.lastScan" :docId="qr.docId"
            :link="qr.link" :isActive="qr.isActive" :isBanned="qr.isBanned" :banReason="qr.banReason"
            :planPurchasedAt="qr.planPurchasedAt" :planEndDate="qr.planEndDate" :createdAt="qr.createdAt" />
        </div>

        <!-- Empty State -->
        <div v-show="!isLoading && noQRsFound" key="empty"
          class="flex flex-col items-center justify-center py-20 text-center w-full">
          <span class="material-symbols-outlined text-6xl text-slate-500 mb-4">qr_code_2</span>
          <h3 class="text-xl font-semibold text-white mb-2">Aún no tiene códigos QR registrados</h3>
          <p class="text-slate-400">¡Cree su primer código QR para empezar!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
