<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  targetDate: {
    type: String,
    required: true
  }
})

const timeRemaining = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})

let interval: NodeJS.Timeout

const calculateTimeRemaining = () => {
  const target = new Date(props.targetDate).getTime()
  const now = new Date().getTime()
  const distance = target - now

  if (distance < 0) {
    clearInterval(interval)
    return
  }

  timeRemaining.value.days = Math.floor(distance / (1000 * 60 * 60 * 24))
  timeRemaining.value.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  timeRemaining.value.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  timeRemaining.value.seconds = Math.floor((distance % (1000 * 60)) / 1000)
}

onMounted(() => {
  calculateTimeRemaining()
  interval = setInterval(calculateTimeRemaining, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
    <div class="bg-white/10 backdrop-blur-md rounded-lg p-4">
      <div class="text-4xl md:text-5xl font-bold font-montserrat">{{ timeRemaining.days }}</div>
      <div class="text-sm uppercase tracking-wider opacity-80">Days</div>
    </div>
    <div class="bg-white/10 backdrop-blur-md rounded-lg p-4">
      <div class="text-4xl md:text-5xl font-bold font-montserrat">{{ timeRemaining.hours }}</div>
      <div class="text-sm uppercase tracking-wider opacity-80">Hours</div>
    </div>
    <div class="bg-white/10 backdrop-blur-md rounded-lg p-4">
      <div class="text-4xl md:text-5xl font-bold font-montserrat">{{ timeRemaining.minutes }}</div>
      <div class="text-sm uppercase tracking-wider opacity-80">Minutes</div>
    </div>
    <div class="bg-white/10 backdrop-blur-md rounded-lg p-4">
      <div class="text-4xl md:text-5xl font-bold font-montserrat">{{ timeRemaining.seconds }}</div>
      <div class="text-sm uppercase tracking-wider opacity-80">Seconds</div>
    </div>
  </div>
</template>
