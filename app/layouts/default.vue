<script setup lang="ts">
import Navigation from '~/components/Navigation.vue'
import Footer from '~/components/Footer.vue'
import { siteConfig } from '~/config/siteConfig'

const route = useRoute()

// Canonical URL always points at the official domain (cicmun.qzz.io), even when
// the page is served from a preview/workers.dev origin.
useHead({
  link: [
    {
      rel: 'canonical',
      href: computed(() => {
        const base = siteConfig.siteUrl.replace(/\/+$/, '')
        const path = route.path === '/' ? '/' : route.path.replace(/\/+$/, '')
        return `${base}${path}`
      }),
    },
  ],
})
</script>

<template>
  <div class="min-h-screen bg-background font-sans antialiased flex flex-col">
    <Navigation />
    <main id="main-content" class="flex-1">
      <slot />
    </main>
    <Footer />
  </div>
</template>
