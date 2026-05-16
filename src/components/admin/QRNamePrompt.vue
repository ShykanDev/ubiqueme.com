<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = defineProps<{
  isOpen: boolean
  userName: string
}>()

const emit = defineEmits<{
  (e: 'submit', qrName: string): void
  (e: 'cancel'): void
}>()

const qrNameInput = ref('')

// Focus and clear input when modal opens
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    qrNameInput.value = ''
  }
})

const handleSubmit = () => {
  if (!qrNameInput.value.trim()) return
  emit('submit', qrNameInput.value.trim())
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <Transition name="fade-scale">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
      
      <!-- Prompt Card -->
      <div class="bg-[#09090b] border border-white/10 w-full max-w-sm rounded-3xl p-6 md:p-8 flex flex-col space-y-6 relative overflow-hidden">
        
        <!-- Subtle Pattern -->
        <div class="absolute inset-0 opacity-[0.02] pointer-events-none"
             style="background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 20px 20px;">
        </div>

        <div class="relative z-10 space-y-2 text-center">
          <div class="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="material-symbols-outlined text-orange-500 text-[24px]">qr_code_scanner</span>
          </div>
          <h3 class="text-xl font-black italic uppercase tracking-tighter text-[#dce7ff]">Asignar Nuevo QR</h3>
          <p class="text-white/40 text-xs">Asigne el nombre del nuevo QR para el usuario <span class="font-bold text-white">{{ userName }}</span>.</p>
        </div>

        <div class="relative z-10 space-y-4">
          <div class="space-y-1">
            <label class="text-[9px] font-black text-orange-500 uppercase tracking-widest ml-2">Nombre del QR</label>
            <input 
              v-model="qrNameInput"
              type="text" 
              placeholder="Ej. Llaves del auto"
              @keyup.enter="handleSubmit"
              class="w-full p-4 bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl text-sm text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors outline-none placeholder:text-white/20"
              autofocus
            />
          </div>

          <div class="flex gap-3 pt-2">
            <button @click="handleCancel"
                    class="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">
              Cancelar
            </button>
            <button @click="handleSubmit"
                    :disabled="!qrNameInput.trim()"
                    class="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-[#09090b] rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Asignar
            </button>
          </div>
        </div>

      </div>

    </div>
  </Transition>
</template>

<style scoped>
.font-google-sans {
  font-family: 'Google Sans', sans-serif;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 24;
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
