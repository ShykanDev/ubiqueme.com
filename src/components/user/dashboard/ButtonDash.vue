<script lang="ts" setup>
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  isHover: {
    type: Boolean,
  },
  index: {
    type: Number,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  }

})
</script>

<template>
  <button
    class="w-full  text-white overflow-hidden  flex  p-5  items-center justify-start gap-3 hover:bg-[#0f2657] rounded-md relative cursor-pointer"
    :class="{ 'bg-[#0f2657]': active }">
    <v-icon :name="props.icon" scale="1.5" class="absolute left-4" />
    <span v-show="isHover"
      class="animate__animated animate__flipInX whitespace-nowrap animate-duration-[.1s] w-full  transition-colors duration-200 ease-out text-lg"
      :style="{ 'animation-delay': `${index * 55}ms` }">{{
        props.name }}</span>
  </button>
</template>

<style scoped></style>
