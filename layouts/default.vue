<script setup lang="ts">
import Navigation from '~/components/Navigation.vue'
</script>

<template>
  <div class="min-h-screen bg-background font-sans antialiased">
    <Navigation />
    <slot />
  </div>
</template>
