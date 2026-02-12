<script setup lang="ts">
import { Calendar, MapPin } from 'lucide-vue-next'
import type { Committee } from '~/shared/types'

useSeoMeta({
  title: 'JMUN 2026',
  ogTitle: 'JMUN 2026 - Junior Model of United Nations',
  description: 'Descubre los comités y temas para JMUN 2026. La introducción perfecta a la diplomacia para estudiantes de secundaria inferior en CIC.',
  ogDescription: 'Descubre los comités y temas para JMUN 2026. La introducción perfecta a la diplomacia para estudiantes de secundaria inferior en CIC.',
})

const { data: committees, status } = await useFetch<Committee[]>('/api/committees/JMUN')
const { data: events } = await useFetch('/api/events')

const eventDetails = computed(() => events.value?.find(e => e.id === 'jmun'))
const isLoading = computed(() => status.value === 'pending')
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="container max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-5xl font-bold text-black mb-4 font-montserrat">{{ eventDetails?.name || 'JMUN 2026' }}</h1>
        <p class="text-xl text-gray-700">
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
                  <p class="font-bold text-gray-900 text-lg">Date</p>
                  <p class="text-gray-700 text-lg">{{ eventDetails?.date || 'Coming Soon' }}</p>
                </div>
              </div>

              <div class="flex items-start gap-5">
                <div class="bg-gray-50 p-3 rounded-xl">
                  <MapPin class="w-6 h-6 text-black" />
                </div>
                <div class="flex-1">
                  <p class="font-bold text-gray-900 text-lg">Location</p>
                  <div class="hidden md:block">
                    <p class="text-gray-700 font-medium">{{ eventDetails?.location || 'Colegio Internacional de Caracas' }}</p>
                    <p class="text-sm text-gray-500 mt-1">{{ eventDetails?.address }}</p>
                    <p class="text-sm text-gray-500">{{ eventDetails?.city }}</p>
                    
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
              <iframe
                width="100%"
                height="100%"
                style="border: 0"
                loading="lazy"
                allowfullscreen
                referrerpolicy="no-referrer-when-downgrade"
                :src="eventDetails?.mapUrl"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <!-- Committees Section -->
      <div>
        <h2 class="text-3xl font-bold text-black mb-8 font-montserrat">JMUN Committees</h2>

        <div v-if="isLoading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        <div v-else class="bg-white p-8 rounded-lg text-center">
          <p class="text-gray-700 text-lg">
            Committees coming soon. Check back for updates!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
