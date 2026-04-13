<script lang="ts" setup>
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  trendIcon: {
    type: String,
    required: true,
  },
  trendText: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div
    class="col-span-12 md:col-span-3 surface-container rounded-xl p-8 border border-white/5 relative overflow-hidden group"
  >
    <div
      class="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform duration-500"
    >
      <span class="material-symbols-outlined text-[120px]">{{ icon }}</span>
    </div>
    <p class="text-on-surface-variant text-sm font-medium mb-1">{{ title }}</p>
    <p class="text-4xl font-bold font-headline text-on-surface mb-4">{{ value }}</p>
    <div class="flex items-center text-xs text-primary font-semibold">
      <span class="material-symbols-outlined text-sm mr-1">{{ trendIcon }}</span>
      {{ trendText }}
    </div>
  </div>
</template>

<style scoped></style>
