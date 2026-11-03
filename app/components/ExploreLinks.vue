<script setup lang="ts">
import { ArrowRight, CalendarDays, Globe2, Images, Landmark, Users, Library } from 'lucide-vue-next'

/**
 * ExploreLinks — PanAmUN-style quick-links wayfinding grid.
 *
 * Borrowed pattern: PanAmUN places an icon "quick links" card grid directly
 * under the hero so visitors can jump to any major section in a single glance
 * instead of hunting through the nav. Each card = icon + title + one-line
 * description + explicit CTA link (arrow), and the whole grid is fully
 * keyboard/AT accessible (real focusable NuxtLinks, aria-labels, skip-safe).
 */

export interface ExploreLink {
  title: string
  description: string
  to: string
  icon: any
  accent?: 'red' | 'black'
}

const props = withDefaults(defineProps<{
  items?: ExploreLink[]
  heading?: string
}>(), {
  heading: 'Explore CICMUN',
})

const links = computed<ExploreLink[]>(() =>
  props.items?.length
    ? props.items
    : [
        { title: 'Delegates', description: 'Prepare your delegation', to: '/delegates', icon: Users },
        { title: 'SAMUN', description: 'The flagship high-school conference', to: '/samun', icon: Landmark, accent: 'red' },
        { title: 'JMUN', description: 'Junior Model United Nations', to: '/jmun', icon: Globe2 },
        { title: 'Schedule', description: 'Plan your conference days', to: '/schedule', icon: CalendarDays },
        { title: 'Resources', description: 'Guides, rules, and downloads', to: '/resources', icon: Library },
        { title: 'Gallery', description: 'Relive past conferences', to: '/gallery', icon: Images },
      ],
)
</script>

<template>
  <section class="bg-white pt-20 pb-16 md:pt-28 md:pb-20 px-4">
    <div class="container max-w-6xl mx-auto">
      <div class="mb-10 text-center animate-fade-in-up">
        <h2 class="text-3xl md:text-4xl font-bold font-display text-black">{{ heading }}</h2>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
        <NuxtLink
          v-for="(link, idx) in links"
          :key="link.title"
          :to="link.to"
          class="group flex flex-col rounded-2xl border border-gray-200 bg-gray-50 p-5 md:p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl reveal"
          :style="{ transitionDelay: `${idx * 120}ms` }"
          :aria-label="link.title"
        >
          <h3 class="mb-1.5 flex items-center gap-2.5 text-lg font-bold text-black font-display uppercase tracking-tight">
            <component
              :is="link.icon"
              class="h-5 w-5 shrink-0 transition-colors duration-300"
              :class="link.accent === 'red' ? 'text-red-600' : 'text-black'"
              aria-hidden="true"
            />
            {{ link.title }}
          </h3>
          <p class="flex-1 text-sm leading-relaxed text-gray-600">{{ link.description }}</p>
          <span
            class="mt-4 inline-flex items-center gap-1.5 text-sm font-bold transition-colors duration-300"
            :class="link.accent === 'red' ? 'text-red-600 group-hover:text-red-700' : 'text-black group-hover:text-gray-700'"
          >
            Explore
            <ArrowRight class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
