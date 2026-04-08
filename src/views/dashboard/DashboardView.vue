<script lang="ts" setup>
import ButtonDash from '@/components/user/dashboard/ButtonDash.vue';
import UserDashoardLayout from '@/layouts/UserDashoardLayout.vue';
import { defineAsyncComponent, onMounted, ref, shallowRef } from 'vue';
const hoverOnSideBar = ref(false);

let timeout = null as any;

const handleSideBarHover = () => {
  if (timeout) clearTimeout(timeout);
  hoverOnSideBar.value = true;
}

const handleSideBarLeave = () => {
  if (timeout) clearTimeout(timeout);

  timeout = setTimeout(() => {
    hoverOnSideBar.value = false;
  }, 200);

}

const dashButtons = [
  {
    name: 'Inicio',
    icon: 'co-home',
  },
  {
    name: 'Mis QR',
    icon: 'co-qr-code',
  },
  {
    name: 'Notificaciones',
    icon: 'fa-bell',
  },
  {
    name: 'Configuración',
    icon: 'co-settings',
  },
  {
    name: 'Cerrar Sesión',
    icon: 'io-log-in',
  },
  {
    name: 'Soporte',
    icon: 'bi-question-circle',
  }
]


type ComponentName = 'Inicio' | 'Mis QR' | 'Notificaciones' | 'Configuración' | 'Cerrar Sesión' | 'Soporte';

const componentsMap: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  'Inicio': defineAsyncComponent(() => import('../../components/user/dashboard/async/HomeDash.vue')),
  'Mis QR': defineAsyncComponent(() => import('../../components/user/dashboard/QRDash/MyQrDash.vue')),
}
const currentComponent = shallowRef(componentsMap['Inicio']);

const changeComponent = (component: ComponentName) => {
  currentComponent.value = componentsMap[component] ?? componentsMap['Inicio']
}


</script>

<template>
  <UserDashoardLayout>
    <template #main>

      <!--Main Container for Dash-->
      <div class="flex  relative ">

        <!-- Left Side -->
        <aside @mouseenter="handleSideBarHover" @mouseleave="handleSideBarLeave"
          :class="{ 'w-2/12': hoverOnSideBar, 'w-16': !hoverOnSideBar }"
          class="absolute z-20 left-0 transition-all duration-300 bg-[#070C16]/95  h-screen flex flex-col items-center justify-around pt-20">
          <ButtonDash @click="changeComponent(btn.name as ComponentName)" v-for="(btn, index) in dashButtons"
            :key="btn.name" :name="btn.name" :isHover="hoverOnSideBar" :index="index" :icon="btn.icon"
            :active="componentsMap[btn.name] === currentComponent"></ButtonDash>
        </aside>

        <!-- Right Side -->
        <div class="w-full bg-[#0F1324] h-screen pl-20 pt-24 pr-10 overflow-y-scroll overflow-hidden scrollbar-hide ">
          <component :is="currentComponent"></component>
        </div>
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
