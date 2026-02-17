<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  auth: {
    required: true,
    roles: ['delegate'],
  },
})

const { user } = useAuth()
const timestamp = ref('')
let interval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timestamp.value = new Date().toISOString()
  interval = setInterval(() => {
    timestamp.value = new Date().toISOString()
  }, 30000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

const payload = computed(() => {
  if (!user.value || !timestamp.value) return ''
  return JSON.stringify({
    uid: user.value.uid,
    email: user.value.email,
    ts: timestamp.value,
  })
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="container max-w-3xl mx-auto">
      <QrCodeCard
        :payload="payload"
        title="Your check-in code"
        hint="Show this code at registration."
      />
    </div>
  </div>
</template>
