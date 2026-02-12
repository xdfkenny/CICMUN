<script setup lang="ts">
import { Calendar, MapPin } from 'lucide-vue-next'
import type { Committee } from '~/shared/types'

useSeoMeta({
  title: 'SAMUN 2026',
  ogTitle: 'SAMUN 2026 - South American Model United Nations',
  description: 'Explora los comités, temas y recursos para SAMUN 2026. La conferencia insignia de Model UN para estudiantes de secundaria en CIC.',
  ogDescription: 'Explora los comités, temas y recursos para SAMUN 2026. La conferencia insignia de Model UN para estudiantes de secundaria en CIC.',
})

const { data: committees, status } = await useFetch<Committee[]>('/api/committees/SAMUN')
const { data: events } = await useFetch('/api/events')

const eventDetails = computed(() => events.value?.find(e => e.id === 'samun'))
const isLoading = computed(() => status.value === 'pending')
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="container max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-5xl font-bold text-black mb-4 font-montserrat">{{ eventDetails?.name || 'SAMUN 2026' }}</h1>
        <p class="text-xl text-gray-700">
          {{ eventDetails?.description || 'South American Model of United Nations' }}
        </p>
      </div>

      <!-- Event Details -->
      <div class="max-w-4xl mx-auto mb-12">
        <!-- Date and Location with Map -->
        <div class="bg-white p-6 md:p-10 rounded-2xl border-l-8 border-red-600 shadow-xl overflow-hidden">
          <h2 class="text-3xl font-bold text-black mb-8 font-montserrat">Event Details</h2>

          <div class="grid md:grid-cols-2 gap-10">
            <div class="space-y-6">
              <div class="flex items-start gap-5">
                <div class="bg-red-50 p-3 rounded-xl">
                  <Calendar class="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p class="font-bold text-gray-900 text-lg">Date</p>
                  <p class="text-gray-700 text-lg">{{ eventDetails?.date || 'Coming Soon' }}</p>
                </div>
              </div>

              <div class="flex items-start gap-5">
                <div class="bg-red-50 p-3 rounded-xl">
                  <MapPin class="w-6 h-6 text-red-600" />
                </div>
                <div class="flex-1">
                  <p class="font-bold text-gray-900 text-lg">Location</p>
                  <div class="hidden md:block">
                    <p class="text-gray-700 font-medium">{{ eventDetails?.location || 'Colegio Internacional de Caracas' }}</p>
                    <p class="text-sm text-gray-500 mt-1">{{ eventDetails?.address }}</p>
                    <p class="text-sm text-gray-500">{{ eventDetails?.city }}</p>
                    
                    <div v-if="eventDetails?.externalMapUrl" class="mt-6">
                      <a :href="eventDetails.externalMapUrl" target="_blank" rel="noopener noreferrer">
                        <UiButton size="default" class="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg hover:shadow-red-600/20">
                          <MapPin class="w-4 h-4" />
                          Open in Google Maps
                        </UiButton>
                      </a>
                    </div>
                  </div>
                  <!-- Mobile only fallback or just keep it simple -->
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
        <h2 class="text-3xl font-bold text-black mb-8 font-montserrat">SAMUN Committees</h2>

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
