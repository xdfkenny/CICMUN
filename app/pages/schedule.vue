<script setup lang="ts">
import { AlertCircle, CalendarClock } from 'lucide-vue-next'
import { siteConfig, siteTitle } from '~/config/siteConfig'

const { data: schedule, status, error } = await useFetch('/api/schedule', {
  // Never let the browser cache API data: stale schedule responses can
  // resurface after data changes (see gallery.vue for the same pattern).
  cache: 'no-store',
})

useSeoMeta({
  title: 'Conference Schedule',
  ogTitle: `Conference Schedule | ${siteTitle}`,
  description: `Check out the detailed schedule of activities for ${siteTitle}, including ceremonies and committee sessions.`,
  ogDescription: `Check out the detailed schedule of activities for ${siteTitle}, including ceremonies and committee sessions.`,
})

const activeTab = ref<'JMUN' | 'SAMUN'>('JMUN')

const filteredSchedule = computed(() => {
  if (!schedule.value) return []
  return schedule.value.filter((day: any) => 
    !day.conferences || day.conferences.includes(activeTab.value)
  )
})

const handleTabKey = (tab: 'JMUN' | 'SAMUN') => {
  if (activeTab.value === tab) {
    // If already focused, move to next tab
    activeTab.value = tab === 'JMUN' ? 'SAMUN' : 'JMUN'
  } else {
    activeTab.value = tab
  }
}

// e.g. "JMUN 2027" — follows the active tab so the coming-soon notice names
// the right conference while the schedule datasets are still pending.
const conferenceLabel = computed(() =>
  activeTab.value === 'JMUN' ? siteConfig.jmun.name : siteConfig.samun.name)
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="container max-w-4xl mx-auto">
      <UiPageHero title="Conference Schedule" />
      
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
            @keydown.prevent="handleTabKey('JMUN')"
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
            @keydown.prevent="handleTabKey('SAMUN')"
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
          <h3 class="text-2xl font-bold mb-3 font-display uppercase tracking-tight">Notice</h3>
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
              <h2 class="text-3xl font-bold font-display uppercase tracking-tight">
                {{ day.day }} - {{ day.date }}
              </h2>
            </div>
            <div class="p-8">
              <!-- Room Directory (data pending — hidden until day.rooms is populated;
                   renders once per day, sessions only show committee badges) -->
              <div v-if="day.rooms?.length" class="mb-8 rounded-xl border border-gray-100 bg-gray-50 p-5">
                <p class="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Room Directory</p>
                <ul class="grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                  <li v-for="room in day.rooms" :key="room.committee" class="flex items-baseline gap-2 text-sm">
                    <span class="font-bold text-black whitespace-nowrap">{{ room.committee }}</span>
                    <span class="font-medium text-gray-600">
                      {{ room.room }}{{ room.chair ? ` · ${room.chair}` : '' }}
                    </span>
                  </li>
                </ul>
              </div>
              <div class="space-y-8">
                <div 
                  v-for="(event, eIndex) in day.events" 
                  :key="eIndex" 
                  class="flex flex-col md:flex-row md:items-center gap-6 border-b border-gray-100 last:border-0 pb-8 last:pb-0 group"
                >
                  <div :class="['md:w-48 font-extrabold text-xl whitespace-nowrap tabular-nums transition-colors duration-300', activeTab === 'SAMUN' ? 'text-red-600' : 'text-black']">
                    {{ event.time }}
                  </div>
                  <div class="flex-1">
                    <div class="font-bold text-2xl text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                      {{ event.activity }}
                    </div>
                    <div v-if="event.committees?.length" class="flex flex-wrap gap-2 mt-2" aria-label="Committees in session">
                      <span
                        v-for="code in event.committees"
                        :key="code"
                        class="text-xs font-bold border border-gray-200 rounded-lg px-3 py-1 bg-gray-50 shadow-sm whitespace-nowrap"
                      >
                        {{ code }}
                      </span>
                    </div>
                    <div v-else class="text-gray-600 flex items-center gap-2 mt-2 font-medium">
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
        
        <!-- Empty State: schedule datasets pending — published closer to the conference -->
        <div v-else class="reveal rounded-2xl border border-gray-100 bg-white p-16 text-center shadow-xl">
          <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <CalendarClock class="h-8 w-8 text-gray-500" aria-hidden="true" />
          </div>
          <h2 class="font-display text-2xl font-bold uppercase tracking-tight text-gray-900">
            Schedule coming soon
          </h2>
          <p class="mx-auto mt-3 max-w-md text-base font-medium text-gray-500">
            The day-by-day schedule for {{ conferenceLabel }} is being finalized and will be
            published here as soon as it's confirmed.
          </p>
          <p class="mt-2 text-sm font-medium text-gray-400">
            Check back soon — or email the secretariat at
            <a
              href="mailto:samun@ciccaracas.com.ve"
              class="font-bold text-gray-600 underline underline-offset-2 hover:text-red-600"
            >
              samun@ciccaracas.com.ve
            </a>.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
