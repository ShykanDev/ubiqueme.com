<script lang="ts" setup>
import UserDashoardLayout from '@/layouts/UserDashoardLayout.vue';
import { ref } from 'vue';
const hoverOnSideBar = ref(false);


</script>

<template>
  <UserDashoardLayout>
    <template #main>
      <div @mouseenter="hoverOnSideBar = true" @mouseleave="hoverOnSideBar = false" class="flex pt-20">
        <!-- Left Side -->
        <aside :class="{ 'bg-orange-600! h-screen': hoverOnSideBar }" class="w-1/4 bg-red-600 h-screen">

        </aside>
        <!-- Right Side -->
        <div class="w-3/4 bg-blue-600 h-screen">

        </div>
      </div>
    </template>
  </UserDashoardLayout>
</template>

<style scoped></style>
