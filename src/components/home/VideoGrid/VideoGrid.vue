<template>
  <section class="relative z-10 px-6 sm:px-8 py-24 mx-auto max-w-7xl">

    <!-- Section Header -->
    <div class="text-center mb-16" data-aos="fade-up">
      <h2 class="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
        Ubiqueme en acción
      </h2>
      <p class="text-white/50 text-base sm:text-lg font-medium max-w-2xl mx-auto">
        Descubra cómo nuestra tecnología protege lo que más valora.
      </p>
    </div>

    <!-- Responsive Grid of 6 Videos -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

      <!-- Video Card (Repeated 6 times) -->
      <div v-for="i in 6" :key="i"
        class="relative aspect-[4/5] bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden group"
        data-aos="fade-up" :data-aos-delay="(i - 1) * 100">
        <!-- Placeholder for User's Video -->
        <video
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src="../../../assets/videos/vid01.mp4" autoplay loop muted playsinline>
        </video>

        <!-- Bottom Gradient for text/button readability -->
        <div
          class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#070b14]/80 to-transparent pointer-events-none transition-opacity duration-300">
        </div>

        <!-- Sound Activation Button (Absolute positioned with rounded corners) -->
        <button @click="activateSound(i)"
          class="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 bg-[#070b14] hover:bg-white border border-white/20 hover:border-transparent text-white/90 hover:text-[#070b14] text-[10px] font-black uppercase tracking-widest rounded-full transition-all duration-300 z-10 flex items-center gap-2 whitespace-nowrap">
          <span class="material-symbols-outlined text-[14px]">volume_off</span>
          Haga click para activar el sonido
        </button>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { toast } from 'vue-sonner'

const videoSources = [
  {
    src: new URL('../../../assets/videos/vid01.mp4', import.meta.url).href,
    title: 'Video 1',
    description: 'Description 1'
  },
  {
    src: new URL('../../../assets/videos/vid02.mp4', import.meta.url).href,
    title: 'Video 2',
    description: 'Description 2'
  },
  {
    src: new URL('../../../assets/videos/vid03.mp4', import.meta.url).href,
    title: 'Video 3',
    description: 'Description 3'
  },
  {
    src: new URL('../../../assets/videos/vid04.mp4', import.meta.url).href,
    title: 'Video 4',
    description: 'Description 4'
  },
  {
    src: new URL('../../../assets/videos/vid05.mp4', import.meta.url).href,
    title: 'Video 5',
    description: 'Description 5'
  },
  {
    src: new URL('../../../assets/videos/vid06.mp4', import.meta.url).href,
    title: 'Video 6',
    description: 'Description 6'
  },
]

onMounted(() => {
  AOS.init({
    duration: 800,
    once: true,
    offset: 50,
    easing: 'ease-out-cubic'
  })
})

const activateSound = (index: number) => {
  toast.info(`Sonido activado`);
  // Aquí podrá implementar la lógica para mutear/desmutear el video en el futuro
}
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
