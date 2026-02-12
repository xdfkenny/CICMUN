<script setup lang="ts">
import { Maximize2 } from 'lucide-vue-next'

const props = defineProps<{
  images: string[]
}>()

const showLightbox = ref(false)
const selectedImageIndex = ref(0)

const openLightbox = (index: number) => {
  selectedImageIndex.value = index
  showLightbox.value = true
}
</script>

<template>
  <div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="(image, index) in images" 
        :key="image"
        class="group relative aspect-video overflow-hidden rounded-xl bg-gray-200 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-red-600"
        @click="openLightbox(index)"
      >
        <img 
          :src="image" 
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div class="bg-white/20 backdrop-blur-md p-3 rounded-full scale-50 group-hover:scale-100 transition-transform duration-300">
            <Maximize2 class="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
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
