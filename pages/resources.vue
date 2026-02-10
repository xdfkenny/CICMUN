<script setup lang="ts">
import { FileText, Download, Eye } from 'lucide-vue-next'

const { data: resources } = await useFetch('/api/resources')

const isViewerOpen = ref(false)
const selectedPdf = ref({ url: '', title: '' })

const openViewer = (filename: string, title: string) => {
  selectedPdf.value = {
    url: `/resources/${filename}`,
    title: title
  }
  isViewerOpen.value = true
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="container max-w-4xl mx-auto">
      <h1 class="text-4xl md:text-5xl font-bold text-center mb-4 font-montserrat text-black">Resources</h1>
      <p class="text-xl text-center text-gray-600 mb-12">Essential documents for your preparation</p>

      <div class="grid md:grid-cols-2 gap-6">
        <div v-for="resource in resources" :key="resource.id" class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-black">
          <div class="flex justify-between items-start mb-4">
            <div class="p-3 bg-gray-100 rounded-lg">
              <FileText class="w-8 h-8 text-black" />
            </div>
            <span class="text-xs font-bold px-2 py-1 bg-gray-100 rounded text-gray-600">PDF</span>
          </div>
          
          <h3 class="text-xl font-bold mb-2 font-montserrat">{{ resource.title }}</h3>
          <p class="text-gray-600 mb-6 text-sm">{{ resource.description }}</p>
          
          <div class="flex items-center gap-6 mt-auto">
            <button 
              @click="openViewer(resource.filename, resource.title)"
              class="inline-flex items-center gap-2 text-black font-bold hover:text-gray-700 transition-colors"
            >
              <Eye class="w-4 h-4" />
              View
            </button>
            <a :href="`/resources/${resource.filename}`" target="_blank" download class="inline-flex items-center gap-2 text-red-600 font-bold hover:text-red-700 transition-colors">
              <Download class="w-4 h-4" />
              Download
            </a>
          </div>
        </div>
      </div>
    </div>

    <PdfViewer 
      :is-open="isViewerOpen"
      :pdf-url="selectedPdf.url"
      :title="selectedPdf.title"
      @close="isViewerOpen = false"
    />
  </div>
</template>
