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

const resources = [
  { title: 'Background Guide', type: 'PDF', size: '1.2 MB' },
  { title: 'Committee Roster', type: 'PDF', size: '0.4 MB' }
]
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

        <!-- Leadership -->
        <div class="grid md:grid-cols-2 gap-8">
          <div class="bg-white p-8 rounded-2xl shadow-lg">
            <h3 class="text-xl font-bold font-montserrat mb-6">Committee Leadership</h3>
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-lg">
                  {{ committee.chairName.charAt(0) }}
                </div>
                <div>
                  <div class="font-bold text-lg">{{ committee.chairName }}</div>
                  <div class="text-sm text-gray-500">Chair</div>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-lg">
                  {{ committee.coChairName.charAt(0) }}
                </div>
                <div>
                  <div class="font-bold text-lg">{{ committee.coChairName }}</div>
                  <div class="text-sm text-gray-500">Co-Chair</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Resources -->
          <div class="bg-white p-8 rounded-2xl shadow-lg">
            <h3 class="text-xl font-bold font-montserrat mb-6">Committee Resources</h3>
            <div class="space-y-4">
              <div v-for="(res, idx) in resources" :key="idx" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group">
                <div class="flex items-center gap-3">
                  <FileText class="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                  <span class="font-medium text-gray-700">{{ res.title }}</span>
                </div>
                <Download class="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
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
