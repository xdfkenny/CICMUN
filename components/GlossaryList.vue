<script setup lang="ts">
import type { GlossaryTerm } from '~/shared/types'

const props = defineProps<{
  terms: GlossaryTerm[]
}>()
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
    <h3 class="text-xl font-bold font-montserrat mb-4">Committee glossary</h3>
    <div class="grid md:grid-cols-2 gap-4">
      <div
        v-for="term in props.terms"
        :key="term.term"
        class="p-4 rounded-xl border border-gray-100 bg-gray-50"
      >
        <div class="font-bold text-gray-900 mb-2">{{ term.term }}</div>
        <p class="text-sm text-gray-700">
          {{ term.definition_en }}
        </p>
      </div>
    </div>
  </div>
</template>
