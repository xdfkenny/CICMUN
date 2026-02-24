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

const LIMIT = 24
const selectedEventId = ref<string>('all')
const currentPage = ref(1)
const extraImages = ref<GalleryImage[]>([])
const isFetchingMore = ref(false)

// Events metadata — SSR
const { data: metaData } = await useAsyncData('gallery-meta', () =>
  $fetch<GalleryResponse>('/api/gallery', { query: { metaOnly: true } })
)
const galleryEvents = computed(() => metaData.value?.events ?? [])

// Images for the selected event — reactive key causes auto-refetch on filter change
const { data: pageData, pending: isLoading } = await useAsyncData(
  () => `gallery-${selectedEventId.value}`,
  () => $fetch<GalleryResponse>('/api/gallery', {
    query: { event: selectedEventId.value, page: 1, limit: LIMIT }
  }),
  { watch: [selectedEventId] }
)

// Reset pagination when event changes
watch(selectedEventId, () => {
  extraImages.value = []
  currentPage.value = 1
})

const allImages = computed<GalleryImage[]>(() => [
  ...(pageData.value?.images ?? []),
  ...extraImages.value,
])

const totalImages = computed(() => {
  if (selectedEventId.value === 'all') {
    return galleryEvents.value.reduce((sum, e) => sum + e.imageCount, 0)
  }
  return galleryEvents.value.find(e => e.id === selectedEventId.value)?.imageCount ?? 0
})

const hasMore = computed(() => allImages.value.length < totalImages.value)

const selectEvent = (id: string) => {
  selectedEventId.value = id
}

const loadMore = async () => {
  if (!hasMore.value || isFetchingMore.value || isLoading.value) return
  isFetchingMore.value = true
  try {
    const nextPage = currentPage.value + 1
    const response = await $fetch<GalleryResponse>('/api/gallery', {
      query: { event: selectedEventId.value, page: nextPage, limit: LIMIT }
    })
    if (response?.images?.length) {
      extraImages.value.push(...response.images)
      currentPage.value = nextPage
    }
  } finally {
    isFetchingMore.value = false
  }
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

      <!-- Loading state while switching events -->
      <div v-if="isLoading" class="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
        <div class="mb-6 inline-flex bg-gray-100 p-6 rounded-full animate-pulse">
          <ImageIcon class="w-16 h-16 text-gray-400" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Loading photos...</h3>
        <p class="text-gray-500 max-w-md mx-auto">Preparing the gallery for you.</p>
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
