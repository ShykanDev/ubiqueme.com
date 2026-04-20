<script lang="ts" setup>
import type { IQRLog } from '@/interfaces/IPublicQR'
import { useImageStore } from '@/stores/imageStore';
import { useUserStore } from '@/stores/user';
import { computed } from 'vue'

const props = defineProps<IQRLog>()

const formatDate = (timestamp?: any) => {
  if (!timestamp || typeof timestamp.toDate !== 'function') return '---'
  const d = timestamp.toDate()
  return `${d.getDate().toString().padStart(2, '0')} ${d.toLocaleString('es-MX', { month: 'short' })} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`
}

const dateStr = computed(() => formatDate(props.scanDate))

const reasonMap: Record<string, { label: string, icon: string, color: string }> = {
  emergency: { label: 'EMERGENCIA', icon: 'emergency', color: 'text-rose-500' },
  communication: { label: 'CONTACTO', icon: 'chat', color: 'text-primary' },
  informative: { label: 'INFO', icon: 'info', color: 'text-white/40' },
  other: { label: 'PERSONALIZADO', icon: 'edit_note', color: 'text-white/60' }
}

const interactionDetail = computed(() => {
  if (!props.interaction) return null
  return reasonMap[props.interaction.reason] || { label: 'ESCANEADO', icon: 'visibility', color: 'text-white/40' }
})

const imageStore = useImageStore();

const openImage = (img: string) => {
  imageStore.clearImages();
  imageStore.setImages(img);
  imageStore.showImage();
}

</script>

<template>

  <li
    class="group relative  bg-white/3 border border-white/5 rounded-2xl p-4 transition-all duration-300 hover:bg-white/6 hover:border-white/10 font-google-sans">

    <div class="flex gap-4 ">
      <!-- 📸 IMAGE THUMBNAIL (Optional) -->
      <div v-if="img" class="w-16 h-16 shrink-0 rounded-xl overflow-hidden border border-white/10 bg-black/40">
        <img :src="img" @click="openImage(img)" alt="Log evidence"
          class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
      </div>

      <!-- 📝 CONTENT -->
      <div class="flex-1 min-w-0 space-y-2">
        <!-- Header Info -->
        <div class="flex items-start justify-between gap-2">
          <div class="flex flex-col">
            <div v-if="interactionDetail" class="flex items-center gap-1.5 mb-1" :class="interactionDetail.color">
              <span class="material-symbols-outlined text-[14px] font-black">{{ interactionDetail.icon }}</span>
              <span class="text-[9px] font-black uppercase tracking-[0.2em]">{{ interactionDetail.label }}</span>
            </div>
            <div class="flex gap-1 flex-col">
              <small class="text-white/90 text-[11px] font-normal truncate font-poppins"><span
                  class="font-bold font-google-sans">Fecha:</span> {{ dateStr }}</small>
              <p class="text-white/90 text-[11px] font-normal truncate font-poppins"><span
                  class="font-bold font-google-sans">Ciudad:</span>
                {{ scanMetrics.city }},
              </p>
              <p class="text-white/90 text-[11px] font-normal truncate font-poppins">
                <span class="font-bold font-google-sans">Pais:</span> {{ scanMetrics.country }}
              </p>
            </div>
          </div>

        </div>

        <!-- Message -->
        <div v-if="interaction?.message" class="bg-white/5 rounded-xl p-2 md:p-3 border border-white/5">
          <small class="text-white/90 text-[11px] font-normal truncate font-poppins">Mensaje:</small>
          <p
            class="text-white/60 text-[10px] leading-relaxed italic line-clamp-2 group-hover:line-clamp-none transition-all">
            "{{ interaction.message }}"
          </p>
        </div>
      </div>
    </div>

    <!-- Decorative Corner Glow (Emergency only) -->

  </li>



</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
