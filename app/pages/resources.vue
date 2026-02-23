<script setup lang="ts">
import { FileText, Download, Eye, AlertCircle } from 'lucide-vue-next'

const { data: resources, status, error } = await useFetch('/api/resources')

useSeoMeta({
  title: 'Resources & Guides',
  ogTitle: 'Resources & Guides | CICMUN 2026',
  description: 'Download preparation guides, rules of procedure, and essential documents for CICMUN 2026.',
  ogDescription: 'Download preparation guides, rules of procedure, and essential documents for CICMUN 2026.',
})

const isViewerOpen = ref(false)
const selectedPdf = ref({ url: '', title: '' })
const activeTab = ref<'JMUN' | 'SAMUN'>('JMUN')

const openViewer = (filename: string, title: string) => {
  selectedPdf.value = {
    url: `/resources/${filename}`,
    title: title
  }
  isViewerOpen.value = true
}

const filteredResources = computed(() => {
  if (!resources.value) return []
  return resources.value.filter((r: any) => 
    !r.conferences || r.conferences.includes(activeTab.value)
  )
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="container max-w-4xl mx-auto">
      <h1 class="text-5xl md:text-6xl font-bold text-center mb-4 font-montserrat text-black tracking-tight">Resources</h1>
      <p class="text-xl text-center text-gray-600 mb-8">Essential documents for your preparation</p>

      <!-- Contextual Tabs -->
      <div class="flex justify-center mb-12">
        <div class="bg-gray-200 p-1 rounded-xl inline-flex shadow-inner">
          <button 
            @click="activeTab = 'JMUN'"
            :class="[
              'px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-200',
              activeTab === 'JMUN' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            JMUN
          </button>
          <button 
            @click="activeTab = 'SAMUN'"
            :class="[
              'px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-200',
              activeTab === 'SAMUN' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            SAMUN
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="status === 'pending'" class="grid md:grid-cols-2 gap-6">
        <div v-for="i in 4" :key="i" class="bg-white p-6 rounded-xl shadow-md border-l-4 border-gray-200">
          <div class="flex justify-between items-start mb-4">
            <UiSkeleton class="w-12 h-12 rounded-lg" />
            <UiSkeleton class="w-10 h-6 rounded" />
          </div>
          <UiSkeleton class="w-2/3 h-6 mb-2" />
          <UiSkeleton class="w-full h-4 mb-1" />
          <UiSkeleton class="w-5/6 h-4 mb-6" />
          <div class="flex gap-4">
            <UiSkeleton class="w-16 h-6" />
            <UiSkeleton class="w-24 h-6" />
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 text-red-700 p-8 rounded-xl text-center border border-red-200">
        <AlertCircle class="w-12 h-12 mx-auto mb-4 text-red-500" />
        <h3 class="text-xl font-bold mb-2">Notice</h3>
        <p>Resources are temporarily unavailable. Please try again later or contact the secretariat.</p>
      </div>

      <!-- Data State -->
      <div v-else-if="filteredResources.length > 0" class="grid md:grid-cols-2 gap-6">
        <div v-for="resource in filteredResources" :key="resource.id" 
             :class="['bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4', activeTab === 'SAMUN' ? 'border-red-600' : 'border-black']">
          <div class="flex justify-between items-start mb-4">
            <div :class="['p-3 rounded-lg', activeTab === 'SAMUN' ? 'bg-red-50' : 'bg-gray-100']">
              <FileText :class="['w-8 h-8', activeTab === 'SAMUN' ? 'text-red-600' : 'text-black']" />
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
            <a :href="`/resources/${resource.filename}`" download class="inline-flex items-center gap-2 font-bold transition-colors" :class="activeTab === 'SAMUN' ? 'text-red-600 hover:text-red-700' : 'text-black hover:text-gray-700'">
              <Download class="w-4 h-4" />
              Download
            </a>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center bg-white p-12 rounded-xl border border-gray-100 shadow-sm">
        <FileText class="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <p class="text-xl text-gray-600 font-medium">Resources for {{ activeTab }} coming soon.</p>
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
