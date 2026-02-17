<script setup lang="ts">
useSeoMeta({
  title: 'Login',
  ogTitle: 'Login | CICMUN 2026',
  description: 'Sign in to access delegate-only resources for CICMUN 2026.',
  ogDescription: 'Sign in to access delegate-only resources for CICMUN 2026.',
})

const { login, loginWithGoogle, loginAnonymousStudent, error, isAuthenticated, ready } = useAuth()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const isSubmitting = ref(false)
const formError = ref<string | null>(null)

const redirectTo = computed(() => {
  const target = route.query.redirect
  if (typeof target !== 'string') return '/'
  const trimmed = target.trim()
  if (!trimmed) return '/'
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.includes('://')) {
    return '/'
  }
  return trimmed
})

const submit = async () => {
  formError.value = null
  isSubmitting.value = true

  try {
    await login(email.value.trim(), password.value)
    await router.push(redirectTo.value)
  } catch (err: any) {
    formError.value = err?.message || 'Login failed'
  } finally {
    isSubmitting.value = false
  }
}

const loginStudent = async () => {
  formError.value = null
  isSubmitting.value = true

  try {
    await loginAnonymousStudent()
    await router.push('/student/join')
  } catch (err: any) {
    formError.value = err?.message || 'Student login failed'
  } finally {
    isSubmitting.value = false
  }
}
const loginGoogle = async () => {
  formError.value = null
  isSubmitting.value = true

  try {
    await loginWithGoogle()
    await router.push(redirectTo.value)
  } catch (err: any) {
    formError.value = err?.message || 'Google login failed'
  } finally {
    isSubmitting.value = false
  }
}

watchEffect(() => {
  if (ready.value && isAuthenticated.value) {
    router.replace(redirectTo.value)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="container max-w-md mx-auto">
      <div class="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
        <h1 class="text-3xl font-bold text-black mb-2 font-montserrat">Login</h1>
        <p class="text-gray-600 mb-6">
          Choose your access type. Teachers, staff, and admins use email. Students use a teacher code.
        </p>

        <div class="grid gap-3 mb-6">
          <UiButton type="button" class="w-full bg-black hover:bg-gray-900 text-white" :disabled="isSubmitting" @click="loginGoogle">
            Continue with Google (Teachers / Staff / Admins)
          </UiButton>
          <UiButton type="button" class="w-full bg-gray-100 hover:bg-gray-200 text-black" :disabled="isSubmitting" @click="loginStudent">
            Student Login with Code
          </UiButton>
        </div>

        <div class="flex items-center gap-3 my-4 text-xs text-gray-400">
          <div class="flex-1 h-px bg-gray-200"></div>
          or use email/password
          <div class="flex-1 h-px bg-gray-200"></div>
        </div>

        <form class="space-y-5" @submit.prevent="submit">
          <div>
            <label for="login-email" class="text-sm font-bold text-gray-800">Email</label>
            <input
              id="login-email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="you@school.edu"
            />
          </div>

          <div>
            <label for="login-password" class="text-sm font-bold text-gray-800">Password</label>
            <input
              id="login-password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              required
              class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="••••••••"
            />
          </div>

          <div v-if="formError || error" class="text-sm text-red-600 font-medium">
            {{ formError || error }}
          </div>

          <UiButton
            type="submit"
            class="w-full bg-red-600 hover:bg-red-700 text-white"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Signing in...' : 'Sign in' }}
          </UiButton>
        </form>
      </div>
    </div>
  </div>
</template>
