<script lang="ts" setup>

</script>

<template>
  <div>
    <!-- TopNavBar -->
    <nav class="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-xl shadow-2xl shadow-slate-950/50">
      <div class="flex justify-between items-center h-20 px-8 md:px-24 w-full max-w-screen-2xl mx-auto">

        <!-- Logo -->
        <div class="text-xl font-bold text-slate-100 font-headline tracking-tight">
          Ubiqueme
        </div>

        <!-- Menu -->
        <div class="hidden md:flex items-center space-x-10 font-['Manrope'] tracking-tight">
          <a class="text-slate-400 hover:text-sky-300 transition-colors duration-300" href="#">Product</a>
          <a class="text-sky-400 font-semibold hover:text-sky-300 transition-colors duration-300" href="#">How it
            Works</a>
          <a class="text-slate-400 hover:text-sky-300 transition-colors duration-300" href="#">Security</a>
          <a class="text-slate-400 hover:text-sky-300 transition-colors duration-300" href="#">Pricing</a>
        </div>

        <!-- Buttons -->
        <div class="flex items-center space-x-6">
          <button class="text-slate-400 font-['Manrope'] hover:text-slate-100 transition-all text-sm font-semibold">
            Sign In
          </button>
          <button
            class="bg-sky-400 text-on-primary-fixed font-['Manrope'] px-6 py-2.5 rounded-full text-sm font-bold hover:opacity-80 active:scale-95 transition-all">
            Get Started
          </button>
        </div>

      </div>
    </nav>

    <main>
      <slot name="main"></slot>
    </main>

    <footer>

    </footer>
  </div>
</template>

<style scoped></style>
