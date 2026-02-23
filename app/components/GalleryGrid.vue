<script setup lang="ts">
import type { GalleryImage } from '~~/shared/gallery'

const props = defineProps<{
  images: GalleryImage[]
  hasMore: boolean
}>()

const emit = defineEmits<{
  (e: 'load-more'): void
}>()

const showLightbox = ref(false)
const selectedImageIndex = ref(0)
const loadMoreRef = ref<HTMLElement | null>(null)
let loadMoreObserver: IntersectionObserver | null = null

const openLightbox = (index: number) => {
  selectedImageIndex.value = index
  showLightbox.value = true
}

const cleanupObserver = () => {
  loadMoreObserver?.disconnect()
  loadMoreObserver = null
}

const setupLoadMoreObserver = () => {
  cleanupObserver()

  if (!process.client || !props.hasMore || !loadMoreRef.value) {
    return
  }

  if (!('IntersectionObserver' in window)) {
    emit('load-more')
    return
  }

  loadMoreObserver = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) {
      emit('load-more')
    }
  }, { rootMargin: '500px 0px' })

  loadMoreObserver.observe(loadMoreRef.value)
}

watch(loadMoreRef, () => {
  nextTick(() => setupLoadMoreObserver())
})

watch(() => props.hasMore, () => {
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
        v-for="(image, index) in images"
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
       v-show="hasMore"
      ref="loadMoreRef"
      class="h-14 mt-4 flex items-center justify-center text-sm text-gray-400"
    >
       <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600 mr-2"></div>
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
