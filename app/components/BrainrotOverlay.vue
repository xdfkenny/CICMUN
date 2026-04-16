<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const showDoot = ref(false)
const particles = ref<Array<{
  id: number
  char: string
  style: Record<string, string>
}>>([])

let cleanupTimer: NodeJS.Timeout | null = null

const createParticles = () => {
  const count = 35
  const newParticles: typeof particles.value = []

  for (let i = 0; i < count; i++) {
    const char = Math.random() > 0.5 ? '6' : '7'
    const left = Math.random() * 100
    const startY = 80 + Math.random() * 30 // Start from bottom area
    const size = 1.2 + Math.random() * 2.5
    const duration = 2.5 + Math.random() * 2
    const delay = Math.random() * 0.8
    const rotateEnd = -180 + Math.random() * 360
    const scaleEnd = 0.3 + Math.random() * 0.5
    const hue = 40 + Math.random() * 20 // Gold-amber range

    newParticles.push({
      id: i,
      char,
      style: {
        left: `${left}%`,
        top: `${startY}vh`,
        fontSize: `${size}rem`,
        color: `hsl(${hue}, 100%, ${55 + Math.random() * 15}%)`,
        '--duration': `${duration}s`,
        '--delay': `${delay}s`,
        '--rotate-end': `${rotateEnd}deg`,
        '--scale-end': `${scaleEnd}`,
      } as Record<string, string>,
    })
  }

  particles.value = newParticles
}

onMounted(() => {
  // Fire particles immediately
  createParticles()

  // Show "Doot Doot" flash after 1s delay
  setTimeout(() => {
    showDoot.value = true
  }, 1000)

  // Clean everything up after animations complete
  cleanupTimer = setTimeout(() => {
    particles.value = []
    showDoot.value = false
  }, 5000)
})

onUnmounted(() => {
  if (cleanupTimer) clearTimeout(cleanupTimer)
})
</script>

<template>
  <!-- Particle Layer -->
  <span
    v-for="p in particles"
    :key="p.id"
    class="brainrot-particle select-none"
    :style="p.style"
  >
    {{ p.char }}
  </span>

  <!-- Doot Doot Flash -->
  <Transition
    enter-active-class="transition-none"
    leave-active-class="transition-opacity duration-300"
    leave-to-class="opacity-0"
  >
    <div
      v-if="showDoot"
      class="doot-flash select-none"
    >
      <div class="text-center">
        <div class="text-6xl md:text-8xl font-bold font-montserrat tracking-tighter text-amber-300 drop-shadow-lg">
          6 - 7
        </div>
        <div class="text-lg md:text-2xl font-bold uppercase tracking-[0.3em] text-white/80 mt-2">
          Doot Doot 🎵
        </div>
      </div>
    </div>
  </Transition>
</template>
