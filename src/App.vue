<script lang="ts" setup>
import 'animate.css'
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
</script>

<template>
  <Toaster position="top-left" richColors />
  <router-view />
</template>

<style scoped></style>
