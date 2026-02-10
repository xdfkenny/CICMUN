<script setup lang="ts">
import { Users, FileText, Download, Eye } from 'lucide-vue-next'
import type { Committee } from '~/shared/types'

const route = useRoute()
const committeeId = parseInt(route.params.id as string)

// Fetch committee data based on ID
// In a real app, we'd have a specific endpoint, but filtering on client for now is fine for small data
const { data: committees } = await useFetch<Committee[]>('/api/committees/JMUN') // Fetch all and filter
const { data: samunCommittees } = await useFetch<Committee[]>('/api/committees/SAMUN')

const committee = computed(() => {
  const allCommittees = [...(committees.value || []), ...(samunCommittees.value || [])]
  return allCommittees.find(c => c.id === committeeId)
})

useSeoMeta({
  title: () => committee.value ? `${committee.value.name} (${committee.value.type})` : 'Cargando...',
  ogTitle: () => committee.value ? `${committee.value.name} - CICMUN 2026` : 'Comité - CICMUN 2026',
  description: () => committee.value ? `Información sobre el comité ${committee.value.name}. Temas: ${committee.value.topicA}${committee.value.topicB ? ' y ' + committee.value.topicB : ''}.` : 'Detalles del comité de CICMUN.',
  ogDescription: () => committee.value ? `Información sobre el comité ${committee.value.name}. Temas: ${committee.value.topicA}${committee.value.topicB ? ' y ' + committee.value.topicB : ''}.` : 'Detalles del comité de CICMUN.',
})

const resources = computed(() => committee.value?.resources || [])

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
      <div v-if="committee" class="space-y-8">
        <!-- Header -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
          <!-- Hero Section -->
          <div class="relative group h-64 md:h-80 overflow-hidden flex items-center justify-center">
            <!-- Background Image -->
            <div v-if="committee.image" class="absolute inset-0 z-0">
              <img 
                :src="committee.image" 
                :alt="committee.name"
                class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              <div class="absolute inset-0 bg-black/40"></div>
            </div>
            <div v-else class="absolute inset-0 bg-black"></div>

            <!-- Hero Content -->
            <div class="relative z-10 text-white p-8 text-center">
              <h1 class="text-4xl md:text-6xl font-bold font-montserrat mb-4 drop-shadow-2xl tracking-tight">
                {{ committee.name }}
              </h1>
              <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30 shadow-xl">
                <span class="font-bold tracking-widest uppercase text-xs">
                  {{ committee.type }} Committee
                </span>
              </div>
            </div>
          </div>
          
          <div class="p-8 bg-white relative z-20">
            <h2 class="text-2xl font-bold font-montserrat mb-6 border-b border-gray-100 pb-4">Topics</h2>
            <div class="grid md:grid-cols-2 gap-8">
              <div class="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
                <span class="text-red-700 font-bold text-sm uppercase tracking-wider mb-2 block">Topic A</span>
                <p class="text-xl font-medium text-gray-900 leading-tight">{{ committee.topicA }}</p>
              </div>
              <div v-if="committee.topicB" class="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
                <span class="text-red-700 font-bold text-sm uppercase tracking-wider mb-2 block">Topic B</span>
                <p class="text-xl font-medium text-gray-900 leading-tight">{{ committee.topicB }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Leadership and Resources -->
        <div class="grid lg:grid-cols-3 gap-8 items-start">
          <!-- Leadership -->
          <div class="bg-white p-8 rounded-2xl shadow-lg lg:sticky lg:top-24">
            <h3 class="text-xl font-bold font-montserrat mb-6">Committee Leadership</h3>
            <div class="space-y-6">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-600 font-bold text-xl border-2 border-red-100 uppercase">
                  {{ committee.chairName.charAt(0) }}
                </div>
                <div>
                  <div class="font-bold text-lg leading-tight">{{ committee.chairName }}</div>
                  <div class="text-sm text-gray-500 font-medium">Chair</div>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 font-bold text-xl border-2 border-gray-100 uppercase">
                  {{ committee.coChairName.charAt(0) }}
                </div>
                <div>
                  <div class="font-bold text-lg leading-tight">{{ committee.coChairName }}</div>
                  <div class="text-sm text-gray-500 font-medium">Co-Chair</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Resources -->
          <div class="lg:col-span-2 space-y-6">
            <h3 class="text-2xl font-bold font-montserrat text-black px-2">Committee Resources</h3>
            <div class="grid sm:grid-cols-2 gap-4">
              <div v-for="resource in resources" :key="resource.title" class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border-l-4 border-black group flex flex-col">
                <div class="flex justify-between items-start mb-4">
                  <div class="p-2 bg-gray-50 rounded-lg group-hover:bg-red-50 transition-colors">
                    <FileText class="w-6 h-6 text-black group-hover:text-red-500 transition-colors" />
                  </div>
                  <span class="text-[10px] font-bold px-2 py-0.5 bg-gray-100 rounded text-gray-500 uppercase tracking-widest">PDF</span>
                </div>
                
                <h4 class="text-lg font-bold mb-1 font-montserrat leading-tight">{{ resource.title }}</h4>
                <p class="text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed">{{ resource.description }}</p>
                
                <div class="flex items-center gap-4 mt-auto pt-2">
                  <button 
                    @click="openViewer(resource.filename, resource.title)"
                    class="inline-flex items-center gap-1.5 text-sm text-black font-bold hover:text-gray-700 transition-colors"
                  >
                    <Eye class="w-3.5 h-3.5" />
                    View
                  </button>
                  <a :href="`/resources/${resource.filename}`" target="_blank" download class="inline-flex items-center gap-1.5 text-sm text-red-600 font-bold hover:text-red-700 transition-colors">
                    <Download class="w-3.5 h-3.5" />
                    Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center pt-8">
          <NuxtLink :to="committee.type === 'JMUN' ? '/jmun' : '/samun'" class="text-gray-500 hover:text-black font-bold transition-colors">
            ← Back to {{ committee.type }}
          </NuxtLink>
        </div>
      </div>
      
      <div v-else class="text-center py-24">
        <h2 class="text-2xl font-bold text-gray-400">Committee not found</h2>
        <NuxtLink to="/" class="text-red-600 hover:underline mt-4 inline-block">Return Home</NuxtLink>
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
