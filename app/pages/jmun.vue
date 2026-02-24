<script setup lang="ts">
import { Calendar, MapPin } from 'lucide-vue-next'
import type { Committee } from '~~/shared/types'

useSeoMeta({
  title: 'JMUN 2026',
  ogTitle: 'JMUN 2026 - Junior Model of United Nations',
  description: 'Discover the committees and topics for JMUN 2026. The perfect introduction to diplomacy for middle school students at CIC.',
  ogDescription: 'Discover the committees and topics for JMUN 2026. The perfect introduction to diplomacy for middle school students at CIC.',
})

const { data: committees, status } = await useFetch<Committee[]>('/api/committees/JMUN')
const { data: events } = await useFetch('/api/events')

const eventDetails = computed(() => events.value?.find((e: any) => e.id === 'jmun'))
const isLoading = computed(() => status.value === 'pending')

const formatEventDateRange = (startDate: string, endDate: string, timeZone = 'UTC') => {
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 'Coming Soon'

  const startMonth = start.toLocaleDateString('en-US', { month: 'long', timeZone })
  const endMonth = end.toLocaleDateString('en-US', { month: 'long', timeZone })
  const startDay = parseInt(start.toLocaleDateString('en-US', { day: 'numeric', timeZone }), 10)
  const endDay = parseInt(end.toLocaleDateString('en-US', { day: 'numeric', timeZone }), 10)
  const year = parseInt(start.toLocaleDateString('en-US', { year: 'numeric', timeZone }), 10)

  if (startMonth === endMonth) {
    if (startDay === endDay) return `${startMonth} ${startDay}, ${year}`
    return `${startMonth} ${startDay}-${endDay}, ${year}`
  }

  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`
}

const formattedDate = computed(() => {
  if (!eventDetails.value) return 'Coming Soon'
  
  if (eventDetails.value.startDate && eventDetails.value.endDate) {
    return formatEventDateRange(
      eventDetails.value.startDate,
      eventDetails.value.endDate,
      eventDetails.value.timezone || 'UTC'
    )
  }
  
  return 'Coming Soon'
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="container max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-5xl md:text-6xl font-bold text-black mb-4 font-montserrat tracking-tight">{{ eventDetails?.name || 'JMUN 2026' }}</h1>
        <p class="text-xl text-black">
          {{ eventDetails?.description || 'Junior Model of United Nations' }}
        </p>
      </div>

      <!-- Event Details -->
      <div class="max-w-4xl mx-auto mb-12">
        <!-- Date and Location with Map -->
        <div class="bg-white p-6 md:p-10 rounded-2xl border-l-8 border-black shadow-xl overflow-hidden">
          <h2 class="text-3xl font-bold text-black mb-8 font-montserrat">Event Details</h2>

          <div class="grid md:grid-cols-2 gap-10">
            <div class="space-y-6">
              <div class="flex items-start gap-5">
                <div class="bg-gray-50 p-3 rounded-xl">
                  <Calendar class="w-6 h-6 text-black" />
                </div>
                <div>
                  <p class="font-bold text-black text-lg">Date</p>
                  <p class="text-black text-lg">{{ formattedDate }}</p>
                </div>
              </div>

              <div class="flex items-start gap-5">
                <div class="bg-gray-50 p-3 rounded-xl">
                  <MapPin class="w-6 h-6 text-black" />
                </div>
                <div class="flex-1">
                  <p class="font-bold text-black text-lg">Location</p>
                  <div class="hidden md:block">
                    <p class="text-black font-medium">{{ eventDetails?.location || 'Colegio Internacional de Caracas' }}</p>
                    <p class="text-sm text-black mt-1">{{ eventDetails?.address }}</p>
                    <p class="text-sm text-black">{{ eventDetails?.city }}</p>
                    
                    <div v-if="eventDetails?.externalMapUrl" class="mt-6">
                      <a :href="eventDetails.externalMapUrl" target="_blank" rel="noopener noreferrer">
                        <UiButton size="default" class="flex items-center gap-2 bg-black text-white hover:bg-gray-800 transition-all shadow-lg">
                          <MapPin class="w-4 h-4" />
                          Open in Google Maps
                        </UiButton>
                      </a>
                    </div>
                  </div>
                  <!-- Mobile only fallback -->
                  <p class="md:hidden text-gray-700 font-medium">{{ eventDetails?.location || 'Colegio Internacional de Caracas' }}</p>
                </div>
              </div>
            </div>

            <div class="rounded-xl overflow-hidden border border-gray-100 shadow-inner h-[250px] md:h-full min-h-[250px]">
              <template v-if="eventDetails?.mapUrl">
                <iframe
                  title="Google Maps Location"
                  width="100%"
                  height="100%"
                  style="border: 0"
                  loading="lazy"
                  allowfullscreen
                  referrerpolicy="no-referrer-when-downgrade"
                  :src="eventDetails?.mapUrl"
                ></iframe>
              </template>
              <template v-else>
                <div class="flex items-center justify-center h-full p-4 text-center text-gray-500">
                  <p class="max-w-xs">Map unavailable for this event.</p>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Committees Section -->
      <div>
        <h2 class="text-3xl font-bold text-black mb-8 font-montserrat">JMUN Committees</h2>

        <div v-if="status === 'error'" class="bg-red-50 text-red-700 p-8 rounded-xl text-center border border-red-200 mb-8">
          <p class="text-xl font-bold mb-2">Notice</p>
          <p>Committees are temporarily unavailable. Please try again later.</p>
        </div>

        <div v-else-if="isLoading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="bg-white p-6 rounded-lg shadow-md">
            <UiSkeleton class="h-8 w-3/4 mb-4" />
            <UiSkeleton class="h-4 w-full mb-3" />
            <UiSkeleton class="h-4 w-full mb-3" />
            <UiSkeleton class="h-20 w-full" />
          </div>
        </div>

        <div v-else-if="committees && committees.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CommitteeCard
            v-for="committee in committees"
            :key="committee.id"
            :committee="committee"
          />
        </div>

        <div v-else class="bg-white p-8 rounded-lg text-center shadow-sm border border-gray-100">
          <p class="text-black text-lg">
            Committees coming soon. Check back for updates!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
