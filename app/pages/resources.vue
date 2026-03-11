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
      <h1 class="text-5xl md:text-6xl font-bold text-center mb-4 font-montserrat text-black tracking-tight animate-fade-in-up">Resources</h1>
      <p class="text-xl text-center text-gray-600 mb-8 animate-fade-in-up" style="animation-delay: 200ms; animation-fill-mode: both;">Essential documents for your preparation</p>

      <!-- Contextual Tabs -->
      <div class="flex justify-center mb-12 animate-fade-in-up" style="animation-delay: 400ms; animation-fill-mode: both;">
        <div class="bg-gray-200 p-1.5 rounded-2xl inline-flex shadow-inner">
          <button 
            @click="activeTab = 'JMUN'"
            :class="[
              'px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300',
              activeTab === 'JMUN' ? 'bg-white text-black shadow-md scale-105' : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            JMUN
          </button>
          <button 
            @click="activeTab = 'SAMUN'"
            :class="[
              'px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300',
              activeTab === 'SAMUN' ? 'bg-red-600 text-white shadow-md scale-105' : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            SAMUN
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="status === 'pending'" class="grid md:grid-cols-2 gap-6">
        <div v-for="i in 4" :key="i" class="bg-white p-8 rounded-2xl shadow-md border-l-4 border-gray-200 animate-pulse">
          <div class="flex justify-between items-start mb-6">
            <UiSkeleton class="w-14 h-14 rounded-xl" />
            <UiSkeleton class="w-12 h-6 rounded" />
          </div>
          <UiSkeleton class="w-2/3 h-8 mb-4" />
          <UiSkeleton class="w-full h-5 mb-2" />
          <UiSkeleton class="w-5/6 h-5 mb-8" />
          <div class="flex gap-6 mt-auto">
            <UiSkeleton class="w-20 h-6" />
            <UiSkeleton class="w-28 h-6" />
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 text-red-700 p-12 rounded-2xl text-center border border-red-200 reveal">
        <AlertCircle class="w-16 h-16 mx-auto mb-6 text-red-500 animate-bounce" />
        <h3 class="text-2xl font-bold mb-3 font-montserrat uppercase tracking-tight">Notice</h3>
        <p class="text-lg font-medium opacity-80">Resources are temporarily unavailable. Please try again later or contact the secretariat.</p>
      </div>

      <!-- Data State -->
      <div v-else-if="filteredResources.length > 0" class="grid md:grid-cols-2 gap-8 min-h-[400px]">
        <div v-for="(resource, idx) in filteredResources" :key="resource.id" 
             :class="['bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-l-8 reveal hover-lift flex flex-col', activeTab === 'SAMUN' ? 'border-red-600' : 'border-black']"
             :style="{ transitionDelay: `${idx * 150}ms` }">
          <div class="flex justify-between items-start mb-6">
            <div :class="['p-4 rounded-xl transition-colors duration-300', activeTab === 'SAMUN' ? 'bg-red-50' : 'bg-gray-100']">
              <FileText :class="['w-10 h-10', activeTab === 'SAMUN' ? 'text-red-600' : 'text-black']" />
            </div>
            <span class="text-xs font-extrabold px-3 py-1.5 bg-gray-100 rounded-lg text-black uppercase tracking-wider">PDF</span>
          </div>
          
          <h3 class="text-2xl font-bold mb-3 font-montserrat text-black tracking-tight uppercase">{{ resource.title }}</h3>
          <p class="text-gray-600 mb-8 text-base font-medium leading-relaxed">{{ resource.description }}</p>
          
          <div class="flex items-center gap-8 mt-auto pb-2">
            <button 
              @click="openViewer(resource.filename, resource.title)"
              class="inline-flex items-center gap-2 text-black font-extrabold hover:text-red-600 transition-colors group"
            >
              <Eye class="w-5 h-5 group-hover:scale-110 transition-transform" />
              View
            </button>
            <a :href="`/resources/${resource.filename}`" download class="inline-flex items-center gap-2 font-extrabold transition-colors group" :class="activeTab === 'SAMUN' ? 'text-red-600 hover:text-red-700' : 'text-black hover:text-gray-700'">
              <Download class="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
              Download
            </a>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center bg-white p-12 rounded-xl border border-gray-100 shadow-sm">
        <FileText class="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <p class="text-xl text-black font-medium">Resources for {{ activeTab }} coming soon.</p>
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
