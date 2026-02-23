<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next'

const { data: schedule, status, error } = await useFetch('/api/schedule')

useSeoMeta({
  title: 'Conference Schedule',
  ogTitle: 'Conference Schedule | CICMUN 2026',
  description: 'Check out the detailed schedule of activities for CICMUN 2026, including ceremonies and committee sessions.',
  ogDescription: 'Check out the detailed schedule of activities for CICMUN 2026, including ceremonies and committee sessions.',
})

const activeTab = ref<'JMUN' | 'SAMUN'>('JMUN')

const filteredSchedule = computed(() => {
  if (!schedule.value) return []
  return schedule.value.filter((day: any) => 
    !day.conferences || day.conferences.includes(activeTab.value)
  )
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="container max-w-4xl mx-auto">
      <h1 class="text-5xl md:text-6xl font-bold text-center mb-6 font-montserrat text-black tracking-tight">Conference Schedule</h1>
      
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

      <div class="space-y-12">
        <!-- Loading State -->
        <div v-if="status === 'pending'" class="space-y-8">
          <div v-for="i in 2" :key="i" class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="bg-gray-800 p-6">
              <UiSkeleton class="w-1/3 h-8 bg-gray-600 mb-2" />
            </div>
            <div class="p-6 space-y-6">
              <div v-for="j in 3" :key="j" class="flex flex-col md:flex-row gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <UiSkeleton class="w-32 h-6" />
                <div class="flex-1 space-y-2">
                  <UiSkeleton class="w-2/3 h-6" />
                  <UiSkeleton class="w-24 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 text-red-700 p-8 rounded-xl text-center border border-red-200">
          <AlertCircle class="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h3 class="text-xl font-bold mb-2">Notice</h3>
          <p>The schedule is temporarily unavailable. Please try again later or contact the secretariat.</p>
        </div>

        <!-- Data State -->
        <template v-else-if="filteredSchedule.length > 0">
          <div v-for="(day, index) in filteredSchedule" :key="index" class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div :class="['p-6 text-white', activeTab === 'SAMUN' ? 'bg-red-700' : 'bg-black']">
              <h2 class="text-2xl font-bold font-montserrat">{{ day.day }} - {{ day.date }}</h2>
            </div>
            <div class="p-6">
              <div class="space-y-6">
                <div v-for="(event, eIndex) in day.events" :key="eIndex" class="flex flex-col md:flex-row md:items-center gap-4 border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                  <div class="md:w-48 font-bold text-red-600 text-lg">{{ event.time }}</div>
                  <div class="flex-1">
                    <div class="font-bold text-xl text-gray-900">{{ event.activity }}</div>
                    <div class="text-gray-600 flex items-center gap-1 mt-1">
                      <span class="text-sm border border-gray-200 rounded px-2 py-0.5 bg-gray-50">{{ event.location }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        
        <!-- Empty State -->
        <div v-else class="text-center bg-white p-12 rounded-xl border border-gray-100 shadow-sm">
          <p class="text-xl text-gray-600 font-medium">Schedule for {{ activeTab }} coming soon.</p>
        </div>
      </div>
    </div>
  </div>
</template>
