<script setup lang="ts">
// TEMPORARY: full-screen "setting up" block for the new school year.
// To remove the block, delete the <SetupOverlay /> usage in app/layouts/default.vue
// (and optionally this file).
onMounted(() => {
  document.documentElement.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#7F1D1D] via-[#DC2628] to-[#EF4444] px-6">
    <div class="max-w-xl text-center">
      <p class="text-sm font-medium uppercase tracking-[0.3em] text-white/70">
        CICMUN
      </p>
      <h1 class="mt-4 text-3xl font-bold text-white sm:text-4xl">
        We are currently preparing everything for the upcoming school year
      </h1>
      <p class="mt-4 text-white/80">
        Please check back soon.
      </p>
    </div>
  </div>
</template>
