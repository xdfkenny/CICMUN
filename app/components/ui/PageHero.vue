<script setup lang="ts">
/**
 * PageHero — unified page-level title block.
 *
 * Every non-homepage previously hand-rolled its own h1 styling (text-4xl/5xl,
 * bold/extrabold, uppercase/no-uppercase, left/center align). This component
 * is the single place those decisions live:
 *
 *   <UiPageHero title="Delegate Resources" subtitle="..." />
 *   <UiPageHero align="left" uppercase :title="..." :subtitle="..." />
 *
 * The h1 keeps the Montserrat heading font via the base h1-h6 rule, so no
 * font utility class is needed here.
 */
withDefaults(defineProps<{
  title: string
  subtitle?: string
  /** Defaults to centered; conference pages use 'left'. */
  align?: 'center' | 'left'
  /** Uppercase display (gallery + conference pages). */
  uppercase?: boolean
  /** Red divider line between title and subtitle (gallery). */
  divider?: boolean
}>(), {
  subtitle: undefined,
  align: 'center',
  uppercase: false,
  divider: false,
})
</script>

<template>
  <div class="mb-12 animate-fade-in-up" :class="align === 'left' ? 'text-left' : 'text-center'">
    <h1
      class="text-4xl font-bold tracking-tight text-black md:text-6xl"
      :class="uppercase ? 'uppercase' : ''"
    >
      {{ title }}
    </h1>
    <div
      v-if="divider"
      class="mt-4 h-1.5 w-16 rounded-full bg-red-600"
      :class="align === 'left' ? 'ml-0' : 'mx-auto'"
      aria-hidden="true"
    />
    <p v-if="subtitle" class="mt-3 text-lg font-medium text-gray-600 md:text-xl">
      {{ subtitle }}
    </p>
    <slot />
  </div>
</template>