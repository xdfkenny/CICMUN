<script setup lang="ts">
import { X, ExternalLink, Download } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  pdfUrl: string
  title: string
}>()

const emit = defineEmits(['close'])

const closeOnEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  window.addEventListener('keydown', closeOnEsc)
})

onUnmounted(() => {
  window.removeEventListener('keydown', closeOnEsc)
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-black/60 backdrop-blur-sm"
        @click="emit('close')"
      ></div>

      <!-- Modal Content -->
      <div class="relative bg-white w-full h-full max-w-6xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b bg-gray-50">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-black rounded-lg">
              <span class="text-white font-bold text-xs">PDF</span>
            </div>
            <h3 class="font-bold font-montserrat text-gray-900 truncate max-w-[200px] md:max-w-md">
              {{ title }}
            </h3>
          </div>
          
          <div class="flex items-center gap-2">
            <a 
              :href="pdfUrl" 
              target="_blank" 
              class="p-2 hover:bg-gray-200 rounded-full transition-colors hidden md:flex items-center gap-2 text-xs font-bold text-gray-600"
              title="Open in new tab"
            >
              <ExternalLink class="w-4 h-4" />
              Open New Tab
            </a>
            <a 
              :href="pdfUrl" 
              download
              class="p-2 hover:bg-gray-200 rounded-full transition-colors flex items-center gap-2 text-xs font-bold text-gray-600"
              title="Download PDF"
            >
              <Download class="w-4 h-4" />
              <span class="hidden sm:inline">Download</span>
            </a>
            <button 
              @click="emit('close')"
              class="p-2 hover:bg-gray-200 rounded-full transition-colors ml-2"
            >
              <X class="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <!-- PDF Viewer Iframe -->
        <div class="flex-grow bg-gray-100 relative">
          <div class="absolute inset-0 flex items-center justify-center -z-10">
            <div class="animate-pulse text-gray-400 font-medium">Loading document...</div>
          </div>
          <iframe 
            :src="pdfUrl" 
            class="w-full h-full border-none"
            title="PDF Viewer"
          ></iframe>
        </div>

        <!-- Footer / Mobile fallback -->
        <div class="p-3 bg-gray-50 border-t flex justify-center text-[10px] text-gray-400 md:hidden">
          Tip: You can pinch to zoom or scroll to navigate.
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.font-montserrat {
  font-family: 'Montserrat', sans-serif;
}
</style>
