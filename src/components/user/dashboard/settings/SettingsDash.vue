<script lang="ts" setup>
import { ref } from 'vue'

const settings = ref({
  profile: {
    name: 'Juan Pérez',
    email: 'juan@example.com',
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
</script>

<template>
  <div class="w-full max-w-7xl mx-auto font-google-sans">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-white mb-1">Configuración</h2>
      <p class="text-sm text-gray-400">Administra tu cuenta, notificaciones y seguridad.</p>
    </div>

    <div class="space-y-6">
      <!-- Card: Perfil -->
      <div class="bg-[#111324] rounded-2xl p-6 shadow-lg border border-white/5">
        <h3 class="text-white text-lg font-semibold mb-4 border-b border-white/5 pb-3">Perfil</h3>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-gray-400 mb-1">Nombre completo</label>
            <input
              type="text"
              v-model="settings.profile.name"
              class="w-full bg-[#0F1222] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-400 mb-1">Correo electrónico</label>
            <input
              type="email"
              v-model="settings.profile.email"
              class="w-full bg-[#0F1222] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors opacity-60"
              disabled
            />
            <p class="text-[11px] text-gray-500 mt-1">
              El correo electrónico no se puede cambiar por motivos de seguridad.
            </p>
          </div>
          <div class="pt-2">
            <button
              class="px-5 py-2.5 rounded-lg text-sm bg-blue-500/90 hover:bg-blue-500 text-white transition cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.2)]"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>

      <!-- Card: Notificaciones -->
      <div class="bg-[#111324] rounded-2xl p-6 shadow-lg border border-white/5">
        <h3 class="text-white text-lg font-semibold mb-4 border-b border-white/5 pb-3">
          Preferencias de Notificaciones
        </h3>

        <div class="space-y-4">
          <label class="flex items-center justify-between cursor-pointer group">
            <div>
              <p class="text-sm text-white font-medium">Alertas por Correo</p>
              <p class="text-xs text-gray-400">Recibe resúmenes de escaneos y novedades.</p>
            </div>
            <div class="relative">
              <input
                type="checkbox"
                v-model="settings.notifications.emailAlerts"
                class="sr-only peer"
              />
              <div
                class="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 transition-colors"
              ></div>
            </div>
          </label>

          <label class="flex items-center justify-between cursor-pointer group">
            <div>
              <p class="text-sm text-white font-medium">Notificaciones Push</p>
              <p class="text-xs text-gray-400">
                Recibe notificaciones en tiempo real en tu dispositivo.
              </p>
            </div>
            <div class="relative">
              <input
                type="checkbox"
                v-model="settings.notifications.pushAlerts"
                class="sr-only peer"
              />
              <div
                class="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 transition-colors"
              ></div>
            </div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
