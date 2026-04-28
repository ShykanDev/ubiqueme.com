<template>
  <HomeLayout>
    <template #main>
      <section
        class="relative min-h-screen w-full flex flex-col md:flex-row bg-[#070b14] font-google-sans overflow-hidden">

        <!-- 📐 BACKGROUND CROSSHATCH (Lightweight) -->
        <div class="absolute inset-0 z-0 opacity-[0.03]"
          style="background-image: repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 40px), repeating-linear-gradient(-45deg, #fff 0, #fff 1px, transparent 0, transparent 40px);">
        </div>

        <!-- 💠 LEFT SIDE: LOGOS & TABS (Desktop) -->
        <div
          class="relative hidden md:flex md:w-1/2 lg:w-3/5 flex-col justify-center p-16 lg:p-24 border-r border-white/5">


          <div class="relative z-10 space-y-10">
            <div class="inline-flex items-center gap-3">
              <div class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                <span class="text-black font-black text-2xl">U</span>
              </div>
              <h2 class="text-4xl font-black text-white tracking-tighter uppercase">Ubiqueme</h2>
            </div>

            <div class="space-y-6">
              <h1 class="text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                ÚNASE A LA<br />
                <span class="text-primary uppercase">Comunidad.</span>
              </h1>
              <p class="text-white/40 text-lg font-medium leading-relaxed max-w-sm">
                Empiece a proteger sus pertenencias y comunicaciones con el estándar de seguridad de Ubiqueme.
              </p>
            </div>

            <div class="grid grid-cols-2 gap-4 max-w-sm">
              <div class="p-4 bg-white/[0.03] border border-white/10 rounded-2xl">
                <span class="material-symbols-outlined text-primary mb-2">shield_check</span>
                <p class="text-[10px] font-black text-white/50 uppercase tracking-widest">Protección Total</p>
              </div>
              <div class="p-4 bg-white/[0.03] border border-white/10 rounded-2xl">
                <span class="material-symbols-outlined text-primary mb-2">bolt</span>
                <p class="text-[10px] font-black text-white/50 uppercase tracking-widest">Aviso al Instante</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 🚀 RIGHT SIDE: REGISTER FORM -->
        <div class="relative grow md:w-1/2 lg:w-2/5 flex items-center justify-center p-8 sm:p-16 z-10">
          <div class="w-full max-w-md space-y-8">

            <div class="md:hidden flex flex-col items-center mb-8 text-center">
              <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6">
                <span class="text-black font-black text-3xl">Ubiqueme</span>
              </div>
              <h2 class="text-2xl font-black text-white uppercase tracking-widest">Registro de Usuario</h2>
            </div>

            <header class="space-y-2">
              <h2 class="text-3xl font-black text-white tracking-tight">Crear su cuenta</h2>
              <p class="text-white/40 text-sm font-medium">Comience a proteger sus pertenencias hoy mismo.</p>
            </header>

            <form @submit.prevent="handleRegister" class="space-y-5">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] ml-1">Nombre
                  Completo</label>
                <input id="name" v-model="form.name" type="text" placeholder="Juan Pérez"
                  class="w-full px-5 py-4 bg-white/5 border border-white/20 hover:border-white/30 rounded-2xl text-white placeholder:text-white/40 focus:border-primary focus:outline-none focus:bg-white/10 transition-all" />
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] ml-1">Correo
                  Electrónico</label>
                <input id="email" v-model="form.email" type="email" placeholder="nombre@dominio.com"
                  class="w-full px-5 py-4 bg-white/5 border border-white/20 hover:border-white/30 rounded-2xl text-white placeholder:text-white/40 focus:border-primary focus:outline-none focus:bg-white/10 transition-all" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] ml-1">Contraseña</label>
                  <input id="password" v-model="form.password" type="password" placeholder="••••••••"
                    class="w-full px-5 py-4 bg-white/5 border border-white/20 hover:border-white/30 rounded-2xl text-white placeholder:text-white/40 focus:border-primary focus:outline-none focus:bg-white/10 transition-all" />
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] ml-1">Confirmar</label>
                  <input id="confirm" v-model="form.confirmPassword" type="password" placeholder="••••••••"
                    class="w-full px-5 py-4 bg-white/5 border border-white/20 hover:border-white/30 rounded-2xl text-white placeholder:text-white/40 focus:border-primary focus:outline-none focus:bg-white/10 transition-all" />
                </div>
              </div>

              <div class="flex items-start gap-3 px-1 py-1">
                <input id="terms" v-model="form.terms" type="checkbox"
                  class="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 accent-primary cursor-pointer focus:ring-primary/20 transition-all" />
                <label for="terms" class="text-[10px] font-bold text-white/40 uppercase tracking-wider leading-relaxed">
                  Acepto los <span
                    class="text-white hover:text-primary cursor-pointer transition-colors">Términos</span> y la <span
                    class="text-white hover:text-primary cursor-pointer transition-colors">Política de
                    Privacidad</span>.
                </label>
              </div>

              <button type="submit"
                class="group w-full h-16 bg-white text-black rounded-2xl font-black text-lg transition-all duration-300 hover:bg-primary hover:shadow-[0_0_20px_rgba(123,208,255,0.4)] active:scale-[0.98] flex items-center justify-center gap-3">
                <span>Registrarme</span>
                <span
                  class="material-symbols-outlined font-black transition-transform group-hover:translate-x-1">app_registration</span>
              </button>
            </form>

            <p class="text-center text-white/30 text-xs font-medium">
              ¿Ya es parte de la red?
              <RouterLink to="/login" class="text-primary font-black hover:text-white ml-2 transition-colors">
                INICIAR SESIÓN</RouterLink>
            </p>
          </div>
        </div>
      </section>
    </template>
  </HomeLayout>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import HomeLayout from '@/layouts/HomeLayout.vue'
import { auth as authFirebase } from '@/firebase'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth'
import { doc, getFirestore, Timestamp, writeBatch } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import { nanoid } from 'nanoid'
import { toast } from 'vue-sonner'

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false,
})

const auth = authFirebase
const router = useRouter()
const db = getFirestore()
const generateRandomId = () => nanoid(10);

const handleRegister = async () => {
  if (form.name === '' || form.email === '' || form.password === '' || form.password !== form.confirmPassword || !form.terms) {
    toast.error('Verifique los campos obligatorios y términos.')
    return
  }

  try {
    const credentials = await createUserWithEmailAndPassword(auth, form.email, form.password);
    const user = credentials.user;
    await updateProfile(user, { displayName: form.name.trim() });
    await sendEmailVerification(user);

    const batch = writeBatch(db);
    batch.set(doc(db, `users/${user.uid}`), {
      uid: user.uid,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: '',
      role: 'user',
      isActive: true,
      isBanned: false,
      banReason: '',
      plan: 'alpha',
      subscriptionStatus: 'active',
      planPurchasedAt: Timestamp.now(),
      planEndDate: null,
      paymentProviderId: '',
      totalQRs: 0,
      preferences: {
        emailNotifications: false,
        smsNotifications: false,
        whatsappNotifications: false
      },
      lastLoginAt: Timestamp.now(),
      createdAt: Timestamp.now(),
    });

    await batch.commit()
    toast.success('Registro completado con éxito')
    router.push({ name: 'login' })
  } catch (error) {
    toast.error(`Error: ${error}`)
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
