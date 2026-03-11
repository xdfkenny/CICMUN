<script setup lang="ts">
// Global scroll reveal observer
onMounted(() => {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible')
        // Once revealed, we don't need to observe it anymore
        // unless we want it to hide/show every time
        // observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // Watch for elements with .reveal class
  const revealElements = document.querySelectorAll('.reveal')
  revealElements.forEach((el) => observer.observe(el))

  // Also handle elements added dynamically (e.g., after navigation)
  const mutationObserver = new MutationObserver(() => {
    const newRevealElements = document.querySelectorAll('.reveal:not(.reveal-visible)')
    newRevealElements.forEach((el) => observer.observe(el))
  })

  mutationObserver.observe(document.body, { childList: true, subtree: true })
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
