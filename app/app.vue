<script setup lang="ts">
let revealObserver: IntersectionObserver | null = null
let mutationObserver: MutationObserver | null = null
const staggerCleanupTimers = new WeakMap<Element, number>()

// .reveal's entrance transition lasts 800ms; +buffer before clearing stagger.
const REVEAL_ENTRANCE_MS = 900

const clearStaggerAfterEntrance = (el: Element) => {
  const previousTimer = staggerCleanupTimers.get(el)
  if (previousTimer) window.clearTimeout(previousTimer)

  // Inline `transition-delay: idx * Nms` staggers the entrance, but if left in
  // place it also delays every later transition (hover lift/shadow), making
  // cards feel unresponsive. Remove it once the entrance has finished.
  const firstDelaySeconds = Number.parseFloat(getComputedStyle(el).transitionDelay.split(',')[0]) || 0
  const timer = window.setTimeout(() => {
    el.style.removeProperty('transition-delay')
    staggerCleanupTimers.delete(el)
  }, firstDelaySeconds * 1000 + REVEAL_ENTRANCE_MS)
  staggerCleanupTimers.set(el, timer)
}

const refreshRevealElements = () => {
  if (!revealObserver) return

  const revealElements = document.querySelectorAll('.reveal:not(.reveal-visible)')
  revealElements.forEach((el) => {
    // Unobserve + observe forces a fresh intersection check. Re-observing alone
    // is a no-op for tracked targets, and Vue can strip `reveal-visible` from
    // reused nodes when it rewrites their class bindings during re-render.
    revealObserver?.unobserve(el)
    revealObserver?.observe(el)
  })
}

// Global scroll reveal observer
onMounted(() => {
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible')
        clearStaggerAfterEntrance(entry.target)
      }
    })
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  })

  refreshRevealElements()

  mutationObserver = new MutationObserver(refreshRevealElements)

  // Watch class changes as well: swapping tab/filter state rewrites the class
  // attribute of reused nodes, which can drop `reveal-visible` without any
  // childList mutation happening.
  mutationObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] })
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
