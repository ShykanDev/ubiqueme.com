<script lang="ts" setup>
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { auth } from '@/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'

const settings = ref({
  profile: {
    name: 'Juan Pérez',
    email: 'juan@example.com',
  },
  subscription: {
    plan: 'Plan Premium',
    renewalDate: '15 de Mayo, 2024',
    status: 'Activo'
  },
  notifications: {
    emailAlerts: true,
    pushAlerts: false,
    marketing: true,
  },
  security: {
    twoFactor: false,
  },
})

const isResettingPassword = ref(false)
const isCancelling = ref(false)

const handleResetPassword = async () => {
  if (!settings.value.profile.email) return
  
  isResettingPassword.value = true
  try {
    await sendPasswordResetEmail(auth, settings.value.profile.email)
    toast.success('Se ha enviado un correo para restablecer tu contraseña')
  } catch (error: any) {
    toast.error('Error al enviar el correo: ' + error.message)
  } finally {
    isResettingPassword.value = false
  }
}

const handleCancelAccount = () => {
  isCancelling.value = true
  // Simulamos el envío de un correo de cancelación
  setTimeout(() => {
    toast.success('Solicitud de cancelación enviada. Recibirás un correo de confirmación pronto.')
    isCancelling.value = false
  }, 1500)
}
</script>

<template>
  <div class="w-full max-w-7xl mx-auto font-google-sans pb-20">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-white mb-2">Configuración</h2>
      <p class="text-gray-400">Administre su cuenta, suscripción y seguridad.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Profile & Subscription -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Card: Perfil -->
        <div class="bg-[#111324] rounded-2xl p-6 shadow-lg border border-white/5">
          <div class="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
            <div class="p-2 bg-blue-500/10 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 class="text-white text-lg font-semibold">Perfil del Usuario</h3>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Nombre completo</label>
                <input
                  type="text"
                  v-model="settings.profile.name"
                  class="w-full bg-[#0F1222] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Correo electrónico</label>
                <input
                  type="email"
                  v-model="settings.profile.email"
                  class="w-full bg-[#0F1222] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none opacity-60 cursor-not-allowed"
                  disabled
                />
              </div>
            </div>
            <div class="pt-4 flex justify-end">
              <button
                class="px-6 py-2.5 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>

        <!-- Card: Subscription (Requested) -->
        <div class="bg-[#111324] rounded-2xl p-6 shadow-lg border border-white/5 relative overflow-hidden">
          <div class="absolute top-0 right-0 p-6">
            <span class="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-widest border border-green-500/20">
              {{ settings.subscription.status }}
            </span>
          </div>
          
          <div class="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
            <div class="p-2 bg-purple-500/10 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 class="text-white text-lg font-semibold">Mi Plan y Facturación</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-4 bg-[#0F1222] rounded-xl border border-white/5">
              <p class="text-xs text-gray-400 mb-1">Plan Actual</p>
              <p class="text-xl font-bold text-white">{{ settings.subscription.plan }}</p>
            </div>
            <div class="p-4 bg-[#0F1222] rounded-xl border border-white/5">
              <p class="text-xs text-gray-400 mb-1">Próxima Renovación</p>
              <p class="text-xl font-bold text-white">{{ settings.subscription.renewalDate }}</p>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-3">
            <button class="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">Ver historial de facturas</button>
            <span class="text-gray-700">•</span>
            <button class="text-sm font-medium text-gray-400 hover:text-white transition-colors">Cambiar método de pago</button>
          </div>
        </div>
      </div>

      <!-- Right Column: Security & Actions -->
      <div class="space-y-6">
        <!-- Card: Seguridad -->
        <div class="bg-[#111324] rounded-2xl p-6 shadow-lg border border-white/5">
          <h3 class="text-white text-lg font-semibold mb-4 border-b border-white/5 pb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04k0A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Seguridad
          </h3>

          <div class="space-y-4">
            <button 
              @click="handleResetPassword"
              :disabled="isResettingPassword"
              class="w-full flex items-center justify-between p-4 bg-[#0F1222] hover:bg-white/5 border border-white/5 rounded-xl transition-all group"
            >
              <div class="text-left">
                <p class="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">Recuperar Contraseña</p>
                <p class="text-[11px] text-gray-500">Se enviará un enlace a tu correo</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <label class="flex items-center justify-between cursor-pointer group p-4 bg-[#0F1222] border border-white/5 rounded-xl">
              <div>
                <p class="text-sm text-white font-medium">Doble Factor (2FA)</p>
                <p class="text-[11px] text-gray-500">Aumenta la seguridad de tu cuenta</p>
              </div>
              <div class="relative">
                <input type="checkbox" v-model="settings.security.twoFactor" class="sr-only peer" />
                <div class="w-10 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500 transition-colors"></div>
              </div>
            </label>
          </div>
        </div>

        <!-- Card: Zona de Peligro -->
        <div class="bg-[#111324] rounded-2xl p-6 shadow-lg border border-red-500/10">
          <h3 class="text-red-500 text-lg font-semibold mb-4 border-b border-red-500/5 pb-3">Zona de Peligro</h3>
          
          <p class="text-xs text-gray-400 mb-4">
            Al cancelar su cuenta, todos sus datos serán marcados para eliminación. Esta acción no se puede deshacer fácilmente.
          </p>
          
          <button 
            @click="handleCancelAccount"
            :disabled="isCancelling"
            class="w-full py-3 rounded-xl text-sm font-medium border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
          >
            <svg v-if="isCancelling" class="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isCancelling ? 'Procesando...' : 'Cancelar mi cuenta' }}
          </button>
          <p class="text-[10px] text-center text-gray-600 mt-3">
            Se enviará una solicitud de cancelación a nuestro equipo.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

