<template>
  <HomeLayout>
    <template #main>
      <section class="relative min-h-screen w-full flex flex-col md:flex-row bg-[#070b14] font-google-sans overflow-hidden">
        
        <!-- 📐 BACKGROUND DOT MATRIX (Lightweight) -->
        <div class="absolute inset-0 z-0 opacity-[0.05]" 
             style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 24px 24px;">
        </div>
        
        <!-- 💠 LEFT SIDE: BRAND NARRATIVE (Desktop) -->
        <div class="relative hidden md:flex md:w-1/2 lg:w-3/5 flex-col justify-center p-16 lg:p-24 border-r border-white/5">
          <div class="absolute top-0 left-0 w-full h-[300px] bg-primary/10 blur-[150px] rounded-full pointer-events-none"></div>
          
          <div class="relative z-10 space-y-8">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-lg border border-primary/20">
              <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span class="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Security Protocol v4.0</span>
            </div>

            <h1 class="text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter">
              ACCESS<br />
              <span class="text-primary">PORTAL.</span>
            </h1>

            <div class="max-w-md space-y-6">
              <p class="text-white/40 text-lg font-medium leading-relaxed">
                Ingresa a tu cuenta de Ubiqueme para gestionar tus códigos QR y protegidos.
              </p>
              
              <div class="flex gap-4 items-center pt-4">
                <div class="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                   <span class="material-symbols-outlined text-white/50">key</span>
                </div>
                <div class="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                   <span class="material-symbols-outlined text-white/50">shield</span>
                </div>
                <div class="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                   <span class="material-symbols-outlined text-white/50">fingerprint</span>
                </div>
              </div>
            </div>
          </div>

          <!-- FOOTER LOGO -->
          <div class="absolute bottom-16 left-16 lg:left-24 flex items-center gap-4 opacity-50">
             <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <span class="text-black font-black text-xl">U</span>
             </div>
             <span class="font-black text-xl tracking-[0.2em] text-white uppercase">Ubiqueme</span>
          </div>
        </div>

        <!-- 🚀 RIGHT SIDE: LOGIN FORM -->
        <div class="relative grow md:w-1/2 lg:w-2/5 flex items-center justify-center p-8 sm:p-16 z-10">
          <div class="w-full max-w-sm space-y-10">
            
            <div class="md:hidden flex flex-col items-center mb-10 text-center">
               <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(123,208,255,0.3)]">
                  <span class="text-black font-black text-3xl">U</span>
               </div>
               <h2 class="text-2xl font-black text-white uppercase tracking-widest">Ubiqueme</h2>
            </div>

            <header class="space-y-2">
              <h2 class="text-3xl font-black text-white tracking-tight">Bienvenido</h2>
              <p class="text-white/40 text-sm font-medium">Credenciales de acceso requeridas.</p>
            </header>

            <form @submit.prevent="handleLogin" class="space-y-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Correo Electrónico</label>
                <div class="group relative">
                  <input id="email" v-model="form.email" type="email" placeholder="nombre@dominio.com"
                    class="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:border-primary focus:outline-none focus:bg-white/[0.05] transition-all" />
                </div>
              </div>

              <div class="space-y-2">
                <div class="flex justify-between items-center px-1">
                  <label class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Contraseña</label>
                  <a href="#" class="text-[10px] font-black text-primary hover:text-white uppercase tracking-widest">Recuperar</a>
                </div>
                <div class="group relative">
                  <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    class="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:border-primary focus:outline-none focus:bg-white/[0.05] transition-all" />
                  <button type="button" @click="showPassword = !showPassword"
                    class="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                    <span class="material-symbols-outlined text-xl">{{ showPassword ? 'visibility' : 'visibility_off' }}</span>
                  </button>
                </div>
              </div>

              <button type="submit"
                class="group w-full h-16 bg-white text-black rounded-2xl font-black text-lg transition-all duration-300 hover:bg-primary active:scale-[0.98] flex items-center justify-center gap-3">
                <span>Entrar</span>
                <span class="material-symbols-outlined font-black transition-transform group-hover:translate-x-1">login</span>
              </button>
            </form>

            <div class="relative py-4">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-white/5"></div>
              </div>
              <div class="relative flex justify-center">
                <span class="bg-[#070b14] px-4 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">O CONECTAR CON</span>
              </div>
            </div>

            <button
              class="w-full flex items-center justify-center gap-3 h-14 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all font-bold text-sm text-white">
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" opacity="0.6" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff" opacity="0.4" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" opacity="0.8" />
              </svg>
              Cuenta de Google
            </button>

            <p class="text-center text-white/30 text-xs font-medium">
              ¿Sin credenciales todavía?
              <RouterLink to="/register" class="text-primary font-black hover:text-white ml-2 transition-colors">
                CREAR CUENTA</RouterLink>
            </p>
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
.font-google-sans {
  font-family: 'Google Sans', sans-serif;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Custom smooth easing for interactions */
button {
  transition: all 0.2s ease;
}
</style>
