<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  auth: {
    required: true,
    roles: ['delegate'],
  },
})

const { user } = useAuth()
const db = useDb()
const student = ref<{ qrToken?: string } | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const payload = computed(() => {
  if (!user.value || !student.value?.qrToken) return ''
  return JSON.stringify({
    uid: user.value.uid,
    email: user.value.email || null,
    qrToken: student.value.qrToken,
  })
})

const loadStudent = async () => {
  loading.value = true
  error.value = null
  try {
    const { doc, getDoc } = await import('firebase/firestore')
    if (!user.value) return
    const snap = await getDoc(doc(db, 'students', user.value.uid))
    if (snap.exists()) {
      student.value = snap.data() as any
    }
  } catch (err: any) {
    error.value = err?.message || 'Unable to load registration data.'
  } finally {
    loading.value = false
  }
}

onMounted(loadStudent)
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="container max-w-md mx-auto">
      <div v-if="loading" class="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <p class="text-gray-600">Loading your registration...</p>
      </div>
      <div v-else-if="error" class="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <p class="text-red-600">{{ error }}</p>
      </div>
      <QrCodeCard
        v-else-if="payload"
        :payload="payload"
        title="Your Delegate QR"
        hint="Show this at check-in."
      />
      <div v-else class="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <p class="text-gray-600">Complete your registration to generate your QR code.</p>
        <NuxtLink to="/student/join" class="text-red-600 font-bold hover:underline mt-3 inline-block">Go to registration</NuxtLink>
      </div>
    </div>
  </div>
</template>
