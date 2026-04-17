<template>
  <div
    class="relative w-full max-w-[380px] bg-[#000000]/20 rounded-[24px] border border-white/5 overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">

    <div class="p-6">
      <!-- Header Skeleton -->
      <div class="flex justify-between items-start mb-6">
        <div class="flex flex-col gap-2">
          <!-- Title -->
          <div class="h-6 w-32 bg-white/10 rounded-md skeleton-item"></div>
          <!-- ID -->
          <div class="h-3 w-20 bg-white/5 rounded-md skeleton-item"></div>
        </div>

        <!-- Status Badge -->
        <div class="h-6 w-20 bg-white/10 rounded-full skeleton-item"></div>
      </div>

      <!-- Content/Stats Skeleton -->
      <div class="flex items-center justify-between bg-white/5 p-4 rounded-2xl mb-6 border border-white/5">
        <div class="flex flex-col gap-2">
          <div class="h-3 w-14 bg-white/5 rounded skeleton-item"></div>
          <div class="h-5 w-8 bg-white/10 rounded skeleton-item"></div>
        </div>
        <div class="w-px h-6 bg-white/10"></div>
        <div class="flex flex-col gap-2 items-end">
          <div class="h-3 w-16 bg-white/5 rounded skeleton-item"></div>
          <div class="h-5 w-24 bg-white/10 rounded skeleton-item"></div>
        </div>
      </div>

      <!-- QR Code Skeleton -->
      <section class="flex justify-center bg-[#000000]/30 p-2 rounded-2xl mb-6">
        <div class="bg-white/5 p-2 rounded-xl flex items-center justify-center">
          <div class="w-[220px] h-[220px] bg-white/5 rounded-lg skeleton-item"></div>
        </div>
      </section>

      <!-- Actions Footer Skeleton -->
      <div class="flex items-center justify-end">
        <div class="w-[38px] h-[38px] bg-white/5 border border-white/10 rounded-xl skeleton-item"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Custom Skeleton for Ubiqueme
</script>

<style scoped>
.skeleton-item {
  position: relative;
  overflow: hidden;
  animation: smooth-pulse 2.5s infinite ease-in-out;
}

.skeleton-item::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.03) 40%,
      rgba(255, 255, 255, 0.06) 50%,
      rgba(255, 255, 255, 0.03) 60%,
      transparent 100%);
  animation: shimmer 1s infinite linear;
}

@keyframes smooth-pulse {

  0%,
  100% {
    opacity: 0.4;
  }

  50% {
    opacity: 1;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }

  20% {
    transform: translateX(100%);
  }

  100% {
    transform: translateX(100%);
  }
}
</style>
