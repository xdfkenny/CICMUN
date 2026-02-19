<script setup lang="ts">
import { getAuth } from 'firebase/auth'

definePageMeta({
  middleware: ['role'],
  auth: {
    required: true,
    roles: ['admin', 'super_admin'],
  },
})

const { setViewAsRole, viewAsRole, isRealSuperAdmin } = useAuth()

const auth = process.client ? getAuth() : null
const registrations = ref<any[]>([])
const loading = ref(true)
const loadError = ref(false)
const staffEmail = ref('')
const status = ref('')
const updateStatusMessage = ref('')

const notifyError = (message: string) => {
  const nuxtApp = useNuxtApp()
  nuxtApp.$toast?.error?.(message)
  updateStatusMessage.value = message
}

const loadRegistrations = async () => {
  loading.value = true
  loadError.value = false
  try {
    const token = await auth?.currentUser?.getIdToken()
    const data = await $fetch('/api/admin/registrations', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    registrations.value = Array.isArray(data) ? data : []
  } catch (err) {
    registrations.value = []
    loadError.value = true
    console.error('Failed to load registrations', err)
  }
  loading.value = false
}

const addStaff = async () => {
  status.value = ''
  const trimmed = staffEmail.value.trim().toLowerCase()
  if (!trimmed) {
    status.value = 'Please enter a staff email.'
    return
  }
  const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
  if (!emailPattern.test(trimmed)) {
    status.value = 'Please enter a valid email address.'
    return
  }
  try {
    const token = await auth?.currentUser?.getIdToken()
    await $fetch('/api/admin/grant-role', {
      method: 'POST',
      body: { email: trimmed, role: 'staff' },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    status.value = 'Staff role granted.'
  } catch {
    status.value = 'Could not grant staff role.'
  }
}

const updateStatus = async (item: any, newStatus: string) => {
  const token = await auth?.currentUser?.getIdToken()
  const previous = item.status
  item.status = newStatus
  updateStatusMessage.value = ''
  try {
    await $fetch(`/api/admin/registrations/${item.id}`, {
      method: 'PATCH',
      body: { status: newStatus },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  } catch (err: any) {
    item.status = previous
    const detail = err?.data?.message || err?.message || 'Unknown error'
    notifyError(`Failed to update status: ${detail}`)
  }
}

let unsubscribeAuth: (() => void) | null = null
if (process.client && auth) {
  unsubscribeAuth = auth.onAuthStateChanged((user) => {
    if (user) {
      loadRegistrations()
    }
  })
}

onUnmounted(() => {
  unsubscribeAuth?.()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="container max-w-5xl mx-auto space-y-8">
      <div class="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h1 class="text-3xl font-bold mb-2 font-montserrat">Admin Hub</h1>
        <p class="text-gray-600">Manage registrations and roles.</p>
      </div>

      <div v-if="isRealSuperAdmin" class="bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-4">
        <h2 class="text-xl font-bold font-montserrat">View as role</h2>
        <div class="flex flex-wrap gap-3">
          <UiButton class="bg-black text-white" @click="setViewAsRole(null)">Reset</UiButton>
          <UiButton class="bg-gray-200" @click="setViewAsRole('public')">Public</UiButton>
          <UiButton class="bg-gray-200" @click="setViewAsRole('teacher')">Teacher</UiButton>
          <UiButton class="bg-gray-200" @click="setViewAsRole('delegate')">Delegate</UiButton>
          <UiButton class="bg-gray-200" @click="setViewAsRole('staff')">Staff</UiButton>
          <UiButton class="bg-gray-200" @click="setViewAsRole('admin')">Admin</UiButton>
        </div>
        <p class="text-xs text-gray-500">Current view: {{ viewAsRole || 'none' }}</p>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-4">
        <h2 class="text-xl font-bold font-montserrat">Grant Staff Role</h2>
        <div class="flex items-center gap-3">
          <input v-model="staffEmail" type="email" class="flex-1 rounded-lg border border-gray-200 px-4 py-3" placeholder="email@school.edu" />
          <UiButton class="bg-red-600 text-white" @click="addStaff">Grant</UiButton>
        </div>
        <p class="text-xs text-gray-500">{{ status }}</p>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h2 class="text-xl font-bold mb-4 font-montserrat">Delegation Registrations</h2>
        <p v-if="updateStatusMessage" class="text-sm text-red-600 mb-3">{{ updateStatusMessage }}</p>
        <div v-if="loading" class="text-sm text-gray-500">Loading...</div>
        <div v-else-if="loadError" class="text-sm text-red-600">Failed to load registrations.</div>
        <div v-else-if="registrations.length === 0" class="text-sm text-gray-500">No submissions yet.</div>
        <div v-else class="space-y-3">
          <div v-for="item in registrations" :key="item.id" class="border-b border-gray-100 pb-3 space-y-2">
            <div class="font-semibold">{{ item.delegationName }} ({{ item.event }})</div>
            <div class="text-xs text-gray-500">{{ item.school }} | {{ item.supervisorEmail }}</div>
            <div class="text-sm text-gray-600 mt-1">{{ item.committees }}</div>
            <div class="flex items-center gap-3 text-xs">
              <span class="text-gray-500">Status:</span>
              <select
                :value="item.status || 'pending'"
                class="rounded border border-gray-200 px-2 py-1"
                @change="updateStatus(item, ($event.target as HTMLSelectElement).value)"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
