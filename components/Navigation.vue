<script setup lang="ts">
import { Home, Users, Calendar, BookOpen, Image, Instagram, Menu, X } from 'lucide-vue-next'
const route = useRoute()
const isActive = (path: string) => route.path === path

const isMenuOpen = ref(false)
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

        <NuxtLink to="/delegates">
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

        <NuxtLink to="/resources">
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

        <div class="h-8 w-px bg-gray-200 mx-2"></div>

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
        class="lg:hidden z-50 p-2 text-black hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Toggle Menu"
      >
        <Menu v-if="!isMenuOpen" class="w-8 h-8" />
        <X v-else class="w-8 h-8" />
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

          <NuxtLink to="/delegates" class="group">
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

          <NuxtLink to="/resources" class="group">
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
            <div class="flex items-center gap-2 opacity-30">
              <img src="/LOGO.png" alt="CICMUN Logo" class="w-8 h-8 grayscale" />
              <span class="font-bold tracking-widest text-sm">CICMUN</span>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </nav>
</template>
