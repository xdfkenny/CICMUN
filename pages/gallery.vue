<script setup lang="ts">
import { Camera } from 'lucide-vue-next'

useSeoMeta({
  title: 'Galería de Fotos',
  ogTitle: 'Galería de Fotos | CICMUN 2026',
  description: 'Revive los mejores momentos de las conferencias CICMUN a través de nuestra galería de fotos.',
  ogDescription: 'Revive los mejores momentos de las conferencias CICMUN a través de nuestra galería de fotos.',
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="text-center max-w-2xl bg-white p-12 rounded-2xl shadow-xl">
      <div class="mb-6 inline-flex bg-red-100 p-6 rounded-full">
        <Camera class="w-16 h-16 text-red-600" />
      </div>
      <h1 class="text-4xl md:text-5xl font-bold mb-4 font-montserrat text-black">Photo Gallery</h1>
      <h2 class="text-2xl text-gray-500 font-light mb-8">Coming Soon</h2>
      <p class="text-lg text-gray-600 leading-relaxed">
        We are currently finalizing our photo collection. Please check back later to see highlights from CICMUN conferences.
      </p>
      <div class="mt-8">
        <NuxtLink to="/" class="inline-flex items-center gap-2 text-black font-bold hover:underline">
          Return to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
