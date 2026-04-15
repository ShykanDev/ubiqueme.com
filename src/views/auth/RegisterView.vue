<template>
  <HomeLayout>
    <template #main>
      <section
        class="min-h-screen w-full flex flex-col md:flex-row bg-surface font-body overflow-hidden pt-20 font-google-sans">
        <div class="grow md:w-1/2 lg:w-2/5 flex items-center justify-center p-6 sm:p-12 bg-surface order-2 md:order-1">
          <div class="w-full max-w-md">
            <div class="md:hidden flex flex-col items-center mb-10 text-center">
              <div
                class="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-on-primary font-google-sans font-black text-2xl mb-4 shadow-xl shadow-primary/20">
                U
              </div>
              <h2 class="font-google-sans font-bold text-3xl text-on-surface">Ubiqueme</h2>
              <p class="text-on-surface-variant mt-2">Únete a la comunidad de curaduría digital</p>
            </div>

            <div
              class="bg-surface-container-low md:bg-transparent p-8 md:p-0 rounded-3xl md:rounded-none border md:border-none border-outline-variant/10 shadow-2xl md:shadow-none">
              <div class="hidden md:block mb-8">
                <h2 class="font-google-sans text-4xl font-bold text-on-surface mb-3 text-balance">
                  Cree su cuenta
                </h2>
                <p class="text-on-surface-variant">
                  Comience a mantenerse comunicado, seguro y privado.
                </p>
              </div>

              <form @submit.prevent="handleRegister" class="space-y-4">
                <div class="space-y-1.5">
                  <label class="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] ml-1"
                    for="name">Nombre Completo</label>
                  <div class="group relative">
                    <span
                      class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-xl">person</span>
                    <input id="name" v-model="form.name" type="text" placeholder="Juan Pérez"
                      class="w-full pl-12 pr-4 py-3.5 bg-surface-container-highest border border-outline-variant/10 rounded-2xl text-on-surface placeholder:text-outline/40 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all" />
                  </div>
                </div>

                <div class="space-y-1.5">
                  <label class="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] ml-1"
                    for="email">Correo Electrónico</label>
                  <div class="group relative">
                    <span
                      class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-xl">mail</span>
                    <input id="email" v-model="form.email" type="email" placeholder="nombre@dominio.com"
                      class="w-full pl-12 pr-4 py-3.5 bg-surface-container-highest border border-outline-variant/10 rounded-2xl text-on-surface placeholder:text-outline/40 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all" />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] ml-1"
                      for="password">Contraseña</label>
                    <div class="group relative">
                      <span
                        class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-xl">lock</span>
                      <input id="password" v-model="form.password" type="password" placeholder="••••••••"
                        class="w-full pl-12 pr-4 py-3.5 bg-surface-container-highest border border-outline-variant/10 rounded-2xl text-on-surface text-sm placeholder:text-outline/40 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all" />
                    </div>
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] ml-1"
                      for="confirm">Confirmar Contraseña</label>
                    <div class="group relative">
                      <span
                        class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-xl">lock_reset</span>
                      <input id="confirm" v-model="form.confirmPassword" type="password" placeholder="••••••••"
                        class="w-full pl-12 pr-4 py-3.5 bg-surface-container-highest border border-outline-variant/10 rounded-2xl text-on-surface text-sm placeholder:text-outline/40 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all" />
                    </div>
                  </div>
                </div>

                <div class="flex items-start gap-3 px-1 py-2">
                  <input id="terms" v-model="form.terms" type="checkbox"
                    class="mt-1 w-4 h-4 rounded border-outline-variant/30 bg-surface-container-highest text-primary focus:ring-primary/20" />
                  <label for="terms" class="text-xs text-on-surface-variant leading-relaxed">
                    Acepto los
                    <a href="#" class="text-primary font-bold hover:underline">Términos de Servicio</a>
                    y la
                    <a href="#" class="text-primary font-bold hover:underline">Política de Privacidad</a>.
                  </label>
                </div>

                <button type="submit"
                  class="w-full py-4 mt-2 bg-primary text-on-primary rounded-2xl font-google-sans font-black text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                  <span>Crear Cuenta</span>
                  <span class="material-symbols-outlined">person_add</span>
                </button>
              </form>

              <div class="relative my-8">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-outline-variant/10"></div>
                </div>
                <div class="relative flex justify-center">
                  <span class="bg-surface px-4 text-[10px] font-black text-outline uppercase tracking-[0.2em]">O</span>
                </div>
              </div>

              <p class="text-center mt-8 text-on-surface-variant text-sm">
                ¿Ya tiene una cuenta?
                <RouterLink to="/login" class="text-primary font-bold hover:underline ml-1">
                  Inicia sesión</RouterLink>
              </p>
            </div>
          </div>
        </div>

        <div
          class="hidden md:flex md:w-1/2 lg:w-3/5 bg-obsidian-gradient relative items-start justify-center p-12 lg:p-24 order-1 md:order-2 border-l border-outline-variant/10">
          <div class="absolute inset-0 opacity-20">
            <div class="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[100px]"></div>
            <div
              class="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-secondary-container/10 rounded-full blur-[80px]">
            </div>
          </div>

          <div class="relative z-10 max-w-xl">
            <div class="mb-10 inline-flex items-center gap-3">
              <div
                class="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-xl shadow-primary/30">
                <span class="material-symbols-outlined font-bold text-2xl">shield_lock</span>
              </div>
              <span class="font-google-sans font-black text-3xl tracking-tighter text-on-surface">Ubiqueme</span>
            </div>

            <h1
              class="font-google-sans text-5xl lg:text-7xl font-extrabold tracking-tight text-on-surface leading-none mb-8">
              Comunicación <span class="text-primary">segura.</span>
            </h1>

            <p class="text-on-surface-variant font-poppins text-xl lg:text-md leading-relaxed mb-12">
              Reciba notificaciones en tiempo real via
              <span v-for="via in ['SMS', 'WhatsApp', 'o Correo']" :key="via"
                class="text-primary font-bold hover:underline ml-1">{{ via }}</span>
            </p>

            <div class="flex flex-wrap gap-3">
              <div v-for="tag in ['Seguro', 'Notificaciones en Tiempo Real', 'Privado']" :key="tag"
                class="px-4 py-2 rounded-full bg-[#001029] border-2 border-double border-sky-400 text-xs font-bold text-slate-300 tracking-wide">
                {{ tag }}
              </div>
            </div>
          </div>

          <div
            class="absolute bottom-12 right-12 lg:right-24 flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-outline">
            <span class="text-on-surface-variant/40">© 2026 Ubiqueme Inc.</span>
            <a href="#" class="hover:text-primary transition-colors">Privacidad</a>
            <a href="#" class="hover:text-primary transition-colors">Términos</a>
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
import { collection, doc, getFirestore, Timestamp, writeBatch } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import { nanoid } from 'nanoid'
const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false,
})

const auth = authFirebase
const router = useRouter()

const validateForm = () => {
  if (form.name === '') {
    return false
  }
  if (form.email === '') {
    return false
  }
  if (form.password === '') {
    return false
  }
  if (form.confirmPassword === '') {
    return false
  }
  if (form.terms === false) {
    return false
  }
  return true
}

//generate random ID
const generateRandomId = () => nanoid(10);

const db = getFirestore()
const handleRegister = async () => {
  if (!validateForm()) {
    alert('Todos los campos son obligatorios')
    return
  }

  let user
  try {
    const credentials = await createUserWithEmailAndPassword(auth, form.email, form.password);
    user = credentials.user;
    await updateProfile(user, { displayName: form.name.trim() });
    await sendEmailVerification(user);
    const userDoc = doc(db, `users/${user.uid}`);
    const batch = writeBatch(db);

    //Set user data
    batch.set(userDoc, {
      uid: user.uid,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: '',
      isActive: true,
      isBanned: false,
      banReason: '',
      plan: 'none',
      planPurchasedAt: null,
      planEndDate: null,
      createdAt: Timestamp.now(),
    })

    //Set first example user QR (for DEMO)
    const userQrDoc = doc(db, `users/${user.uid}/qrs/demoid1`)
    batch.set(userQrDoc, {
      name: 'MacBook Pro',
      isActive: true,
      isBanned: false,
      banReason: '',
      status: 'Active',
      scans: 0,
      lastScan: '',
      planPurchasedAt: null,
      planEndDate: null,
      id: generateRandomId(),
      createdAt: Timestamp.now(),
    })

    //Set second example user QR (for DEMO)
    const secondUserQrDoc = doc(db, `users/${user.uid}/qrs/demoid2`)
    batch.set(secondUserQrDoc, {
      name: 'Bicicleta ',
      isActive: true,
      isBanned: false,
      banReason: '',
      status: 'Active',
      scans: 0,
      lastScan: '',
      planPurchasedAt: null,
      planEndDate: null,
      id: generateRandomId(),
      createdAt: Timestamp.now(),
    })

    //Set third example user QR (for DEMO)
    const thirdUserQrDoc = doc(db, `users/${user.uid}/qrs/demoid3`)
    batch.set(thirdUserQrDoc, {
      name: 'Motocicleta',
      isActive: true,
      isBanned: false,
      banReason: '',
      status: 'Active',
      scans: 0,
      lastScan: '',
      planPurchasedAt: null,
      planEndDate: null,
      id: generateRandomId(),
      createdAt: Timestamp.now(),
    })


    await batch.commit()
    console.log(`User ${user.uid} created successfully`)
    console.log('Usuario creado exitosamente');
    router.push({ name: 'login' })
  } catch (error) {
    if (user) await user.delete()
    console.log(`Error while creating user: ${error}`)
  }
}
</script>

<style scoped>
.bg-obsidian-gradient {
  background: radial-gradient(circle at 80% 20%, #151b2d 0%, #0c1324 100%);
}

.font-google-sans {
  font-family: 'Manrope', sans-serif;
}

.font-body {
  font-family: 'Inter', sans-serif;
}

.material-symbols-outlined {
  font-variation-settings:
    'FILL' 1,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}

/* Custom Checkbox focus */
input[type='checkbox']:focus {
  box-shadow: none;
}
</style>
