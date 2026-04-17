<script lang="ts" setup>
import type { Timestamp } from 'firebase/firestore'
import { computed } from 'vue'

interface IQRCardLog {
  scanDate?: Timestamp | null;
  scanMetrics?: {
    city: string;
    country: string;
    region: string;
  } | null
}

const props = defineProps<IQRCardLog>()

const displayData = computed(() => {
  let dateStr = "---";

  if (props.scanDate && typeof props.scanDate.toDate === 'function') {
    const d = props.scanDate.toDate()

    dateStr = d.toLocaleString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    })
  }

  return {
    date: dateStr,
    city: props.scanMetrics?.city || "Azcapotzalco",
    region: props.scanMetrics?.region || "CDMX",
    country: props.scanMetrics?.country || "México"
  }
})
</script>

<template>
  <div class="group relative flex items-center justify-between
           bg-white/5 border border-white/5 rounded-xl px-3 py-2
           hover:bg-white/10 transition-all">

    <!-- LEFT: Icon + Location -->
    <div class="flex items-center gap-3 min-w-0">
      <div class="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
        <span class="material-symbols-outlined text-[#d5d5d5] text-[16px]">location_on</span>
      </div>

      <div class="flex flex-col leading-tight min-w-0">
        <span class="text-white text-xs font-semibold truncate">
          {{ displayData.city }}
        </span>

        <span class="text-white/40 text-[10px] truncate">
          {{ displayData.region }}, {{ displayData.country }}
        </span>
      </div>
    </div>

    <!-- RIGHT: Date -->
    <div class="text-right shrink-0">
      <span class="text-[10px] text-white/70 font-mono leading-tight">
        {{ displayData.date }}
      </span>
    </div>

  </div>
</template>

<style scoped>
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
</style>
