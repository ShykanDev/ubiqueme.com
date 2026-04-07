<script lang="ts" setup>

</script>

<template>
  <section class="mb-20 max-w-4xl">
    <h1 class="text-6xl font-extrabold font-headline tracking-tighter text-on-surface mb-6 leading-none">
      Stay reachable.<br />
      <span class="bg-linear-to-r from-primary to-on-primary-container bg-clip-text text-transparent">Stay
        protected.</span>
    </h1>
    <p class="text-xl text-on-surface-variant font-medium leading-relaxed max-w-2xl">
      Let anyone notify you instantly without exposing your personal information. Your privacy is our priority.
    </p>
  </section>
  <!-- Welcome Banner -->
  <div class="mb-12 flex justify-between items-end">
    <div>
      <p class="text-primary font-semibold tracking-widest uppercase text-xs mb-2">Workspace Overview</p>
      <h2 class="text-4xl font-bold font-headline text-on-surface">Welcome back, Alexander</h2>
    </div>
    <button
      class="flex items-center gap-2 px-8 py-4 rounded-lg bg-linear-to-br from-primary to-on-primary-container text-on-primary font-bold shadow-xl shadow-primary/10 hover:brightness-110 transition-all active:scale-95">
      <span class="material-symbols-outlined">add</span>
      Add New QR
    </button>
  </div>
  <!-- Bento Grid Stats -->
  <div class="grid grid-cols-12 gap-6 mb-16">
    <div
      class="col-span-12 md:col-span-3 surface-container rounded-xl p-8 border border-white/5 relative overflow-hidden group">
      <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform duration-500">
        <span class="material-symbols-outlined text-[120px]">qr_code_scanner</span>
      </div>
      <p class="text-on-surface-variant text-sm font-medium mb-1">Total QR Codes</p>
      <p class="text-4xl font-bold font-headline text-on-surface mb-4">24</p>
      <div class="flex items-center text-xs text-primary font-semibold">
        <span class="material-symbols-outlined text-sm mr-1">trending_up</span>
        +12% from last month
      </div>
    </div>
    <div
      class="col-span-12 md:col-span-3 surface-container rounded-xl p-8 border border-white/5 relative overflow-hidden group">
      <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform duration-500">
        <span class="material-symbols-outlined text-[120px]">notifications_active</span>
      </div>
      <p class="text-on-surface-variant text-sm font-medium mb-1">Alerts Received</p>
      <p class="text-4xl font-bold font-headline text-on-surface mb-4">182</p>
      <div class="flex items-center text-xs text-primary font-semibold">
        <span class="material-symbols-outlined text-sm mr-1">bolt</span>
        4 new today
      </div>
    </div>
    <div
      class="col-span-12 md:col-span-3 surface-container rounded-xl p-8 border border-white/5 relative overflow-hidden group">
      <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform duration-500">
        <span class="material-symbols-outlined text-[120px]">verified</span>
      </div>
      <p class="text-on-surface-variant text-sm font-medium mb-1">Active QRs</p>
      <p class="text-4xl font-bold font-headline text-on-surface mb-4">19</p>
      <div class="flex items-center text-xs text-on-surface-variant font-medium">
        <span class="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></span>
        Live monitoring active
      </div>
    </div>
    <div
      class="col-span-12 md:col-span-3 surface-container rounded-xl p-8 border border-white/5 relative overflow-hidden group">
      <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform duration-500">
        <span class="material-symbols-outlined text-[120px]">history</span>
      </div>
      <p class="text-on-surface-variant text-sm font-medium mb-1">Response Rate</p>
      <p class="text-4xl font-bold font-headline text-on-surface mb-4">98%</p>
      <div class="flex items-center text-xs text-primary font-semibold">
        <span class="material-symbols-outlined text-sm mr-1">check_circle</span>
        Excellent health
      </div>
    </div>
  </div>
</template>

<style scoped></style>
