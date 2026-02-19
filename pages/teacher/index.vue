<script setup lang="ts">
import { getAuth } from 'firebase/auth'
import { getApp } from 'firebase/app'

definePageMeta({
  middleware: ['role'],
  auth: {
    required: true,
    roles: ['teacher'],
  },
})

const { user } = useAuth()
const route = useRoute()
const router = useRouter()
const code = ref('')
const students = ref<{ id: string; name: string; committeeId: string | null; status?: string }[]>([])
const pendingStudents = ref<{ id: string; name: string; committeeId: string | null; status?: string }[]>([])
const loading = ref(true)
const committees = ref<{ id: string; name: string; type: string }[]>([])
const updateFeedback = ref<{ type: 'success' | 'error'; message: string } | null>(null)
const schoolName = ref('')

type PortalResponse = {
  schoolName: string | null
  code: string | null
  students: { id: string; name: string; committeeId: string | null; status?: string }[]
  pendingStudents: { id: string; name: string; committeeId: string | null; status?: string }[]
}

const consumeRegisteredQuery = () => {
  if (route.query.registered) {
    updateFeedback.value = {
      type: 'success',
      message: 'Registration submitted. Your teacher dashboard is ready.',
    }
    const { registered, ...rest } = route.query
    router.replace({ query: rest })
  }
}

const getAuthToken = async () => {
  if (!process.client) return null
  const auth = getAuth(getApp())
  const current = auth.currentUser
  if (!current) return null
  return current.getIdToken()
}

const authFetch = async <T>(url: string, options: any = {}) => {
  const token = await getAuthToken()
  if (!token) {
    throw new Error('Not authenticated')
  }
  const headers = {
    ...(options.headers || {}),
    authorization: `Bearer ${token}`,
  }
  return await $fetch<T>(url, { ...options, headers })
}

const generateCode = async () => {
  if (!user.value) {
    updateFeedback.value = { type: 'error', message: 'Please sign in to generate a code.' }
    return
  }
  try {
    const data = await authFetch<{ code: string }>('/api/teacher/code', { method: 'POST' })
    code.value = data?.code || ''
    updateFeedback.value = { type: 'success', message: 'New code generated.' }
  } catch (e) {
    console.error('Failed to generate code', e)
    updateFeedback.value = { type: 'error', message: 'Unable to generate code. Please try again.' }
  }
}

const loadPortal = async () => {
  if (!user.value) return
  loading.value = true
  try {
    const data = await authFetch<PortalResponse>('/api/teacher/portal')
    schoolName.value = data.schoolName || 'My School'
    code.value = data.code || ''
    students.value = data.students || []
    pendingStudents.value = data.pendingStudents || []
  } catch (e) {
    console.error('Failed to load teacher portal', e)
    updateFeedback.value = { type: 'error', message: 'Unable to load teacher data. Please try again.' }
    schoolName.value = schoolName.value || 'My School'
    students.value = []
    pendingStudents.value = []
  } finally {
    loading.value = false
  }
}

const loadCommittees = async () => {
  try {
    const jmun = await $fetch('/api/committees/JMUN')
    const samun = await $fetch('/api/committees/SAMUN')
    committees.value = [...(jmun || []), ...(samun || [])].map((c: any) => ({
      id: String(c.id),
      name: c.name,
      type: c.type,
    }))
  } catch {
    committees.value = []
  }
}

const updateStudent = async (student: { id: string; name: string; committeeId: string | null }) => {
  if (!user.value) return
  const trimmedName = student.name.trim()
  if (!trimmedName) {
    updateFeedback.value = { type: 'error', message: 'Student name is required.' }
    return
  }
  student.name = trimmedName
  try {
    await authFetch(`/api/teacher/students/${student.id}`, {
      method: 'PATCH',
      body: {
        name: trimmedName,
        committeeId: student.committeeId,
      },
    })
    updateFeedback.value = { type: 'success', message: 'Student updated successfully.' }
  } catch (err) {
    console.error('Failed to update student', err)
    updateFeedback.value = { type: 'error', message: 'Unable to update student. Please try again.' }
  }
}

const approveStudent = async (student: { id: string }) => {
  try {
    await authFetch(`/api/teacher/students/${student.id}/approve`, { method: 'POST' })
    // Refresh local list
    const idx = pendingStudents.value.findIndex(s => s.id === student.id)
    if (idx !== -1) {
      const [moved] = pendingStudents.value.splice(idx, 1)
      moved.status = 'approved'
      students.value.push(moved)
    }
    updateFeedback.value = { type: 'success', message: 'Student approved.' }
  } catch (e) {
    console.error('Error approving', e)
    updateFeedback.value = { type: 'error', message: 'Failed to approve student.' }
  }
}

watch(user, async (val) => {
  if (!val) return
  await loadPortal()
  await loadCommittees()
}, { immediate: true })

onMounted(() => {
  consumeRegisteredQuery()
})

watch(() => route.query.registered, () => {
  consumeRegisteredQuery()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto space-y-8">
      
      <!-- Header / School Info -->
      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="bg-black text-white p-8">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 class="text-3xl font-bold font-montserrat">Teacher Portal</h1>
              <p class="text-gray-400 mt-1 text-lg">{{ schoolName || 'Loading School...' }}</p>
            </div>
            <div class="text-right md:text-left">
               <div class="inline-flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-2">
                 <span class="text-gray-400 text-sm uppercase tracking-wider font-bold">Class Code</span>
                 <span class="text-xl font-mono text-white font-bold tracking-widest">{{ code }}</span>
               </div>
               <div class="mt-2 text-xs text-gray-500 text-center md:text-right">
                 <button @click="generateCode" class="hover:text-white transition-colors underline">Regenerate</button>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="updateFeedback" class="rounded-2xl border px-4 py-3 text-sm flex items-start justify-between gap-3"
        :class="updateFeedback.type === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'">
        <span>{{ updateFeedback.message }}</span>
        <button class="text-xs uppercase tracking-wide font-semibold opacity-70 hover:opacity-100" @click="updateFeedback = null">Dismiss</button>
      </div>

      <!-- Pending Students -->
      <div v-if="pendingStudents.length > 0" class="bg-white rounded-3xl shadow-md border border-red-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100 bg-red-50">
          <h2 class="text-xl font-bold text-red-800 flex items-center gap-2">
            <span class="flex h-6 w-6 items-center justify-center rounded-full bg-red-200 text-xs">!</span>
            Pending Acceptance
          </h2>
        </div>
        <div class="divide-y divide-gray-100">
          <div v-for="student in pendingStudents" :key="student.id" class="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <span class="font-medium text-gray-900">{{ student.name }}</span>
            <div class="flex gap-2">
              <UiButton class="bg-red-600 text-white hover:bg-red-700 text-xs px-3 py-1" @click="approveStudent(student)">
                Approve
              </UiButton>
              <UiButton class="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs px-3 py-1">
                Reject
              </UiButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Students -->
      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-8 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold font-montserrat text-gray-900">My Delegation</h2>
            <p class="text-gray-500">Manage committee assignments</p>
          </div>
          <div class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
            {{ students.length }} Students
          </div>
        </div>

        <div v-if="loading" class="p-12 text-center text-gray-500">
          <div class="animate-spin h-8 w-8 border-4 border-gray-200 border-t-black rounded-full mx-auto mb-4"></div>
          Loading roster...
        </div>

        <div v-else-if="students.length === 0" class="p-12 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 text-gray-400 font-bold text-2xl">?</div>
          <h3 class="text-lg font-bold text-gray-900">No students yet</h3>
          <p class="text-gray-500 max-w-sm mx-auto mt-2">
            Share the code <strong>{{ code }}</strong> with your students so they can join your delegation.
          </p>
        </div>

        <div v-else class="divide-y divide-gray-100">
          <div v-for="student in students" :key="student.id" class="p-4 sm:p-6 hover:bg-gray-50 transition-colors group">
            <div class="flex flex-col sm:flex-row sm:items-center gap-4">
              <div class="flex-1">
                 <input 
                   v-model="student.name" 
                   class="font-bold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black focus:outline-none transition-colors w-full"
                 />
                 <div class="text-xs text-gray-400 mt-0.5">Edit name</div>
              </div>
              
              <div class="flex-1 sm:max-w-xs">
                 <select 
                   v-model="student.committeeId" 
                   class="w-full rounded-lg border-gray-200 text-sm focus:border-black focus:ring-black bg-white"
                   @change="updateStudent(student)"
                 >
                   <option :value="null">No Committee Assigned</option>
                   <optgroup label="JMUN">
                     <option v-for="c in committees.filter(x => x.type === 'JMUN')" :key="c.id" :value="c.id">{{ c.name }}</option>
                   </optgroup>
                   <optgroup label="SAMUN">
                     <option v-for="c in committees.filter(x => x.type === 'SAMUN')" :key="c.id" :value="c.id">{{ c.name }}</option>
                   </optgroup>
                 </select>
              </div>

              <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="text-gray-400 hover:text-red-600" title="Remove student">
                  <span class="sr-only">Remove</span>
                  &times;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
