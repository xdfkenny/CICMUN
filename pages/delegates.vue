<script setup lang="ts">
import { Users, BookOpen } from 'lucide-vue-next'

definePageMeta({
  middleware: ['role'],
  auth: {
    required: true,
    roles: ['delegate'],
  },
})

useSeoMeta({
  title: 'Recursos para Delegados',
  ogTitle: 'Recursos para Delegados | CICMUN 2026',
  description: 'Información y recursos esenciales para los delegados de SAMUN y JMUN en CICMUN 2026.',
  ogDescription: 'Información y recursos esenciales para los delegados de SAMUN y JMUN en CICMUN 2026.',
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="container max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-5xl font-bold text-black mb-4 font-montserrat">Delegate Resources</h1>
        <p class="text-xl text-gray-700">
          Welcome, delegates! Choose your conference to explore event details, committees, and more.
        </p>
        <p class="text-sm text-gray-500 mt-3">
          You must sign in with your delegate account to access this section.
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-6 mb-12">
        <DelegateProgressTracker />
        <div class="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 class="text-xl font-bold font-montserrat mb-2">Quick Start</h3>
            <p class="text-gray-600 mb-6">New to MUN? Use the onboarding guide and your check-in QR.</p>
          </div>
          <div class="flex flex-col gap-3">
            <NuxtLink to="/onboarding" custom v-slot="{ navigate, href }">
              <UiButton as="a" :href="href" class="w-full bg-black hover:bg-gray-900 text-white" @click="navigate">
                Open Onboarding
              </UiButton>
            </NuxtLink>
            <NuxtLink to="/check-in" custom v-slot="{ navigate, href }">
              <UiButton as="a" :href="href" class="w-full bg-red-600 hover:bg-red-700 text-white" @click="navigate">
                My Check-in QR
              </UiButton>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Selection Buttons -->
      <div class="grid md:grid-cols-2 gap-8">
        <!-- SAMUN Button -->
        <NuxtLink to="/samun">
          <UiButton
            class="w-full h-auto p-8 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center gap-4"
          >
            <Users class="w-16 h-16" />
            <div class="text-center">
              <h2 class="text-3xl font-bold mb-2 font-montserrat">SAMUN 2026</h2>
              <p class="text-lg font-light">South American Model United Nations</p>
              <p class="text-sm mt-2 opacity-90">Grades 9-12</p>
            </div>
          </UiButton>
        </NuxtLink>

        <!-- JMUN Button -->
        <NuxtLink to="/jmun">
          <UiButton
            class="w-full h-auto p-8 bg-black hover:bg-gray-900 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center gap-4"
          >
            <BookOpen class="w-16 h-16" />
            <div class="text-center">
              <h2 class="text-3xl font-bold mb-2 font-montserrat">JMUN 2026</h2>
              <p class="text-lg font-light">Junior Model of United Nations</p>
              <p class="text-sm mt-2 opacity-90">Grades 6-8</p>
            </div>
          </UiButton>
        </NuxtLink>
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
            <li>Multiple UN committees</li>
            <li>Challenging topics</li>
            <li>Experienced chairs and staff</li>
            <li>Networking opportunities</li>
          </ul>
        </div>

        <!-- JMUN Info -->
        <div class="bg-white p-8 rounded-lg border-2 border-black shadow-md">
          <h3 class="text-2xl font-bold text-black mb-4 font-montserrat">About JMUN</h3>
          <p class="text-gray-700 mb-4">
            The Junior Model United Nations provides middle school students with their first introduction to diplomatic simulation and international affairs.
          </p>
          <ul class="space-y-2 text-gray-700">
            <li>Beginner-friendly committees</li>
            <li>Supportive environment</li>
            <li>Educational focus</li>
            <li>Fun and engaging activities</li>
          </ul>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="mt-16 bg-white p-8 rounded-lg shadow-md">
        <h3 class="text-2xl font-bold text-black mb-6 font-montserrat">Quick Questions?</h3>
        <div class="space-y-4">
          <div>
            <p class="font-bold text-gray-900">Where is it held?</p>
            <p class="text-gray-700">Colegio Internacional de Caracas, Caracas, Venezuela</p>
          </div>
          <div>
            <p class="font-bold text-gray-900">Do I need experience?</p>
            <p class="text-gray-700">No! Both conferences welcome delegates of all experience levels.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
