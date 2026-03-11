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

// isLoading starts true so SSR/hydration renders the spinner, not "No photos found"
const isLoading = ref(true)
const isFetchingMore = ref(false)
const allImages = ref<GalleryImage[]>([])

// Events metadata only — SSR
const { data: metaData } = await useFetch<GalleryResponse>('/api/gallery', {
  query: { metaOnly: true },
})
const galleryEvents = computed(() => metaData.value?.events ?? [])
const totalImages = computed(() => {
  if (selectedEventId.value === 'all') {
    return galleryEvents.value.reduce((sum, e) => sum + e.imageCount, 0)
  }
  return galleryEvents.value.find(e => e.id === selectedEventId.value)?.imageCount ?? 0
})
const hasMore = computed(() => allImages.value.length < totalImages.value)

// Request ID guards against race conditions: if a newer request fires
// before an older one resolves, the older result is discarded.
let latestRequestId = 0

async function loadEvent(eventId: string) {
  const requestId = ++latestRequestId
  isLoading.value = true
  allImages.value = []
  currentPage.value = 1

  try {
    const data = await $fetch<GalleryResponse>('/api/gallery', {
      params: { event: eventId, page: 1, limit: LIMIT },
    })
    if (requestId !== latestRequestId) return // stale — newer request fired
    allImages.value = data?.images ?? []
  } catch (err) {
    if (requestId !== latestRequestId) return
    console.error('Gallery fetch error:', err)
    allImages.value = []
  } finally {
    if (requestId === latestRequestId) {
      isLoading.value = false
    }
  }
}

const selectEvent = (id: string) => {
  selectedEventId.value = id
  loadEvent(id)
}

onMounted(() => loadEvent('all'))

const loadMore = async () => {
  if (!hasMore.value || isFetchingMore.value || isLoading.value) return
  isFetchingMore.value = true
  try {
    const nextPage = currentPage.value + 1
    const data = await $fetch<GalleryResponse>('/api/gallery', {
      params: { event: selectedEventId.value, page: nextPage, limit: LIMIT },
    })
    if (data?.images?.length) {
      allImages.value.push(...data.images)
      currentPage.value = nextPage
    }
  } catch (err) {
    console.error('Load more error:', err)
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
      <div class="text-center mb-16 animate-fade-in-up px-4">
        <div class="mb-6 inline-flex bg-red-100 p-8 rounded-full shadow-lg group transition-transform duration-500 hover:rotate-12 hover:scale-110">
          <Camera class="w-14 h-14 text-red-600" />
        </div>
        <h1 class="text-5xl md:text-6xl font-extrabold mb-4 font-montserrat text-black tracking-tight uppercase">
          Photo Gallery
        </h1>
        <div class="h-1.5 w-24 bg-red-600 mx-auto rounded-full mb-8"></div>
        <p class="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Relive the best moments of CICMUN conferences through our photo selection.
        </p>
      </div>

      <!-- Filters -->
      <div v-if="galleryEvents.length > 0" class="flex flex-wrap justify-center gap-4 mb-16 animate-fade-in-up px-4" style="animation-delay: 200ms; animation-fill-mode: both;">
        <button
          @click="selectEvent('all')"
          :class="[
            'px-8 py-3 rounded-full font-bold transition-all duration-300 border-2 shadow-sm',
            selectedEventId === 'all'
              ? 'bg-black border-black text-white shadow-xl scale-105'
              : 'bg-white border-gray-100 text-gray-500 hover:border-black hover:text-black hover:shadow-md'
          ]"
        >
          All Photos
        </button>
        <button
          v-for="(event, idx) in galleryEvents"
          :key="event.id"
          @click="selectEvent(event.id)"
          :class="[
            'px-8 py-3 rounded-full font-bold transition-all duration-300 border-2 shadow-sm',
            selectedEventId === event.id
              ? 'bg-red-600 border-red-600 text-white shadow-xl scale-105'
              : 'bg-white border-gray-100 text-gray-500 hover:border-red-600 hover:text-red-600 hover:shadow-md'
          ]"
          :style="{ transitionDelay: `${idx * 50}ms` }"
        >
          {{ event.name }} ({{ event.imageCount }})
        </button>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-24 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 reveal px-4">
        <div class="mb-8 inline-flex bg-gray-50 p-8 rounded-full animate-pulse shadow-inner">
          <ImageIcon class="w-16 h-16 text-gray-300" />
        </div>
        <h3 class="text-3xl font-extrabold text-black mb-3 font-montserrat uppercase tracking-tight">Loading photos...</h3>
        <p class="text-gray-500 max-w-md mx-auto font-medium opacity-80">Preparing the gallery for you.</p>
      </div>

      <!-- Photo grid -->
      <div v-else-if="allImages.length > 0" class="reveal px-4">
        <GalleryGrid
          :images="allImages"
          :has-more="hasMore"
          @load-more="loadMore"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-24 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 reveal px-4">
        <div class="mb-8 inline-flex bg-gray-50 p-8 rounded-full shadow-inner">
          <ImageIcon class="w-16 h-16 text-gray-300" />
        </div>
        <h3 class="text-3xl font-extrabold text-black mb-3 font-montserrat uppercase tracking-tight">No photos found</h3>
        <p class="text-gray-500 max-w-md mx-auto mb-10 font-medium opacity-80 leading-relaxed">
          We haven't uploaded photos for this event yet. Please check back later!
        </p>
        <NuxtLink to="/" class="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:-translate-y-1">
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
