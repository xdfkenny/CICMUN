<script setup lang="ts">
import type { GalleryImage } from '~/shared/gallery'

const props = defineProps<{
  images: GalleryImage[]
}>()

const showLightbox = ref(false)
const selectedImageIndex = ref(0)
const visibleCount = ref(24)
const loadMoreRef = ref<HTMLElement | null>(null)

let loadMoreObserver: IntersectionObserver | null = null

const openLightbox = (index: number) => {
  selectedImageIndex.value = index
  showLightbox.value = true
}

const visibleImages = computed(() => props.images.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < props.images.length)

const loadMore = () => {
  visibleCount.value = Math.min(visibleCount.value + 24, props.images.length)
}

const cleanupObserver = () => {
  loadMoreObserver?.disconnect()
  loadMoreObserver = null
}

const setupLoadMoreObserver = () => {
  cleanupObserver()

  if (!process.client || !hasMore.value || !loadMoreRef.value) {
    return
  }

  if (!('IntersectionObserver' in window)) {
    loadMore()
    return
  }

  loadMoreObserver = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) {
      loadMore()
    }
  }, { rootMargin: '500px 0px' })

  loadMoreObserver.observe(loadMoreRef.value)
}

watch(() => props.images, () => {
  visibleCount.value = 24
  selectedImageIndex.value = 0
  showLightbox.value = false
  nextTick(() => setupLoadMoreObserver())
})

watch(loadMoreRef, () => {
  nextTick(() => setupLoadMoreObserver())
})

watch(hasMore, () => {
  nextTick(() => setupLoadMoreObserver())
})

onMounted(setupLoadMoreObserver)

onUnmounted(() => {
  cleanupObserver()
})
</script>

<template>
  <div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="(image, index) in visibleImages"
        :key="image.id"
      >
        <GalleryImageCard
          :image="image"
          :eager="index < 6"
          @select="openLightbox(index)"
        />
      </div>
    </div>

    <div
      v-if="hasMore"
      ref="loadMoreRef"
      class="h-14 mt-4 flex items-center justify-center text-sm text-gray-400"
    >
      Loading more photos...
    </div>

    <Teleport to="body">
      <ImageLightbox 
        v-if="showLightbox"
        :images="images"
        :initial-index="selectedImageIndex"
        @close="showLightbox = false"
      />
    </Teleport>
  </div>
</template>
