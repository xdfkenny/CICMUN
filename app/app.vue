<script setup lang="ts">
let revealObserver: IntersectionObserver | null = null
let mutationObserver: MutationObserver | null = null

const observeRevealElements = () => {
  if (!revealObserver) return

  const revealElements = document.querySelectorAll('.reveal:not(.reveal-visible)')
  revealElements.forEach((el) => revealObserver?.observe(el))
}

// Global scroll reveal observer
onMounted(() => {
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible')
      }
    })
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  })

  observeRevealElements()

  mutationObserver = new MutationObserver(() => {
    observeRevealElements()
  })

  mutationObserver.observe(document.body, { childList: true, subtree: true })
})

onUnmounted(() => {
  mutationObserver?.disconnect()
  revealObserver?.disconnect()
  mutationObserver = null
  revealObserver = null
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
/* Global page transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
