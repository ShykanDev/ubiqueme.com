<script lang="ts" setup>
import FeaturesComponent from '@/components/home/Features/FeaturesComponent.vue'
import StepByStep from '@/components/home/StepByStep/StepByStep.vue'
import HomeLayout from '@/layouts/HomeLayout.vue'
</script>

<template>
  <HomeLayout>
    <template #main>
      <main class="relative bg-[#070b14] overflow-hidden font-google-sans">

        <!-- 📐 BACKGROUND ORNAMENTATION (Blueprint Style) -->
        <div class="absolute inset-0 z-0">
          <div
            class="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none">
          </div>
          <div
            class="absolute top-[-5%] right-[-5%] w-[400px] h-[400px] border border-white/5 rounded-full pointer-events-none">
          </div>
          <div class="absolute inset-0 z-0 opacity-[0.02]"
            style="background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 100px 100px;">
          </div>
        </div>

        <!-- 🚀 HERO SECTION -->
        <section class="relative z-10 px-8 md:px-24 pt-32 pb-20 mx-auto max-w-7xl ">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center ">

            <!-- CONTENT -->
            <div class="space-y-10">
              <div class="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-lg border border-primary/20">
                <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span class="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Sistema de Notificación
                  Activo</span>
              </div>

              <h1 class="text-6xl lg:text-8xl font-black text-white leading-[0.85] tracking-[ -0.05em] uppercase">
                Reciba<br />
                <span class="text-primary">ALERTAS SEGURAS</span>
              </h1>

              <div class="text-white/40 text-xl font-medium leading-relaxed max-w-lg">
                Mantenga sus pertenencias localizables. Reciba alertas instantáneas de su
                <span class="text-white font-black italic">automóvil, bicicleta o equipaje</span>
                sin exponer un solo dato de su información personal.
              </div>

              <div class="flex flex-wrap gap-4">
                <router-link :to="{ name: 'register' }"
                  class="px-10 py-5 bg-white text-black font-black uppercase tracking-widest text-sm rounded-2xl transition-all duration-300 hover:bg-primary hover:text-black active:scale-95 shadow-2xl font-google-sans">
                  Obtener Código QR
                </router-link>
                <router-link :to="{ name: 'login' }"
                  class="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-white/10 transition-all font-google-sans">
                  Iniciar Sesión
                </router-link>
              </div>

              <!-- TECH STACK BADGES -->
              <div class="flex items-center gap-8 pt-8 opacity-20 filter grayscale">
                <span class="text-[10px] font-black tracking-widest uppercase">Encriptación P2P</span>
                <span class="text-[10px] font-black tracking-widest uppercase">Privacidad Total</span>
                <span class="text-[10px] font-black tracking-widest uppercase">Aviso Inmediato</span>
              </div>
            </div>

            <!-- VISUAL -->
            <div class="relative">
              <div class="absolute -inset-20 bg-primary/5 blur-[120px] rounded-full"></div>

              <div
                class="relative aspect-square rounded-[3rem] overflow-hidden border border-white/10 bg-white/5 shadow-2xl group">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none">
                </div>
                <video class="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  src="../../assets/videos/laptop.mp4" autoplay loop muted></video>

                <!-- OVERLAY CARD -->
                <div
                  class="absolute bottom-8 left-8 right-8 z-20 p-6 bg-white/[0.1] border border-white/10 rounded-2xl flex items-center justify-between">
                  <div class="space-y-1">
                    <p class="text-[10px] font-black text-primary uppercase tracking-widest">Estado del Servicio</p>
                    <p class="text-white font-bold">Conexión Protegida</p>
                  </div>
                  <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black">
                    <span class="material-symbols-outlined text-sm font-bold">verified</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        <StepByStep />
        <FeaturesComponent />
      </main>
    </template>
  </HomeLayout>
</template>

<style scoped>
.font-google-sans {
  font-family: 'Google Sans', sans-serif;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

button {
  transition: all 0.2s ease;
}
</style>
