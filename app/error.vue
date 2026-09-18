<script setup lang="ts">
import { siteTitle } from '~/config/siteConfig'

const props = defineProps<{ error: { statusCode?: number; statusMessage?: string; message?: string } }>()

const statusCode = computed(() => props.error?.statusCode)
const is404 = computed(() => statusCode.value === 404)

const heading = computed(() => (is404.value ? 'Page not found' : 'Something went wrong'))

const detail = computed(() => {
  if (statusCode.value === 404) {
    return 'The page you are looking for does not exist or has moved.'
  }
  if (statusCode.value === 429) {
    return 'Too many requests. Please slow down and try again in a moment.'
  }
  if (statusCode.value && statusCode.value >= 500) {
    return 'We hit an unexpected error on our side. Please try again shortly.'
  }
  return props.error?.statusMessage || props.error?.message || 'An unexpected error occurred.'
})

useSeoMeta({
  title: () => `${heading.value} | ${siteTitle}`,
  robots: 'noindex',
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 px-4 py-20">
    <div class="container mx-auto max-w-2xl text-center">
      <div class="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <span class="font-display text-3xl font-extrabold text-red-600">C</span>
      </div>
      <p class="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-red-600">
        Error {{ statusCode || '—' }}
      </p>
      <h1 class="mb-4 font-display text-4xl font-bold uppercase tracking-tight text-black md:text-5xl">
        {{ heading }}
      </h1>
      <p class="mx-auto mb-10 max-w-md text-lg font-medium leading-relaxed text-gray-600">
        {{ detail }}
      </p>
      <div class="flex flex-wrap items-center justify-center gap-4">
        <UiButton asChild size="lg" class="bg-black text-white hover:bg-gray-800">
          <NuxtLink to="/">Back to Home</NuxtLink>
        </UiButton>
        <UiButton asChild size="lg" variant="ghost" class="text-black hover:bg-gray-100">
          <NuxtLink to="/schedule">Conference Schedule</NuxtLink>
        </UiButton>
      </div>
    </div>
  </div>
</template>