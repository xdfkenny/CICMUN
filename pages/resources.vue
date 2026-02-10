<script setup lang="ts">
import { FileText, Download } from 'lucide-vue-next'

const resources = [
  {
    title: 'Delegate Handbook',
    description: 'Everything you need to know about CICMUN procedures and protocols.',
    type: 'PDF',
    size: '2.4 MB',
    link: '#'
  },
  {
    title: 'Rules of Procedure',
    description: 'Comprehensive guide to parliamentary procedure used in our committees.',
    type: 'PDF',
    size: '1.8 MB',
    link: '#'
  },
  {
    title: 'Position Paper Guide',
    description: 'Tips and templates for writing an award-winning position paper.',
    type: 'PDF',
    size: '0.5 MB',
    link: '#'
  },
  {
    title: 'Resolution Writing 101',
    description: 'Learn how to draft effective resolutions and amendments.',
    type: 'PDF',
    size: '1.2 MB',
    link: '#'
  }
]
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="container max-w-4xl mx-auto">
      <h1 class="text-4xl md:text-5xl font-bold text-center mb-4 font-montserrat text-black">Resources</h1>
      <p class="text-xl text-center text-gray-600 mb-12">Essential documents for your preparation</p>

      <div class="grid md:grid-cols-2 gap-6">
        <div v-for="(resource, index) in resources" :key="index" class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-black">
          <div class="flex justify-between items-start mb-4">
            <div class="p-3 bg-gray-100 rounded-lg">
              <FileText class="w-8 h-8 text-black" />
            </div>
            <span class="text-xs font-bold px-2 py-1 bg-gray-100 rounded text-gray-600">{{ resource.type }}</span>
          </div>
          
          <h3 class="text-xl font-bold mb-2 font-montserrat">{{ resource.title }}</h3>
          <p class="text-gray-600 mb-6 text-sm">{{ resource.description }}</p>
          
          <a :href="resource.link" class="inline-flex items-center gap-2 text-red-600 font-bold hover:text-red-700 transition-colors">
            Download
            <Download class="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
