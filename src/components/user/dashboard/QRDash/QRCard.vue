<script lang="ts" setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { collection, doc, onSnapshot, orderBy, query, Timestamp, updateDoc, writeBatch } from 'firebase/firestore'
import { db } from '@/firebase'
import { useUserStore } from '@/stores/user'
import CloudLoader from '@/components/ui/CloudLoader.vue'
import { nanoid } from 'nanoid'
import type { IQRCard } from '@/interfaces/IQRCard'
import type { IPublicQR, IQRLog } from '@/interfaces/IPublicQR'
import type { Unsubscribe } from 'firebase/auth'
import QRCardLog from './QRCardLog.vue'
import QRCardLogSkeleton from '@/components/ui/user/dashboard/QRCardLogSkeleton.vue'
import { toast } from 'vue-sonner'

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
  if (propsComputed.value.isBanned) {
    return {
      bg: 'bg-red-500/20',
      text: 'text-red-500',
      dot: 'bg-red-500',
      label: 'Baneado'
    }
  }
  return statusConfig[propsComputed.value.status] || {
    bg: 'bg-slate-500/10',
    text: 'text-slate-400',
    dot: 'bg-slate-400',
    label: 'Desconocido'
  }
})

const cardStyle = computed(() => {
  if (props.isBanned) {
    return 'grayscale opacity-50 brightness-[0.4] cursor-not-allowed'
  }

  if (props.status === 'Canceled') {
    return 'grayscale opacity-60 brightness-75'
  }

  if (props.status === 'Paused' || !props.isActive) {
    return 'grayscale-[0.8] opacity-80 brightness-90'
  }

  if (props.status === 'Error') {
    return 'border-rose-500/40'
  }

  return ''
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
    const publicQrDoc = doc(db, 'publicQR', props.docId);

    const batch = writeBatch(db);
    batch.update(userQRDoc, {
      name: qrName.value
    })
    batch.update(publicQrDoc, {
      name: qrName.value
    })
    await batch.commit();
    closeAll();
    toast.success(`Nombre de QR actualizado`);
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    const e = error as Error;
    toast.error(`Error al editar el nombre del QR: ${e.message}`);
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
      name: props.name,
      status: 'Active',
      isBanned: false,
      banReason: '',
      totalScans: props.scans,
      lastScan: null,
      uid: userStore.getUserId,
      tier: userStore.getPlan,
    }
    const qrDoc = doc(db, `users/${userStore.getUserId}/qrs/${props.docId}`)
    batch.update(qrDoc, {
      status: 'Active',
    })
    batch.set(publicQrRef, publicQRData);
    await batch.commit();
    isLoading.value = false;
    toast.success(`QR establecido como público`);
  } catch (error) {
    isLoading.value = false;
    const e = error as Error;
    toast.error(`Error al hacer público el QR: ${e.message}`);
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
    toast.success(`QR establecido como privado`);
  } catch (error) {
    isLoading.value = false;
    const e = error as Error;
    toast.error(`Error al hacer privado el QR: ${e.message}`);
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
      toast.error(`QR no encontrado`);
      //errorMsg.value = "No se encontro informacion sobre este QR";
      //loading.value = false;
      return;
    }
    qrStatus.totalScans = docSnapshot.data().totalScans ?? 0;
    qrStatus.lastScan = docSnapshot.data().lastScan ?? 'No se ha escaneado aún';
    // toast.success(`Estado del QR actualizado`); // Silencing this success as it fires frequently

    loadCount.value++;
  }
    , (error) => {
      toast.error(`Error al obtener datos: ${error}`);
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
    toast.error(`Error al convertir la fecha: ${error}`);
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
      toast.info(`Registros del QR vacíos`);
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
    // toast.success(`Registros del QR actualizados`) // Silencing this as it fires on load
    loadCount.value++;
  }, (error) => {
    isLogsLoading.value = false;
    toast.error(`Error al obtener datos de registros: ${error}`);
  });
}

onUnmounted(() => {
  if (unsubscribeLogs) unsubscribeLogs();
})


</script>

<template>
  <div :class="[cardStyle]"
    class="relative w-full bg-[#121214] border border-white/[0.08] rounded-2xl transition-colors duration-300 hover:bg-[#161619] hover:border-white/[0.12] group font-google-sans flex flex-col">

    <section v-if="isLoading"
      class="absolute inset-0 bg-[#09090b]/80 rounded-2xl flex items-center justify-center z-50 backdrop-blur-sm">
      <CloudLoader></CloudLoader>
    </section>

    <div class="p-5 md:p-6 flex flex-col flex-1 relative z-10">

      <!-- TOP: Thumbnail + Title + Menu -->
      <div class="flex justify-between items-start mb-6">
        <div class="flex items-center gap-4">
          <!-- Thumbnail -->
          <div
            class="relative w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center">
            <template v-if="propsComputed.img">
              <img :src="propsComputed.img" class="w-full h-full object-cover" />
            </template>
            <template v-else>
              <div class="w-full h-full flex items-center justify-center bg-white p-1">
                <QrcodeVue :value="`https://ubiqueme.com/qr/${propsComputed.id}`" :size="40" class="w-full h-full"
                  render-as="canvas" />
              </div>
            </template>
          </div>

          <!-- Title & ID -->
          <div class="flex flex-col">
            <h3 class="text-white/90 text-base md:text-lg font-medium tracking-tight leading-tight mb-0.5">{{
              propsComputed.name
              }}</h3>
            <p class="text-white/40 text-xs font-mono tracking-wider">{{ propsComputed.id }}</p>
          </div>
        </div>

        <button @click="toggleMenu"
          class="text-white/40 hover:text-white transition-colors cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 -mr-2">
          <span class="material-symbols-outlined text-[20px]">more_horiz</span>
        </button>
      </div>

      <!-- MIDDLE: Minimal Stats Grid -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="flex flex-col gap-1.5">
          <span class="text-white/40 text-[11px] uppercase tracking-wider font-medium">Estado</span>
          <div class="flex items-center gap-1.5">
            <span :class="['w-1.5 h-1.5 rounded-full', currentStatus.dot]"></span>
            <span class="text-white/80 text-sm font-medium">{{ currentStatus.label }}</span>
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <span class="text-white/40 text-[11px] uppercase tracking-wider font-medium">Escaneos</span>
          <span :key="qrStatus.totalScans" class="text-white/80 text-sm font-medium">{{ qrStatus.totalScans }}</span>
        </div>

        <div class="col-span-2 flex flex-col gap-1.5">
          <span class="text-white/40 text-[11px] uppercase tracking-wider font-medium">Última Actividad</span>
          <span :key="qrStatus.lastScan?.seconds || 'none'" class="text-white/80 text-sm font-medium">{{
            timestampToDate()
            }}</span>
        </div>
      </div>

      <!-- BOTTOM: Expand Logs -->
      <div class="mt-auto pt-4 border-t border-white/5">
        <button @click="loadLogs"
          class="w-full flex items-center justify-between py-1.5 text-white/50 hover:text-white transition-colors group/btn cursor-pointer">
          <span class="text-xs font-medium tracking-wide">Actividad Reciente</span>
          <span
            class="material-symbols-outlined text-[16px] transition-transform group-hover/btn:translate-y-0.5">expand_more</span>
        </button>

        <!-- Logs Content -->
        <div v-if="isLogsLoading || logsLoaded" class="animate-fade-down mt-3">
          <div v-if="isLogsLoading" class="flex flex-col space-y-2">
            <QRCardLogSkeleton v-for="i in 2" :key="i" />
          </div>

          <TransitionGroup v-else name="list" tag="ul"
            class="flex flex-col space-y-1.5 overflow-y-auto max-h-[250px] hide-scrollbar">
            <QRCardLog v-for="e in qrLogs.slice(0, 5)" :key="e.id" v-bind="e" />
          </TransitionGroup>

          <p v-if="logsLoaded && qrLogs.length === 0" class="text-center text-xs text-white/30 py-3 font-medium">
            No hay actividad reciente.
          </p>
        </div>
      </div>
    </div>

    <!-- Dropdown Menu -->
    <Transition enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2 scale-95" enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-2 scale-95">
      <div v-if="showMenu"
        class="absolute top-16 right-5 w-[200px] bg-[#1a1a1d] border border-white/10 rounded-xl p-1.5 z-30 shadow-2xl">
        <template v-for="(option, index) in menuOptions" :key="index">
          <div v-if="option.divider" class="h-px bg-white/5 my-1 mx-2"></div>
          <button v-else @click="option.action" :class="[
            'w-full flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg bg-transparent text-sm transition-colors text-left font-medium',
            option.color || 'text-white/70',
            option.hoverBg || 'hover:bg-white/10 hover:text-white'
          ]">
            <span class="material-symbols-outlined text-[16px]">{{ option.icon }}</span>
            {{ option.label }}
          </button>
        </template>
      </div>
    </Transition>

    <!-- Overlay Prompts -->
    <Transition enter-active-class="transition-all duration-200 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="activePrompt"
        class="absolute inset-0 bg-[#09090b]/95 z-40 p-6 flex flex-col justify-center items-center rounded-2xl backdrop-blur-sm">

        <button @click="closeAll"
          class="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all cursor-pointer">
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>

        <!-- Cancel Prompt -->
        <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
          <div v-if="activePrompt === 'cancel'" class="w-full text-center">
            <div class="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
              <span class="material-symbols-outlined text-rose-500 text-[24px]">warning</span>
            </div>
            <h3 class="text-white/90 text-lg font-medium mb-1.5">¿Desactivar código?</h3>
            <p class="text-white/50 text-sm leading-relaxed mb-6 px-4">
              Esta acción desactivará el código inmediatamente.
            </p>
            <div class="flex gap-3 w-full">
              <button @click="closeAll"
                class="flex-1 py-2.5 bg-white/5 text-white/70 rounded-lg font-medium text-sm hover:bg-white/10 hover:text-white transition-colors cursor-pointer">Cancelar</button>
              <button
                class="flex-1 py-2.5 bg-rose-500 text-white rounded-lg font-medium text-sm hover:bg-rose-600 transition-colors active:scale-[0.98] cursor-pointer">Desactivar</button>
            </div>
          </div>
        </Transition>

        <!-- Renew Prompt -->
        <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
          <div v-if="activePrompt === 'renew'" class="w-full text-center">
            <div class="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
              <span class="material-symbols-outlined text-amber-500 text-[24px]">autorenew</span>
            </div>
            <h3 class="text-white/90 text-lg font-medium mb-1.5">Renovar código</h3>
            <p class="text-white/50 text-sm leading-relaxed mb-6 px-4">
              Se iniciará el proceso de renovación.
            </p>
            <div class="flex gap-3 w-full">
              <button @click="closeAll"
                class="flex-1 py-2.5 bg-white/5 text-white/70 rounded-lg font-medium text-sm hover:bg-white/10 hover:text-white transition-colors cursor-pointer">Cancelar</button>
              <button
                class="flex-1 py-2.5 bg-white text-black rounded-lg font-medium text-sm hover:bg-white/90 transition-colors active:scale-[0.98] cursor-pointer">Renovar</button>
            </div>
          </div>
        </Transition>

        <!-- Edit Name Prompt -->
        <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
          <div v-if="activePrompt === 'edit'" class="w-full">
            <h3 class="text-white/90 text-lg font-medium mb-4 text-center">Editar nombre</h3>
            <div class="mb-6">
              <input @keyup.enter="handleEdit" type="text" v-model="qrName" placeholder="Nuevo nombre"
                class="w-full bg-[#161619] border border-white/10 rounded-lg px-4 py-3 text-white text-sm transition-all focus:outline-none focus:border-white/30 placeholder:text-white/30" />
            </div>
            <div class="flex gap-3 w-full">
              <button @click="closeAll"
                class="flex-1 py-2.5 bg-white/5 text-white/70 rounded-lg font-medium text-sm hover:bg-white/10 hover:text-white transition-colors cursor-pointer">Cancelar</button>
              <button @click="handleEdit"
                class="flex-1 py-2.5 bg-white text-black rounded-lg font-medium text-sm hover:bg-white/90 transition-colors active:scale-[0.98] cursor-pointer">Guardar</button>
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
