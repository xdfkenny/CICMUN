<script setup lang="ts">
import { X, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  images: string[]
  initialIndex: number
}>()

const emit = defineEmits(['close'])

const currentIndex = ref(props.initialIndex)

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const prev = () => {
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
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm">
    <button 
      @click="close"
      class="absolute top-6 right-6 text-white hover:text-red-500 transition-colors z-[110]"
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
        <img 
          :src="images[currentIndex]" 
          class="max-w-full max-h-[80vh] object-contain shadow-2xl rounded-lg select-none transition-all duration-300"
          alt="Gallery Image"
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
