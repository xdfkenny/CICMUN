<script setup lang="ts">
import { Camera, Image as ImageIcon, Filter } from 'lucide-vue-next'

useSeoMeta({
  title: 'Galería de Fotos',
  ogTitle: 'Galería de Fotos | CICMUN 2026',
  description: 'Revive los mejores momentos de las conferencias CICMUN a través de nuestra galería de fotos.',
  ogDescription: 'Revive los mejores momentos de las conferencias CICMUN a través de nuestra galería de fotos.',
})

interface GalleryEvent {
  id: string
  name: string
  images: string[]
}

const { data: galleryEvents, pending } = await useFetch<GalleryEvent[]>('/api/gallery')

const selectedEventId = ref<string>('all')

const filteredImages = computed(() => {
  if (!galleryEvents.value) return []
  if (selectedEventId.value === 'all') {
    return galleryEvents.value.flatMap(e => e.images)
  }
  return galleryEvents.value.find(e => e.id === selectedEventId.value)?.images || []
})

const selectEvent = (id: string) => {
  selectedEventId.value = id
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="container mx-auto max-w-7xl">
      <!-- Header Section -->
      <div class="text-center mb-16">
        <div class="mb-6 inline-flex bg-red-100 p-6 rounded-full">
          <Camera class="w-12 h-12 text-red-600" />
        </div>
        <h1 class="text-4xl md:text-6xl font-extrabold mb-4 font-montserrat text-black tracking-tight uppercase">
          Photo Gallery
        </h1>
        <p class="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
          Relive the best moments of CICMUN conferences through our photo selection.
        </p>
      </div>

      <!-- Filters Section -->
      <div v-if="galleryEvents && galleryEvents.length > 0" class="flex flex-wrap justify-center gap-3 mb-12">
        <button 
          @click="selectEvent('all')"
          :class="[
            'px-6 py-2.5 rounded-full font-bold transition-all duration-300 border-2',
            selectedEventId === 'all' 
              ? 'bg-black border-black text-white shadow-lg' 
              : 'bg-white border-gray-200 text-gray-600 hover:border-black hover:text-black'
          ]"
        >
          All Photos
        </button>
        <button 
          v-for="event in galleryEvents" 
          :key="event.id"
          @click="selectEvent(event.id)"
          :class="[
            'px-6 py-2.5 rounded-full font-bold transition-all duration-300 border-2',
            selectedEventId === event.id 
              ? 'bg-red-600 border-red-600 text-white shadow-lg' 
              : 'bg-white border-gray-200 text-gray-600 hover:border-red-600 hover:text-red-600'
          ]"
        >
          {{ event.name }}
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="flex flex-col items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-red-600 mb-4"></div>
        <p class="text-gray-500 font-medium">Loading gallery...</p>
      </div>

      <!-- Content Section -->
      <div v-else-if="filteredImages.length > 0">
        <GalleryGrid :images="filteredImages" />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
        <div class="mb-6 inline-flex bg-gray-100 p-6 rounded-full">
          <ImageIcon class="w-16 h-16 text-gray-400" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">No photos found</h3>
        <p class="text-gray-500 max-w-md mx-auto mb-8">
          We haven't uploaded photos for this event yet. Please check back later!
        </p>
        <NuxtLink to="/" class="inline-flex items-center gap-2 text-red-600 font-bold hover:underline">
          Return to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
