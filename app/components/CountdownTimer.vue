<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  targetDate: {
    type: String,
    required: true
  }
})

const emit = defineEmits<{
  brainrot: []
}>()

const timeRemaining = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})

let interval: NodeJS.Timeout
let brainrotEmitted = false

// 67 brainrot detection
const isBrainrot67 = computed(() => {
  const d = timeRemaining.value.days
  return d === 6 || d === 7
})

// Emit once when 67 state is first detected
watch(isBrainrot67, (is67) => {
  if (is67 && !brainrotEmitted) {
    brainrotEmitted = true
    emit('brainrot')
  }
})

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

  // Check immediately after first calculation in case days is already 6 or 7
  if (isBrainrot67.value && !brainrotEmitted) {
    brainrotEmitted = true
    emit('brainrot')
  }
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
    <div :class="['bg-white/10 backdrop-blur-md rounded-lg p-4 transition-all duration-500', { 'countdown-67': isBrainrot67 }]">
      <div :class="['text-4xl md:text-5xl font-bold font-montserrat', { 'brainrot-number-pulse': isBrainrot67 }]">{{ timeRemaining.days }}</div>
      <div class="text-sm uppercase tracking-wider opacity-80">Days</div>
      <div v-if="isBrainrot67" class="text-xs mt-1.5 font-bold tracking-wide animate-pulse text-amber-300">
        6-7 🤌
      </div>
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
