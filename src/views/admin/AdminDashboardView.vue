<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import UserDashoardLayout from '@/layouts/UserDashoardLayout.vue'
import QRNamePrompt from '@/components/admin/QRNamePrompt.vue'
import BanConfirmPrompt from '@/components/admin/BanConfirmPrompt.vue'
import ChangePlanPrompt from '@/components/admin/ChangePlanPrompt.vue'
import { toast } from 'vue-sonner'
import { collection, onSnapshot } from 'firebase/firestore'
import { db as firestoreDb } from '@/firebase'

// ==========================================
// 🚀 17-FIELD MOCK DATA & TYPES
// ==========================================
interface MockUser {
  uid: string
  name: string
  email: string
  phone: string
  role: 'scanner' | 'admin' | 'user'
  isActive: boolean
  isBanned: boolean
  banReason: string
  plan: 'alpha' | 'beta' | 'epsilon'
  subscriptionStatus: 'active' | 'inactive' | 'canceled'
  planPurchasedAt: string
  planEndDate: string | null
  paymentProviderId: string
  totalQRs: number
  preferences: {
    emailNotifications: boolean
    smsNotifications: boolean
    whatsappNotifications: boolean
  }
  lastLoginAt: string
  createdAt: string
}

const users = ref<MockUser[]>([])
const loading = ref(true)

// ==========================================
// ⚙️ SIMULATED FUNCTIONS
// ==========================================

const fetchUsers = () => {
  console.log('🔄 [fetchUsers] Extrayendo los 17 campos por usuario de la base de datos...')
  loading.value = true

  setTimeout(() => {
    users.value = [
      {
        uid: 'asjdbaj86538127tgiasudg976323', name: 'Frida', email: 'frida@ejemplo.com', phone: '+52555555555', role: 'user',
        isActive: true, isBanned: false, banReason: '',
        plan: 'alpha', subscriptionStatus: 'active', planPurchasedAt: '30 Abr 2026', planEndDate: null, paymentProviderId: '',
        totalQRs: 1, preferences: { emailNotifications: true, smsNotifications: false, whatsappNotifications: true },
        lastLoginAt: '30 Abr 2026, 11:18 AM', createdAt: '30 Abr 2026'
      },
      {
        uid: 'xyz987654321qwertyuiopasdfg', name: 'Carlos Mendoza', email: 'cmendoza@empresa.com', phone: '+1234567890', role: 'admin',
        isActive: true, isBanned: false, banReason: '',
        plan: 'epsilon', subscriptionStatus: 'active', planPurchasedAt: '15 Mar 2026', planEndDate: '15 Mar 2027', paymentProviderId: 'sub_J3LKs92Ndx',
        totalQRs: 142, preferences: { emailNotifications: true, smsNotifications: true, whatsappNotifications: true },
        lastLoginAt: '12 May 2026, 09:00 AM', createdAt: '01 Ene 2026'
      },
      {
        uid: 'banneduser99999999999999999', name: 'Malory Archer', email: 'malory@isis.com', phone: '+15550001111', role: 'user',
        isActive: true, isBanned: true, banReason: 'Comportamiento de escaneo fraudulento.',
        plan: 'beta', subscriptionStatus: 'canceled', planPurchasedAt: '01 Feb 2026', planEndDate: '01 Mar 2026', paymentProviderId: 'sub_X92Kk1aPq',
        totalQRs: 5, preferences: { emailNotifications: false, smsNotifications: false, whatsappNotifications: false },
        lastLoginAt: '28 Feb 2026, 04:20 PM', createdAt: '15 Ene 2026'
      },
      {
        uid: 'scanner12312312312312312312', name: 'Usuario QR (Anónimo)', email: 'anonimo_qr@temp.com', phone: '', role: 'scanner',
        isActive: false, isBanned: false, banReason: '',
        plan: 'alpha', subscriptionStatus: 'inactive', planPurchasedAt: '12 May 2026', planEndDate: null, paymentProviderId: '',
        totalQRs: 0, preferences: { emailNotifications: false, smsNotifications: false, whatsappNotifications: false },
        lastLoginAt: '12 May 2026, 02:15 PM', createdAt: '12 May 2026'
      }
    ]
    loading.value = false
    console.log('✅ [fetchUsers] Data sincronizada exitosamente:', users.value)
  }, 1200)
}


// ==========================================
// MODAL: SUSPENDER/REACTIVAR
// ==========================================
const isBanModalOpen = ref(false)
const selectedUserForBan = ref<{ id: string, name: string, isBanned: boolean } | null>(null)

const openBanModal = (user: MockUser) => {
  selectedUserForBan.value = { id: user.uid, name: user.name, isBanned: user.isBanned }
  isBanModalOpen.value = true
}

const handleBanSubmit = (reason: string) => {
  if (!selectedUserForBan.value) return
  const userId = selectedUserForBan.value.id
  const newStatus = !selectedUserForBan.value.isBanned

  const userIndex = users.value.findIndex(u => u.uid === userId)
  if (userIndex !== -1) {
    const user = users.value[userIndex]
    if (user) {
      user.isBanned = newStatus
      user.banReason = newStatus ? reason : ''
    }
  }
  isBanModalOpen.value = false
  selectedUserForBan.value = null
}

// ==========================================
// MODAL: CAMBIAR PLAN
// ==========================================
const isPlanModalOpen = ref(false)
const selectedUserForPlan = ref<{ id: string, name: string, plan: string } | null>(null)

const openPlanModal = (user: MockUser) => {
  selectedUserForPlan.value = { id: user.uid, name: user.name, plan: user.plan }
  isPlanModalOpen.value = true
}

const handlePlanSubmit = (newPlan: string) => {
  if (!selectedUserForPlan.value) return
  const userId = selectedUserForPlan.value.id

  const userIndex = users.value.findIndex(u => u.uid === userId)
  if (userIndex !== -1) {
    const user = users.value[userIndex]
    if (user) {
      user.plan = newPlan as any
      // Si asiganmos un plan premium, cambiamos el status simulado a active
      if (newPlan !== 'alpha') user.subscriptionStatus = 'active'
    }
  }
  isPlanModalOpen.value = false
  selectedUserForPlan.value = null
}

// ==========================================
// MODAL: ASIGNAR NUEVO QR
// ==========================================
const isQRModalOpen = ref(false)
const selectedUserForQR = ref<{ id: string, name: string } | null>(null)

const openQRModal = (userId: string, userName: string) => {
  selectedUserForQR.value = { id: userId, name: userName }
  isQRModalOpen.value = true
}

const handleQRSubmit = (qrName: string) => {
  if (!selectedUserForQR.value) return
  const userId = selectedUserForQR.value.id

  const userIndex = users.value.findIndex(u => u.uid === userId)
  if (userIndex !== -1) {
    const user = users.value[userIndex]
    if (user) {
      user.totalQRs += 1
    }
  }
  isQRModalOpen.value = false
  selectedUserForQR.value = null
}


onMounted(() => {
  const db = firestoreDb;
  const usersCollection = collection(db, `users`);
  onSnapshot((usersCollection), (doc) => {
    console.log(doc)
  })
})
</script>

<template>
  <UserDashoardLayout>
    <template #main>
      <div class="min-h-screen bg-[#09090b] w-full p-4 md:p-8 font-google-sans text-white pt-28">

        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 class="text-3xl font-black italic uppercase tracking-tighter text-[#dce7ff] font-poppins">Centro de
              Mando</h1>
            <p class="text-white/40 text-sm mt-1">Inspección profunda de base de datos de usuarios</p>
          </div>

          <div class="flex items-center gap-4">
            <button @click="fetchUsers"
              class="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl transition-colors">
              <span class="material-symbols-outlined text-[18px]" :class="{ 'animate-spin': loading }">sync</span>
              <span class="text-xs font-bold uppercase tracking-widest">Sincronizar DB</span>
            </button>
          </div>
        </div>

        <!-- Data Grid: Scroll Horizontal para aguantar mucha densidad de info -->
        <div class="w-full bg-[#09090b] border border-white/10 rounded-2xl overflow-hidden relative">

          <div class="absolute inset-0 opacity-[0.02] pointer-events-none"
            style="background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 20px 20px;">
          </div>

          <div class="w-full overflow-x-auto relative z-10 custom-scrollbar">
            <!-- La tabla necesita más min-width para acomodar las 5 super-columnas holgadamente -->
            <table class="w-full text-left border-collapse min-w-[1200px]">

              <!-- Header -->
              <thead>
                <tr class="border-b border-white/10 bg-white/[0.02] font-poppins">
                  <th class="p-4 text-[10px] font-black uppercase tracking-widest text-white/40 min-w-[280px]">Identidad
                    / Contacto</th>
                  <th class="p-4 text-[10px] font-black uppercase tracking-widest text-white/40 min-w-[180px]">Actividad
                    y QRs</th>
                  <th class="p-4 text-[10px] font-black uppercase tracking-widest text-white/40 min-w-[220px]">
                    Facturación y Planes</th>
                  <th class="p-4 text-[10px] font-black uppercase tracking-widest text-white/40 min-w-[180px]">Estado
                    (Security)</th>
                  <th
                    class="p-4 text-[10px] font-black uppercase tracking-widest text-white/40 text-right min-w-[250px]">
                    Acciones de Mando</th>
                </tr>
              </thead>

              <!-- Body -->
              <tbody>
                <tr v-if="loading">
                  <td colspan="5" class="p-10 text-center text-white/40">
                    <span class="material-symbols-outlined animate-spin text-3xl mb-2">settings</span>
                    <p class="text-xs font-bold uppercase tracking-widest">Recopilando Datos de Firestore...</p>
                  </td>
                </tr>

                <tr v-else v-for="user in users" :key="user.uid"
                  class="border-b border-white/5 hover:bg-white/[0.02] transition-colors group align-top">

                  <!-- 1. IDENTIDAD / CONTACTO -->
                  <td class="p-4">
                    <div class="flex gap-3">
                      <div class="w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 mt-1"
                        :class="user.role === 'admin' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 'bg-white/5 border-white/10 text-white'">
                        <span class="font-bold uppercase">{{ user.name.charAt(0) }}</span>
                      </div>
                      <div class="overflow-hidden flex flex-col space-y-1">
                        <div class="flex items-center gap-1.5">
                          <h3 class="text-sm font-bold text-white truncate max-w-[150px] font-poppins">{{ user.name }}
                          </h3>
                          <div v-tooltip="'Rol: ' + user.role"
                            class="px-1.5 py-0.5 rounded border text-[8px] font-black uppercase tracking-widest"
                            :class="user.role === 'admin' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 'bg-white/5 border-white/10 text-white/60'">
                            {{ user.role }}
                          </div>
                        </div>
                        <div class="flex items-center gap-1 text-white/50 text-xs" v-tooltip="'Email Principal'">
                          <span class="material-symbols-outlined text-[12px]">mail</span>
                          <span class="truncate">{{ user.email }}</span>
                        </div>
                        <div v-if="user.phone" class="flex items-center gap-1 text-white/50 text-xs"
                          v-tooltip="'Teléfono'">
                          <span class="material-symbols-outlined text-[12px]">call</span>
                          <span class="font-mono">{{ user.phone }}</span>
                        </div>
                        <!-- UID Oculto/Truncado pero copiable visualmente -->
                        <div class="flex items-center gap-1 mt-1 pt-1 border-t border-white/5">
                          <span class="material-symbols-outlined text-[10px] text-white/20">key</span>
                          <span class="text-[8px] font-mono text-white/20 truncate w-32"
                            v-tooltip="'UID de Firebase: ' + user.uid">{{ user.uid }}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- 2. ACTIVIDAD Y QRs -->
                  <td class="p-4">
                    <div class="flex flex-col space-y-2">

                      <!-- QRs e IsActive -->
                      <div class="flex items-center gap-3">
                        <div class="flex flex-col">
                          <span class="text-[9px] font-black uppercase tracking-widest text-white/30">Total QRs</span>
                          <div class="flex items-center gap-1 text-white">
                            <span class="material-symbols-outlined text-[14px]">qr_code_2</span>
                            <span class="text-sm font-mono font-bold">{{ user.totalQRs }}</span>
                          </div>
                        </div>
                        <div class="w-px h-6 bg-white/10"></div>
                        <div class="flex flex-col">
                          <span class="text-[9px] font-black uppercase tracking-widest text-white/30">Cuenta
                            Activa</span>
                          <div class="flex items-center gap-1"
                            :class="user.isActive ? 'text-green-500' : 'text-white/40'">
                            <span class="material-symbols-outlined text-[14px]">{{ user.isActive ? 'verified_user' :
                              'pending' }}</span>
                            <span class="text-[10px] font-bold">{{ user.isActive ? 'Sí' : 'No' }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Fechas -->
                      <div class="bg-black/40 rounded-lg p-2 border border-white/5 space-y-1.5 mt-2">
                        <div class="flex justify-between items-center text-[9px]">
                          <span class="text-white/40">Registro</span>
                          <span class="font-mono text-white/60">{{ user.createdAt }}</span>
                        </div>
                        <div class="flex justify-between items-center text-[9px]">
                          <span class="text-white/40">Último Login</span>
                          <span class="font-mono text-white/60">{{ user.lastLoginAt }}</span>
                        </div>
                      </div>

                    </div>
                  </td>

                  <!-- 3. FACTURACIÓN Y PLANES -->
                  <td class="p-4">
                    <div class="flex flex-col space-y-2">
                      <!-- Plan & Status -->
                      <div class="flex items-center gap-2">
                        <div
                          class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[9px] font-black uppercase tracking-widest"
                          :class="{
                            'bg-white/5 border-white/10 text-white': user.plan === 'alpha',
                            'bg-blue-500/10 border-blue-500/20 text-blue-400': user.plan === 'beta',
                            'bg-orange-500/10 border-orange-500/20 text-orange-500': user.plan === 'epsilon'
                          }">
                          Plan {{ user.plan }}
                        </div>
                        <div class="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest"
                          :class="user.subscriptionStatus === 'active' ? 'text-green-500' : (user.subscriptionStatus === 'canceled' ? 'text-red-500' : 'text-white/40')">
                          <span class="material-symbols-outlined text-[12px]">
                            {{ user.subscriptionStatus === 'active' ? 'check_circle' : (user.subscriptionStatus ===
                              'canceled' ? 'cancel' : 'radio_button_unchecked') }}
                          </span>
                          {{ user.subscriptionStatus }}
                        </div>
                      </div>

                      <!-- Detalles Extra (Fechas y Provider ID) -->
                      <div class="text-[9px] space-y-1">
                        <div v-if="user.paymentProviderId" class="flex items-center gap-1 text-white/40">
                          <span class="material-symbols-outlined text-[10px]">receipt_long</span>
                          <span class="font-mono">ID: {{ user.paymentProviderId }}</span>
                        </div>
                        <div class="text-white/30 font-mono">
                          Comprado: {{ user.planPurchasedAt }}
                        </div>
                        <div v-if="user.planEndDate" class="text-white/30 font-mono">
                          Vence: {{ user.planEndDate }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- 4. ESTADO / SEGURIDAD -->
                  <td class="p-4">
                    <div class="space-y-1.5">
                      <div
                        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest"
                        :class="user.isBanned ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-500'">
                        <span class="material-symbols-outlined text-[12px]">{{ user.isBanned ? 'block' : 'shield'
                          }}</span>
                        {{ user.isBanned ? 'Baneado / Suspendido' : 'Cuenta Segura' }}
                      </div>

                      <!-- Razón del baneo si existe -->
                      <div v-if="user.isBanned && user.banReason"
                        class="bg-red-500/5 border border-red-500/10 rounded-lg p-2 text-[10px] text-red-400/80 leading-snug">
                        <strong>Motivo:</strong> {{ user.banReason }}
                      </div>
                    </div>
                  </td>

                  <!-- 5. ACCIONES DE MANDO -->
                  <td class="p-4 text-right align-middle">
                    <div class="flex flex-col items-end justify-center gap-2 h-full">

                      <div class="flex gap-2">
                        <!-- Asignar QR -->
                        <button @click="openQRModal(user.uid, user.name)" v-tooltip="'Asignar Código QR'"
                          class="inline-flex items-center justify-center h-8 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors">
                          <span class="material-symbols-outlined text-[14px] mr-1.5 text-white/50">qr_code</span>
                          <span class="text-[9px] font-black uppercase tracking-widest">+ QR</span>
                        </button>

                        <!-- Cambiar Plan -->
                        <button @click="openPlanModal(user)" v-tooltip="'Gestionar Plan'"
                          class="inline-flex items-center justify-center h-8 px-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 transition-colors">
                          <span class="material-symbols-outlined text-[14px] mr-1.5">payments</span>
                          <span class="text-[9px] font-black uppercase tracking-widest">Plan</span>
                        </button>
                      </div>

                      <!-- Banear -->
                      <button @click="openBanModal(user)"
                        class="inline-flex items-center justify-center h-8 px-3 rounded-lg transition-colors border w-full"
                        :class="user.isBanned ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white/60' : 'bg-red-500/10 hover:bg-red-500/20 border-red-500/20 text-red-500'">
                        <span class="material-symbols-outlined text-[14px] mr-1.5">{{ user.isBanned ? 'how_to_reg' :
                          'gavel' }}</span>
                        <span class="text-[9px] font-black uppercase tracking-widest">
                          {{ user.isBanned ? 'Quitar Restricción' : 'Suspender Acceso' }}</span>
                      </button>

                    </div>
                  </td>

                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Modales Independientes -->
        <QRNamePrompt :is-open="isQRModalOpen" :user-name="selectedUserForQR?.name || ''" @submit="handleQRSubmit"
          @cancel="isQRModalOpen = false" />

        <BanConfirmPrompt :is-open="isBanModalOpen" :user-name="selectedUserForBan?.name || ''"
          :is-currently-banned="selectedUserForBan?.isBanned || false" @submit="handleBanSubmit"
          @cancel="isBanModalOpen = false" />

        <ChangePlanPrompt :is-open="isPlanModalOpen" :user-name="selectedUserForPlan?.name || ''"
          :current-plan="selectedUserForPlan?.plan || ''" @submit="handlePlanSubmit"
          @cancel="isPlanModalOpen = false" />

      </div>
    </template>
  </UserDashoardLayout>
</template>

<style scoped>
.font-google-sans {
  font-family: 'Google Sans', sans-serif;
}

.font-poppins {
  font-family: 'Poppins', sans-serif;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 24;
}

/* Scrollbar estilizada */
.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 136, 0, 0.2);
  /* Naranja sutil */
  border-radius: 10px;
  border: 2px solid #09090b;
  /* Padding hack */
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 136, 0, 0.5);
}
</style>
