<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  targetDate: {
    type: String,
    required: true
  }
})

const emit = defineEmits<{
  ended: []
}>()

const timeRemaining = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})

let interval: NodeJS.Timeout
let endEmitted = false

const calculateTimeRemaining = () => {
  const target = new Date(props.targetDate).getTime()
  const now = new Date().getTime()

  // Validate target date
  if (Number.isNaN(target)) {
    if (interval) clearInterval(interval)
    timeRemaining.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return
  }

  const distance = target - now

  // Countdown ended
  if (distance < 0) {
    timeRemaining.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    if (interval) clearInterval(interval)
    if (!endEmitted) {
      endEmitted = true
      emit('ended')
    }
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
  if (interval) clearInterval(interval)
})
</script>

<template>
  <!-- Ticking units are decoration; screen readers get the static date from the
       surrounding section instead of a per-second announcement stream. -->
  <div aria-hidden="true" class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
    <div class="bg-white/10 backdrop-blur-md rounded-lg p-4 transition-all duration-500">
      <div class="text-4xl md:text-5xl font-bold font-display">{{ timeRemaining.days }}</div>
      <div class="text-sm uppercase tracking-wider text-white">Days</div>
    </div>
    <div class="bg-white/10 backdrop-blur-md rounded-lg p-4">
      <div class="text-4xl md:text-5xl font-bold font-display">{{ timeRemaining.hours }}</div>
      <div class="text-sm uppercase tracking-wider text-white">Hours</div>
    </div>
    <div class="bg-white/10 backdrop-blur-md rounded-lg p-4">
      <div class="text-4xl md:text-5xl font-bold font-display">{{ timeRemaining.minutes }}</div>
      <div class="text-sm uppercase tracking-wider text-white">Minutes</div>
    </div>
    <div class="bg-white/10 backdrop-blur-md rounded-lg p-4">
      <div class="text-4xl md:text-5xl font-bold font-display">{{ timeRemaining.seconds }}</div>
      <div class="text-sm uppercase tracking-wider text-white">Seconds</div>
    </div>
  </div>
</template>
