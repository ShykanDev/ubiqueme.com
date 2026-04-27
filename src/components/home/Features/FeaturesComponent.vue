<script lang="ts" setup>
import FeatureCard from './FeatureCard.vue'

const features = [
  {
    icon: 'visibility_off',
    title: 'Contacto anónimo',
    description:
      'Permita que cualquier persona se comunique con usted sin revelar su información personal.',
  },
  {
    icon: 'warning',
    title: 'Alertas inmediatas',
    description: 'Reciba notificaciones al instante cuando alguien escanee su código QR.',
  },
  {
    icon: 'grid_view',
    title: 'Múltiples códigos QR',
    description: 'Gestione todos sus códigos QR y propiedades desde un solo panel.',
  },
  {
    icon: 'chat_bubble',
    title: 'Mensajes predefinidos',
    description: 'Controle los mensajes que pueden enviarle para evitar spam.',
  },
  {
    icon: 'block',
    title: 'Desactivar en cualquier momento',
    description: 'Suspenda o desactive sus códigos QR cuando lo necesite.',
  },
  {
    icon: 'verified_user',
    title: 'Privado y seguro',
    description: 'Toda la información y comunicación se mantiene protegida.',
  },
]
</script>

<template>
  <section class="pb-5 bg-[#0a0c10] px-8 md:px-24 mx-auto">
    <div class="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
      <div class="max-w-xl">
        <h2 class="font-headline text-4xl font-bold mb-6 text-white">
          Diseñado para la seguridad, construido para la tranquilidad.
        </h2>
        <p class="text-on-surface-variant text-lg">
          Cada función está diseñada para mantener su privacidad mientras lo mantiene perfectamente
          localizable en los momentos que más importan.
        </p>
      </div>
      <div class="pb-2"></div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <FeatureCard v-for="feature in features" :key="feature.title" :feature="feature" />
    </div>
  </section>
</template>

<style scoped></style>
