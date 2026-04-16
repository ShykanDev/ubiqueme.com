<script lang="ts" setup>
interface Steps {
  icon: string
  title: string
  description: string
  number: number
  video: string
}

const props = defineProps<{
  steps: Steps
}>()
</script>

<template>
  <!-- Step  -->
  <div
    class="relative h-[590px] group"
  >
    <video
      class="rounded-3xl absolute w-full h-full top-0 bottom-0 left-0 right-0 object-cover"
      :src="steps.video"
      autoplay
      loop
      muted
      playsinline
    ></video>

    <div
      class="text-[8rem] font-black text-white/30 absolute -top-20 z-20 -left-4 select-none opacity-80 font-headline w-full h-full"
    >
      {{ steps.number }}
    </div>
    <div
      class="relative z-10 inset-0 flex flex-col justify-around h-full text-center px-2 bg-black/45 items-center rounded-3xl"
    >
      <div
        class="w-16 h-16 rounded-2xl bg-primary-container flex items-center justify-center mb-8 border border-primary/20"
      >
        <span class="material-symbols-outlined text-primary text-3xl" :data-icon="steps.icon">{{
          steps.icon
        }}</span>
      </div>
      <h3 class="font-headline text-xl font-bold mb-4 text-slate-100">{{ steps.title }}</h3>
      <p
        class="text-white font-rubik leading-relaxed p-1.5 bg-black/40 rounded-2xl"
      >
        {{ steps.description }}
      </p>
    </div>
  </div>
</template>

<style scoped></style>
