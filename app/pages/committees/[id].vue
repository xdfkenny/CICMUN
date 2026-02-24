<script setup lang="ts">
import { Users, FileText, Download, Eye, AlertCircle } from 'lucide-vue-next'
import type { Committee } from '~~/shared/types'

const route = useRoute()
const committeeId = parseInt(route.params.id as string)

// Fetch specific committee data directly
const { data: committee, status, error } = await useFetch<Committee>(`/api/committees/${committeeId}`)

const isLoading = computed(() => status.value === 'pending')
const hasError = computed(() => !!error.value || !committee.value)

useSeoMeta({
  title: () => committee.value ? `${committee.value.name} (${committee.value.type})` : 'Loading...',
  ogTitle: () => committee.value ? `${committee.value.name} - CICMUN 2026` : 'Committee - CICMUN 2026',
  description: () => committee.value ? `Information about the ${committee.value.name} committee. Topics: ${committee.value.topicA}${committee.value.topicB ? ' and ' + committee.value.topicB : ''}.` : 'CICMUN committee details.',
  ogDescription: () => committee.value ? `Information about the ${committee.value.name} committee. Topics: ${committee.value.topicA}${committee.value.topicB ? ' and ' + committee.value.topicB : ''}.` : 'CICMUN committee details.',
  ogImage: '/LOGO.png',
})

const accentColor = computed(() => committee.value?.type === 'SAMUN' ? 'red-600' : 'black')
const bgLightColor = computed(() => committee.value?.type === 'SAMUN' ? 'bg-red-50' : 'bg-gray-50')
const bgAccentColor = computed(() => committee.value?.type === 'SAMUN' ? 'bg-red-600' : 'bg-black')
const borderAccentColor = computed(() => committee.value?.type === 'SAMUN' ? 'border-red-100' : 'border-gray-200')
const textAccentColor = computed(() => committee.value?.type === 'SAMUN' ? 'text-red-600' : 'text-black')
const textDarkColor = computed(() => committee.value?.type === 'SAMUN' ? 'text-red-700' : 'text-black')
const groupHoverTextAccentColor = computed(() => committee.value?.type === 'SAMUN' ? 'group-hover:text-red-500' : 'group-hover:text-black')
const groupHoverBgLightColor = computed(() => committee.value?.type === 'SAMUN' ? 'group-hover:bg-red-50' : 'group-hover:bg-gray-100')
const hoverTextDarkColor = computed(() => committee.value?.type === 'SAMUN' ? 'hover:text-red-700' : 'hover:text-black')

const resources = computed(() => committee.value?.resources || [])

const isViewerOpen = ref(false)
const selectedPdf = ref({ url: '', title: '' })

const getInitial = (name?: string | null) => {
  const trimmed = typeof name === 'string' ? name.trim() : ''
  return trimmed ? trimmed.charAt(0).toUpperCase() : '?'
}

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
      <div v-if="isLoading" class="space-y-8 animate-pulse">
        <div class="bg-gray-200 h-64 md:h-80 rounded-2xl w-full"></div>
        <div class="grid lg:grid-cols-3 gap-8 items-start">
          <div class="bg-white p-8 rounded-2xl shadow-lg h-48 w-full"></div>
          <div class="lg:col-span-2 space-y-4">
            <div class="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div class="h-32 bg-white rounded-xl shadow-md w-full"></div>
            <div class="h-32 bg-white rounded-xl shadow-md w-full"></div>
          </div>
        </div>
      </div>
      
      <div v-else-if="hasError" class="bg-red-50 text-red-700 p-12 rounded-2xl text-center border border-red-200">
        <AlertCircle class="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h2 class="text-2xl font-bold mb-2">Error Loading Committee</h2>
        <p class="text-lg">We couldn't load the details for this committee. Please try again later.</p>
        <NuxtLink to="/" class="inline-block mt-6 px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors">Return Home</NuxtLink>
      </div>

      <div v-else-if="committee" class="space-y-8">
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
              <h1 class="text-5xl md:text-6xl font-bold font-montserrat mb-4 drop-shadow-2xl tracking-tight">
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
                <span class="font-bold text-sm uppercase tracking-wider mb-2 block" :class="textDarkColor">Topic A</span>
                <p class="text-xl font-medium text-black leading-tight">{{ committee.topicA }}</p>
              </div>
              <div v-if="committee.topicB" class="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
                <span class="font-bold text-sm uppercase tracking-wider mb-2 block" :class="textDarkColor">Topic B</span>
                <p class="text-xl font-medium text-black leading-tight">{{ committee.topicB }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Leadership and Resources -->
        <div class="grid lg:grid-cols-3 gap-8 items-start">
          <!-- Leadership -->
          <div class="bg-white p-8 rounded-2xl shadow-lg lg:sticky lg:top-24">
            <h3 class="text-xl font-bold font-montserrat mb-6 text-black">Committee Leadership</h3>
            <div class="space-y-6">
                <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl border-2 uppercase" :class="[bgLightColor, textAccentColor, borderAccentColor]">
                  {{ getInitial(committee.chairName) }}
                </div>
                <div>
                  <div class="font-bold text-lg leading-tight text-black">{{ committee.chairName || 'TBA' }}</div>
                  <div class="text-sm text-black font-medium">Chair</div>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-black font-bold text-xl border-2 border-gray-100 uppercase">
                  {{ getInitial(committee.coChairName) }}
                </div>
                <div>
                  <div class="font-bold text-lg leading-tight text-black">{{ committee.coChairName || 'TBA' }}</div>
                  <div class="text-sm text-black font-medium">Co-Chair</div>
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
                  <div class="p-2 rounded-lg transition-colors" :class="groupHoverBgLightColor">
                    <FileText class="w-6 h-6 text-black transition-colors" :class="groupHoverTextAccentColor" />
                  </div>
                  <span class="text-[10px] font-bold px-2 py-0.5 bg-gray-100 rounded text-black uppercase tracking-widest">PDF</span>
                </div>
                
                <h4 class="text-lg font-bold mb-1 font-montserrat leading-tight text-black">{{ resource.title }}</h4>
                <p class="text-black text-xs mb-4 line-clamp-2 leading-relaxed">{{ resource.description }}</p>
                
                <div class="flex items-center gap-4 mt-auto pt-2">
                  <button 
                    @click="openViewer(resource.filename, resource.title)"
                    class="inline-flex items-center gap-1.5 text-sm text-black font-bold hover:text-gray-700 transition-colors"
                  >
                    <Eye class="w-3.5 h-3.5" />
                    View
                  </button>
                  <a :href="`/resources/${resource.filename}`" target="_blank" download class="inline-flex items-center gap-1.5 text-sm font-bold transition-colors" :class="[textAccentColor, hoverTextDarkColor]">
                    <Download class="w-3.5 h-3.5" />
                    Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center pt-8">
          <NuxtLink :to="committee.type === 'JMUN' ? '/jmun' : '/samun'" class="text-black hover:text-gray-700 font-bold transition-colors">
            ← Back to {{ committee.type }}
          </NuxtLink>
        </div>
      </div>
      
      <div v-else class="text-center py-24">
        <h2 class="text-2xl font-bold text-black">Committee not found</h2>
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
