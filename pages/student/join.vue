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
  <div class="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 py-10 px-4">
    <div class="container max-w-6xl mx-auto grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
      <section class="order-2 lg:order-1 space-y-6">
        <div class="bg-white border border-gray-200 rounded-3xl shadow-lg p-6 sm:p-8">
          <div class="flex flex-wrap items-center gap-3 mb-4">
            <span class="rounded-full bg-red-50 text-red-600 text-xs font-bold px-3 py-1">Students</span>
            <span class="text-xs uppercase tracking-[0.3em] text-gray-400">Step 1 of 2</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-bold font-montserrat text-gray-900 mb-3">Student Registration</h1>
          <p class="text-gray-600 text-lg">
            Join your delegation with your teacher code. It takes less than a minute.
          </p>

          <div class="mt-6 grid gap-4">
            <div class="flex items-start gap-3">
              <div class="h-9 w-9 flex items-center justify-center rounded-full bg-red-600 text-white text-sm font-bold">1</div>
              <div>
                <p class="font-semibold text-gray-900">Enter your full name</p>
                <p class="text-sm text-gray-600">Use the name your advisor expects on the roster.</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="h-9 w-9 flex items-center justify-center rounded-full bg-red-600 text-white text-sm font-bold">2</div>
              <div>
                <p class="font-semibold text-gray-900">Add the teacher code</p>
                <p class="text-sm text-gray-600">Codes are shared by your advisor or committee staff.</p>
              </div>
            </div>
          </div>

          <div class="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            If your code doesn’t work, double-check spaces and letters, then ask your advisor.
          </div>
        </div>

        <div class="hidden lg:flex items-center gap-3 text-xs text-gray-500">
          <span class="inline-flex h-2 w-2 rounded-full bg-red-600"></span>
          Your access is private to your delegation and conference staff.
        </div>
      </section>

      <section class="order-1 lg:order-2">
        <div class="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100 space-y-5">
          <div>
            <h2 class="text-2xl font-bold font-montserrat text-gray-900">Join Your Delegation</h2>
            <p class="text-sm text-gray-500">Already logged in as a student. Just add your details below.</p>
          </div>

          <div>
            <label for="student-name" class="text-sm font-semibold text-gray-700">Full name</label>
            <input
              id="student-name"
              v-model="name"
              class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="e.g. Camila Rojas"
            />
          </div>
          <div>
            <label for="teacher-code" class="text-sm font-semibold text-gray-700">Teacher code</label>
            <input
              id="teacher-code"
              v-model="code"
              class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="ABCDE1"
            />
            <p class="text-xs text-gray-500 mt-2">Use the exact code shared by your advisor.</p>
          </div>

          <UiButton class="w-full bg-red-600 text-white" :disabled="isSubmitting" @click="join">
            {{ isSubmitting ? 'Joining...' : 'Join Delegation' }}
          </UiButton>

          <p v-if="status !== 'idle'" :class="status === 'success' ? 'text-green-600' : 'text-red-600'" class="text-sm font-semibold">
            {{ message }}
          </p>
        </div>
      </section>
    </div>
  </div>
</template>
