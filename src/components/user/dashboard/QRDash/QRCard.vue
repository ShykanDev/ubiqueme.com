<script lang="ts" setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { collection, doc, onSnapshot, orderBy, query, Timestamp, updateDoc, writeBatch } from 'firebase/firestore'
import { db } from '@/firebase'
import { useUserStore } from '@/stores/user'
import CloudLoader from '@/components/ui/CloudLoader.vue'
import { nanoid } from 'nanoid'
import type { IPublicQR } from '@/interfaces/IPublicQR'
import type { Unsubscribe } from 'firebase/auth'
import QRCardLog from './QRCardLog.vue'
type TStatus = 'Active' | 'Canceled' | 'Process' | 'Error' | 'Paused'

interface IQRCard {
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

const props = defineProps<IQRCard>()

const propsComputed = computed(() => {
  return {
    ...props,
  }
})

const showMenu = ref(false)
const activePrompt = ref<'cancel' | 'renew' | 'edit' | null>(null)

const qrName = ref(propsComputed.value.name);

const statusConfig = {
  Active: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400', label: 'Activo' },
  Canceled: { bg: 'bg-rose-500/10', text: 'text-rose-400', dot: 'bg-rose-400', label: 'Cancelado' },
  Process: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400', label: 'En Proceso' },
  Error: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400', label: 'Error' },
  Paused: { bg: 'bg-slate-500/10', text: 'text-slate-400', dot: 'bg-slate-400', label: 'Pausado' },
}

const currentStatus = computed(() => {
  return statusConfig[propsComputed.value.status] || {
    bg: 'bg-slate-500/10',
    text: 'text-slate-400',
    dot: 'bg-slate-400',
    label: 'Desconocido'
  }
})

const toggleMenu = () => {
  showMenu.value = !showMenu.value
  activePrompt.value = null
}

const openPrompt = (type: 'cancel' | 'renew' | 'edit') => {
  showMenu.value = false
  activePrompt.value = type
}

const closeAll = () => {
  showMenu.value = false
  activePrompt.value = null
}

const userStore = useUserStore();

const isLoading = ref(false);

const handleEdit = async () => {
  try {
    isLoading.value = true;
    const userQRDoc = doc(db, `users/${userStore.getUserId}/qrs/${props.docId}`)
    const publicQrDoc = doc(db, 'publicQR', props.id);

    const batch = writeBatch(db);
    batch.update(userQRDoc, {
      name: qrName.value
    })
    batch.update(publicQrDoc, {
      ownerName: qrName.value
    })
    await batch.commit();
    closeAll();
    console.log(`QR name updated successfully`);
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    const e = error as Error;
    console.log(`Error while trying to edit the qr name`, e.message);
  }
}

const _setQrPublic = async () => {
  showMenu.value = false;
  try {
    isLoading.value = true;
    const batch = writeBatch(db);
    const publicQrRef = doc(db, 'publicQR', props.id);
    const publicQRData: IPublicQR = {
      id: props.id,
      ownerName: props.name,
      status: 'Active',
      isBanned: false,
      banReason: '',
      totalScans: 0,
      lastScan: null,
    }
    const qrDoc = doc(db, `users/${userStore.getUserId}/qrs/${props.docId}`)
    batch.update(qrDoc, {
      status: 'Active',
    })
    batch.set(publicQrRef, publicQRData);
    await batch.commit();
    isLoading.value = false;
    console.log(`QR set to public successfully`);
  } catch (error) {
    isLoading.value = false;
    const e = error as Error;
    console.log(`Error while trying to set the qr to public`, e.message);
  }
}

const _setQrPrivate = async () => {
  showMenu.value = false;
  try {
    isLoading.value = true;
    const batch = writeBatch(db);
    const publicQrRef = doc(db, 'publicQR', props.id);
    batch.delete(publicQrRef);
    const qrDoc = doc(db, `users/${userStore.getUserId}/qrs/${props.docId}`)
    batch.update(qrDoc, {
      status: 'Paused',
    })
    await batch.commit();
    isLoading.value = false;
    console.log(`QR set to private successfully`);
  } catch (error) {
    isLoading.value = false;
    const e = error as Error;
    console.log(`Error while trying to set the qr to private`, e.message);
  }
}

let unsubscribe: Unsubscribe;



const qrStatus = reactive({
  totalScans: 0,
  lastScan: Timestamp.now() ?? 'No se ha escaneado aún',
})

const loadCount = ref(0);


onMounted(() => {
  unsubscribe = onSnapshot(doc(db, 'publicQR', props.id), (docSnapshot) => {
    if (!docSnapshot.exists()) {
      console.log(`QR not found`);
      //errorMsg.value = "No se encontro informacion sobre este QR";
      //loading.value = false;
      return;
    }
    qrStatus.totalScans = docSnapshot.data().totalScans ?? 0;
    qrStatus.lastScan = docSnapshot.data().lastScan ?? 'No se ha escaneado aún';
    console.log(`QR status updated`)
    loadCount.value++;
  }
    , (error) => {
      console.log(`Error while trying to get data: ${error}`);
    }
  )
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
})

const timestampToDate = (): string => {
  try {
    if (qrStatus.lastScan instanceof Timestamp) {
      return qrStatus.lastScan.toDate().toLocaleString('es-MX');
    }
    return 'No se ha escaneado aún';
  } catch (error) {
    console.log(`Error while trying to convert timestamp to date`, error);
    return 'No se ha escaneado aún';
  }
}

const menuOptions = [
  { label: 'Hacer Público', icon: 'public', action: _setQrPublic },
  { label: 'Hacer Privado', icon: 'visibility_off', action: _setQrPrivate },
  { divider: true },
  { label: 'Editar nombre', icon: 'edit', action: () => openPrompt('edit') },
  { label: 'Renovar QR', icon: 'autorenew', action: () => openPrompt('renew') },
  { divider: true },
  {
    label: 'Desactivar',
    icon: 'block',
    action: () => openPrompt('cancel'),
    color: 'text-rose-400',
    hoverBg: 'hover:bg-rose-500/10'
  },
]

interface IQRLog {
  id: string;
  scanDate: Timestamp;
  scanMetrics: {
    city: string;
    country: string;
    region: string;
  }
}

const qrLogs = ref<IQRLog[]>([]);
const logsLoaded = ref(false);
const isLogsLoading = ref(false);

let unsubscribeLogs: Unsubscribe;

const loadLogs = () => {
  if (logsLoaded.value) return;
  
  isLogsLoading.value = true;
  const qrsLogsRef = collection(db, `publicQR/${props.id}/logs`);
  const queryLogs = query(qrsLogsRef, orderBy("scanDate", "desc"));
  
  unsubscribeLogs = onSnapshot(queryLogs, (querySnapshot) => {
    isLogsLoading.value = false;
    logsLoaded.value = true;
    
    if (querySnapshot.empty) {
      console.log(`QR logs empty`);
      qrLogs.value = [];
      return;
    }
    
    qrLogs.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      scanDate: doc.data().scanDate,
      scanMetrics: doc.data().scanMetrics,
      interaction: doc.data().interaction,
      img: doc.data().img
    }));
    console.log(`QR logs updated`)
    loadCount.value++;
  }, (error) => {
    isLogsLoading.value = false;
    console.log(`Error while trying to get data: ${error}`);
  });
}

onUnmounted(() => {
  if (unsubscribeLogs) unsubscribeLogs();
})

</script>

<template>
  <div
    class="relative w-full max-w-[380px] bg-white/[0.03] rounded-[2rem] border border-white/5 overflow-hidden transition-all duration-300 hover:border-primary/20 shadow-2xl group font-google-sans">
    
    <!-- Hero Background Accent -->
    <div class="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 blur-3xl rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>

    <section v-if="isLoading" class="absolute inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <CloudLoader></CloudLoader>
    </section>

    <!-- Main Card Content -->
    <div class="p-6 ">
      <!-- Header -->
      <div class="flex justify-between items-start mb-6">
        <div class="flex flex-col gap-1">
          <h3 class="text-white text-xl font-black tracking-tight m-0 uppercase">{{ propsComputed.name }}</h3>
          <span class="text-[9px] text-white/30 font-black uppercase tracking-widest font-mono">ID: {{ propsComputed.id }}</span>
        </div>

        <div
          :class="['flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/5 backdrop-blur-md', currentStatus.bg, currentStatus.text]">
          <span :class="['w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]', currentStatus.dot]"></span>
          {{ currentStatus.label }}
        </div>
      </div>

      <!-- Content/Stats -->
      <div
        class="flex items-center justify-between bg-white/5 p-4 rounded-2xl mb-6 border border-white/5 overflow-hidden backdrop-blur-sm">
        <div class="flex flex-col gap-1">
          <span class="text-[8px] text-white/30 font-black uppercase tracking-[0.2em]">Escaneos Totales</span>
          <div class="flex items-baseline gap-1">
            <span :key="qrStatus.totalScans" class="text-white font-black text-xl"
              :class="{ 'animate-fade-up animate-delay-[500]': loadCount > 1 }">{{
                qrStatus.totalScans }}</span>
            <span class="text-[8px] text-primary font-black uppercase tracking-widest">MET_01</span>
          </div>
        </div>
        <div class="w-px h-8 bg-white/10"></div>
        <div class="flex flex-col gap-1 text-right">
          <span class="text-[8px] text-white/30 font-black uppercase tracking-[0.2em]">Último escaneo</span>
          <span :key="qrStatus.lastScan?.seconds || 'none'"
            :class="{ 'animate-fade-up animate-delay-700': loadCount > 1 }"
            class="text-white/60 font-black text-xs uppercase tracking-widest font-mono">{{ timestampToDate()
            }}</span>
        </div>
      </div>

      <!-- Logs Section -->
      <div class="space-y-3 mb-6">
        <div class="flex items-center justify-between mb-2">
          <h5 class="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] m-0 font-google-sans">Historial de Actividad</h5>
          <button v-if="!logsLoaded && !isLogsLoading" @click="loadLogs" 
            class="text-[10px] text-primary font-bold uppercase tracking-wider hover:underline transition-all mt-0.5 font-google-sans">
            Mostrar registros
          </button>
        </div>

        <div v-if="isLogsLoading" class="flex items-center justify-center py-4">
           <div class="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>

        <TransitionGroup v-else name="list" tag="ul"
          class="flex flex-col space-y-3 overflow-y-auto max-h-[280px] hide-scrollbar overflow-x-hidden rounded-[1.5rem] bg-black/20 p-2">
          <QRCardLog v-for="e in qrLogs.slice(0, 5)" :key="e.id" v-bind="e" />
        </TransitionGroup>
        
        <p v-if="logsLoaded && qrLogs.length === 0" class="text-center text-[10px] text-white/20 italic py-2 font-google-sans">
          Aún no se ha detectado actividad
        </p>
      </div>


      <!-- QR Code / Asset Image -->
      <section class="relative group/media flex justify-center bg-[#000000]/30 rounded-2xl overflow-hidden mb-6 border border-white/5 shadow-inner min-h-[220px]">
        <Transition name="fade-slide" mode="out-in">
          <div v-if="propsComputed.img" :key="propsComputed.img" class="w-full h-full">
            <img :src="propsComputed.img" class="w-full h-full object-cover opacity-80 group-hover/media:opacity-100 transition-opacity duration-500" alt="Asset preview" />
            <!-- Tiny overlay QR if image is present -->
            <div class="absolute bottom-2 right-2 p-1.5 bg-white rounded-lg shadow-xl scale-75 origin-bottom-right">
              <QrcodeVue :value="`https://ubiqueme.com/qr/${propsComputed.id}`" :size="40" render-as="canvas" />
            </div>
          </div>
          <div v-else class="bg-white p-2 rounded-xl my-4">
            <QrcodeVue :value="`https://ubiqueme.com/qr/${propsComputed.id}`" :size="200" render-as="canvas" />
          </div>
        </Transition>
      </section>

      <!-- Actions Footer -->
      <div class="flex items-center justify-end">
        <!-- MENU -->
        <button @click="toggleMenu" :class="[
          'p-2 rounded-xl transition-all duration-300 border flex items-center justify-center',
          showMenu
            ? 'bg-white/10 border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.3)]'
            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:shadow-[0_0_8px_rgba(255,255,255,0.2)]'
        ]">
          <span v-if="!showMenu" class="material-symbols-outlined text-white text-[20px]">more_vert</span>
          <span v-else class="material-symbols-outlined text-white text-[20px]">close</span>
        </button>
      </div>
    </div>

    <!-- Dropdown Menu -->
    <Transition enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2 scale-95" enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-2 scale-95">
      <div v-if="showMenu"
        class="absolute bottom-[72px] right-6 w-[200px] bg-[#1a1d35] border border-white/10 rounded-2xl p-2 z-100">
        <template v-for="(option, index) in menuOptions" :key="index">
          <div v-if="option.divider" class="h-1px bg-white/5 my-1.5"></div>
          <button v-else @click="option.action" :class="[
            'w-full flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-xl bg-transparent text-sm transition-colors text-left',
            option.color || 'text-slate-200',
            option.hoverBg || 'hover:bg-white/5'
          ]">
            <span class="material-symbols-outlined text-[18px]">{{ option.icon }}</span>
            {{ option.label }}
          </button>
        </template>
      </div>
    </Transition>

    <!-- Overlay Prompts -->
    <Transition enter-active-class="transition-all duration-100 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="activePrompt"
        class="absolute inset-0 bg-[#0A0C1B]/95  z-200 p-6 flex flex-col justify-center items-center">
        <button @click="closeAll"
          class="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all border-none">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>

        <!-- Cancel Prompt -->
        <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
          <div v-if="activePrompt === 'cancel'" class="w-full text-center">
            <div class="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
              <span class="material-symbols-outlined text-rose-500 text-[28px]">warning</span>
            </div>
            <h3 class="text-white text-xl font-bold mb-3">¿Desactivar QR?</h3>
            <p class="text-slate-400 text-sm leading-relaxed mb-6">
              Esta acción es <span class="text-rose-500 font-semibold">permanente</span>. El código dejará de funcionar
              de inmediato.
            </p>
            <div class="flex flex-col gap-2.5 w-full">
              <button @click="closeAll"
                class="px-3 py-3 bg-transparent text-slate-400 border border-white/10 rounded-xl font-semibold hover:bg-white/5 hover:text-white transition-colors">Cancelar</button>
              <button
                class="px-3 py-3 bg-rose-500 text-white rounded-xl font-semibold shadow-[0_4px_15px_rgba(244,63,94,0.3)] hover:bg-rose-600 transition-colors">Confirmar</button>
            </div>
          </div>
        </Transition>

        <!-- Renew Prompt -->
        <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
          <div v-if="activePrompt === 'renew'" class="w-full text-center">
            <div class="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
              <span class="material-symbols-outlined text-blue-500 text-[28px]">autorenew</span>
            </div>
            <h3 class="text-white text-xl font-bold mb-3">Renovar QR</h3>
            <p class="text-slate-400 text-sm leading-relaxed mb-6">
              Se generará un nuevo pago. El QR actual será reemplazado por la nueva configuración.
            </p>
            <div class="flex flex-col gap-2.5 w-full">
              <button @click="closeAll"
                class="px-3 py-3 bg-transparent text-slate-400 border border-white/10 rounded-xl font-semibold hover:bg-white/5 hover:text-white transition-colors">Volver</button>
              <button
                class="px-3 py-3 bg-blue-500 text-white rounded-xl font-semibold shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:bg-blue-600 transition-colors">Renovar</button>
            </div>
          </div>
        </Transition>

        <!-- Edit Name Prompt -->
        <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
          <div v-if="activePrompt === 'edit'" class="w-full text-center mt-4">
            <h3 class="text-white text-xl font-bold mb-6">Editar nombre</h3>
            <div class="text-left mb-6">
              <label class="block text-xs text-slate-400 mb-2 uppercase tracking-wider">Nuevo nombre</label>
              <input @keyup.enter="handleEdit" type="text" v-model="qrName" placeholder="Ej: Mi QR Personal"
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[15px] transition-colors focus:outline-none focus:border-blue-500 focus:bg-white/10" />
            </div>
            <div class="flex flex-col gap-2.5 w-full">
              <button @click="closeAll"
                class="px-3 py-3 bg-transparent text-slate-400 border border-white/10 rounded-xl font-semibold hover:bg-white/5 hover:text-white transition-colors">Descartar</button>
              <button @click="handleEdit"
                class="px-3 py-3 bg-blue-500 text-white rounded-xl font-semibold shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:bg-blue-600 transition-colors">Guardar</button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 1,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}

.list-move,
/* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}

/* TASK Hidde scrollbar  for logs */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}
</style>
