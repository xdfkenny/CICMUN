<script setup lang="ts">
import { FileText, Download } from 'lucide-vue-next'

const { data: resources } = await useFetch('/api/resources')
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
          
          <a :href="`/resources/${resource.filename}`" target="_blank" class="inline-flex items-center gap-2 text-red-600 font-bold hover:text-red-700 transition-colors">
            Download
            <Download class="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
