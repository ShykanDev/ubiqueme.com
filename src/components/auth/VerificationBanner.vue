<template>
  <div class="w-full bg-primary/5 border border-primary/20 rounded-3xl p-8 flex flex-col items-center text-center space-y-5 animate-fade-in">
    <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-[0_0_30px_rgba(123,208,255,0.15)]">
      <span class="material-symbols-outlined text-primary text-3xl">mark_email_unread</span>
    </div>
    
    <div class="space-y-2">
      <h3 class="text-white font-black text-2xl tracking-tight">Sólo un paso más</h3>
      <p class="text-white/60 text-sm font-medium leading-relaxed px-2">
        Por favor verifique su cuenta haciendo clic en el enlace que enviamos a su correo. Si no lo encuentra, recuerde revisar su carpeta de spam.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Este componente es puramente visual
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
