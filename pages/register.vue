<script setup lang="ts">
useSeoMeta({
  title: 'Delegation Registration',
  ogTitle: 'Delegation Registration | CICMUN 2026',
  description: 'Register your delegation for JMUN or SAMUN.',
  ogDescription: 'Register your delegation for JMUN or SAMUN.',
})

const db = useDb()
const isSubmitting = ref(false)
const submitted = ref(false)
const submitError = ref('')
const { data: delegations } = await useFetch('/api/delegations', { default: () => [] })

const delegationMode = ref<'existing' | 'new'>('existing')

watchEffect(() => {
  if ((delegations.value || []).length === 0) {
    delegationMode.value = 'new'
  }
})

watch(delegationMode, () => {
  form.delegationName = ''
})

const form = reactive({
  delegationName: '',
  event: 'SAMUN',
  committees: '',
  participants: '',
  supervisorName: '',
  supervisorEmail: '',
  supervisorPhone: '',
  school: '',
})

const submit = async () => {
  isSubmitting.value = true
  submitError.value = ''
  try {
    const { addDoc, collection, serverTimestamp } = await import('firebase/firestore')
    await addDoc(collection(db, 'registrations'), {
      ...form,
      delegationMode: delegationMode.value,
      createdAt: serverTimestamp(),
      status: 'pending',
    })
    submitted.value = true
  } catch {
    submitError.value = 'Unable to submit registration. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="container max-w-3xl mx-auto">
      <h1 class="text-4xl font-bold text-black mb-4 font-montserrat">
        Delegation registration
      </h1>
      <p class="text-gray-600 mb-8">
        Complete this form to register your delegation.
      </p>

      <div v-if="submitted" class="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h2 class="text-2xl font-bold mb-2 font-montserrat">Submitted</h2>
        <p class="text-gray-600">We received your registration. We will contact you soon.</p>
      </div>

      <form v-else class="bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-4" @submit.prevent="submit">
        <div>
          <label for="delegation-name" class="text-sm font-bold text-gray-800">Delegation</label>
          <div class="flex items-center gap-3 mt-2">
            <button
              type="button"
              class="px-3 py-2 rounded-lg border"
              :class="delegationMode === 'existing' ? 'border-red-600 text-red-600' : 'border-gray-200 text-gray-600'"
              @click="delegationMode = 'existing'"
            >
              Existing
            </button>
            <button
              type="button"
              class="px-3 py-2 rounded-lg border"
              :class="delegationMode === 'new' ? 'border-red-600 text-red-600' : 'border-gray-200 text-gray-600'"
              @click="delegationMode = 'new'"
            >
              New
            </button>
          </div>
          <div v-if="delegationMode === 'existing'" class="mt-3">
            <select id="delegation-name" v-model="form.delegationName" required class="w-full rounded-lg border border-gray-200 px-4 py-3">
              <option disabled value="">Select delegation</option>
              <option v-for="delegation in delegations" :key="delegation.name" :value="delegation.name">
                {{ delegation.name }}
              </option>
            </select>
          </div>
          <div v-else class="mt-3">
            <input id="delegation-name" v-model="form.delegationName" required class="w-full rounded-lg border border-gray-200 px-4 py-3" placeholder="New delegation name" />
          </div>
        </div>
        <div>
          <label for="school" class="text-sm font-bold text-gray-800">School</label>
          <input id="school" v-model="form.school" required class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3" />
        </div>
        <div>
          <label for="event" class="text-sm font-bold text-gray-800">Conference</label>
          <select id="event" v-model="form.event" class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3">
            <option value="SAMUN">SAMUN</option>
            <option value="JMUN">JMUN</option>
          </select>
        </div>
        <div>
          <label for="committees" class="text-sm font-bold text-gray-800">Committees attending</label>
          <input id="committees" v-model="form.committees" required class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3" />
        </div>
        <div>
          <label for="participants" class="text-sm font-bold text-gray-800">Participants per committee</label>
          <input id="participants" v-model="form.participants" required class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3" />
        </div>
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label for="supervisor-name" class="text-sm font-bold text-gray-800">Supervisor name</label>
            <input id="supervisor-name" v-model="form.supervisorName" required class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3" />
          </div>
          <div>
            <label for="supervisor-email" class="text-sm font-bold text-gray-800">Supervisor email</label>
            <input id="supervisor-email" v-model="form.supervisorEmail" type="email" required class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3" />
          </div>
        </div>
        <div>
          <label for="supervisor-phone" class="text-sm font-bold text-gray-800">Supervisor phone</label>
          <input id="supervisor-phone" v-model="form.supervisorPhone" class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3" />
        </div>

        <UiButton type="submit" class="w-full bg-red-600 hover:bg-red-700 text-white" :disabled="isSubmitting">
          {{ isSubmitting ? 'Submitting...' : 'Submit registration' }}
        </UiButton>
        <p v-if="submitError" class="text-sm text-red-600 font-semibold">{{ submitError }}</p>
      </form>
    </div>
  </div>
</template>
