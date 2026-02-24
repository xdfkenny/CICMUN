<script setup lang="ts">
import { Camera, Image as ImageIcon } from 'lucide-vue-next'
import type { GalleryResponse, GalleryImage } from '~~/shared/gallery'

useSeoMeta({
  title: 'Photo Gallery',
  ogTitle: 'Photo Gallery | CICMUN 2026',
  description: 'Relive the best moments of CICMUN conferences through our photo gallery.',
  ogDescription: 'Relive the best moments of CICMUN conferences through our photo gallery.',
  ogImage: '/LOGO.png',
})

const selectedEventId = ref<string>('all')
const currentPage = ref(1)
const currentLimit = ref(24)
const isFetching = ref(false)
const fetchError = ref<string | null>(null)

// Fetch event metadata (SSR)
const { data: galleryMeta } = await useFetch<GalleryResponse>('/api/gallery', {
  query: { metaOnly: true }
})

const galleryEvents = computed(() => galleryMeta.value?.events || [])
const totalImages = computed(() => {
  if (selectedEventId.value === 'all') {
    return galleryEvents.value.reduce((sum, e) => sum + e.imageCount, 0)
  }
  return galleryEvents.value.find(e => e.id === selectedEventId.value)?.imageCount || 0
})

// Fetch the first page of images server-side so they render immediately (no flash of "No photos found")
const { data: initialData } = await useAsyncData<GalleryResponse>(
  'gallery-initial',
  () => $fetch<GalleryResponse>('/api/gallery', {
    query: { event: 'all', page: 1, limit: 24 }
  })
)

const allImages = ref<GalleryImage[]>(initialData.value?.images ?? [])
const hasMore = computed(() => allImages.value.length < totalImages.value)

const fetchImages = async (page: number, event: string) => {
  isFetching.value = true
  fetchError.value = null
  try {
    const response = await $fetch<GalleryResponse>('/api/gallery', {
      query: { event, page, limit: currentLimit.value }
    })

    if (!response?.images) throw new Error('Invalid response from gallery API')

    if (page === 1) {
      allImages.value = response.images
    } else {
      allImages.value.push(...response.images)
    }
    return true
  } catch (err: any) {
    console.error('Failed to fetch gallery images', err)
    fetchError.value = err?.message || 'Failed to load images'
    if (page === 1) allImages.value = []
    return false
  } finally {
    isFetching.value = false
  }
}

onMounted(() => {
  if (window.innerWidth < 768) {
    currentLimit.value = 12
  }
})

const selectEvent = async (id: string) => {
  selectedEventId.value = id
  currentPage.value = 1
  allImages.value = []
  await fetchImages(1, id)
}

const loadMore = async () => {
  if (!hasMore.value || isFetching.value) return
  const nextPage = currentPage.value + 1
  const success = await fetchImages(nextPage, selectedEventId.value)
  if (success) currentPage.value = nextPage
}

const refreshPage = () => window.location.reload()
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="container mx-auto max-w-7xl">
      <!-- Header -->
      <div class="text-center mb-16">
        <div class="mb-6 inline-flex bg-red-100 p-6 rounded-full">
          <Camera class="w-12 h-12 text-red-600" />
        </div>
        <h1 class="text-5xl md:text-6xl font-extrabold mb-4 font-montserrat text-black tracking-tight uppercase">
          Photo Gallery
        </h1>
        <p class="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
          Relive the best moments of CICMUN conferences through our photo selection.
        </p>
      </div>

      <!-- Filters -->
      <div v-if="galleryEvents.length > 0" class="flex flex-wrap justify-center gap-3 mb-12">
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
          {{ event.name }} ({{ event.imageCount }})
        </button>
      </div>

      <!-- Loading state (only when switching events, not initial load) -->
      <div v-if="isFetching && allImages.length === 0" class="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
        <div class="mb-6 inline-flex bg-gray-100 p-6 rounded-full animate-pulse">
          <ImageIcon class="w-16 h-16 text-gray-400" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Loading photos...</h3>
        <p class="text-gray-500 max-w-md mx-auto mb-2">Preparing the gallery for you.</p>
      </div>

      <!-- Photo grid -->
      <div v-else-if="allImages.length > 0">
        <GalleryGrid
          :images="allImages"
          :has-more="hasMore"
          @load-more="loadMore"
        />
      </div>

      <!-- Empty state -->
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

      <div class="mt-12 flex justify-center">
        <button
          type="button"
          class="px-4 py-2 text-xs font-semibold uppercase tracking-wide rounded-full border border-gray-200 text-gray-600 bg-white hover:border-black hover:text-black transition-colors"
          @click="refreshPage"
        >
          Refresh Gallery
        </button>
      </div>
    </div>
  </div>
</template>
