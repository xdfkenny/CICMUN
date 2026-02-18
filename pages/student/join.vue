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
const router = useRouter()
const code = ref('')
const name = ref('')
const status = ref<'idle' | 'success' | 'error'>('idle')
const message = ref('')
const isSubmitting = ref(false)

const createSecureUuid = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID()
  }
  if (globalThis.crypto?.getRandomValues) {
    const bytes = new Uint8Array(16)
    globalThis.crypto.getRandomValues(bytes)
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
  }
  throw new Error('Secure random generator unavailable')
}

const join = async () => {
  if (isSubmitting.value) return
  status.value = 'idle'
  message.value = ''
  const trimmedName = name.value.trim()
  const trimmedCode = code.value.trim().toUpperCase()
  if (!trimmedName || !trimmedCode) {
    status.value = 'error'
    message.value = 'Please enter your full name and teacher code.'
    return
  }
  if (!user.value?.uid) {
    status.value = 'error'
    message.value = 'Please sign in again to complete registration.'
    return
  }
  code.value = trimmedCode
  isSubmitting.value = true
  try {
    const { doc, getDoc, setDoc, serverTimestamp } = await import('firebase/firestore')
    const codeRef = doc(db, 'registrationCodes', trimmedCode)
    const codeSnap = await getDoc(codeRef)
    if (!codeSnap.exists()) {
      throw new Error('Invalid code')
    }

    const qrToken = createSecureUuid()

    await setDoc(doc(db, 'students', user.value.uid), {
      name: trimmedName,
      teacherId: codeSnap.data().teacherId || null,
      qrToken,
      createdAt: serverTimestamp(),
    }, { merge: true })

    status.value = 'success'
    message.value = 'Registered successfully.'
    setTimeout(async () => {
      try {
        await router.push('/student/me')
      } finally {
        isSubmitting.value = false
      }
    }, 500)
  } catch (err: any) {
    status.value = 'error'
    message.value = err?.message || 'Registration failed'
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="container max-w-md mx-auto">
      <div class="bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-4">
        <h1 class="text-2xl font-bold font-montserrat">Student Registration</h1>
        <div>
          <label for="student-name" class="text-sm font-semibold text-gray-700">Full name</label>
          <input id="student-name" v-model="name" class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3" placeholder="Full name" />
        </div>
        <div>
          <label for="teacher-code" class="text-sm font-semibold text-gray-700">Teacher code</label>
          <input id="teacher-code" v-model="code" class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 uppercase" placeholder="Teacher code" />
        </div>
        <UiButton class="w-full bg-red-600 text-white" :disabled="isSubmitting" @click="join">
          {{ isSubmitting ? 'Joining...' : 'Join' }}
        </UiButton>
        <p v-if="status !== 'idle'" :class="status === 'success' ? 'text-green-600' : 'text-red-600'" class="text-sm font-semibold">
          {{ message }}
        </p>
      </div>
    </div>
  </div>
</template>
