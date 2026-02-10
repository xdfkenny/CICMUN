<script setup lang="ts">
import type { Committee } from '~/shared/types'

const props = defineProps<{ committee: Committee }>()

const accentColor = computed(() => {
  return props.committee.type === 'SAMUN' ? 'red-600' : 'black'
})

const lightAccentColor = computed(() => {
  return props.committee.type === 'SAMUN' ? 'red-50' : 'gray-50'
})

const textAccentColor = computed(() => {
  return props.committee.type === 'SAMUN' ? 'red-700' : 'gray-900'
})
</script>

<template>
  <NuxtLink :to="`/committees/${committee.id}`" class="block h-full">
    <UiCard 
      class="group overflow-hidden transition-all duration-300 border-0 shadow-sm hover:shadow-xl bg-white h-full"
      :class="`hover:ring-2 hover:ring-${accentColor}`"
    >
      <div 
        class="h-2 transition-colors duration-300"
        :class="`bg-${accentColor}`"
      ></div>

      <UiCardContent class="pt-8 px-6 pb-6">
        <UiCardTitle class="text-2xl font-bold mb-6 font-montserrat tracking-tight group-hover:text-red-600 transition-colors duration-300">
          {{ committee.name }}
        </UiCardTitle>

        <div class="space-y-6">
          <!-- Staff Section -->
          <div class="grid grid-cols-1 gap-4">
            <!-- Chair -->
            <div class="flex items-center gap-4 p-3 rounded-lg bg-gray-50/50 border border-transparent transition-colors hover:bg-white hover:border-gray-100">
              <div 
                class="w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0 bg-white"
                :class="`border-${accentColor}`"
              >
                <img
                  v-if="committee.chairPhoto"
                  :src="committee.chairPhoto"
                  :alt="committee.chairName"
                  class="w-full h-full rounded-full object-cover"
                />
                <span v-else class="font-bold text-xs" :class="`text-${accentColor}`">CH</span>
              </div>
              <div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Chair</p>
                <p class="font-semibold text-gray-900 leading-tight">{{ committee.chairName }}</p>
              </div>
            </div>

            <!-- Co-Chair -->
            <div v-if="committee.coChairName" class="flex items-center gap-4 p-3 rounded-lg bg-gray-50/50 border border-transparent transition-colors hover:bg-white hover:border-gray-100">
              <div 
                class="w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0 bg-white"
                :class="committee.type === 'SAMUN' ? 'border-blue-600' : 'border-gray-600'"
              >
                <img
                  v-if="committee.coChairPhoto"
                  :src="committee.coChairPhoto"
                  :alt="committee.coChairName"
                  class="w-full h-full rounded-full object-cover"
                />
                <span v-else class="font-bold text-xs" :class="committee.type === 'SAMUN' ? 'text-blue-600' : 'text-gray-600'">CC</span>
              </div>
              <div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Co-Chair</p>
                <p class="font-semibold text-gray-900 leading-tight">{{ committee.coChairName }}</p>
              </div>
            </div>

            <!-- Secretary -->
            <div v-if="committee.secretaryName" class="flex items-center gap-4 p-3 rounded-lg bg-gray-50/50 border border-transparent transition-colors hover:bg-white hover:border-gray-100">
              <div 
                class="w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0 bg-white"
                :class="committee.type === 'SAMUN' ? 'border-green-600' : 'border-gray-400'"
              >
                <img
                  v-if="committee.secretaryPhoto"
                  :src="committee.secretaryPhoto"
                  :alt="committee.secretaryName"
                  class="w-full h-full rounded-full object-cover"
                />
                <span v-else class="font-bold text-xs" :class="committee.type === 'SAMUN' ? 'text-green-600' : 'text-gray-400'">SE</span>
              </div>
              <div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Secretary</p>
                <p class="font-semibold text-gray-900 leading-tight">{{ committee.secretaryName }}</p>
              </div>
            </div>
          </div>

          <!-- Topics -->
          <div class="pt-6 border-t border-gray-100">
            <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Topics</p>
            <div class="space-y-3">
              <div 
                class="p-4 rounded-xl transition-all duration-300 hover:translate-x-1"
                :class="[`bg-${lightAccentColor}`, `border-l-4 border-${accentColor}`]"
              >
                <p class="text-[10px] font-bold uppercase mb-1" :class="`text-${textAccentColor}`">Topic A</p>
                <p class="text-sm font-medium text-gray-800 leading-snug">{{ committee.topicA }}</p>
              </div>
              <div 
                v-if="committee.topicB"
                class="p-4 rounded-xl bg-gray-50 border-l-4 border-gray-300 transition-all duration-300 hover:translate-x-1 hover:bg-white hover:border-gray-400"
              >
                <p class="text-[10px] font-bold uppercase mb-1 text-gray-500">Topic B</p>
                <p class="text-sm font-medium text-gray-800 leading-snug">{{ committee.topicB }}</p>
              </div>
            </div>
          </div>
        </div>
      </UiCardContent>
    </UiCard>
  </NuxtLink>
</template>
