<script setup lang="ts">
import { getAuth } from 'firebase/auth'
import { getApp } from 'firebase/app'

useSeoMeta({
  title: 'Delegation Registration',
  ogTitle: 'Delegation Registration | CICMUN 2026',
  description: 'Register your delegation for JMUN or SAMUN.',
  ogDescription: 'Register your delegation for JMUN or SAMUN.',
})

const { user, role, loginWithGoogle, refreshAuthState } = useAuth()
const isSubmitting = ref(false)
const submitted = ref(false)
const submitError = ref('')
const submitMessage = ref('')
const redirecting = ref(false)
const { data: delegations } = await useFetch('/api/delegations', { default: () => [] })

const delegationMode = ref<'existing' | 'new'>('existing')

watchEffect(() => {
  if ((delegations.value || []).length === 0) {
    delegationMode.value = 'new'
  }
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

watch(delegationMode, () => {
  form.delegationName = ''
})



// Pre-fill form if user is logged in
watchEffect(() => {
  if (user.value?.email) {
    form.supervisorEmail = user.value.email
    if (user.value.displayName) {
      form.supervisorName = user.value.displayName
    }
  }
})

const submit = async () => {
  isSubmitting.value = true
  submitError.value = ''
  try {
    const auth = getAuth(getApp())
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error('Please sign in to submit your registration.')
    }
    const token = await currentUser.getIdToken()
    await $fetch('/api/registrations', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: {
        ...form,
        delegationMode: delegationMode.value,
      },
    })
    submitted.value = true
    submitMessage.value = `Registration submitted for ${form.delegationName || 'your delegation'}.`
    if (user.value) {
      await refreshAuthState()
      redirecting.value = true
      await navigateTo('/teacher?registered=1')
    }
  } catch (err: any) {
    submitError.value = err?.data?.message || err?.message || 'Unable to submit registration. Please try again.'
  } finally {
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
            <span class="rounded-full bg-red-50 text-red-600 text-xs font-bold px-3 py-1">Delegations</span>
            <span class="text-xs uppercase tracking-[0.3em] text-gray-400">Registration</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-bold text-black mb-3 font-montserrat">Delegation Registration</h1>
          <p class="text-gray-600 text-lg">
            Share your delegation details so we can prepare assignments, schedules, and materials.
          </p>
          <div class="mt-6 grid gap-4">
            <div class="flex items-start gap-3">
              <div class="h-9 w-9 flex items-center justify-center rounded-full bg-red-600 text-white text-sm font-bold">1</div>
              <div>
                <p class="font-semibold text-gray-900">Delegation details</p>
                <p class="text-sm text-gray-600">Choose existing or add a new delegation and school.</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="h-9 w-9 flex items-center justify-center rounded-full bg-red-600 text-white text-sm font-bold">2</div>
              <div>
                <p class="font-semibold text-gray-900">Participation info</p>
                <p class="text-sm text-gray-600">Tell us which committees and how many delegates.</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="h-9 w-9 flex items-center justify-center rounded-full bg-red-600 text-white text-sm font-bold">3</div>
              <div>
                <p class="font-semibold text-gray-900">Supervisor contact</p>
                <p class="text-sm text-gray-600">We’ll use this to confirm and coordinate.</p>
              </div>
            </div>
          </div>
          <div class="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            After submitting, your registration status will be marked as pending until we confirm.
          </div>
        </div>
      </section>

      <section class="order-1 lg:order-2">
        <div v-if="submitted" class="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100">
          <h2 class="text-2xl font-bold mb-2 font-montserrat">Submitted</h2>
          <p class="text-gray-600">{{ submitMessage || 'We received your registration. We will contact you soon.' }}</p>
          <p v-if="redirecting" class="mt-3 text-sm font-semibold text-blue-600">Redirecting to the teacher dashboard...</p>
          <NuxtLink v-else to="/teacher" class="block mt-4">
            <UiButton class="w-full bg-black text-white hover:bg-gray-800">
              Go to Teacher Dashboard
            </UiButton>
          </NuxtLink>
        </div>

        <div v-else-if="role === 'teacher'" class="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100 text-center">
          <div class="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5z"/></svg>
          </div>
          <h2 class="text-2xl font-bold font-montserrat text-gray-900 mb-2">You are already registered</h2>
          <p class="text-gray-600 mb-6">
            You are logged in as a teacher. Please go to your dashboard to manage your students.
          </p>
          <NuxtLink to="/teacher">
            <UiButton class="w-full bg-black text-white hover:bg-gray-800">
              Go to Teacher Dashboard
            </UiButton>
          </NuxtLink>
        </div>

        <div v-else class="space-y-6">
          <div v-if="!user" class="bg-blue-50 border border-blue-200 rounded-3xl p-6 relative overflow-hidden">
             <!-- Decorative background pattern -->
            <div class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-100 blur-2xl opacity-50"></div>
            
            <h3 class="text-lg font-bold text-blue-900 mb-2 relative z-10">Are you a teacher?</h3>
            <p class="text-sm text-blue-800 mb-4 relative z-10">
              We highly recommend signing in with Google. It's faster and helps us verify your school details.
            </p>
            <UiButton type="button" class="w-full bg-white text-blue-700 hover:bg-blue-50 border border-blue-200 relative z-10" @click="loginWithGoogle">
              <svg class="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
              Continue with Google
            </UiButton>
          </div>

          <form class="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100 space-y-6" @submit.prevent="submit">
            <div>
              <h2 class="text-2xl font-bold font-montserrat text-gray-900">Delegation Details</h2>
              <p class="text-sm text-gray-500">Required fields are marked with an asterisk.</p>
            </div>

            <div>
              <label for="delegation-name" class="text-sm font-bold text-gray-800">Delegation *</label>
              <div class="flex flex-wrap items-center gap-2 mt-2">
                <button
                  type="button"
                  class="px-3 py-2 rounded-lg border text-sm"
                  :class="delegationMode === 'existing' ? 'border-red-600 text-red-600 bg-red-50' : 'border-gray-200 text-gray-600'"
                  @click="delegationMode = 'existing'"
                >
                  Existing
                </button>
                <button
                  type="button"
                  class="px-3 py-2 rounded-lg border text-sm"
                  :class="delegationMode === 'new' ? 'border-red-600 text-red-600 bg-red-50' : 'border-gray-200 text-gray-600'"
                  @click="delegationMode = 'new'"
                >
                  New
                </button>
              </div>
              <div v-if="delegationMode === 'existing'" class="mt-3">
                <select
                  id="delegation-name"
                  v-model="form.delegationName"
                  required
                  class="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option disabled value="">Select delegation</option>
                  <option v-for="delegation in delegations" :key="delegation.name" :value="delegation.name">
                    {{ delegation.name }}
                  </option>
                </select>
              </div>
              <div v-else class="mt-3">
                <input
                  id="delegation-name"
                  v-model="form.delegationName"
                  required
                  class="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="New delegation name"
                />
              </div>
            </div>

            <div>
              <label for="school" class="text-sm font-bold text-gray-800">School *</label>
              <input
                id="school"
                v-model="form.school"
                required
                class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="School name"
                autocomplete="organization"
              />
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label for="event" class="text-sm font-bold text-gray-800">Conference *</label>
                <select
                  id="event"
                  v-model="form.event"
                  class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="SAMUN">SAMUN</option>
                  <option value="JMUN">JMUN</option>
                </select>
              </div>
              <div>
                <label for="participants" class="text-sm font-bold text-gray-800">Participants per committee *</label>
                <input
                  id="participants"
                  v-model="form.participants"
                  required
                  inputmode="numeric"
                  class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="e.g. 10"
                />
              </div>
            </div>

            <div>
              <label for="committees" class="text-sm font-bold text-gray-800">Committees attending *</label>
              <input
                id="committees"
                v-model="form.committees"
                required
                class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="e.g. DISEC, WHO, ECOSOC"
              />
            </div>

            <div class="border-t border-gray-100 pt-4">
              <h3 class="text-lg font-bold text-gray-900 mb-3">Supervisor Contact</h3>
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label for="supervisor-name" class="text-sm font-bold text-gray-800">Supervisor name *</label>
                  <input
                    id="supervisor-name"
                    v-model="form.supervisorName"
                    required
                    class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                    autocomplete="name"
                  />
                </div>
                <div>
                  <label for="supervisor-email" class="text-sm font-bold text-gray-800">Supervisor email *</label>
                  <input
                    id="supervisor-email"
                    v-model="form.supervisorEmail"
                    type="email"
                    required
                    class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                    autocomplete="email"
                    :disabled="!!(user && user.email)"
                    :class="{'bg-gray-50 text-gray-500': !!(user && user.email)}"
                  />
                </div>
              </div>
              <div class="mt-4">
                <label for="supervisor-phone" class="text-sm font-bold text-gray-800">Supervisor phone</label>
                <input
                  id="supervisor-phone"
                  v-model="form.supervisorPhone"
                  class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="+58"
                  autocomplete="tel"
                />
              </div>
            </div>

            <UiButton type="submit" class="w-full bg-red-600 hover:bg-red-700 text-white" :disabled="isSubmitting">
              {{ isSubmitting ? 'Submitting...' : 'Submit registration' }}
            </UiButton>
            <p v-if="submitError" class="text-sm text-red-600 font-semibold">{{ submitError }}</p>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>
