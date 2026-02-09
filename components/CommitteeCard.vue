<script setup lang="ts">
import type { Committee } from '~/shared/types'

defineProps<{ committee: Committee }>()
</script>

<template>
  <UiCard class="overflow-hidden hover:shadow-lg transition-shadow border-2 border-gray-200 hover:border-red-600">
    <UiCardHeader class="bg-gradient-to-r from-red-600 to-red-700 text-white pb-4">
      <UiCardTitle class="text-xl">{{ committee.name }}</UiCardTitle>
    </UiCardHeader>

    <UiCardContent class="pt-6">
      <!-- Chair -->
      <div class="mb-6">
        <h3 class="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3">Chair</h3>
        <div class="flex items-center gap-3">
          <img
            v-if="committee.chairPhoto"
            :src="committee.chairPhoto"
            :alt="committee.chairName"
            class="w-12 h-12 rounded-full object-cover border-2 border-red-600"
          />
          <div v-else class="w-12 h-12 rounded-full bg-red-100 border-2 border-red-600 flex items-center justify-center">
            <span class="text-red-600 font-bold text-xs">CH</span>
          </div>
          <p class="font-semibold text-gray-900">{{ committee.chairName }}</p>
        </div>
      </div>

      <!-- Co-Chair -->
      <div class="mb-6">
        <h3 class="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3">Co-Chair</h3>
        <div class="flex items-center gap-3">
          <img
            v-if="committee.coChairPhoto"
            :src="committee.coChairPhoto"
            :alt="committee.coChairName"
            class="w-12 h-12 rounded-full object-cover border-2 border-blue-600"
          />
          <div v-else class="w-12 h-12 rounded-full bg-blue-100 border-2 border-blue-600 flex items-center justify-center">
            <span class="text-blue-600 font-bold text-xs">CC</span>
          </div>
          <p class="font-semibold text-gray-900">{{ committee.coChairName }}</p>
        </div>
      </div>

      <!-- Secretary -->
      <div class="mb-6">
        <h3 class="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3">Secretary</h3>
        <div class="flex items-center gap-3">
          <img
            v-if="committee.secretaryPhoto"
            :src="committee.secretaryPhoto"
            :alt="committee.secretaryName"
            class="w-12 h-12 rounded-full object-cover border-2 border-green-600"
          />
          <div v-else class="w-12 h-12 rounded-full bg-green-100 border-2 border-green-600 flex items-center justify-center">
            <span class="text-green-600 font-bold text-xs">SE</span>
          </div>
          <p class="font-semibold text-gray-900">{{ committee.secretaryName }}</p>
        </div>
      </div>

      <!-- Topics -->
      <div class="border-t pt-4">
        <h3 class="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3">Topics</h3>
        <div class="space-y-2">
          <div class="bg-red-50 p-3 rounded-md border-l-4 border-red-600">
            <p class="text-xs font-semibold text-red-700 mb-1">Topic A</p>
            <p class="text-sm text-gray-800">{{ committee.topicA }}</p>
          </div>
          <div class="bg-blue-50 p-3 rounded-md border-l-4 border-blue-600">
            <p class="text-xs font-semibold text-blue-700 mb-1">Topic B</p>
            <p class="text-sm text-gray-800">{{ committee.topicB }}</p>
          </div>
        </div>
      </div>
    </UiCardContent>
  </UiCard>
</template>
