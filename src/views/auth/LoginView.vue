<template>
  <HomeLayout>
    <template #main>
      <section class="min-h-screen w-full flex flex-col md:flex-row bg-surface font-body overflow-hidden pt-20">
        <div
          class="hidden md:flex md:w-1/2 lg:w-3/5 bg-obsidian-gradient relative items-start justify-center p-12 lg:p-7">
          <div class="absolute inset-0 opacity-10 pointer-events-none">
            <div
              class="absolute top-0 left-0 w-full h-full border border-primary/5 [mask-:linear-gradient(to_bottom,black,transparent)]">
            </div>
          </div>

          <div class="relative z-10 max-w-xl">
            <div
              class="mb-8 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-300 border border-outline-variant/20">
              <span class="material-symbols-outlined text-blue-900 text-[20px]">verified_user</span>
              <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-fixed text-blue-900">Privacidad
                Avanzada</span>
            </div>

            <h1
              class="font-headline text-5xl lg:text-7xl font-extrabold tracking-tight text-on-surface leading-[1.1] mb-8">
              Mantengase localizable.<br />
              <span class="text-primary">Mantengase protegido.</span>
            </h1>

            <p class="text-on-surface-variant text-lg lg:text-xl font-light leading-relaxed mb-12 max-w-md">
              Notificaciones seguras sin exponer su información personal. Seguro privado y rápido.
            </p>

            <div class="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/20 shadow-2xl">
              <div class="flex items-center gap-6">
                <div
                  class="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <span class="material-symbols-outlined text-primary text-3xl">qr_code_2</span>
                </div>
                <div class="space-y-2">
                  <div class="h-1.5 w-32 bg-primary/30 rounded-full"></div>
                  <div class="h-1.5 w-48 bg-outline-variant/30 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="absolute bottom-12 left-12 lg:left-24 flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary font-headline font-black text-xl shadow-lg shadow-primary/20">
              U
            </div>
            <span class="font-headline font-bold text-2xl tracking-tight text-on-surface">Ubiqueme</span>
          </div>
        </div>

        <div
          class="grow md:w-1/2 lg:w-2/5 flex items-center justify-center p-6 sm:p-12 bg-surface border-l border-outline-variant/10">
          <div class="w-full max-w-md">
            <div class="md:hidden flex flex-col items-center mb-10 text-center">
              <div
                class="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-on-primary font-headline font-black text-2xl mb-4 shadow-xl shadow-primary/20">
                U
              </div>
              <h2 class="font-headline font-bold text-3xl text-on-surface">Ubiqueme</h2>
              <p class="text-on-surface-variant mt-2">Acceso seguro a tu panel</p>
            </div>

            <div
              class="bg-surface-container-low md:bg-transparent p-8 md:p-0 rounded-3xl md:rounded-none border md:border-none border-outline-variant/10">
              <div class="hidden md:block mb-10">
                <h2 class="font-headline text-4xl font-bold text-on-surface mb-3">
                  Bienvenido de nuevo
                </h2>
                <p class="text-on-surface-variant">Ingresa tus credenciales para continuar</p>
              </div>

              <form @submit.prevent="handleLogin" class="space-y-5">
                <div class="space-y-2">
                  <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider ml-1"
                    for="email">Correo Electrónico</label>
                  <div class="group relative">
                    <span
                      class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-xl">mail</span>
                    <input id="email" v-model="form.email" type="email" placeholder="nombre@dominio.com"
                      class="w-full pl-12 pr-4 py-4 bg-surface-container-highest border border-outline-variant/10 rounded-2xl text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all" />
                  </div>
                </div>

                <div class="space-y-2">
                  <div class="flex justify-between items-center px-1">
                    <label class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider"
                      for="password">Contraseña</label>
                    <a href="#"
                      class="text-xs font-bold text-primary hover:text-primary-fixed transition-colors">¿Olvidaste?</a>
                  </div>
                  <div class="group relative">
                    <span
                      class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-xl">lock</span>
                    <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'"
                      placeholder="••••••••"
                      class="w-full pl-12 pr-12 py-4 bg-surface-container-highest border border-outline-variant/10 rounded-2xl text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all" />
                    <button type="button" @click="showPassword = !showPassword"
                      class="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors">
                      <span class="material-symbols-outlined text-xl">{{
                        showPassword ? 'visibility' : 'visibility_off'
                      }}</span>
                    </button>
                  </div>
                </div>

                <button type="submit"
                  class="w-full py-4 mt-4 bg-primary text-on-primary rounded-2xl font-headline font-black text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                  <span>Iniciar Sesión</span>
                  <span class="material-symbols-outlined">arrow_forward</span>
                </button>
              </form>

              <div class="relative my-10">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-outline-variant/10"></div>
                </div>
                <div class="relative flex justify-center">
                  <span class="bg-surface px-4 text-xs font-bold text-outline uppercase tracking-[0.2em]">O</span>
                </div>
              </div>

              <button
                class="w-full flex items-center justify-center gap-3 py-4 bg-surface-container-high border border-outline-variant/20 rounded-2xl hover:bg-surface-variant transition-all group">
                <svg class="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4" />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853" />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05" />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335" />
                </svg>
                <span class="text-on-surface font-bold text-sm">Continuar con Google</span>
              </button>

              <p class="text-center mt-8 text-on-surface-variant text-sm">
                ¿No tienes una cuenta?
                <RouterLink to="/register" class="text-primary font-bold hover:underline ml-1">
                  Crear una</RouterLink>
              </p>
            </div>
          </div>
        </div>
      </section>
    </template>
  </HomeLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

import HomeLayout from '@/layouts/HomeLayout.vue'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
const router = useRouter();

const showPassword = ref(false)
const form = reactive({
  email: '',
  password: '',
})

const userStore = useUserStore()

const handleLogin = async () => {
  try {
    const user = await signInWithEmailAndPassword(auth, form.email, form.password)
    if (!user.user.displayName && !user.user.metadata.creationTime) {
      //router.push({ name: 'register' })
      console.log('User has no display name, user deleted')
      return
    }
    userStore.setFullName(user.user.displayName || '')
    userStore.setCreationDate(user.user.metadata?.creationTime || '')
    userStore.setUserId(user.user.uid)
    router.push({ name: 'dashboard' });
  } catch (error) {
    console.log(`Error while trying to login: ${error}`)
  }
}
</script>

<style scoped>
/* Reemplazo de backdrop-filter por colores sólidos o gradientes limpios */
.bg-obsidian-gradient {
  background: radial-gradient(circle at 20% 30%, #151b2d 0%, #0c1324 100%);
}

.font-headline {
  font-family: 'Manrope', sans-serif;
}

.font-body {
  font-family: 'Inter', sans-serif;
}

/* Mejora de los iconos Material */
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 1,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}
</style>
