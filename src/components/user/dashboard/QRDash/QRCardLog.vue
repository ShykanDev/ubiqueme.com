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

const formatDate = (timestamp?: Timestamp | null) => {
  if (!timestamp || typeof timestamp.toDate !== 'function') return '---'

  const d = timestamp.toDate()

  return `${d.getDate().toString().padStart(2, '0')} ${d.toLocaleString('es-MX', { month: 'short' })
    } ${d.getFullYear()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`
}

const date = computed(() => formatDate(props.scanDate))

const city = computed(() => props.scanMetrics?.city || "Azcapotzalco")
const region = computed(() => props.scanMetrics?.region || "CDMX")
const country = computed(() => props.scanMetrics?.country || "México")
</script>

<template>
  <li class="group relative flex items-center justify-between
           bg-white/5 border border-white/5 rounded-xl px-3 py-2
           hover:bg-white/10 transition-colors duration-100 ease-out font-google-sans">

    <!-- LEFT: Icon + Location -->
    <div class="flex items-center gap-3 min-w-0">
      <div class="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
        <span class="material-symbols-outlined text-[#d5d5d5] text-[16px]">location_on</span>
      </div>

      <div class="flex flex-col leading-tight min-w-0">
        <span class="text-white text-xs font-semibold truncate">
          {{ city }}
        </span>

        <span class="text-white/40 text-[10px] truncate">
          {{ region }}, {{ country }}
        </span>
      </div>
    </div>

    <!-- RIGHT: Date -->
    <div class="text-right shrink-0">
      <span class="text-[10px] text-white/70 font-mono leading-tight">
        {{ date }}
      </span>
    </div>

  </li>
</template>
