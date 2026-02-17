<script setup lang="ts">
import type { AllocationEntry } from '~/shared/types'

const props = defineProps<{
  allocation?: AllocationEntry | null
}>()

const statusStyles = (status: string) => {
  switch (status) {
    case 'assigned':
      return 'bg-red-50 text-red-700 border-red-200'
    case 'reserved':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    default:
      return 'bg-green-50 text-green-700 border-green-200'
  }
}
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
    <h3 class="text-xl font-bold font-montserrat mb-4">Country allocation</h3>
    <div v-if="allocation?.countries?.length" class="grid sm:grid-cols-2 gap-3">
      <div
        v-for="country in allocation.countries"
        :key="country.name"
        class="flex items-center justify-between rounded-lg border px-3 py-2"
        :class="statusStyles(country.status)"
      >
        <span class="font-medium">{{ country.name }}</span>
        <span class="text-xs font-bold uppercase">{{ country.status }}</span>
      </div>
    </div>
    <p v-else class="text-sm text-gray-500">Allocation list coming soon.</p>
  </div>
</template>
