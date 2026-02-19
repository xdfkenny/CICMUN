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
const hasNavigated = ref(false)

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
    hasNavigated.value = true
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
    hasNavigated.value = true
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
    hasNavigated.value = true
    await router.push(redirectTo.value)
  } catch (err: any) {
    formError.value = err?.message || 'Google login failed'
  } finally {
    isSubmitting.value = false
  }
}

watchEffect(() => {
  if (ready.value && isAuthenticated.value && !hasNavigated.value) {
    router.replace(redirectTo.value)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 py-10 sm:py-12 px-4">
    <div class="container max-w-6xl mx-auto grid gap-6 sm:gap-8 lg:gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start lg:items-center">
      <div class="order-2 lg:order-1 relative overflow-hidden rounded-3xl border border-red-200 bg-gradient-to-br from-red-700 via-red-600 to-red-800 text-white p-5 sm:p-8 md:p-12 shadow-2xl">
        <div class="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div class="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-black/20 blur-3xl"></div>

        <p class="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/80 mb-4">CICMUN Delegate Portal</p>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold font-montserrat mb-3 sm:mb-4">Welcome Back</h1>
        <p class="text-base sm:text-lg text-white/90 max-w-xl">
          Choose the fastest way to access your resources. Staff and teachers use Google or email.
          Students enter with a teacher code.
        </p>

        <div class="mt-5 sm:mt-8 grid gap-4 hidden sm:grid">
          <div class="flex items-start gap-3">
            <div class="h-9 w-9 flex items-center justify-center rounded-full bg-white/15 text-sm font-bold">1</div>
            <div>
              <p class="font-semibold">Teachers, staff, and admins</p>
              <p class="text-sm text-white/80">Use Google or your email/password.</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="h-9 w-9 flex items-center justify-center rounded-full bg-white/15 text-sm font-bold">2</div>
            <div>
              <p class="font-semibold">Students</p>
              <p class="text-sm text-white/80">Use the code provided by your advisor.</p>
            </div>
          </div>
        </div>

        <div class="mt-5 flex flex-wrap gap-2 text-[11px] uppercase tracking-widest text-white/85 sm:hidden">
          <span class="rounded-full border border-white/30 px-3 py-1.5">Teachers & Staff</span>
          <span class="rounded-full border border-white/30 px-3 py-1.5">Student Code</span>
        </div>

        <div class="mt-6 sm:mt-8 hidden sm:flex flex-wrap gap-3 text-xs uppercase tracking-widest text-white/80">
          <span class="rounded-full border border-white/30 px-4 py-2">Google Sign-In</span>
          <span class="rounded-full border border-white/30 px-4 py-2">Student Code</span>
        </div>
      </div>

      <div class="order-1 lg:order-2 bg-white border border-gray-200 rounded-3xl shadow-xl p-6 sm:p-8 md:p-10">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-3xl font-bold text-black font-montserrat">Login</h2>
          <span class="text-[10px] uppercase tracking-[0.3em] text-gray-400">Secure Access</span>
        </div>
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
          <p class="text-xs text-gray-500 text-center">Need a code? Ask your advisor or committee staff.</p>
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
              placeholder="********"
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
