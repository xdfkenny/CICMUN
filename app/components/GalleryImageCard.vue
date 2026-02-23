<script setup lang="ts">
import { Maximize2 } from 'lucide-vue-next'
import type { GalleryImage } from '~~/shared/gallery'

const props = defineProps<{
  image: GalleryImage
  eager?: boolean
}>()

const emit = defineEmits<{
  select: []
}>()

const cardRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const isLoaded = ref(false)
const hasError = ref(false)
const useFallback = ref(false)

let observer: IntersectionObserver | null = null

const resolvedSrc = computed(() => {
  if (useFallback.value || !props.image.thumbnail) return props.image.src
  return props.image.thumbnail
})

const resolvedSrcSet = computed(() => {
  if (useFallback.value) return undefined
  return props.image.srcSet || undefined
})

const revealImage = () => {
  isVisible.value = true
  observer?.disconnect()
  observer = null
}

const onImageLoaded = () => {
  isLoaded.value = true
}

const onImageError = () => {
  const hasDistinctThumbnail = Boolean(
    props.image.thumbnail && props.image.src && props.image.thumbnail !== props.image.src
  )

  if (!useFallback.value && hasDistinctThumbnail) {
    useFallback.value = true
    isLoaded.value = false
    hasError.value = false
    return
  }

  hasError.value = true
  isLoaded.value = false
}

const setupObserver = () => {
  if (!process.client || !cardRef.value || isVisible.value) {
    return
  }

  if (!('IntersectionObserver' in window)) {
    revealImage()
    return
  }

  observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) {
      revealImage()
    }
  }, { rootMargin: '300px 0px' })

  observer.observe(cardRef.value)
}

onMounted(setupObserver)

onUnmounted(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <button
    ref="cardRef"
    type="button"
    class="group relative aspect-video w-full overflow-hidden rounded-xl bg-gray-200 shadow-sm transition-all duration-300 hover:shadow-xl border-2 border-transparent hover:border-red-600 cursor-pointer"
    :aria-label="`Open ${image.alt}`"
    @click="emit('select')"
  >
    <div
      v-if="!isLoaded"
      class="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200"
    />

    <div
      v-if="!isVisible || hasError"
      class="absolute inset-0 bg-gray-100"
    />

    <img
      v-if="isVisible && !hasError"
      :src="resolvedSrc"
      :srcset="resolvedSrcSet"
      :sizes="image.sizes || undefined"
      :alt="image.alt"
      width="800"
      height="450"
      :loading="eager ? 'eager' : 'lazy'"
      decoding="async"
      class="h-full w-full object-cover transition duration-500 group-hover:scale-110"
      :class="isLoaded ? 'opacity-100' : 'opacity-0'"
      @load="onImageLoaded"
      @error="onImageError"
    />

    <div class="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
      <div class="rounded-full bg-white/20 p-3 backdrop-blur-md transition-transform duration-300 scale-50 group-hover:scale-100">
        <Maximize2 class="h-6 w-6 text-white" />
      </div>
    </div>
  </button>
</template>
