<script setup lang="ts">
import { Calendar, MapPin } from 'lucide-vue-next'
import type { Committee } from '~/shared/types'

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
      <div class="grid md:grid-cols-2 gap-8 mb-12">
        <!-- Date and Location -->
        <div class="bg-white p-8 rounded-lg border-l-4 border-black shadow-md">
          <h2 class="text-2xl font-bold text-black mb-6 font-montserrat">Event Details</h2>

          <div class="space-y-4">
            <div class="flex items-start gap-4">
              <Calendar class="w-6 h-6 text-black flex-shrink-0 mt-1" />
              <div>
                <p class="font-bold text-gray-900">Date</p>
                <p class="text-gray-700">{{ eventDetails?.date || 'Coming Soon' }}</p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <MapPin class="w-6 h-6 text-black flex-shrink-0 mt-1" />
              <div>
                <p class="font-bold text-gray-900">Location</p>
                <p class="text-gray-700">{{ eventDetails?.location || 'Colegio Internacional de Caracas' }}</p>
                <p class="text-sm text-gray-600">{{ eventDetails?.address }}</p>
                <p class="text-sm text-gray-600">{{ eventDetails?.city }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Map -->
        <div class="bg-white p-4 rounded-lg shadow-md overflow-hidden">
          <iframe
            width="100%"
            height="300"
            style="border: 0"
            loading="lazy"
            allowfullscreen
            referrerpolicy="no-referrer-when-downgrade"
            :src="eventDetails?.mapUrl"
          ></iframe>
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
