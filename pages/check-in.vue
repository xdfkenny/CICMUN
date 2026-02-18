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
    ts: timestamp.value,
  })
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
    <div class="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div class="bg-red-600 p-6 text-center">
        <h1 class="text-2xl font-bold text-white font-montserrat">Delegate Check-In</h1>
        <p class="text-red-100 text-sm mt-1">CICMUN 2026</p>
      </div>
      
      <div class="p-8 flex flex-col items-center text-center space-y-6">
        <div class="bg-white p-4 rounded-xl shadow-inner border border-gray-100">
          <QrCodeCard
            :payload="payload"
            :size="250"
            title=""
            hint=""
            class="mx-auto"
          />
        </div>

        <div>
           <p class="font-bold text-gray-900 text-lg mb-1">Show this code at registration</p>
           <p class="text-gray-500 text-sm">This code identifies you as a delegate.</p>
        </div>

        <div class="flex items-center gap-2 text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
          <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Code refreshes automatically
        </div>
      </div>
      
      <div class="bg-gray-50 px-6 py-4 text-center border-t border-gray-100">
        <p class="text-xs text-gray-400">
          Having trouble? Contact a staff member.
        </p>
      </div>
    </div>
  </div>
</template>
