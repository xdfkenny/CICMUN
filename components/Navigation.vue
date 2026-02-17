<script setup lang="ts">
import { Home, Users, Calendar, BookOpen, Image, Instagram, LogIn, LogOut } from 'lucide-vue-next'
import type { AuthRole } from '~/composables/useAuth'
import { useRoleOverrideStore } from '~/stores/roleOverride'
const route = useRoute()
const router = useRouter()
const isActive = (path: string) => route.path === path
const { effectiveRole, role, isAuthenticated, logout, ready, setViewAsRole } = useAuth()
const roleOverrideStore = useRoleOverrideStore()
const roleOverrideOptions: AuthRole[] = ['public', 'delegate', 'teacher', 'staff', 'admin', 'super_admin']
const overrideSelection = computed({
  get: () => roleOverrideStore.overrideRole ?? '',
  set: (value: string) => {
    roleOverrideStore.setOverrideRole(value ? (value as AuthRole) : null)
  },
})

const canSeeDelegateLinks = computed(() => ready.value && isAuthenticated.value && effectiveRole.value === 'delegate')
const canSeeTeacher = computed(() => ready.value && isAuthenticated.value && effectiveRole.value === 'teacher')
const canSeeStaff = computed(() => ready.value && isAuthenticated.value && effectiveRole.value === 'staff')
const canSeeAdmin = computed(() => ready.value && isAuthenticated.value && (effectiveRole.value === 'admin' || effectiveRole.value === 'super_admin'))
const isPreviewing = computed(() => role.value === 'super_admin' && effectiveRole.value !== role.value)

const isMenuOpen = ref(false)
const isAccessOpen = ref(false)
const accessMenuRef = ref<HTMLElement | null>(null)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
}

// Close menu when route changes
watch(() => route.path, () => {
  isMenuOpen.value = false
  document.body.style.overflow = 'auto'
})

const goLogin = () => {
  router.push(`/login?redirect=${encodeURIComponent(route.fullPath)}`)
}

const doLogout = async () => {
  await logout()
  router.push('/')
}

const openAccessMenu = () => {
  isAccessOpen.value = true
}

const closeAccessMenu = (event?: FocusEvent) => {
  const nextTarget = event?.relatedTarget as Node | null
  if (accessMenuRef.value && nextTarget && accessMenuRef.value.contains(nextTarget)) {
    return
  }
  isAccessOpen.value = false
}

</script>

<template>
  <nav class="sticky top-0 z-50 bg-white border-b-2 border-black shadow-md">
    <div class="container flex items-center justify-between h-20 px-4 mx-auto">
      <!-- Logo and Brand -->
      <NuxtLink to="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity flex-shrink-0 z-50">
        <img src="/LOGO.png" alt="CICMUN Logo" class="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
        <div>
          <h1 class="text-base sm:text-lg font-bold text-black leading-tight tracking-widest">CICMUN</h1>
        </div>
      </NuxtLink>
      
      <!-- Desktop Navigation Links -->
      <div class="hidden lg:flex items-center gap-1 sm:gap-2">
        <NuxtLink to="/">
          <UiButton
            :variant="isActive('/') ? 'default' : 'ghost'"
            :class="`${isActive('/') ? 'bg-red-600 hover:bg-red-700 text-white' : 'text-black hover:bg-gray-100'} flex items-center gap-2 px-3 sm:px-4`"
          >
            <Home class="w-5 h-5" />
            <span class="hidden md:inline">Home</span>
          </UiButton>
        </NuxtLink>

        <NuxtLink v-if="canSeeDelegateLinks" to="/delegates">
          <UiButton
            :variant="isActive('/delegates') ? 'default' : 'ghost'"
            :class="`${isActive('/delegates') ? 'bg-red-600 hover:bg-red-700 text-white' : 'text-black hover:bg-gray-100'} flex items-center gap-2 px-3 sm:px-4`"
          >
            <Users class="w-5 h-5" />
            <span class="hidden md:inline">Delegates</span>
          </UiButton>
        </NuxtLink>

        <NuxtLink to="/schedule">
          <UiButton
            :variant="isActive('/schedule') ? 'default' : 'ghost'"
            :class="`${isActive('/schedule') ? 'bg-red-600 hover:bg-red-700 text-white' : 'text-black hover:bg-gray-100'} flex items-center gap-2 px-3 sm:px-4`"
          >
            <Calendar class="w-5 h-5" />
            <span class="hidden md:inline">Schedule</span>
          </UiButton>
        </NuxtLink>

        <NuxtLink v-if="canSeeDelegateLinks" to="/resources">
          <UiButton
            :variant="isActive('/resources') ? 'default' : 'ghost'"
            :class="`${isActive('/resources') ? 'bg-red-600 hover:bg-red-700 text-white' : 'text-black hover:bg-gray-100'} flex items-center gap-2 px-3 sm:px-4`"
          >
            <BookOpen class="w-5 h-5" />
            <span class="hidden md:inline">Resources</span>
          </UiButton>
        </NuxtLink>

        <NuxtLink to="/gallery">
          <UiButton
            :variant="isActive('/gallery') ? 'default' : 'ghost'"
            :class="`${isActive('/gallery') ? 'bg-red-600 hover:bg-red-700 text-white' : 'text-black hover:bg-gray-100'} flex items-center gap-2 px-3 sm:px-4`"
          >
            <Image class="w-5 h-5" />
            <span class="hidden md:inline">Gallery</span>
          </UiButton>
        </NuxtLink>

        <NuxtLink v-if="canSeeTeacher" to="/teacher">
          <UiButton
            :variant="isActive('/teacher') ? 'default' : 'ghost'"
            :class="`${isActive('/teacher') ? 'bg-black text-white' : 'text-black hover:bg-gray-100'} flex items-center gap-2 px-3 sm:px-4`"
          >
            <Users class="w-5 h-5" />
            <span class="hidden md:inline">Teacher</span>
          </UiButton>
        </NuxtLink>

        <NuxtLink v-if="canSeeStaff" to="/staff/check-in">
          <UiButton
            :variant="isActive('/staff/check-in') ? 'default' : 'ghost'"
            :class="`${isActive('/staff/check-in') ? 'bg-black text-white' : 'text-black hover:bg-gray-100'} flex items-center gap-2 px-3 sm:px-4`"
          >
            <Users class="w-5 h-5" />
            <span class="hidden md:inline">Staff</span>
          </UiButton>
        </NuxtLink>

        <NuxtLink v-if="canSeeAdmin" to="/admin">
          <UiButton
            :variant="isActive('/admin') ? 'default' : 'ghost'"
            :class="`${isActive('/admin') ? 'bg-black text-white' : 'text-black hover:bg-gray-100'} flex items-center gap-2 px-3 sm:px-4`"
          >
            <Users class="w-5 h-5" />
            <span class="hidden md:inline">Admin</span>
          </UiButton>
        </NuxtLink>

        <div
          ref="accessMenuRef"
          class="relative group ml-2"
          @focusin="openAccessMenu"
          @focusout="closeAccessMenu"
          @keydown.escape="isAccessOpen = false"
        >
          <UiButton
            type="button"
            variant="ghost"
            class="text-black hover:bg-gray-100 flex items-center gap-2 px-3 sm:px-4"
            aria-haspopup="menu"
            :aria-expanded="isAccessOpen ? 'true' : 'false'"
            @click="openAccessMenu"
            @focus="openAccessMenu"
          >
            <Users class="w-5 h-5" />
            <span class="hidden md:inline">Access</span>
          </UiButton>

          <div
            :class="[
              'absolute right-0 mt-2 w-52 rounded-xl border border-gray-200 bg-white shadow-lg opacity-0 pointer-events-none transition',
              'group-hover:opacity-100 group-focus-within:opacity-100 group-hover:pointer-events-auto group-focus-within:pointer-events-auto',
              isAccessOpen ? 'opacity-100 pointer-events-auto' : ''
            ]"
            role="menu"
            aria-label="Access menu"
          >
            <NuxtLink
              to="/register"
              class="flex items-center gap-2 px-4 py-3 text-sm text-black hover:bg-gray-50 rounded-t-xl"
              role="menuitem"
            >
              <Users class="w-4 h-4" />
              Register Delegation
            </NuxtLink>
            <div v-if="isPreviewing" class="px-4 py-2 text-xs text-gray-500">
              Previewing as {{ effectiveRole }}
            </div>
            <div v-if="ready && isAuthenticated" class="px-4 py-3 border-t border-gray-100">
              <p class="text-[10px] uppercase tracking-widest text-gray-400">Role override</p>
              <select
                v-model="overrideSelection"
                class="mt-2 w-full rounded-lg border border-gray-200 px-2 py-2 text-xs"
              >
                <option value="">No override</option>
                <option v-for="roleOption in roleOverrideOptions" :key="roleOption" :value="roleOption">
                  {{ roleOption }}
                </option>
              </select>
              <button
                v-if="roleOverrideStore.overrideRole"
                type="button"
                class="mt-2 text-xs text-red-600 hover:text-red-700"
                @click="roleOverrideStore.clearOverrideRole()"
              >
                Clear override
              </button>
            </div>
            <button
              v-if="!isAuthenticated"
              :class="`w-full flex items-center gap-2 px-4 py-3 text-sm text-black hover:bg-gray-50 ${isPreviewing ? '' : 'rounded-b-xl'}`"
              role="menuitem"
              @click="goLogin"
            >
              <LogIn class="w-4 h-4" />
              Login
            </button>
            <button
              v-else
              :class="`w-full flex items-center gap-2 px-4 py-3 text-sm text-black hover:bg-gray-50 ${isPreviewing ? '' : 'rounded-b-xl'}`"
              role="menuitem"
              @click="doLogout"
            >
              <LogOut class="w-4 h-4" />
              Logout
            </button>
            <button
              v-if="isPreviewing"
              class="w-full flex items-center gap-2 px-4 py-3 text-sm text-black hover:bg-gray-50 rounded-b-xl"
              role="menuitem"
              @click="setViewAsRole(null)"
            >
              <LogIn class="w-4 h-4" />
              Exit Preview
            </button>
          </div>
        </div>

        <a 
          href="https://www.instagram.com/cicmunve/" 
          target="_blank" 
          rel="noopener noreferrer"
          class="relative group"
        >
          <UiButton
            variant="ghost"
            class="text-black hover:text-white px-3 transition-all duration-300 relative overflow-hidden group-hover:shadow-[0_0_15px_rgba(219,39,119,0.3)]"
          >
            <!-- Background gradient on hover -->
            <div class="absolute inset-0 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Instagram class="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
          </UiButton>
        </a>
      </div>

      <!-- Mobile Hamburger Button -->
      <button 
        @click="toggleMenu" 
        class="lg:hidden z-50 p-2 text-black hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
        aria-label="Toggle Menu"
      >
        <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M20 17.5a1.5 1.5 0 0 1 .144 2.993L20 20.5H4a1.5 1.5 0 0 1-.144-2.993L4 17.5zm0-7a1.5 1.5 0 0 1 0 3H4a1.5 1.5 0 0 1 0-3zm0-7a1.5 1.5 0 0 1 0 3H4a1.5 1.5 0 1 1 0-3z"/></g></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"/></svg>
      </button>

      <!-- Mobile Menu Overlay -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <div v-if="isMenuOpen" class="fixed inset-0 z-40 bg-white lg:hidden flex flex-col pt-24 px-6 gap-4 overflow-y-auto">
          <NuxtLink to="/" class="group">
            <div :class="`flex items-center gap-4 p-4 rounded-xl transition-all ${isActive('/') ? 'bg-red-50 text-red-600 shadow-sm' : 'text-black hover:bg-gray-50'}`">
              <div :class="`p-3 rounded-lg ${isActive('/') ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-red-600 group-hover:text-white transition-colors'}`">
                <Home class="w-6 h-6" />
              </div>
              <span class="text-xl font-bold">Home</span>
            </div>
          </NuxtLink>

          <NuxtLink v-if="canSeeDelegateLinks" to="/delegates" class="group">
            <div :class="`flex items-center gap-4 p-4 rounded-xl transition-all ${isActive('/delegates') ? 'bg-red-50 text-red-600 shadow-sm' : 'text-black hover:bg-gray-50'}`">
              <div :class="`p-3 rounded-lg ${isActive('/delegates') ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-red-600 group-hover:text-white transition-colors'}`">
                <Users class="w-6 h-6" />
              </div>
              <span class="text-xl font-bold">Delegates</span>
            </div>
          </NuxtLink>

          <NuxtLink to="/schedule" class="group">
            <div :class="`flex items-center gap-4 p-4 rounded-xl transition-all ${isActive('/schedule') ? 'bg-red-50 text-red-600 shadow-sm' : 'text-black hover:bg-gray-50'}`">
              <div :class="`p-3 rounded-lg ${isActive('/schedule') ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-red-600 group-hover:text-white transition-colors'}`">
                <Calendar class="w-6 h-6" />
              </div>
              <span class="text-xl font-bold">Schedule</span>
            </div>
          </NuxtLink>

          <div class="group">
            <div class="flex items-start gap-4 p-4 rounded-xl transition-all text-black hover:bg-gray-50">
              <div class="p-3 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                <Users class="w-6 h-6" />
              </div>
              <div class="flex flex-col gap-2">
                <NuxtLink to="/register" class="text-xl font-bold">
                  Register Delegation
                </NuxtLink>
                <span v-if="isPreviewing" class="text-xs text-gray-500">
                  Previewing as {{ effectiveRole }}
                </span>
                <div v-if="ready && isAuthenticated" class="mt-2">
                  <p class="text-[10px] uppercase tracking-widest text-gray-400">Role override</p>
                  <select
                    v-model="overrideSelection"
                    class="mt-2 w-full rounded-lg border border-gray-200 px-2 py-2 text-xs"
                  >
                    <option value="">No override</option>
                    <option v-for="roleOption in roleOverrideOptions" :key="roleOption" :value="roleOption">
                      {{ roleOption }}
                    </option>
                  </select>
                  <button
                    v-if="roleOverrideStore.overrideRole"
                    type="button"
                    class="mt-2 text-xs text-red-600 hover:text-red-700"
                    @click="roleOverrideStore.clearOverrideRole()"
                  >
                    Clear override
                  </button>
                </div>
                <button
                  v-if="!isAuthenticated"
                  class="text-sm text-left text-gray-600 hover:text-black"
                  @click="goLogin"
                >
                  Login
                </button>
                <button
                  v-else
                  class="text-sm text-left text-gray-600 hover:text-black"
                  @click="doLogout"
                >
                  Logout
                </button>
                <button
                  v-if="isPreviewing"
                  class="text-sm text-left text-gray-600 hover:text-black"
                  @click="setViewAsRole(null)"
                >
                  Exit Preview
                </button>
              </div>
            </div>
          </div>

          <NuxtLink v-if="canSeeDelegateLinks" to="/resources" class="group">
            <div :class="`flex items-center gap-4 p-4 rounded-xl transition-all ${isActive('/resources') ? 'bg-red-50 text-red-600 shadow-sm' : 'text-black hover:bg-gray-50'}`">
              <div :class="`p-3 rounded-lg ${isActive('/resources') ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-red-600 group-hover:text-white transition-colors'}`">
                <BookOpen class="w-6 h-6" />
              </div>
              <span class="text-xl font-bold">Resources</span>
            </div>
          </NuxtLink>

          <NuxtLink to="/gallery" class="group">
            <div :class="`flex items-center gap-4 p-4 rounded-xl transition-all ${isActive('/gallery') ? 'bg-red-50 text-red-600 shadow-sm' : 'text-black hover:bg-gray-50'}`">
              <div :class="`p-3 rounded-lg ${isActive('/gallery') ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-red-600 group-hover:text-white transition-colors'}`">
                <Image class="w-6 h-6" />
              </div>
              <span class="text-xl font-bold">Gallery</span>
            </div>
          </NuxtLink>

          <NuxtLink v-if="canSeeTeacher" to="/teacher" class="group">
            <div :class="`flex items-center gap-4 p-4 rounded-xl transition-all ${isActive('/teacher') ? 'bg-red-50 text-red-600 shadow-sm' : 'text-black hover:bg-gray-50'}`">
              <div :class="`p-3 rounded-lg ${isActive('/teacher') ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-red-600 group-hover:text-white transition-colors'}`">
                <Users class="w-6 h-6" />
              </div>
              <span class="text-xl font-bold">Teacher</span>
            </div>
          </NuxtLink>

          <NuxtLink v-if="canSeeStaff" to="/staff/check-in" class="group">
            <div :class="`flex items-center gap-4 p-4 rounded-xl transition-all ${isActive('/staff/check-in') ? 'bg-red-50 text-red-600 shadow-sm' : 'text-black hover:bg-gray-50'}`">
              <div :class="`p-3 rounded-lg ${isActive('/staff/check-in') ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-red-600 group-hover:text-white transition-colors'}`">
                <Users class="w-6 h-6" />
              </div>
              <span class="text-xl font-bold">Staff</span>
            </div>
          </NuxtLink>

          <NuxtLink v-if="canSeeAdmin" to="/admin" class="group">
            <div :class="`flex items-center gap-4 p-4 rounded-xl transition-all ${isActive('/admin') ? 'bg-red-50 text-red-600 shadow-sm' : 'text-black hover:bg-gray-50'}`">
              <div :class="`p-3 rounded-lg ${isActive('/admin') ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-red-600 group-hover:text-white transition-colors'}`">
                <Users class="w-6 h-6" />
              </div>
              <span class="text-xl font-bold">Admin</span>
            </div>
          </NuxtLink>

          <div class="mt-auto pb-10 flex flex-col items-center gap-6">
            <div class="w-full h-px bg-gray-100"></div>
            
            <a 
              href="https://www.instagram.com/cicmunve/" 
              target="_blank" 
              rel="noopener noreferrer"
              class="flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-bold shadow-lg hover:scale-105 transition-transform"
            >
              <Instagram class="w-6 h-6" />
              Follow @cicmunve
            </a>

            <div class="flex flex-col items-center gap-4">
              <div class="flex items-center gap-2 opacity-30">
                <img src="/LOGO.png" alt="CICMUN Logo" class="w-8 h-8 grayscale" />
                <span class="font-bold tracking-widest text-sm">CICMUN</span>
              </div>

              <div class="flex flex-col items-center gap-1">
                <p class="text-[10px] text-gray-400 opacity-60">
                  © {{ new Date().getFullYear() }} Colegio Internacional de Caracas
                </p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </nav>
</template>
