<script setup lang="ts">
definePageMeta({
  middleware: ['role'],
  auth: {
    required: true,
    roles: ['delegate'],
  },
})

const steps = [
  { title: 'Research the topic', body: 'Read the guide and gather reliable sources.' },
  { title: 'Define your country position', body: 'Identify allies and key interests.' },
  { title: 'Write your position paper', body: 'Summarize stance and solutions.' },
  { title: 'Practice your speech', body: 'Time, clarity, and key data.' },
  { title: 'Negotiate and draft resolutions', body: 'Build coalitions and consensus.' },
]
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="container max-w-4xl mx-auto">
      <h1 class="text-4xl md:text-5xl font-bold text-black mb-4 font-montserrat">
        How MUN works
      </h1>
      <p class="text-lg text-gray-600 mb-10">
        Quick guide for delegates, especially JMUN.
      </p>

      <div class="grid md:grid-cols-2 gap-6">
        <div v-for="step in steps" :key="step.title" class="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h3 class="text-xl font-bold mb-2 font-montserrat">{{ step.title }}</h3>
          <p class="text-gray-700">{{ step.body }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
