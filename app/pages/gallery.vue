<script setup lang="ts">
import { Camera, Image as ImageIcon } from 'lucide-vue-next'
import { DEFAULT_GALLERY_LIMIT, type GalleryImage, type GalleryResponse } from '~~/shared/gallery'

useSeoMeta({
  title: 'Photo Gallery',
  ogTitle: 'Photo Gallery | CICMUN 2026',
  description: 'Relive the best moments of CICMUN conferences through our photo gallery.',
  ogDescription: 'Relive the best moments of CICMUN conferences through our photo gallery.',
  ogImage: '/LOGO.png',
})

const route = useRoute()
const router = useRouter()
const currentPage = ref(1)
const isFetchingMore = ref(false)
const loadErrorMessage = ref('')
const allImages = ref<GalleryImage[]>([])
const GALLERY_LOAD_ERROR = 'We could not load the gallery right now. Please try again.'

const getRouteEventId = (value: unknown) =>
  typeof value === 'string' && value.trim() ? value.trim() : 'all'

const requestedEventId = computed(() => getRouteEventId(route.query.event))

const { data: metaData, refresh: refreshMeta } = await useFetch<GalleryResponse>('/api/gallery', {
  key: 'gallery-meta',
  query: { metaOnly: true },
  cache: 'no-store',
})

const galleryEvents = computed(() => metaData.value?.events ?? [])
const galleryRevision = computed(() => metaData.value?.revision ?? 'current')
const selectedEventId = computed(() => {
  const requested = requestedEventId.value
  if (requested === 'all') return requested

  return galleryEvents.value.some((event) => event.id === requested)
    ? requested
    : 'all'
})

const { data: galleryData, status, error, refresh } = await useFetch<GalleryResponse>('/api/gallery', {
  key: computed(() => `gallery-page:${galleryRevision.value}:${selectedEventId.value}`),
  query: computed(() => ({
    event: selectedEventId.value,
    page: 1,
    limit: DEFAULT_GALLERY_LIMIT,
    revision: galleryRevision.value,
  })),
  cache: 'no-store',
})

const isLoading = computed(() => status.value === 'pending')

watch(
  () => galleryData.value,
  (value) => {
    allImages.value = value?.images ? [...value.images] : []
    currentPage.value = 1

    if (!error.value) {
      loadErrorMessage.value = ''
    }
  },
  { immediate: true },
)

watch(error, (value) => {
  loadErrorMessage.value = value ? GALLERY_LOAD_ERROR : ''
})

const totalImages = computed(() => {
  if (selectedEventId.value === 'all') {
    return galleryEvents.value.reduce((sum, event) => sum + event.imageCount, 0)
  }

  return galleryEvents.value.find((event) => event.id === selectedEventId.value)?.imageCount
    ?? galleryData.value?.total
    ?? 0
})
const hasMore = computed(() => allImages.value.length < totalImages.value)

const selectEvent = async (id: string) => {
  if (requestedEventId.value === id || (id === 'all' && requestedEventId.value === 'all')) {
    return
  }

  const nextQuery = { ...route.query }
  if (id === 'all') {
    delete nextQuery.event
  } else {
    nextQuery.event = id
  }

  await router.replace({ query: nextQuery })
}

const loadMore = async () => {
  if (!hasMore.value || isFetchingMore.value || isLoading.value) return

  isFetchingMore.value = true
  const eventId = selectedEventId.value

  try {
    const nextPage = currentPage.value + 1
    const data = await $fetch<GalleryResponse>('/api/gallery', {
      params: {
        event: eventId,
        page: nextPage,
        limit: DEFAULT_GALLERY_LIMIT,
        revision: galleryRevision.value,
      },
      cache: 'no-store',
    })

    if (selectedEventId.value !== eventId) {
      return
    }

    if (data.images.length) {
      allImages.value.push(...data.images)
      currentPage.value = nextPage
    }
  } catch (err) {
    console.error('Load more error:', err)
  } finally {
    isFetchingMore.value = false
  }
}

const refreshPage = async () => {
  loadErrorMessage.value = ''
  await Promise.all([refreshMeta(), refresh()])
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-6 md:py-12 px-4">
    <div class="container mx-auto max-w-7xl">
      <!-- Header -->
      <div class="text-center mb-8 md:mb-16 animate-fade-in-up px-4">
        <div class="mb-4 md:mb-6 inline-flex bg-red-100 p-4 md:p-8 rounded-full shadow-lg group transition-transform duration-500 hover:rotate-12 hover:scale-110">
          <Camera class="w-10 h-10 md:w-14 md:h-14 text-red-600" />
        </div>
        <h1 class="text-4xl md:text-6xl font-extrabold mb-2 md:mb-4 font-montserrat text-black tracking-tight uppercase">
          Photo Gallery
        </h1>
        <div class="h-1.5 w-16 md:w-24 bg-red-600 mx-auto rounded-full mb-4 md:mb-8"></div>
        <p class="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Relive the best moments of CICMUN conferences through our photo selection.
        </p>
      </div>

      <!-- Filters -->
      <div v-if="galleryEvents.length > 0" class="flex overflow-x-auto md:overflow-visible md:flex-wrap gap-3 md:gap-4 pb-4 md:pb-0 mb-8 md:mb-16 animate-fade-in-up px-4 md:justify-center snap-x snap-mandatory scroll-smooth md:snap-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-4 md:mx-0" style="animation-delay: 200ms; animation-fill-mode: both;">
        <button
          @click="selectEvent('all')"
          :class="[
            'px-6 py-2.5 md:px-8 md:py-3 rounded-full font-bold transition-all duration-300 border-2 shadow-sm whitespace-nowrap flex-shrink-0 md:flex-shrink md:snap-align-none snap-center text-sm md:text-base',
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
            'px-6 py-2.5 md:px-8 md:py-3 rounded-full font-bold transition-all duration-300 border-2 shadow-sm whitespace-nowrap flex-shrink-0 md:flex-shrink md:snap-align-none snap-center text-sm md:text-base',
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

      <!-- Error state -->
      <div v-else-if="loadErrorMessage" class="text-center py-24 bg-white rounded-[2.5rem] shadow-xl border border-red-100 reveal px-4">
        <div class="mb-8 inline-flex bg-red-50 p-8 rounded-full shadow-inner">
          <ImageIcon class="w-16 h-16 text-red-300" />
        </div>
        <h3 class="text-3xl font-extrabold text-black mb-3 font-montserrat uppercase tracking-tight">Gallery unavailable</h3>
        <p class="text-gray-500 max-w-md mx-auto mb-10 font-medium opacity-80 leading-relaxed">
          {{ loadErrorMessage }}
        </p>
        <button
          type="button"
          class="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:-translate-y-1"
          @click="refreshPage"
        >
          Try again
        </button>
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
