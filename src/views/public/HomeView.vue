<script lang="ts" setup>
import StepByStep from '@/components/home/StepByStep.vue';
import HomeLayout from '@/layouts/HomeLayout.vue';


</script>

<template>
  <HomeLayout>
    <template #main>
      <section class="px-8 md:px-24 max-w-screen-2xl mx-auto pt-32 bg-surface-container">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <!-- Text -->
          <div>
            <span
              class="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest uppercase mb-6">
              Security Redefined
            </span>

            <h1 class="font-headline text-white text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              Cómo funciona <span class="text-gradient ">Ubiqueme</span>
            </h1>

            <p class="text-on-surface-variant text-xl leading-relaxed mb-10 max-w-xl">
              Una forma sencilla y segura para que cualquier persona te notifique si algo le sucede a tu vehículo o
              propiedad.
            </p>

            <div class="flex flex-wrap gap-4">
              <button class="btn-primary text-on-primary font-bold px-8 py-4 rounded-full text-lg">
                Obtén tu QR
              </button>
              <button class="bg-surface-container-highest text-on-surface font-semibold px-8 py-4 rounded-full text-lg">
                Watch Demo
              </button>
            </div>
          </div>

          <!-- Image -->
          <div class="relative">
            <div class="absolute -inset-10 bg-primary/20 blur-[120px] rounded-full"></div>

            <div class="relative p-2 rounded-xl border px-0 mx-0">
              <img class="rounded-xl  w-10/12 mx-auto" src="../../assets/qr-code.png" alt="qr-code">

              <!-- Floating Card -->
              <div class="absolute -bottom-6 -left-6 glass-panel p-6 rounded-3xl border border-sky-700  max-w-[240px]">
                <div class="flex items-center space-x-3 mb-2">
                  <span class="material-symbols-outlined text-primary">lock</span>

                  <span class="text-sm font-bold text-sky-300">Datos Seguros</span>
                </div>
                <p class="text-xs text-on-surface-variant">
                  Conexión segura activa. No se comparten datos.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      <StepByStep />

    </template>
  </HomeLayout>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.glass-panel {
  background: rgba(51, 57, 76, 0.6);
  backdrop-filter: blur(20px);
}

.text-gradient {
  background: linear-gradient(135deg, #7bd0ff 0%, #008abb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.btn-primary {
  background: linear-gradient(135deg, #7bd0ff 0%, #008abb 100%);
}

.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  /* Preferred icon size */
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;

  /* Support for all WebKit browsers. */
  -webkit-font-smoothing: antialiased;
  /* Support for Safari and Chrome. */
  text-rendering: optimizeLegibility;

  /* Support for Firefox. */
  -moz-osx-font-smoothing: grayscale;

  /* Support for IE. */
  font-feature-settings: 'liga';
}
</style>
