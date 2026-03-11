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
      <h1 class="text-5xl md:text-6xl font-bold text-center mb-6 font-montserrat text-black tracking-tight animate-fade-in-up">
        Conference Schedule
      </h1>
      
      <!-- Contextual Tabs -->
      <div class="flex justify-center mb-12 animate-fade-in-up" style="animation-delay: 200ms; animation-fill-mode: both;">
        <div class="bg-gray-200 p-1.5 rounded-2xl inline-flex shadow-inner" role="tablist" aria-label="Conference Tabs">
          <button 
            @click="activeTab = 'JMUN'"
            role="tab"
            :id="'tab-JMUN'"
            :aria-selected="activeTab === 'JMUN'"
            aria-controls="panel-JMUN"
            :tabindex="activeTab === 'JMUN' ? 0 : -1"
            :class="[
              'px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300',
              activeTab === 'JMUN' ? 'bg-white text-black shadow-md scale-105' : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            JMUN
          </button>
          <button 
            @click="activeTab = 'SAMUN'"
            role="tab"
            :id="'tab-SAMUN'"
            :aria-selected="activeTab === 'SAMUN'"
            aria-controls="panel-SAMUN"
            :tabindex="activeTab === 'SAMUN' ? 0 : -1"
            :class="[
              'px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300',
              activeTab === 'SAMUN' ? 'bg-red-600 text-white shadow-md scale-105' : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            SAMUN
          </button>
        </div>
      </div>

      <div class="space-y-12 min-h-[400px]" :id="`panel-${activeTab}`" role="tabpanel" :aria-labelledby="`tab-${activeTab}`" tabindex="0">
        <!-- Loading State -->
        <div v-if="status === 'pending'" class="space-y-8">
          <div v-for="i in 2" :key="i" class="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
            <div class="bg-gray-800 p-6">
              <UiSkeleton class="w-1/3 h-8 bg-gray-600 mb-2" />
            </div>
            <div class="p-8 space-y-6">
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
        <div v-else-if="error" class="bg-red-50 text-red-700 p-12 rounded-2xl text-center border border-red-200 reveal">
          <AlertCircle class="w-16 h-16 mx-auto mb-6 text-red-500 animate-bounce" />
          <h3 class="text-2xl font-bold mb-3 font-montserrat uppercase tracking-tight">Notice</h3>
          <p class="text-lg font-medium opacity-80">
            The schedule is temporarily unavailable. Please try again later or contact the secretariat.
          </p>
        </div>

        <!-- Data State -->
        <div v-else-if="filteredSchedule.length > 0" class="flex flex-col gap-12">
          <div 
            v-for="(day, index) in filteredSchedule" 
            :key="`${activeTab}-${day.date}`" 
            class="bg-white rounded-2xl shadow-xl overflow-hidden reveal hover-lift transition-all duration-500"
            :style="{ transitionDelay: `${index * 150}ms` }"
          >
            <div :class="['p-8 text-white transition-colors duration-500', activeTab === 'SAMUN' ? 'bg-red-700' : 'bg-black']">
              <h2 class="text-3xl font-bold font-montserrat uppercase tracking-tight">
                {{ day.day }} - {{ day.date }}
              </h2>
            </div>
            <div class="p-8">
              <div class="space-y-8">
                <div 
                  v-for="(event, eIndex) in day.events" 
                  :key="eIndex" 
                  class="flex flex-col md:flex-row md:items-center gap-6 border-b border-gray-100 last:border-0 pb-8 last:pb-0 group"
                >
                  <div :class="['md:w-48 font-extrabold text-xl transition-colors duration-300', activeTab === 'SAMUN' ? 'text-red-600' : 'text-black']">
                    {{ event.time }}
                  </div>
                  <div class="flex-1">
                    <div class="font-bold text-2xl text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                      {{ event.activity }}
                    </div>
                    <div class="text-gray-600 flex items-center gap-2 mt-2 font-medium">
                      <span class="text-sm border border-gray-200 rounded-lg px-3 py-1 bg-gray-50 shadow-sm">
                        {{ event.location }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-else class="text-center bg-white p-20 rounded-2xl border border-gray-100 shadow-xl reveal">
          <p class="text-2xl text-gray-400 font-bold font-montserrat uppercase opacity-60">
            Schedule for {{ activeTab }} coming soon.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
