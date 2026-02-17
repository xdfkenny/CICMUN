<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  auth: {
    required: true,
    roles: ['teacher'],
  },
})

const { user } = useAuth()
const db = useDb()
const code = ref('')
const students = ref<{ id: string; name: string; committeeId: string | null }[]>([])
const loading = ref(true)
const committees = ref<{ id: string; name: string; type: string }[]>([])
const updateFeedback = ref<{ type: 'success' | 'error'; message: string } | null>(null)

const generateCode = async () => {
  const { doc, setDoc, serverTimestamp, getDoc, addDoc, collection } = await import('firebase/firestore')
  let newCode = ''
  let codeRef: ReturnType<typeof doc> | null = null
  let exists = true
  let attempts = 0
  while (exists && attempts < 5) {
    newCode = Math.random().toString(36).slice(2, 8).toUpperCase()
    codeRef = doc(db, 'registrationCodes', newCode)
    const snap = await getDoc(codeRef)
    exists = snap.exists()
    attempts += 1
  }
  const payload = {
    teacherId: user.value?.uid || null,
    createdAt: serverTimestamp(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
  }
  if (!exists && codeRef) {
    code.value = newCode
    await setDoc(codeRef, { ...payload, code: newCode })
  } else {
    newCode = Math.random().toString(36).slice(2, 8).toUpperCase()
    code.value = newCode
    await addDoc(collection(db, 'registrationCodes'), { ...payload, code: newCode })
  }
}

const loadOrCreateCode = async () => {
  if (!user.value) return
  const { collection, getDocs, query, where, orderBy, limit } = await import('firebase/firestore')
  const q = query(
    collection(db, 'registrationCodes'),
    where('teacherId', '==', user.value?.uid || ''),
    orderBy('createdAt', 'desc'),
    limit(1)
  )
  const snap = await getDocs(q)
  const existing = snap.docs[0]
  if (existing) {
    const data = existing.data()
    const expiresAt = data.expiresAt ? new Date(data.expiresAt) : null
    if (!expiresAt || expiresAt > new Date()) {
      code.value = data.code || existing.id
      return
    }
  }
  await generateCode()
}

const loadStudents = async () => {
  if (!user.value) return
  loading.value = true
  try {
    const { collection, getDocs, query, where } = await import('firebase/firestore')
    const q = query(collection(db, 'students'), where('teacherId', '==', user.value?.uid || ''))
    const snap = await getDocs(q)
    students.value = snap.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      committeeId: doc.data().committeeId || null,
    }))
  } catch {
    students.value = []
  }
  loading.value = false
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
  const { doc, setDoc, serverTimestamp } = await import('firebase/firestore')
  try {
    await setDoc(doc(db, 'students', student.id), {
      name: trimmedName,
      committeeId: student.committeeId,
      updatedAt: serverTimestamp(),
    }, { merge: true })
    updateFeedback.value = { type: 'success', message: 'Student updated successfully.' }
  } catch (err) {
    console.error('Failed to update student', err)
    updateFeedback.value = { type: 'error', message: 'Unable to update student. Please try again.' }
  }
}

watch(user, async (val) => {
  if (!val) return
  await loadOrCreateCode()
  await loadCommittees()
  await loadStudents()
}, { immediate: true })
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="container max-w-4xl mx-auto space-y-8">
      <div class="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h1 class="text-3xl font-bold mb-2 font-montserrat">Teacher Dashboard</h1>
        <p class="text-gray-600 mb-6">Share the code below with your students.</p>
        <div class="flex items-center gap-4">
          <div class="text-2xl font-bold bg-gray-100 px-4 py-2 rounded-lg tracking-widest">{{ code }}</div>
          <UiButton class="bg-black text-white" @click="generateCode">Regenerate</UiButton>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h2 class="text-xl font-bold mb-4 font-montserrat">Registered Students</h2>
        <p
          v-if="updateFeedback"
          :class="updateFeedback.type === 'success' ? 'text-green-600' : 'text-red-600'"
          class="text-sm font-semibold mb-3"
        >
          {{ updateFeedback.message }}
        </p>
        <div v-if="loading" class="text-sm text-gray-500">Loading...</div>
        <div v-else-if="students.length === 0" class="text-sm text-gray-500">No students yet.</div>
        <div v-else class="space-y-3">
          <div v-for="student in students" :key="student.id" class="border-b border-gray-100 pb-3 space-y-2">
            <input v-model="student.name" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            <div class="flex items-center gap-3">
              <select v-model="student.committeeId" class="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <option :value="null">Unassigned</option>
                <option v-for="committee in committees" :key="committee.id" :value="committee.id">
                  {{ committee.name }} ({{ committee.type }})
                </option>
              </select>
              <UiButton class="bg-black text-white" @click="updateStudent(student)">Save</UiButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
