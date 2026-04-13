<script lang="ts" setup>
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  isHover: {
    type: Boolean,
  },
  index: {
    type: Number,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  iconActive: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
})
</script>

<template>
  <button
    :class="[
      'relative flex items-center gap-3 rounded-[10px] transition-all duration-300 overflow-hidden',
      'min-h-[42px] px-3 cursor-pointer',
      active
        ? 'bg-[rgba(99,140,255,0.13)] text-[#a8bfff]'
        : 'text-[rgba(160,170,200,0.7)] hover:bg-[rgba(99,140,255,0.08)] hover:text-[rgba(200,210,240,0.95)]',
    ]"
    :style="{ width: isHover ? '184px' : '47px' }"
  >
    <!-- indicador activo -->
    <span
      v-if="active"
      class="absolute left-0 top-[20%] bottom-[20%] w-0.5 rounded-full bg-[#6B8FFF]"
    ></span>

    <!-- ícono -->
    <v-icon
      :name="active ? iconActive : icon"
      scale="1.3"
      :class="active ? 'opacity-100' : 'opacity-75'"
    />

    <!-- label con fade + colapso de ancho -->
    <span
      class="text-sm font-light tracking-wide whitespace-nowrap pointer-events-none transition-all duration-200 font-google-sans animate_animated animate__"
      :style="{
        opacity: isHover ? '1' : '0',
        maxWidth: isHover ? '140px' : '0px',
        overflow: 'hidden',
      }"
    >
      {{ name }}
    </span>
  </button>
</template>

<style scoped></style>
