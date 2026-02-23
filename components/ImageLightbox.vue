<script setup lang="ts">
import { X, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { GalleryImage } from '~/shared/gallery'

const props = defineProps<{
  images: GalleryImage[]
  initialIndex: number
}>()

const emit = defineEmits(['close'])

const clampIndex = (index: number) => {
  if (props.images.length === 0) return 0
  return Math.min(Math.max(index, 0), props.images.length - 1)
}

const currentIndex = ref(clampIndex(props.initialIndex))
const isImageLoading = ref(true)

const previousFocus = ref<HTMLElement | null>(null)
const modalRef = ref<HTMLElement | null>(null)

const currentImage = computed(() => props.images[currentIndex.value])

// Preload next and previous images
watch(currentIndex, (newIndex) => {
  if (typeof window === 'undefined') return
  if (!props.images.length || !props.images[newIndex]) return
  
  const preloadImage = (index: number) => {
    const img = props.images[index]
    if (img?.src) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = img.src
      document.head.appendChild(link)
      
      // Cleanup after a short delay
      setTimeout(() => {
        if (document.head.contains(link)) {
          document.head.removeChild(link)
        }
      }, 5000)
    }
  }

  const nextIdx = (newIndex + 1) % props.images.length
  const prevIdx = (newIndex - 1 + props.images.length) % props.images.length
  
  preloadImage(nextIdx)
  preloadImage(prevIdx)
}, { immediate: true })

const next = () => {
  if (!props.images.length || !currentImage.value) return
  isImageLoading.value = true
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const prev = () => {
  if (!props.images.length || !currentImage.value) return
  isImageLoading.value = true
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}

const close = () => {
  emit('close')
}

// Handle keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowRight') next()
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'Tab') {
    if (!modalRef.value) return
    const focusableElements = modalRef.value.querySelectorAll<HTMLElement>(
      'button, [tabindex]:not([tabindex="-1"])'
    )
    if (!focusableElements.length) return
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    if (e.shiftKey) {
      if (document.activeElement === firstElement || document.activeElement === modalRef.value) {
        lastElement?.focus()
        e.preventDefault()
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement?.focus()
        e.preventDefault()
      }
    }
  }
}

const handleImageLoaded = () => {
  isImageLoading.value = false
}

const handleImageError = () => {
  isImageLoading.value = false
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'hidden'
  
  previousFocus.value = document.activeElement as HTMLElement
  setTimeout(() => {
    modalRef.value?.focus()
  }, 0)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
  
  previousFocus.value?.focus()
})
</script>

<template>
  <div 
    class="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    aria-label="Image Gallery"
    ref="modalRef"
    tabindex="-1"
  >
    <button 
      @click="close"
      class="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-[110]"
    >
      <X class="w-8 h-8" />
    </button>

    <div class="relative w-full h-full flex items-center justify-center p-4 md:p-12">
      <!-- Navigation -->
      <button 
        v-if="images.length > 1"
        @click="prev"
        class="absolute left-4 md:left-8 text-white hover:bg-white/10 p-2 rounded-full transition-all z-[110]"
      >
        <ChevronLeft class="w-10 h-10" />
      </button>

      <div class="relative max-w-5xl max-h-full flex flex-col items-center">
        <div
          v-if="isImageLoading"
          class="absolute inset-0 animate-pulse rounded-lg bg-white/10"
        />
        <img
          v-if="currentImage"
          :src="currentImage.src"
          :alt="currentImage.alt || 'Gallery image'"
          class="max-w-full max-h-[80vh] object-contain shadow-2xl rounded-lg select-none transition-all duration-300"
          :class="isImageLoading ? 'opacity-0' : 'opacity-100'"
          decoding="async"
          @load="handleImageLoaded"
          @error="handleImageError"
        />
        <div class="mt-4 text-white font-medium">
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>
      </div>

      <button 
        v-if="images.length > 1"
        @click="next"
        class="absolute right-4 md:right-8 text-white hover:bg-white/10 p-2 rounded-full transition-all z-[110]"
      >
        <ChevronRight class="w-10 h-10" />
      </button>
    </div>
  </div>
</template>
