<script setup lang="ts">
import { Users, BookOpen } from 'lucide-vue-next'

useSeoMeta({
  title: 'Delegate Resources',
  ogTitle: 'Delegate Resources | CICMUN 2026',
  description: 'Essential information and resources for SAMUN and JMUN delegates at CICMUN 2026.',
  ogDescription: 'Essential information and resources for SAMUN and JMUN delegates at CICMUN 2026.',
})

</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="container max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-bold text-black mb-4 font-montserrat tracking-tight">Delegate Resources</h1>
        <p class="text-xl text-gray-700">
          Welcome, delegates! Choose your conference to explore event details, committees, and more.
        </p>
      </div>

      <!-- Selection Buttons -->
      <div class="grid md:grid-cols-2 gap-8">
        <!-- SAMUN Button -->
        <UiButton
          asChild
          class="w-full h-auto p-8 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center gap-4"
        >
          <NuxtLink to="/samun">
            <Users class="w-16 h-16" />
            <div class="text-center">
              <h2 class="text-3xl font-bold mb-2 font-montserrat">SAMUN 2026</h2>
              <p class="text-lg font-light">South American Model United Nations</p>
              <p class="text-sm mt-2 opacity-90">Grades 9-12</p>
            </div>
          </NuxtLink>
        </UiButton>

        <!-- JMUN Button -->
        <UiButton
          asChild
          class="w-full h-auto p-8 bg-black hover:bg-gray-900 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center gap-4"
        >
          <NuxtLink to="/jmun">
            <BookOpen class="w-16 h-16" />
            <div class="text-center">
              <h2 class="text-3xl font-bold mb-2 font-montserrat">JMUN 2026</h2>
              <p class="text-lg font-light">Junior Model of United Nations</p>
              <p class="text-sm mt-2 opacity-90">Grades 6-8</p>
            </div>
          </NuxtLink>
        </UiButton>
      </div>

      <!-- Information Cards -->
      <div class="mt-16 grid md:grid-cols-2 gap-8">
        <!-- SAMUN Info -->
        <div class="bg-white p-8 rounded-lg border-2 border-red-600 shadow-md">
          <h3 class="text-2xl font-bold text-red-600 mb-4 font-montserrat">About SAMUN</h3>
          <p class="text-gray-700 mb-4">
            The South American Model United Nations is our flagship conference, bringing together high school delegates from across the region.
          </p>
          <ul class="space-y-2 text-gray-700">
            <li>✓ Multiple UN committees</li>
            <li>✓ Challenging topics</li>
            <li>✓ Experienced chairs and staff</li>
            <li>✓ Networking opportunities</li>
          </ul>
        </div>

        <!-- JMUN Info -->
        <div class="bg-white p-8 rounded-lg border-2 border-black shadow-md">
          <h3 class="text-2xl font-bold text-black mb-4 font-montserrat">About JMUN</h3>
          <p class="text-gray-700 mb-4">
            The Junior Model United Nations provides middle school students with their first introduction to diplomatic simulation and international affairs.
          </p>
          <ul class="space-y-2 text-gray-700">
            <li>✓ Beginner-friendly committees</li>
            <li>✓ Supportive environment</li>
            <li>✓ Educational focus</li>
            <li>✓ Fun and engaging activities</li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</template>
