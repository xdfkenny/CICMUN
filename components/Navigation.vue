<script setup lang="ts">
const route = useRoute()
const isActive = (path: string) => route.path === path
</script>

<template>
  <nav class="sticky top-0 z-50 bg-white border-b-2 border-black shadow-md">
    <div class="container flex items-center justify-between h-20">
      <!-- Logo and Brand -->
      <NuxtLink to="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <img src="/LOGO.png" alt="CICMUN Logo" class="w-12 h-12 object-contain" />
        <div class="hidden sm:block">
          <h1 class="text-lg font-bold text-black leading-tight">CICMUN</h1>
        </div>
      </NuxtLink>
      
      <!-- Navigation Links -->
      <div class="flex items-center gap-2 sm:gap-4">
        <NuxtLink to="/">
          <UiButton
            :variant="isActive('/') ? 'default' : 'ghost'"
            :class="isActive('/') ? 'bg-red-600 hover:bg-red-700 text-white' : 'text-black hover:bg-gray-100'"
          >
            Home
          </UiButton>
        </NuxtLink>

        <NuxtLink to="/delegates">
          <UiButton
            :variant="isActive('/delegates') ? 'default' : 'ghost'"
            :class="isActive('/delegates') ? 'bg-red-600 hover:bg-red-700 text-white' : 'text-black hover:bg-gray-100'"
          >
            Delegates
          </UiButton>
        </NuxtLink>

        <NuxtLink to="/schedule">
          <UiButton
            :variant="isActive('/schedule') ? 'default' : 'ghost'"
            :class="isActive('/schedule') ? 'bg-red-600 hover:bg-red-700 text-white' : 'text-black hover:bg-gray-100'"
          >
            Schedule
          </UiButton>
        </NuxtLink>

        <NuxtLink to="/resources">
          <UiButton
            :variant="isActive('/resources') ? 'default' : 'ghost'"
            :class="isActive('/resources') ? 'bg-red-600 hover:bg-red-700 text-white' : 'text-black hover:bg-gray-100'"
          >
            Resources
          </UiButton>
        </NuxtLink>

        <NuxtLink to="/gallery">
          <UiButton
            :variant="isActive('/gallery') ? 'default' : 'ghost'"
            :class="isActive('/gallery') ? 'bg-red-600 hover:bg-red-700 text-white' : 'text-black hover:bg-gray-100'"
          >
            Gallery
          </UiButton>
        </NuxtLink>

      </div>
    </div>
  </nav>
</template>
