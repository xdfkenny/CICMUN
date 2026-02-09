<script setup lang="ts">
import { cn } from '@/utils/cn'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div
    :class="cn('bg-accent animate-pulse rounded-md', props.class)"
  />
</template>
