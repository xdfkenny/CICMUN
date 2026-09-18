<script setup lang="ts">
import { ArrowRight, CalendarDays, Globe2, Images, Landmark, Users, BookOpen, Library, Scale } from 'lucide-vue-next'

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
  eyebrow?: string
}>(), {
  heading: 'Explore CICMUN',
  eyebrow: 'Find your path',
})

const links = computed<ExploreLink[]>(() =>
  props.items?.length
    ? props.items
    : [
        { title: 'Delegates', description: 'Register and prepare your role', to: '/delegates', icon: Users },
        { title: 'SAMUN', description: 'The flagship high-school conference', to: '/samun', icon: Landmark, accent: 'red' },
        { title: 'JMUN', description: 'Junior Model United Nations', to: '/jmun', icon: Globe2 },
        { title: 'Schedule', description: 'Plan your conference days', to: '/schedule', icon: CalendarDays },
        { title: 'Resources', description: 'Guides, rules, and downloads', to: '/resources', icon: Library },
        { title: 'Gallery', description: 'Relive past conferences', to: '/gallery', icon: Images },
      ],
)
</script>

<template>
  <section class="bg-white pb-16 md:pb-20 px-4">
    <div class="container max-w-6xl mx-auto">
      <div class="mb-10 text-center animate-fade-in-up">
        <p v-if="eyebrow" class="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-red-600 font-montserrat">{{ eyebrow }}</p>
        <h2 class="text-4xl font-bold font-montserrat text-black mb-2">{{ heading }}</h2>
      </div>

      <div class="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
        <NuxtLink
          v-for="(link, idx) in links"
          :key="link.title"
          :to="link.to"
          class="group flex flex-col rounded-2xl border border-gray-200 bg-gray-50 p-5 md:p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl reveal"
          :style="{ transitionDelay: `${idx * 120}ms` }"
          :aria-label="link.title"
        >
          <div
            class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
            :class="link.accent === 'red' ? 'bg-red-50 text-red-600 group-hover:bg-red-600' : 'bg-gray-100 text-black group-hover:bg-black'"
          >
            <component :is="link.icon" class="h-6 w-6 group-hover:text-white transition-colors duration-300" aria-hidden="true" />
          </div>
          <h3 class="mb-1.5 text-lg font-bold text-black font-montserrat uppercase tracking-tight">{{ link.title }}</h3>
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
