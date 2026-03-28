<script lang="ts" setup>
import HomeLayout from '@/layouts/HomeLayout.vue';


</script>

<template>
  <HomeLayout>
    <template #main>
      <section class="px-8 md:px-24 max-w-screen-2xl mx-auto mb-32 pt-32 bg-surface-container">
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

            <div class="relative glass-panel p-8 rounded-xl border border-outline-variant/10">
              <img class="rounded-xl object-cover w-full h-[400px]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPJSSM7CC2Z4cvKSgZOxycifTLLlTF8i719sOSMzqk1aBntYe-zHgYMc-5XAEuo6sKe2rW--FJjxKlPBRhw_EyZBxLYMi0bvv-KMCXZ_UADVsQCpUYMb8zBaazPgGzINr7Z_XAk60s6Jfv3MuOwzJFuLKsg4e-NXKZ46jeWgvElEKeQkmjb2lYtRPOKM6y9kJc-vS8zIYXmyZp7iXweUFbJ0W8kOTrTdP2YF3jea160E_Pjy5lfI9D1BlCtewc-F-N_h9fbU-6PqX6"
                alt="QR Scan" />

              <!-- Floating Card -->
              <div
                class="absolute -bottom-6 -left-6 glass-panel p-6 rounded-lg border border-outline-variant/20 max-w-[240px]">
                <div class="flex items-center space-x-3 mb-2">
                  <span class="material-symbols-outlined text-primary">lock</span>
                  <span class="text-sm font-bold">Secure Transfer</span>
                </div>
                <p class="text-xs text-on-surface-variant">
                  Encrypted connection active. No data shared.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>
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
</style>
