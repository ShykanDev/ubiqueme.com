<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = defineProps<{
  isOpen: boolean
  userName: string
  isCurrentlyBanned: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', banReason: string): void
  (e: 'cancel'): void
}>()

const banReasonInput = ref('')

// Clear input when modal opens
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    banReasonInput.value = ''
  }
})

const handleSubmit = () => {
  emit('submit', banReasonInput.value.trim())
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
          <div class="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
               :class="!isCurrentlyBanned ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-500'">
            <span class="material-symbols-outlined text-[24px]">
              {{ isCurrentlyBanned ? 'how_to_reg' : 'gavel' }}
            </span>
          </div>
          <h3 class="text-xl font-black italic uppercase tracking-tighter"
              :class="!isCurrentlyBanned ? 'text-red-500' : 'text-green-500'">
            {{ isCurrentlyBanned ? 'Reactivar Usuario' : 'Suspender Usuario' }}
          </h3>
          <p class="text-white/40 text-xs">
            ¿Estás seguro que deseas {{ isCurrentlyBanned ? 'reactivar' : 'suspender' }} al usuario <span class="font-bold text-white">{{ userName }}</span>?
          </p>
        </div>

        <div class="relative z-10 space-y-4">
          <!-- Solo mostramos el input de razón si estamos a punto de suspender, no de reactivar -->
          <div v-if="!isCurrentlyBanned" class="space-y-1">
            <label class="text-[9px] font-black text-white/50 uppercase tracking-widest ml-2">Motivo de suspensión (Opcional)</label>
            <textarea 
              v-model="banReasonInput"
              placeholder="Ej. Uso indebido de la plataforma"
              class="w-full p-4 bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl text-sm text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors outline-none resize-none h-24 placeholder:text-white/20"
            ></textarea>
          </div>

          <div class="flex gap-3 pt-2">
            <button @click="handleCancel"
                    class="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">
              Cancelar
            </button>
            <button @click="handleSubmit"
                    class="flex-1 px-4 py-3 text-[#09090b] rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
                    :class="!isCurrentlyBanned ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'">
              {{ isCurrentlyBanned ? 'Reactivar' : 'Suspender' }}
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
