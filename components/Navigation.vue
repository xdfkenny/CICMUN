<script setup lang="ts">
import { Home, Users, Calendar, BookOpen, Image, Instagram } from 'lucide-vue-next'
const route = useRoute()
const isActive = (path: string) => route.path === path
</script>

<template>
  <nav class="sticky top-0 z-50 bg-white border-b-2 border-black shadow-md">
    <div class="container flex items-center justify-between h-20 px-4">
      <!-- Logo and Brand -->
      <NuxtLink to="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity flex-shrink-0">
        <img src="/LOGO.png" alt="CICMUN Logo" class="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
        <div class="hidden xs:block">
          <h1 class="text-base sm:text-lg font-bold text-black leading-tight">CICMUN</h1>
        </div>
      </NuxtLink>
      
      <!-- Navigation Links -->
      <div class="flex items-center gap-1 sm:gap-2">
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

        <div class="h-8 w-px bg-gray-200 mx-2 hidden sm:block"></div>

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
    </div>
  </nav>
</template>
