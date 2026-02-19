<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  targetDate: {
    type: String,
    required: true
  }
})

const now = ref(0)
let interval: ReturnType<typeof setInterval> | null = null

const timeRemaining = computed(() => {
  const target = new Date(props.targetDate).getTime()
  const distance = Math.max(0, target - now.value)

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000)
  }
})

const startTimer = () => {
  if (interval) clearInterval(interval)
  now.value = Date.now()
  interval = setInterval(() => {
    now.value = Date.now()
  }, 1000)
}

onMounted(() => {
  startTimer()
})

watch(() => props.targetDate, () => {
  if (typeof window !== 'undefined') {
    startTimer()
  }
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 text-center">
    <div class="bg-white/10 backdrop-blur-md rounded-lg p-4">
      <div class="text-3xl md:text-4xl lg:text-5xl font-bold font-montserrat">{{ timeRemaining.days }}</div>
      <div class="text-sm uppercase tracking-wider opacity-80">Days</div>
    </div>
    <div class="bg-white/10 backdrop-blur-md rounded-lg p-4">
      <div class="text-3xl md:text-4xl lg:text-5xl font-bold font-montserrat">{{ timeRemaining.hours }}</div>
      <div class="text-sm uppercase tracking-wider opacity-80">Hours</div>
    </div>
    <div class="bg-white/10 backdrop-blur-md rounded-lg p-4">
      <div class="text-3xl md:text-4xl lg:text-5xl font-bold font-montserrat">{{ timeRemaining.minutes }}</div>
      <div class="text-sm uppercase tracking-wider opacity-80">Minutes</div>
    </div>
    <div class="bg-white/10 backdrop-blur-md rounded-lg p-4">
      <div class="text-3xl md:text-4xl lg:text-5xl font-bold font-montserrat">{{ timeRemaining.seconds }}</div>
      <div class="text-sm uppercase tracking-wider opacity-80">Seconds</div>
    </div>
  </div>
</template>
