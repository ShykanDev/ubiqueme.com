<script lang="ts" setup>
import { ref } from 'vue'

const form = ref({
  subject: '',
  message: '',
})

const isSending = ref(false)
const showSuccess = ref(false)

const submitForm = () => {
  if (!form.value.subject || !form.value.message) return

  isSending.value = true

  // Simulando el envío a la base de datos o API
  setTimeout(() => {
    isSending.value = false
    showSuccess.value = true
    form.value.subject = ''
    form.value.message = ''

    setTimeout(() => {
      showSuccess.value = false
    }, 4000)
  }, 1500)
}
</script>

<template>
  <div class="w-full max-w-7xl mx-auto font-google-sans">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-white mb-1">Soporte técnico</h2>
      <p class="text-sm text-gray-400">
        ¿Tiene algún problema? Envíenos un correo y le ayudaremos lo antes posible.
      </p>
    </div>

    <div
      class="bg-[#111324] rounded-2xl p-6 shadow-lg border border-white/5 relative overflow-hidden"
    >
      <!-- Overlay de éxito -->
      <div
        v-if="showSuccess"
        class="absolute inset-0 bg-[#0F1222] flex flex-col items-center justify-center z-10"
      >
        <div
          class="w-16 h-16 bg-green-500/20 text-green-400 border border-green-500/20 rounded-full flex items-center justify-center mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 class="text-white text-lg font-semibold mb-1">¡Mensaje enviado exitosamente!</h3>
        <p class="text-gray-400 text-sm">Nuestro equipo le responderá a su correo en breve.</p>
      </div>

      <form @submit.prevent="submitForm" class="space-y-5 relative">
        <div>
          <label class="block text-xs font-medium text-gray-400 mb-1">Asunto</label>
          <div class="relative">
            <select
              v-model="form.subject"
              required
              class="w-full bg-[#0F1222] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none pr-10"
            >
              <option value="" disabled selected>Selecciona un tema...</option>
              <option value="billing">Problemas de facturación / Pagos</option>
              <option value="qr_issues">Mi código QR no funciona</option>
              <option value="account">Problemas con mi configuración de cuenta</option>
              <option value="other">Otro asunto</option>
            </select>
            <!-- Dropdown Icon -->
            <div
              class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-400 mb-1">Mensaje</label>
          <textarea
            v-model="form.message"
            required
            rows="5"
            class="w-full bg-[#0F1222] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
            placeholder="Describa su problema con detalle para que podamos ayudarle de la mejor manera..."
          ></textarea>
        </div>

        <button
          type="submit"
          :disabled="isSending"
          class="w-full py-3 rounded-lg text-sm font-medium bg-blue-500/90 hover:bg-blue-500 disabled:opacity-70 disabled:cursor-not-allowed text-white transition-all cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2"
        >
          <svg
            v-if="isSending"
            class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ isSending ? 'Enviando mensaje...' : 'Enviar mensaje al soporte' }}
        </button>
      </form>
    </div>

    <div class="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
      También puede escribirnos enviando un correo directo a:
      <a href="mailto:soporte@ubiqueme.com" class="text-blue-400 hover:underline"
        >soporte@ubiqueme.com</a
      >
    </div>
  </div>
</template>

<style scoped></style>
