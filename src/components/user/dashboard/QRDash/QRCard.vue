<script lang="ts" setup>
import { ref } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { doc, Timestamp, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useUserStore } from '@/stores/user'
import CloudLoader from '@/components/ui/CloudLoader.vue'
type TStatus = 'Active' | 'Canceled' | 'Process' | 'Error'

interface IQRCard {
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

const props = defineProps<IQRCard>()

const showMenu = ref(false)
const activePrompt = ref<'cancel' | 'renew' | 'edit' | null>(null)

const qrName = ref(props.name);

const getStatusStyles = (status: TStatus) => {
  switch (status) {
    case 'Active':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        dot: 'bg-emerald-400',
        label: 'Activo'
      }
    case 'Canceled':
      return {
        bg: 'bg-rose-500/10',
        text: 'text-rose-400',
        dot: 'bg-rose-400',
        label: 'Cancelado'
      }
    case 'Process':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        dot: 'bg-amber-400',
        label: 'En Proceso'
      }
    case 'Error':
      return {
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        dot: 'bg-red-400',
        label: 'Error'
      }
    default:
      return {
        bg: 'bg-slate-500/10',
        text: 'text-slate-400',
        dot: 'bg-slate-400',
        label: 'Desconocido'
      }
  }
}


const statusStyle = getStatusStyles(props.status)

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

const handleAction = (action: 'cancel' | 'renew' | 'edit') => {
  switch (action) {
    case 'cancel':
      // Handle cancel logic
      console.log('Cancel QR')
      break
    case 'renew':
      // Handle renew logic
      console.log('Renew QR')
      break
    case 'edit':
      // Handle edit logic
      console.log('Edit QR')
      break
  }
  closeAll()
}

const userStore = useUserStore();

const isLoading = ref(false);

const handleEdit = async () => {
  try {
    isLoading.value = true;
    const qrDoc = doc(db, `users/${userStore.getUserId}/qrs/${props.docId}`)
    await updateDoc(qrDoc, {
      name: qrName.value
    })
    closeAll();
    console.log(`QR name updated successfully`);
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    const e = error as Error;
    console.log(`Error while trying to edit the qr name`, e.message);
  }
}

</script>

<template>
  <div class="qr-card relative">

    <section v-if="isLoading" class="absolute inset-0 bg-black/80 flex items-center justify-center">
      <CloudLoader></CloudLoader>
    </section>

    <!-- Main Card Content -->
    <div class="card-inner">
      <!-- Header -->
      <div class="card-header">
        <div class="title-section">
          <h3 class="card-title">{{ props.name }}</h3>
          <span class="card-id">ID: {{ props.id }}</span>
        </div>

        <div :class="['status-badge', statusStyle.bg, statusStyle.text]">
          <span :class="['status-dot', statusStyle.dot]"></span>
          {{ statusStyle.label }}
        </div>
      </div>

      <!-- Content/Stats -->
      <div class="card-stats">
        <div class="stat-item">
          <span class="stat-label">Escaneos</span>
          <span class="stat-value">{{ props.scans }}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item text-right">
          <span class="stat-label">Último uso</span>
          <span class="stat-value">{{ props.lastScan }}</span>
        </div>
      </div>

      <!-- QR Code -->
      <section class="flex justify-center bg-[#14162c] p-3 rounded-2xl overflow-hidden">
        <div class="bg-white p-2 rounded-lg">
          <QrcodeVue :value="`https://tudominio.com/u/${props.name}`" :size="220" />
        </div>
      </section>

      <!-- Actions Footer -->
      <div class="card-footer">
        <button class="btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Ver Detalle
        </button>

        <button @click="toggleMenu" :class="['btn-icon', { 'active': showMenu }]" aria-label="Menú de opciones">
          <svg v-if="!showMenu" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>


    <!-- Dropdown Menu -->
    <Transition name="fade-slide">
      <div v-if="showMenu" class="dropdown-menu">
        <button @click="openPrompt('edit')" class="menu-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
          </svg>
          Editar nombre
        </button>
        <button @click="openPrompt('renew')" class="menu-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M8 16H3v5" />
          </svg>
          Renovar QR
        </button>
        <div class="menu-divider"></div>
        <button @click="openPrompt('cancel')" class="menu-item text-danger">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m21 21-18-18" />
            <path d="M19 5 5 19" />
          </svg>
          Desactivar
        </button>
      </div>
    </Transition>

    <!-- Overlay Prompts -->
    <Transition name="overlay-fade">
      <div v-if="activePrompt" class="prompt-overlay">
        <button @click="closeAll" class="close-overlay-btn" aria-label="Cerrar">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <!-- Cancel Prompt -->
        <div v-if="activePrompt === 'cancel'" class="prompt-content">
          <div class="prompt-icon bg-danger-soft">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="#f43f5e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m21 21-18-18" />
              <path d="M19 5 5 19" />
            </svg>
          </div>
          <h3 class="prompt-title">¿Desactivar QR?</h3>
          <p class="prompt-desc">Esta acción es <span class="text-danger-bold">permanente</span>. El código dejará de
            funcionar de inmediato.</p>
          <div class="prompt-actions">
            <button @click="closeAll" class="btn-ghost">Cancelar</button>
            <button class="btn-danger">Confirmar</button>
          </div>
        </div>

        <!-- Renew Prompt -->
        <div v-if="activePrompt === 'renew'" class="prompt-content">
          <div class="prompt-icon bg-info-soft">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
          </div>
          <h3 class="prompt-title">Renovar QR</h3>
          <p class="prompt-desc">Se generará un nuevo pago. El QR actual será reemplazado por la nueva configuración.
          </p>
          <div class="prompt-actions">
            <button @click="closeAll" class="btn-ghost">Volver</button>
            <button class="btn-info">Renovar</button>
          </div>
        </div>

        <!-- Edit Name Prompt -->
        <div v-if="activePrompt === 'edit'" class="prompt-content">
          <h3 class="prompt-title">Editar nombre</h3>
          <div class="input-group">
            <label>Nuevo nombre</label>
            <input @keyup.enter="handleEdit" type="text" v-model="qrName" placeholder="Ej: Mi QR Personal" />
          </div>
          <div class="prompt-actions">
            <button @click="closeAll" class="btn-ghost">Descartar</button>
            <button @click="handleEdit" class="btn-info">Guardar</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.qr-card {
  --bg-card: #111324;
  --bg-darker: #0A0C1B;
  --border-white: rgba(255, 255, 255, 0.08);
  --text-muted: #94a3b8;
  --accent-color: #6366f1;
  --danger-color: #f43f5e;
  --info-color: #3b82f6;

  position: relative;
  width: 100%;
  max-width: 380px;
  background: var(--bg-card);
  border-radius: 24px;
  border: 1px solid var(--border-white);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
}

.qr-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.6);
}

.card-inner {
  padding: 24px;
}

/* Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.title-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-title {
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  letter-spacing: -0.025em;
}

.card-id {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-family: monospace;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  box-shadow: 0 0 8px currentColor;
}

/* Stats */
.card-stats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.03);
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.02);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  color: white;
  font-weight: 600;
  font-size: 1rem;
}

.stat-divider {
  width: 1px;
  height: 24px;
  background: var(--border-white);
}

/* Footer */
.card-footer {
  display: flex;
  gap: 12px;
}

.btn-primary {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: white;
  color: #000;
  border: none;
  padding: 12px;
  border-radius: 14px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #f1f5f9;
  transform: scale(1.02);
}

.btn-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  border: 1px solid var(--border-white);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-icon:hover,
.btn-icon.active {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: rgba(255, 255, 255, 0.2);
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 200px;
  background: #1a1d35;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 8px;
  z-index: 100;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
}

.menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: none;
  background: transparent;
  color: #e2e8f0;
  font-size: 0.875rem;
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.menu-item.text-danger {
  color: #fb7185;
}

.menu-item.text-danger:hover {
  background: rgba(244, 63, 94, 0.1);
}

.menu-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.05);
  margin: 6px 0;
}

/* Overlay Prompts */
.prompt-overlay {
  position: absolute;
  inset: 0;
  background: rgba(10, 12, 27, 0.95);
  backdrop-filter: blur(8px);
  z-index: 200;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.close-overlay-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: var(--text-muted);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-overlay-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.prompt-content {
  width: 100%;
  text-align: center;
  animation: promptEntry 0.3s ease-out;
}

@keyframes promptEntry {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.prompt-icon {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.bg-danger-soft {
  background: rgba(244, 63, 94, 0.1);
}

.bg-info-soft {
  background: rgba(59, 130, 246, 0.1);
}

.prompt-title {
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.prompt-desc {
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 24px;
}

.text-danger-bold {
  color: var(--danger-color);
  font-weight: 600;
}

.prompt-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.btn-ghost {
  padding: 12px;
  background: transparent;
  color: var(--text-muted);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.03);
  color: white;
}

.btn-danger {
  padding: 12px;
  background: var(--danger-color);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(244, 63, 94, 0.3);
}

.btn-info {
  padding: 12px;
  background: var(--info-color);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

/* Input Group */
.input-group {
  text-align: left;
  margin-bottom: 24px;
}

.input-group label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-group input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px;
  color: white;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.input-group input:focus {
  outline: none;
  border-color: var(--info-color);
  background: rgba(255, 255, 255, 0.1);
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: all 0.3s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}
</style>
