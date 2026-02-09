<script setup lang="ts">
import { cn } from '@/utils/cn'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <div
    :class="cn('leading-none font-semibold', props.class)"
  >
    <slot />
  </div>
</template>
