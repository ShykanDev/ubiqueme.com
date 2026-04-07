<script lang="ts" setup>
import ButtonDash from '@/components/user/dashboard/ButtonDash.vue';
import UserDashoardLayout from '@/layouts/UserDashoardLayout.vue';
import { defineAsyncComponent, ref } from 'vue';
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


const homeDash = defineAsyncComponent(() => import('../../components/user/dashboard/async/HomeDash.vue'));
const currentComponent = ref(homeDash);


</script>

<template>
  <UserDashoardLayout>
    <template #main>

      <!--Main Container for Dash-->
      <div class="flex  relative overflo">

        <!-- Left Side -->
        <aside @mouseenter="handleSideBarHover" @mouseleave="handleSideBarLeave"
          :class="{ 'w-2/12': hoverOnSideBar, 'w-16': !hoverOnSideBar }"
          class="absolute z-20 left-0 transition-all duration-300 bg-[#070C16]  h-screen flex flex-col items-center justify-around pt-20">
          <ButtonDash v-for="(btn, index) in dashButtons" :key="btn.name" :name="btn.name" :isHover="hoverOnSideBar"
            :index="index" :icon="btn.icon"></ButtonDash>
        </aside>

        <!-- Right Side -->
        <div class="w-full bg-[#0F1324] h-screen pl-20 pt-20 pr-10 overflow-y-scroll overflow-hidden">
          <component :is="homeDash"></component>

        </div>
      </div>
    </template>
  </UserDashoardLayout>
</template>

<style scoped></style>
