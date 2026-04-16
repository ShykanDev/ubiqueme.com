<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { collection, collectionGroup, doc, getDoc, getDocs, getFirestore, onSnapshot, query, Timestamp, where, writeBatch, increment } from 'firebase/firestore'
import { db } from '@/firebase'
import CloudLoader from '@/components/ui/CloudLoader.vue'
import HomeLayout from '@/layouts/HomeLayout.vue'
import type { IPublicQR } from '@/interfaces/IPublicQR'

const route = useRoute()
const qrId = route.params.qrId as string

const loading = ref(true)
const qrData = ref<IPublicQR | null>(null)
const errorMsg = ref('')

//public QR collection


const scanQR = async () => {

  if (!qrId || typeof qrId !== 'string') {
    errorMsg.value = "QR no valido";
    loading.value = false;
    return;
  }
  const QRDoc = doc(db, 'publicQR', qrId);

  try {
    const docSnapshot = await getDoc(QRDoc);
    if (!docSnapshot.exists()) {
      errorMsg.value = "No se encontro informacion sobre este QR";
      loading.value = false;
      console.log(`Not QR data was found`);
      return
    }
    qrData.value = docSnapshot.data() as IPublicQR;
    const batch = writeBatch(db);
    //Update totalScans and lastScan
    batch.update(QRDoc, {
      totalScans: increment(1),
      lastScan: Timestamp.now(),
    });

    const metricData = {
      country: "",
      city: "",
      region: ""
    };

    try {
      /*
       * LEGAL & PRIVACY COMPLIANCE NOTICE
       * This network request operates strictly under a "Stateless Processing" (Ephemeral) architecture.
       * We utilize the client's IP solely 'in transit' to anonymously resolve geographic metadata
       * (City, Region, Country). The raw IP address is NEVER stored, processed, or linked to
       * Personally Identifiable Information (PII) within our databases. By adhering strictly to
       * the Data Minimization principle, this implementation ensures full compliance with international
       * and regional privacy regulations (including GDPR, CCPA, and Mexico's LFPDPPP).
       * The resulting dataset is entirely anonymized and statistically dissociated.
       */
      const ipRes = await fetch('https://ipapi.co/json/');
      if (ipRes.ok) {
        const data = await ipRes.json();
        metricData.country = data.country_name || "";
        metricData.city = data.city || "";
        metricData.region = data.region || "";
      }
    } catch (err) {
      console.log('No se pudieron obtener las metricas:', err);
    }

    const logsCollection = collection(db, 'publicQR', qrId, 'logs');
    const logDoc = doc(logsCollection, Timestamp.now().toMillis().toString());

    batch.set(logDoc, {
      scanDate: Timestamp.now(),
      scanMetrics: metricData
    });

    await batch.commit();
    loading.value = false;
  } catch (error) {
    loading.value = false;
    const e = error as Error;
    errorMsg.value = "Error al obtener la informacion del QR";
    console.log(`Error while trying to get data: ${e}`);
  }
}






onMounted(() => {
  scanQR()
})

</script>

<template>

  <HomeLayout>
    <template #main>
      <main
        class="relative min-h-screen bg-[#070b14] pt-20 overflow-hidden flex flex-col items-center justify-center p-6 md:p-12 font-google-sans">

        <!-- 📐 BACKGROUND GRID (Lightweight architectural feel) -->
        <div class="absolute inset-0 z-0 opacity-[0.03]"
          style="background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 40px 40px;">
        </div>
        <div class="absolute inset-0 z-0 bg-linear-to-b from-primary/5 via-transparent to-transparent"></div>

        <!-- 💠 ORNAMENTAL LIGHT SOURCE -->
        <div
          class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[300px] bg-primary/20 blur-[120px] rounded-full opacity-50 z-0 pointer-events-none">
        </div>

        <!-- ☁️ LOADING STATE -->
        <CloudLoader v-if="loading" />

        <!-- ❌ ERROR STATE -->
        <div v-else-if="errorMsg" class="relative z-10 w-full max-w-md flex flex-col items-center text-center gap-6">
          <div class="relative">
            <div class="absolute inset-0 bg-red-500/20 blur-xl rounded-full scale-110"></div>
            <div
              class="relative w-24 h-24 bg-red-500/10 border border-red-500/30 flex items-center justify-center rounded-3xl shadow-[0_0_40px_rgba(239,68,68,0.2)]">
              <span class="material-symbols-outlined text-red-500 text-5xl">error</span>
            </div>
          </div>

          <div class="space-y-3">
            <h1 class="text-3xl font-black text-white">QR No Encontrado</h1>
            <p class="text-white/50 text-sm leading-relaxed px-4">
              {{ errorMsg }}. Te recomendamos verificar los datos, escanear nuevamente o intentarlo más tarde.
            </p>
          </div>

          <button @click="$router.push('/')"
            class="mt-4 px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors uppercase tracking-widest text-xs">
            Volver al Inicio
          </button>
        </div>

        <!-- 🚀 MAIN CONTENT CONTAINER -->
        <div v-else class="relative z-10 w-full max-w-4xl flex flex-col md:flex-row gap-8 items-stretch">

          <!-- LEFT COLUMN: STATUS & BADGE -->
          <div
            class="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left gap-6 py-6 border-b md:border-b-0 md:border-r border-white/5 pr-0 md:pr-12">

            <div class="relative">
              <div class="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-110"></div>
              <div
                class="relative w-20 h-20 bg-primary flex items-center justify-center rounded-2xl shadow-[0_0_30px_rgba(123,208,255,0.4)]">
                <span class="material-symbols-outlined text-black text-4xl font-bold">verified</span>
              </div>
            </div>

            <div class="space-y-3">
              <h2 class="text-primary font-black text-xs uppercase tracking-[0.4em]">Propiedad Confirmada</h2>
              <h1 class="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter">
                {{ qrData?.ownerName || 'Cargando...' }}
              </h1>
              <p class="text-white/40 text-sm max-w-xs font-medium leading-relaxed">
                Este perfil ha sido validado exitosamente a través de la red segura de Ubiqueme.
              </p>
            </div>

            <div class="flex items-center gap-4 pt-4">
              <div class="px-4 py-2 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                <span class="text-[10px] text-white/70 font-bold uppercase tracking-wider">Servicio Activo</span>
              </div>
              <div class="flex -space-x-2">
                <div
                  class="w-8 h-8 rounded-full border-2 border-[#070b14] bg-white/10 overflow-hidden flex items-center justify-center">
                  <span class="material-symbols-outlined text-xs text-white">person</span>
                </div>
                <div class="w-8 h-8 rounded-full border-2 border-[#070b14] bg-primary flex items-center justify-center">
                  <span class="material-symbols-outlined text-xs text-black">check</span>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN: MODULAR INFO & ACTIONS -->
          <div class="flex-1 flex flex-col gap-6">

            <!-- STATS MODULE -->
            <div class="grid grid-cols-2 gap-4">
              <div
                class="group relative bg-white/[0.03] border border-white/10 rounded-3xl p-6 transition-all duration-300 hover:bg-white/[0.06] overflow-hidden">
                <div class="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                  <span class="material-symbols-outlined text-xl text-white">analytics</span>
                </div>
                <span class="block text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Total
                  Escaneos</span>
                <p class="text-3xl font-black text-white tracking-tight">{{ qrData?.totalScans || 0 }}</p>
              </div>

              <div
                class="group relative bg-white/[0.03] border border-white/10 rounded-3xl p-6 transition-all duration-300 hover:bg-white/[0.06] overflow-hidden">
                <div class="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                  <span class="material-symbols-outlined text-xl text-white">fingerprint</span>
                </div>
                <span class="block text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">ID
                  Registro</span>
                <p class="text-3xl font-black text-white tracking-tight font-mono text-sm leading-8">{{
                  qrData?.id?.substring(0, 8).toUpperCase() || '---' }}</p>
              </div>
            </div>

            <!-- MESSAGING / INFO CARD -->
            <div
              class="relative overflow-hidden bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-[2rem] p-8">
              <div
                class="absolute -bottom-12 -right-12 w-48 h-48 bg-primary/10 blur-[60px] rounded-full pointer-events-none">
              </div>

              <div class="relative z-10 flex flex-col gap-4">
                <div class="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <span class="material-symbols-outlined text-primary text-xl">shield_lock</span>
                </div>
                <div class="space-y-2">
                  <h3 class="text-white font-bold text-lg">Protocolo Privacy-Plus</h3>
                  <p class="text-white/50 text-sm leading-relaxed">
                    La identidad del propietario se encuentra protegida. Al contactar, utilizaremos un túnel de
                    comunicación seguro para garantizar el anonimato de ambas partes.
                  </p>
                </div>
              </div>
            </div>

            <!-- PRIMARY ACTION BUTTON -->
            <button
              class="group relative w-full h-16 rounded-2xl bg-white text-black font-black text-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-[0.98]">
              <div
                class="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              </div>
              <div class="relative z-10 flex items-center justify-center gap-3 group-hover:text-black">
                <span>Contactar Propietario</span>
                <span
                  class="material-symbols-outlined font-black transition-transform group-hover:translate-x-1">arrow_forward</span>
              </div>
            </button>

            <!-- LEGAL TELEMETRY DISCLAIMER -->
            <p class="text-[10px] text-white/30 text-center px-2 leading-relaxed font-medium">
              Como parte del proceso de conexión, registramos métricas anónimas (como región aproximada u horario). Esta
              información es puramente estadística y no está vinculada a ningún dato personal.
            </p>

            <!-- SECONDARY FOOTER -->
            <div class="flex items-center justify-between px-2 pt-2 text-white/20">
              <span class="text-[8px] font-bold uppercase tracking-[0.3em]">Diseñado para la privacidad</span>
              <div class="flex gap-4">
                <span class="material-symbols-outlined text-sm">security</span>
                <span class="material-symbols-outlined text-sm">vpn_key</span>
                <span class="material-symbols-outlined text-sm">eco</span>
              </div>
              <span class="text-[8px] font-bold uppercase tracking-[0.3em] font-mono">v2.4.0_UBI</span>
            </div>

          </div>
        </div>

        <!-- 🏷️ BRAND WATERMARK -->
        <div class="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none">
          <p class="text-white text-[10px] font-black uppercase tracking-[0.8em]">Ubiqueme.com</p>
        </div>
      </main>
    </template>

  </HomeLayout>

</template>

<style scoped>
.font-google-sans {
  font-family: 'Google Sans', sans-serif;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Custom smooth easing for interactions */
button {
  transition: all 0.2s ease;
}
</style>
