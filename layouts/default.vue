<script setup lang="ts">
import Navigation from '~/components/Navigation.vue'
import Footer from '~/components/Footer.vue'
</script>

<template>
  <div class="min-h-screen bg-background font-sans antialiased flex flex-col">
    <Navigation />
    <div class="flex-1">
      <slot />
    </div>
    <Footer />
  </div>
</template>
