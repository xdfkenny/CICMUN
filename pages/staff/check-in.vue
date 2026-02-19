<script setup lang="ts">
import { getAuth } from 'firebase/auth'

definePageMeta({
  middleware: ['role'],
  auth: {
    required: true,
    roles: ['staff'],
  },
})

const input = ref('')
const status = ref<'idle' | 'success' | 'error' | 'warning'>('idle')
const message = ref('')
const checked = ref<{ email: string; uid: string; ts: string }[]>([])

const auth = process.client ? getAuth() : null

const storageKey = 'cicmun:checkins'

const load = () => {
  if (!process.client) return
  const raw = localStorage.getItem(storageKey)
  if (!raw) return
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) checked.value = parsed
  } catch {
    // ignore
  }
}

const save = () => {
  if (!process.client) return
  localStorage.setItem(storageKey, JSON.stringify(checked.value))
}

const handleCheckIn = async () => {
  status.value = 'idle'
  message.value = ''
  try {
    if (!auth?.currentUser) {
      status.value = 'error'
      message.value = 'Please sign in before checking in delegates.'
      return
    }
    const token = await auth.currentUser.getIdToken()
    if (!token) {
      status.value = 'error'
      message.value = 'Missing authorization token.'
      return
    }
    const parsed = JSON.parse(input.value)
    const result = await $fetch<{ ok: boolean; duplicate?: boolean; email?: string | null }>('/api/attendance/check-in', {
      method: 'POST',
      body: { payload: input.value },
      headers: { Authorization: `Bearer ${token}` },
    })
    const displayEmail = result?.email || parsed.email || 'delegate'
    if (result?.duplicate) {
      status.value = 'warning'
      message.value = `Duplicate check-in for ${displayEmail}.`
      input.value = ''
      return
    }
    checked.value.unshift({ uid: parsed.uid || 'unknown', email: displayEmail, ts: new Date().toISOString() })
    save()
    status.value = 'success'
    message.value = 'Check-in recorded'
    input.value = ''
  } catch (err: any) {
    status.value = 'error'
    const detail = err?.data?.message || err?.data || err?.statusMessage || err?.message
    message.value = typeof detail === 'string' && detail.length ? detail : 'Invalid QR payload'
  }
}

onMounted(load)
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="container max-w-3xl mx-auto space-y-8">
      <div class="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h1 class="text-3xl font-bold mb-3 font-montserrat">Staff Check-in</h1>
        <p class="text-gray-600 mb-6">Paste the QR payload to mark a delegate as present.</p>
        <textarea
          v-model="input"
          rows="4"
          class="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
          placeholder='{"uid":"...","ts":"...","sig":"..."}'
        />
        <div class="mt-4 flex items-center gap-3">
          <UiButton class="bg-red-600 hover:bg-red-700 text-white" @click="handleCheckIn">
            Mark check-in
          </UiButton>
          <span
            v-if="status !== 'idle'"
            :class="status === 'success' ? 'text-green-600' : status === 'warning' ? 'text-yellow-600' : 'text-red-600'"
            class="text-sm font-semibold"
          >
            {{ message }}
          </span>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h2 class="text-xl font-bold mb-4 font-montserrat">Checked-in delegates</h2>
        <div v-if="checked.length" class="space-y-2 text-sm">
          <div v-for="(entry, index) in checked" :key="`${entry.uid}-${entry.ts}-${index}`" class="flex justify-between border-b border-gray-100 pb-2">
            <span>{{ entry.email }}</span>
            <span class="text-gray-400">{{ new Date(entry.ts).toLocaleString() }}</span>
          </div>
        </div>
        <p v-else class="text-sm text-gray-500">No check-ins yet.</p>
      </div>
    </div>
  </div>
</template>
