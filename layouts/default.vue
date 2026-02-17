<script setup lang="ts">
import Navigation from '~/components/Navigation.vue'
import Footer from '~/components/Footer.vue'
import AnnouncementsBanner from '~/components/AnnouncementsBanner.vue'
</script>

<template>
  <div class="min-h-screen bg-background font-sans antialiased flex flex-col">
    <Navigation />
    <AnnouncementsBanner />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </div>
</template>
