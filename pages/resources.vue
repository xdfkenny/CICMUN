<script setup lang="ts">
import { FileText, Download, Eye } from 'lucide-vue-next'

definePageMeta({
  middleware: ['role'],
  auth: {
    required: true,
    roles: ['delegate'],
  },
})

const { data: resources, pending, error } = await useFetch('/api/resources', {
  default: () => [],
})

useSeoMeta({
  title: 'Recursos y Guías',
  ogTitle: 'Recursos y Guías | CICMUN 2026',
  description: 'Descarga guías de preparación, reglas de procedimiento y documentos esenciales para CICMUN 2026.',
  ogDescription: 'Descarga guías de preparación, reglas de procedimiento y documentos esenciales para CICMUN 2026.',
})

const isViewerOpen = ref(false)
const selectedPdf = ref({ url: '', title: '' })

const visibleCount = ref(12)
const loadMoreRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const visibleResources = computed(() => (resources.value || []).slice(0, visibleCount.value))
const hasMore = computed(() => (resources.value || []).length > visibleCount.value)

const loadMore = () => {
  visibleCount.value = Math.min(visibleCount.value + 12, (resources.value || []).length)
}

const setupObserver = () => {
  observer?.disconnect()
  if (!process.client || !loadMoreRef.value || !hasMore.value) return
  if (!('IntersectionObserver' in window)) {
    loadMore()
    return
  }
  observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) loadMore()
  }, { rootMargin: '400px 0px' })
  observer.observe(loadMoreRef.value)
}

watch(hasMore, () => nextTick(setupObserver))
watch(loadMoreRef, () => nextTick(setupObserver))
onMounted(setupObserver)
onUnmounted(() => observer?.disconnect())

const openViewer = (filename: string, title: string) => {
  const encoded = encodeURIComponent(filename)
  selectedPdf.value = {
    url: `/resources/${encoded}`,
    title: title
  }
  isViewerOpen.value = true
}

const resourceUrl = (filename: string) => `/resources/${encodeURIComponent(filename)}`
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="container max-w-4xl mx-auto">
      <h1 class="text-4xl md:text-5xl font-bold text-center mb-4 font-montserrat text-black">Resources</h1>
      <p class="text-xl text-center text-gray-600 mb-12">Essential documents for your preparation</p>

      <div v-if="pending" class="text-center text-gray-500 py-12">Loading resources...</div>
      <div v-else-if="error" class="text-center text-red-600 py-12">Unable to load resources.</div>
      <div v-else-if="visibleResources.length === 0" class="text-center text-gray-500 py-12">Resources coming soon.</div>

      <div v-else class="grid md:grid-cols-2 gap-6">
        <div v-for="resource in visibleResources" :key="resource.id" class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-black">
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
            <a :href="resourceUrl(resource.filename)" :download="resource.filename" class="inline-flex items-center gap-2 text-red-600 font-bold hover:text-red-700 transition-colors">
              <Download class="w-4 h-4" />
              Download
            </a>
          </div>
        </div>
      </div>

      <div v-if="hasMore && !pending && !error && visibleResources.length > 0" ref="loadMoreRef" class="mt-6 text-center text-sm text-gray-500">
        Loading more...
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
