<script setup lang="ts">
const route = useRoute()
const isActive = (path: string) => route.path === path
</script>

<template>
  <nav class="sticky top-0 z-50 bg-white border-b-2 border-black shadow-md">
    <div class="container flex items-center justify-between h-20">
      <!-- Logo and Brand -->
      <NuxtLink to="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div class="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
          <span class="text-white font-bold text-lg">CIC</span>
        </div>
        <div class="hidden sm:block">
          <h1 class="text-lg font-bold text-black leading-tight">CICMUN</h1>
          <p class="text-xs text-gray-600">Delegate Portal</p>
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

        <NuxtLink to="/samun">
          <UiButton
            :variant="isActive('/samun') ? 'default' : 'ghost'"
            :class="isActive('/samun') ? 'bg-red-600 hover:bg-red-700 text-white' : 'text-black hover:bg-gray-100'"
          >
            SAMUN
          </UiButton>
        </NuxtLink>

        <NuxtLink to="/jmun">
          <UiButton
            :variant="isActive('/jmun') ? 'default' : 'ghost'"
            :class="isActive('/jmun') ? 'bg-red-600 hover:bg-red-700 text-white' : 'text-black hover:bg-gray-100'"
          >
            JMUN
          </UiButton>
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>
