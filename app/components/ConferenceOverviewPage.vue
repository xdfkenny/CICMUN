<script setup lang="ts">
import { ArrowRight, Calendar, MapPin } from 'lucide-vue-next'
import type { AsyncDataRequestStatus } from 'nuxt/app'
import type { Committee, ConferenceType, PortalEvent } from '~~/shared/types'

const props = defineProps<{
  conferenceType: ConferenceType
  fallbackTitle: string
  fallbackDescription: string
  eventDetails: PortalEvent | null
  formattedDate: string
  committees: Committee[]
  status: AsyncDataRequestStatus
  hasError: boolean
  emptyTitle: string
  emptyDescription: string
}>()

const isSamun = computed(() => props.conferenceType === 'SAMUN')
const isLoading = computed(() => props.status === 'pending')
const accentBorderClass = computed(() => (isSamun.value ? 'border-red-600' : 'border-black'))
const accentIconContainerClass = computed(() => (isSamun.value ? 'bg-red-50 group-hover:bg-red-100' : 'bg-gray-50 group-hover:bg-gray-100'))
const accentIconClass = computed(() => (isSamun.value ? 'text-red-600' : 'text-black'))
const accentButtonClass = computed(() => (isSamun.value ? 'bg-red-600 hover:bg-red-700 hover:shadow-red-600/40' : 'bg-black hover:bg-gray-800 hover:shadow-black/20'))

// PanAmUN-style cross-wayfinding strip data: real tracked routes only (no dead ends)
const crossLinks = [
  { to: '/schedule', label: 'Schedule' },
  { to: '/delegates', label: 'Delegates' },
  { to: '/resources', label: 'Resources' },
  { to: '/gallery', label: 'Gallery' },
]

// Accent-aware text-link styling (red for SAMUN, black for JMUN), matching the homepage quick-links language
const linkClass = computed(() => (isSamun.value ? 'text-red-600 hover:text-red-700' : 'text-black hover:text-gray-700'))
</script>

<template>
  <div class="min-h-screen bg-gray-50 px-4 py-12">
    <div class="container mx-auto max-w-6xl">
      <UiPageHero
        align="left"
        uppercase
        :title="eventDetails?.name || fallbackTitle"
        :subtitle="eventDetails?.description || fallbackDescription"
      />

      <!-- Continue exploring (PanAmUN-style cross-wayfinding strip: slim text + arrow, no card grid) -->
      <nav
        aria-label="Continue exploring CICMUN"
        class="mb-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-b border-gray-200 pb-8 animate-fade-in-up"
        style="animation-delay: 250ms; animation-fill-mode: both;"
      >
        <span class="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Continue exploring</span>
        <NuxtLink
          v-for="link in crossLinks"
          :key="link.to"
          :to="link.to"
          class="group inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-tight transition-colors"
          :class="linkClass"
        >
          {{ link.label }}
          <ArrowRight class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </NuxtLink>
      </nav>

      <div class="reveal mx-auto mb-20 max-w-4xl">
        <div
          class="overflow-hidden rounded-2xl border-l-8 bg-white p-6 shadow-xl transition-all duration-500 hover-lift md:p-10"
          :class="accentBorderClass"
        >
          <h2 class="mb-8 font-display text-3xl font-bold uppercase tracking-tight text-black">
            Event Details
          </h2>

          <div class="grid gap-10 md:grid-cols-2">
            <div class="space-y-6">
              <div class="group flex items-start gap-5">
                <div
                  class="rounded-xl p-3 transition-transform duration-300 group-hover:scale-110"
                  :class="accentIconContainerClass"
                >
                  <Calendar class="h-6 w-6" :class="accentIconClass" />
                </div>
                <div>
                  <p class="text-lg font-bold text-black">Date</p>
                  <p class="text-lg font-medium text-black">{{ formattedDate }}</p>
                </div>
              </div>

              <div class="group flex items-start gap-5">
                <div
                  class="rounded-xl p-3 transition-transform duration-300 group-hover:scale-110"
                  :class="accentIconContainerClass"
                >
                  <MapPin class="h-6 w-6" :class="accentIconClass" />
                </div>
                <div class="flex-1">
                  <p class="text-lg font-bold text-black">Location</p>
                  <div class="hidden md:block">
                    <p class="font-semibold text-black">
                      {{ eventDetails?.location || 'Colegio Internacional de Caracas' }}
                    </p>
                    <p v-if="eventDetails?.address" class="mt-1 text-sm font-medium text-gray-600">
                      {{ eventDetails.address }}
                    </p>
                    <p v-if="eventDetails?.city" class="text-sm font-medium text-gray-600">
                      {{ eventDetails.city }}
                    </p>

                    <div v-if="eventDetails?.externalMapUrl" class="mt-6">
                      <a :href="eventDetails.externalMapUrl" target="_blank" rel="noopener noreferrer">
                        <UiButton
                          size="default"
                          class="flex items-center gap-2 text-white shadow-lg transition-all hover:-translate-y-1"
                          :class="accentButtonClass"
                        >
                          <MapPin class="h-4 w-4" />
                          Open in Google Maps
                        </UiButton>
                      </a>
                    </div>
                  </div>
                  <p class="font-semibold text-black md:hidden">
                    {{ eventDetails?.location || 'Colegio Internacional de Caracas' }}
                  </p>
                </div>
              </div>
            </div>

            <div class="min-h-[250px] h-[250px] overflow-hidden rounded-xl border border-gray-100 shadow-inner transition-transform duration-500 hover:scale-[1.02] md:h-auto">
              <template v-if="eventDetails?.mapUrl">
                <iframe
                  title="Google Maps Location"
                  width="100%"
                  height="100%"
                  style="border: 0"
                  loading="lazy"
                  allowfullscreen
                  referrerpolicy="no-referrer-when-downgrade"
                  :src="eventDetails.mapUrl"
                />
              </template>
              <template v-else>
                <div class="flex h-full items-center justify-center p-4 text-center text-black">
                  <p class="max-w-xs font-medium opacity-60">Map unavailable for this event.</p>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 class="reveal mb-8 font-display text-3xl font-bold uppercase tracking-tight text-black">
          {{ conferenceType }} Committees
        </h2>

        <div
          v-if="hasError"
          class="reveal mb-8 rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-700"
        >
          <p class="mb-2 text-xl font-bold uppercase">Notice</p>
          <p class="font-medium">Committees are temporarily unavailable. Please try again later.</p>
        </div>

        <div v-else-if="isLoading" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="i in 6" :key="i" class="animate-pulse rounded-lg bg-white p-6 shadow-md">
            <UiSkeleton class="mb-4 h-8 w-3/4" />
            <UiSkeleton class="mb-3 h-4 w-full" />
            <UiSkeleton class="mb-3 h-4 w-full" />
            <UiSkeleton class="h-20 w-full" />
          </div>
        </div>

        <div v-else-if="committees.length > 0" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <CommitteeCard
            v-for="(committee, idx) in committees"
            :key="committee.id"
            :committee="committee"
            class="reveal"
            :style="{ transitionDelay: `${idx * 100}ms` }"
          />
        </div>

        <div v-else class="reveal rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-md">
          <p class="mb-3 font-display text-2xl font-bold uppercase text-black">
            {{ emptyTitle }}
          </p>
          <p class="mx-auto max-w-2xl text-base font-medium leading-relaxed text-gray-600">
            {{ emptyDescription }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
