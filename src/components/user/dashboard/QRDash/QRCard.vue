<script lang="ts" setup>
import { ref } from 'vue';

type TStatus = 'Active' | 'Canceled' | 'Process' | 'Error';

interface IQRCard {
  id: string;
  name: string;
  status: TStatus;
  scans: number;
  lastScan: string;
}

const getStatusClass = (status: TStatus) => {
  switch (status) {
    case 'Active':
      return 'bg-green-500/10 text-green-400';
    case 'Canceled':
      return 'bg-red-500/10 text-red-400';
    case 'Process':
      return 'bg-yellow-500/10 text-yellow-400';
    case 'Error':
      return 'bg-red-500/10 text-red-400';
    default:
      return 'bg-gray-500/10 text-gray-400';
  }
};

const getStatusName = (status: TStatus) => {
  switch (status) {
    case 'Active':
      return 'Activo';
    case 'Canceled':
      return 'Cancelado';
    case 'Process':
      return 'En Proceso';
    case 'Error':
      return 'Error';
    default:
      return 'Desconocido';
  }
}

const props = defineProps<IQRCard>()

const showMenu = ref(false);
const showCancelPrompt = ref(false);
const showRenewPrompt = ref(false);
const showEditNamePrompt = ref(false);

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
  showCancelPrompt.value = false;
  showRenewPrompt.value = false;
  showEditNamePrompt.value = false;
};

const openCancelPrompt = () => {
  showMenu.value = false;
  showCancelPrompt.value = true;
};

const openRenewPrompt = () => {
  showMenu.value = false;
  showRenewPrompt.value = true;
};

const openEditNamePrompt = () => {
  showMenu.value = false;
  showEditNamePrompt.value = true;
};

const closePrompts = () => {
  showCancelPrompt.value = false;
  showRenewPrompt.value = false;
  showEditNamePrompt.value = false;
};

</script>

<template>
  <div class="bg-[#111324] rounded-2xl p-5 shadow-lg border border-white/5 w-full max-w-sm relative font-google-sans">

    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div>
        <h3 class="text-white text-lg font-semibold">{{ props.name }}</h3>
        <p class="text-xs text-gray-400 mt-1">ID: {{ props.id }}</p>
      </div>

      <!-- Status -->
      <span :class="['text-xs px-2 py-1 rounded-full font-medium', getStatusClass(props.status)]">
        {{ getStatusName(props.status) }}
      </span>
    </div>

    <!-- Stats -->
    <div class="flex justify-between text-sm text-gray-400 mb-4">
      <div>
        <p class="text-xs">Scans</p>
        <p class="text-white font-semibold">{{ props.scans }}</p>
      </div>
      <div>
        <p class="text-xs">Last scan</p>
        <p class="text-white font-semibold">{{ props.lastScan }}</p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-between gap-2">
      <button class="flex-1 text-sm bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg transition cursor-pointer">
        Ver
      </button>


      <!-- Menu -->
      <button @click="toggleMenu" class="p-2 rounded-lg hover:bg-white/10 transition cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h.01M12 12h.01M18 12h.01" />
        </svg>
      </button>
    </div>

    <!-- Menu Dropdown -->
    <div v-if="showMenu"
      class="absolute top-14 right-5 w-56 bg-[#0F1222] border border-white/10 rounded-xl shadow-xl p-2 z-40 animate-fade-in">

      <!-- Editar nombre -->
      <button @click="openEditNamePrompt"
        class="w-full text-left px-3 py-2 rounded-lg text-sm text-white hover:bg-white/5 transition cursor-pointer">
        Editar nombre
      </button>

      <!-- Renovar -->
      <button @click="openRenewPrompt"
        class="w-full text-left px-3 py-2 rounded-lg text-sm text-white hover:bg-white/5 transition cursor-pointer">
        Renovar QR
      </button>


      <!-- Divider -->
      <div class="h-px bg-white/10 my-2"></div>

      <!-- Desactivar permanentemente -->
      <button @click="openCancelPrompt"
        class="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition cursor-pointer">
        Desactivar permanentemente
      </button>

    </div>

    <!-- Prompt Cancelar -->
    <div v-if="showCancelPrompt"
      class="absolute inset-x-0 bottom-0 top-0 bg-[#0F1222]/95 backdrop-blur-md rounded-2xl p-5 flex flex-col justify-center z-50">
      <h3 class="text-white text-sm  mb-2 text-center leading-tight">¿Desea cancelar este código QR?</h3>
      <p
        class="text-red-400 text-sm text-center mb-5 border border-red-500/20 bg-red-500/10 p-3 rounded-lg leading-snug">
        Al hacer esto, su código dejará de funcionar y será inutilizable permanentemente.
      </p>
      <div class="flex gap-3 w-full">
        <button @click="closePrompts"
          class="flex-1 py-2 rounded-lg text-sm bg-white/5 text-white hover:bg-white/10 transition cursor-pointer">
          Atrás
        </button>
        <button
          class="flex-1 py-2 rounded-lg text-sm bg-red-500/90 hover:bg-red-500 text-white transition cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.3)]">
          Confirmar
        </button>
      </div>
    </div>

    <!-- Prompt Renovar -->
    <div v-if="showRenewPrompt"
      class="absolute inset-x-0 bottom-0 top-0 bg-[#0F1222]/95 backdrop-blur-md rounded-2xl p-5 flex flex-col justify-center z-50">
      <h3 class="text-white mb-2 text-center leading-tight">¿Desea renovar este código QR?</h3>
      <p class="text-blue-400 text-[13px] text-center mb-5 border border-blue-500/20  p-3 rounded-lg leading-snug">
        Esto cancelará el actual y será llevado a la contratación de uno nuevo (será necesario el pago del nuevo).
      </p>
      <div class="flex gap-3 w-full">
        <button @click="closePrompts"
          class="flex-1 py-2 rounded-lg text-sm bg-white/5 text-white hover:bg-white/10 transition cursor-pointer">
          Cancelar
        </button>
        <button
          class="flex-1 py-2 rounded-lg text-sm bg-blue-500/90 hover:bg-blue-500 text-white transition cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          Renovar
        </button>
      </div>
    </div>

    <!-- Prompt Editar Nombre -->
    <div v-if="showEditNamePrompt"
      class="absolute inset-x-0 bottom-0 top-0 bg-[#0F1222]/95 backdrop-blur-md rounded-2xl p-5 flex flex-col justify-center z-50">
      <h3 class="text-white text-lg font-semibold mb-4 text-center leading-tight">Editar nombre del QR</h3>

      <div class="mb-5">
        <label class="block text-xs font-medium text-gray-400 mb-1">Nombre</label>
        <input type="text" :value="props.name"
          class="w-full bg-[#111324] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
          placeholder="Nuevo nombre" />
      </div>

      <div class="flex gap-3 w-full">
        <button @click="closePrompts"
          class="flex-1 py-2 rounded-lg text-sm bg-white/5 text-white hover:bg-white/10 transition cursor-pointer">
          Cancelar
        </button>
        <button
          class="flex-1 py-2 rounded-lg text-sm bg-blue-500/90 hover:bg-blue-500 text-white transition cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          Guardar
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped></style>
