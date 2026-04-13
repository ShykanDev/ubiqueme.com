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
  }, 0)
}

const dashButtons = [
  {
    name: 'Inicio',
    icon: 'co-home',
    iconActive: 'md-home-round',
  },
  {
    name: 'Mis QR',
    icon: 'co-qr-code',
    iconActive: 'md-qrcodescanner-round',
  },
  {
    name: 'Notificaciones',
    icon: 'md-notificationsnone-outlined',
    iconActive: 'fa-bell',
  },
  {
    name: 'Configuración',
    icon: 'co-settings',
    iconActive: 'md-settings',
  },
  {
    name: 'Cerrar Sesión',
    icon: 'io-log-in',
    iconActive: 'ri-logout-box-r-line',
  },
  {
    name: 'Soporte',
    icon: 'bi-question-circle',
    iconActive: 'md-help-sharp',
  },
]

type ComponentName =
  | 'Inicio'
  | 'Mis QR'
  | 'Notificaciones'
  | 'Configuración'
  | 'Cerrar Sesión'
  | 'Soporte'

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
  Notificaciones: withLoader(
    () => import('../../components/user/dashboard/notifications/NotificationsDash.vue'),
  ),
  Configuración: withLoader(
    () => import('../../components/user/dashboard/settings/SettingsDash.vue'),
  ),
  Soporte: defineAsyncComponent(
    () => import('../../components/user/dashboard/support/SupportDash.vue'),
  ),
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
      <!--Main Container for Dash-->
      <div class="flex relative">
        <!-- Sidebar -->
        <aside @mouseenter="handleSideBarHover" @mouseleave="handleSideBarLeave"
          :class="{ 'w-[200px]': hoverOnSideBar, 'w-20': !hoverOnSideBar }"
          class="absolute z-20 left-0 transition-all duration-300 h-screen flex flex-col items-center justify-around pt-14 overflow-hidden"
          style="
            background: rgba(7, 12, 22, 0.97);
            border-right: 1px solid rgba(255, 255, 255, 0.04);
          ">
          <!-- línea decorativa lateral interna -->
          <div class="absolute right-0 top-0 bottom-0 w-px pointer-events-none" style="
              background: linear-gradient(
                to bottom,
                transparent,
                rgba(99, 140, 255, 0.12) 40%,
                rgba(99, 140, 255, 0.12) 60%,
                transparent
              );
            "></div>

          <ButtonDash @click="changeComponent(btn.name as ComponentName)" v-for="(btn, index) in dashButtons"
            :key="btn.name" :name="btn.name" :isHover="hoverOnSideBar" :index="index" :icon="btn.icon"
            :iconActive="btn.iconActive" :active="componentsMap[btn.name] === currentComponent" />
        </aside>

        <!-- Content Side -->
        <section
          class="w-full bg-[#0F1324] h-screen pl-24! pt-24! pr-10! overflow-y-scroll overflow-hidden scrollbar-hide">
          <component :is="currentComponent"></component>
        </section>
      </div>
    </template>
  </UserDashoardLayout>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}
</style>
