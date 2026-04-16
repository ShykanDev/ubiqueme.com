<script lang="ts" setup>
import ButtonDash from '@/components/user/dashboard/ButtonDash.vue'
import UserDashoardLayout from '@/layouts/UserDashoardLayout.vue'
import MainLoader from '@/components/ui/MainLoader.vue'
import { useAuth } from '@/handleAuth'
import { defineAsyncComponent, ref, shallowRef } from 'vue'

const hoverOnSideBar = ref(false)
let timeout = null as any

const handleSideBarHover = () => {
  if (timeout) clearTimeout(timeout)
  hoverOnSideBar.value = true
}

const handleSideBarLeave = () => {
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => {
    hoverOnSideBar.value = false
  }, 50)
}

const dashButtons = [
  { name: 'Inicio', icon: 'co-home', iconActive: 'md-home-round' },
  { name: 'Mis QR', icon: 'co-qr-code', iconActive: 'md-qrcodescanner-round' },
  { name: 'Notificaciones', icon: 'md-notificationsnone-outlined', iconActive: 'fa-bell' },
  { name: 'Configuración', icon: 'co-settings', iconActive: 'md-settings' },
  { name: 'Cerrar Sesión', icon: 'io-log-in', iconActive: 'ri-logout-box-r-line' },
  { name: 'Soporte', icon: 'bi-question-circle', iconActive: 'md-help-sharp' },
]

type ComponentName = 'Inicio' | 'Mis QR' | 'Notificaciones' | 'Configuración' | 'Cerrar Sesión' | 'Soporte'

const withLoader = (viewPath: () => Promise<any>) => {
  return defineAsyncComponent({
    loader: viewPath,
    loadingComponent: MainLoader,
    delay: 200,
  })
}

const componentsMap: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  Inicio: withLoader(() => import('../../components/user/dashboard/async/HomeDash.vue')),
  'Mis QR': withLoader(() => import('../../components/user/dashboard/QRDash/MyQrDash.vue')),
  Notificaciones: withLoader(() => import('../../components/user/dashboard/notifications/NotificationsDash.vue')),
  Configuración: withLoader(() => import('../../components/user/dashboard/settings/SettingsDash.vue')),
  Soporte: defineAsyncComponent(() => import('../../components/user/dashboard/support/SupportDash.vue')),
}

const currentComponent = shallowRef(componentsMap['Inicio'])
const { handleLogout } = useAuth()

const changeComponent = (component: ComponentName) => {
  if (component == 'Cerrar Sesión') {
    handleLogout()
    return
  }
  currentComponent.value = componentsMap[component] ?? componentsMap['Inicio']
}
</script>

<template>
  <UserDashoardLayout>
    <template #main>
      <div class="flex relative min-h-screen bg-[#070b14] overflow-hidden font-google-sans">

        <!-- 📐 BACKGROUND GRID (Lightweight) -->
        <div class="absolute inset-x-20 inset-y-0 z-0 opacity-[0.02]"
          style="background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 50px 50px;">
        </div>

        <!-- 🚀 SIDEBAR (OVERLAY MODE) -->
        <aside @mouseenter="handleSideBarHover" @mouseleave="handleSideBarLeave"
          :class="{ 'w-[260px]': hoverOnSideBar, 'w-24': !hoverOnSideBar }"
          class="absolute left-0 top-0 z-30 pt-20 transition-[width] duration-300 h-screen flex flex-col items-center py-10 border-r border-white/5 bg-[#070b14] will-change-[width]">

          <div class="mb-12">
            <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-2xl">
              <span class="text-black font-black text-xl">U</span>
            </div>
          </div>

          <div class="flex-1 w-full space-y-2 px-4 overflow-hidden justify-evenly h-full flex flex-col">
            <ButtonDash @click="changeComponent(btn.name as ComponentName)" v-for="(btn, index) in dashButtons"
              :key="btn.name" :name="btn.name" :isHover="hoverOnSideBar" :index="index" :icon="btn.icon"
              :iconActive="btn.iconActive" :active="componentsMap[btn.name] === currentComponent" />
          </div>

          <div class="mt-auto opacity-20 text-[8px] font-black uppercase tracking-[0.3em] font-mono whitespace-nowrap"
            v-if="hoverOnSideBar">
            System Terminal v2.4
          </div>
        </aside>

        <!-- 🚀 MAIN CONTENT AREA (FIXED OFFSET) -->
        <div class="relative z-10 flex-1 h-screen overflow-y-auto scrollbar-hide p-8 md:p-12 lg:p-16 ml-24 pt-24!">
          <header class="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <div class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                <span class="text-[9px] font-black text-primary uppercase tracking-[0.4em]">Protocol Linked</span>
              </div>
              <h1 class="text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase font-google-sans">Panel
                de Control</h1>
            </div>

            <div class="flex gap-4">
              <div class="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-1 min-w-[120px] ">
                <span class="text-[8px] font-black text-white/30 uppercase tracking-widest">Global Status</span>
                <span class="text-xs font-bold text-green-400">OPTIMIZED</span>
              </div>
            </div>
          </header>

          <section class="max-w-6xl mx-auto">
            <component :is="currentComponent"></component>
          </section>
        </div>
      </div>
    </template>
  </UserDashoardLayout>
</template>

<style scoped>
.font-google-sans {
  font-family: 'Google Sans', sans-serif;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
