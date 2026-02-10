<script setup lang="ts">
import { Users, FileText, Download } from 'lucide-vue-next'
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

const resources = computed(() => committee.value?.resources || [])
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="container max-w-4xl mx-auto">
      <div v-if="committee" class="space-y-8">
        <!-- Header -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div class="bg-black text-white p-8 md:p-12 text-center">
            <h1 class="text-4xl md:text-5xl font-bold font-montserrat mb-4">{{ committee.name }}</h1>
            <div class="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Users class="w-5 h-5" />
              <span class="font-bold">{{ committee.type }} Committee</span>
            </div>
          </div>
          
          <div class="p-8">
            <h2 class="text-2xl font-bold font-montserrat mb-6 border-b border-gray-100 pb-4">Topics</h2>
            <div class="grid md:grid-cols-2 gap-8">
              <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <span class="text-red-500 font-bold text-sm uppercase tracking-wider mb-2 block">Topic A</span>
                <p class="text-xl font-medium text-gray-900">{{ committee.topicA }}</p>
              </div>
              <div v-if="committee.topicB" class="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <span class="text-red-500 font-bold text-sm uppercase tracking-wider mb-2 block">Topic B</span>
                <p class="text-xl font-medium text-gray-900">{{ committee.topicB }}</p>
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
              <div v-for="resource in resources" :key="resource.title" class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border-l-4 border-black group">
                <div class="flex justify-between items-start mb-4">
                  <div class="p-2 bg-gray-50 rounded-lg group-hover:bg-red-50 transition-colors">
                    <FileText class="w-6 h-6 text-black group-hover:text-red-500 transition-colors" />
                  </div>
                  <span class="text-[10px] font-bold px-2 py-0.5 bg-gray-100 rounded text-gray-500 uppercase tracking-widest">PDF</span>
                </div>
                
                <h4 class="text-lg font-bold mb-1 font-montserrat leading-tight">{{ resource.title }}</h4>
                <p class="text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed">{{ resource.description }}</p>
                
                <a :href="`/resources/${resource.filename}`" target="_blank" class="inline-flex items-center gap-2 text-sm text-red-600 font-bold hover:text-red-700 transition-colors mt-auto">
                  Download
                  <Download class="w-3.5 h-3.5" />
                </a>
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
  </div>
</template>
