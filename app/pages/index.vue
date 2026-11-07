<script setup lang="ts">
import {
  ArrowRight,
  BrainCircuit,
  CalendarDays,
  Globe2,
  Handshake,
  Images,
  Landmark,
  Library,
  Users,
} from 'lucide-vue-next'
import { siteConfig, siteTitle } from '~/config/siteConfig'
// UiButton is auto-imported

const { data: events } = await useFetch('/api/events', { cache: 'no-store' })

// Find the next upcoming event with a confirmed start date
const nextEvent = computed(() => {
  const now = Date.now()
  const upcoming = (events.value ?? [])
    .map((e: any) => ({
      event: e,
      time: e.startDate ? new Date(e.startDate).getTime() : Number.NaN,
    }))
    .filter(({ time }: any) => !Number.isNaN(time))
    .sort((a: any, b: any) => a.time - b.time)

  return upcoming.find(({ time }: any) => time > now)?.event ?? null
})
const countdownDate = computed(() => nextEvent.value?.startDate || '')
const countdownEnded = ref(false)

// Plain-language date range ("November 27–28, 2026") so the hero states the
// literal date, not just a relative countdown.
const eventDateLine = computed(() => {
  const ev = nextEvent.value
  if (!ev?.startDate) return ''
  const tz = ev.timezone || 'America/Caracas'
  const fmt = (opts: Intl.DateTimeFormatOptions, iso?: string) =>
    new Intl.DateTimeFormat('en-US', { timeZone: tz, ...opts }).format(new Date(iso ?? ev.startDate))
  const startDay = fmt({ month: 'long', day: 'numeric' })
  const year = fmt({ year: 'numeric' })
  if (!ev.endDate) return `${startDay}, ${year}`
  const endDay = fmt({ month: 'long', day: 'numeric' }, ev.endDate)
  if (endDay === startDay) return `${startDay}, ${year}`
  const range = startDay.split(' ')[0] === endDay.split(' ')[0]
    ? `${startDay}–${endDay.split(' ')[1]}` // same month → "November 27–28"
    : `${startDay}–${endDay}`
  return `${range}, ${year}`
})

// Closing wayfinding strip: the scroll-depth visitor gets a next step.
const crossLinks = [
  { label: 'Delegates', to: '/delegates' },
  { label: 'Schedule', to: '/schedule' },
  { label: 'Resources', to: '/resources' },
]




useSeoMeta({
  title: 'Home',
  ogTitle: `${siteTitle} - Colegio Internacional de Caracas Model United Nations`,
  description: `Welcome to the official portal for ${siteTitle}. Leadership, diplomacy, and global citizenship at Colegio Internacional de Caracas.`,
  ogDescription: `Welcome to the official portal for ${siteTitle}. Leadership, diplomacy, and global citizenship at Colegio Internacional de Caracas.`,
  ogImage: `${siteConfig.siteUrl}/LOGO.png`,
  twitterCard: 'summary_large_image',
})

// JSON-LD structured data (schema.org) so Google can surface the conference
// as a rich result and associate the site with its organizers. Values derive
// from siteConfig / data/events.json — update there, not here.
const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${siteTitle} Delegate Portal`,
    alternateName: siteTitle,
    url: `${siteConfig.siteUrl}/`,
    inLanguage: 'en',
    publisher: {
      '@type': 'Organization',
      name: 'Colegio Internacional de Caracas',
      logo: { '@type': 'ImageObject', url: `${siteConfig.siteUrl}/LOGO.png` },
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${siteConfig.samun.name} — South American Model of United Nations`,
    description: `${siteConfig.samun.name} Model United Nations conference for high school students (${siteConfig.samun.gradeRange}) hosted by Colegio Internacional de Caracas.`,
    startDate: `${siteConfig.samun.date}T08:00:00-04:00`,
    endDate: '2026-11-28T18:00:00-04:00',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    url: `${siteConfig.siteUrl}/samun`,
    image: [`${siteConfig.siteUrl}/LOGO.png`],
    location: {
      '@type': 'Place',
      name: 'Colegio Internacional de Caracas',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Calle Colegio Americano, Minas de Baruta',
        addressLocality: 'Caracas',
        addressCountry: 'VE',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'Colegio Internacional de Caracas',
      url: `${siteConfig.siteUrl}/`,
    },
  },
]

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(structuredData),
    },
  ],
})

</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Hero Section -->
    <section class="relative flex-1 bg-gradient-to-br from-red-800 via-red-700 to-brand-950 text-white py-20 px-4 md:py-32 overflow-hidden">
      <Globe2 class="absolute -right-24 -top-20 h-[32rem] w-[32rem] text-white/[0.08] stroke-[0.7] md:-right-16 md:-top-24" aria-hidden="true" />
      <div class="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
        <div class="absolute left-[8%] top-20 h-32 w-32 rotate-45 border border-white/60" />
        <div class="absolute bottom-12 right-[14%] h-20 w-20 border-2 border-white/40" />
        <div class="absolute left-1/2 top-0 h-full w-px bg-white/20" />
      </div>
      <div class="container relative z-10 max-w-4xl mx-auto text-center">
        <div class="mb-8">
          <h1 class="text-5xl md:text-6xl font-bold mb-4 leading-tight font-display tracking-tight animate-fade-in-up" style="animation-delay: 0.1s">
            Welcome to CICMUN
          </h1>
          <p class="text-xl md:text-2xl font-light mb-8 text-white animate-fade-in-up" style="animation-delay: 0.3s">
            Model United Nations at Colegio Internacional de Caracas · Since 1990
          </p>
        </div>

        <p class="text-lg md:text-xl mb-8 text-white max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style="animation-delay: 0.5s">
          CICMUN brings middle- and high-school delegates from across South America to Caracas for authentic committee simulations — two days of debate, negotiation, and diplomacy.
        </p>

        <div v-if="countdownDate && !countdownEnded" class="mb-12 min-h-[150px] md:min-h-[160px] animate-fade-in-up" style="animation-delay: 0.7s">
          <p class="text-white font-bold mb-2 uppercase tracking-widest text-sm">Counting down to {{ nextEvent?.name }}</p>
          <p class="mb-4 text-base font-medium text-white/90 md:text-lg">{{ eventDateLine }} · {{ nextEvent?.location }}</p>
          <CountdownTimer :target-date="countdownDate" @ended="countdownEnded = true" />
        </div>

        <!-- Call to Action Button -->
        <UiButton
          asChild
          size="lg"
          class="group bg-white text-red-600 hover:bg-gray-50 font-bold text-xl px-10 py-8 rounded-full shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 inline-flex items-center gap-3 animate-fade-in-up"
        >
          <NuxtLink to="/delegates">
            Get ready for {{ nextEvent?.name || 'the next conference' }}
            <ArrowRight class="w-6 h-6 cta-arrow" />
          </NuxtLink>
        </UiButton>
      </div>
    </section>

    <!-- Explore Quick-Links Grid (PanAmUN-style wayfinding right under hero) -->
    <ExploreLinks
      :items="[
        { title: 'SAMUN', description: 'The flagship high-school conference', to: '/samun', icon: Landmark, accent: 'red' },
        { title: 'JMUN', description: 'Junior Model United Nations', to: '/jmun', icon: Globe2 },
        { title: 'Delegates', description: 'Prepare your delegation', to: '/delegates', icon: Users },
        { title: 'Schedule', description: 'Plan your conference days', to: '/schedule', icon: CalendarDays },
        { title: 'Resources', description: 'Guides, rules, and downloads', to: '/resources', icon: Library },
        { title: 'Gallery', description: 'Relive past conferences', to: '/gallery', icon: Images },
      ]"
    />

    <!-- About Section -->
    <section class="bg-white py-16 md:py-24 px-4">
      <div class="container max-w-6xl mx-auto">
        <div class="mx-auto max-w-3xl text-center">
          <SplitText as="h2" text="About CICMUN" class="text-3xl md:text-4xl font-bold font-display text-black mb-10" />
        </div>
        <div class="prose max-w-3xl mx-auto text-gray-700 text-lg mb-12 text-center">
          <p class="mb-6 leading-relaxed">
            The Colegio Internacional de Caracas Model United Nations (CICMUN) is one of South America's premier Model UN conferences. Since 1990, CIC has hosted the South American Model United Nations (SAMUN), bringing together hundreds of delegates to engage in diplomatic simulations.
          </p>
          <p class="leading-relaxed">
            Our conference features authentic committees, challenging topics, and an environment that fosters critical thinking, public speaking, and international relations skills.
          </p>
        </div>
        <div v-reveal="{ children: true, stagger: 0.12, y: 40 }" class="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          <div v-for="feature in [
            { title: 'Diplomacy', icon: Handshake, description: 'Build consensus across perspectives.' },
            { title: 'Internationalism', icon: Globe2, description: 'See every issue in a global context.' },
            { title: 'International Law', icon: Landmark, description: 'Engage with the rules that shape nations.' },
            { title: 'Critical Thinking', icon: BrainCircuit, description: 'Question deeply and argue with purpose.' },
          ]" :key="feature.title" class="border-t-2 border-black px-1 pt-5 sm:px-4">
            <component :is="feature.icon" class="mb-4 h-7 w-7 text-red-600" aria-hidden="true" />
            <h3 class="mb-2 text-base font-bold text-black sm:text-lg">{{ feature.title }}</h3>
            <p class="text-sm leading-relaxed text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <TeamSection />

    <!-- CIC Values Section -->
    <section class="bg-gray-50 py-16 md:py-24 px-4">
      <div class="container max-w-4xl mx-auto">
        <SplitText as="h2" text="CIC Values" class="text-3xl md:text-4xl font-bold font-display text-black mb-10 text-center" />
        <div v-reveal="{ children: true, stagger: 0.15, y: 40 }" class="grid md:grid-cols-3 gap-8">
          <div v-for="(value, idx) in [
            { title: 'Respect', description: 'Valuing diverse perspectives and cultures' },
            { title: 'Integrity', description: 'Conducting ourselves with honesty and ethics' },
            { title: 'Leadership', description: 'Developing tomorrow\'s global leaders' },
          ]" :key="idx"
          class="bg-white p-6 rounded-lg border border-gray-200"
          >
            <h3 class="text-xl font-bold text-red-600 mb-3 font-display">{{ value.title }}</h3>
            <p class="text-gray-700 font-medium">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Continue exploring (PanAmUN-style cross-wayfinding strip: slim text + arrow).
         The page must not end on a dead end; this mirrors ConferenceOverviewPage. -->
    <section class="border-t border-gray-100 bg-white py-12 px-4">
      <div class="container max-w-4xl mx-auto">
        <nav
          aria-label="Continue exploring CICMUN"
          class="flex flex-wrap items-center justify-center gap-x-5 gap-y-3"
        >
          <span class="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Continue exploring</span>
          <NuxtLink
            v-for="link in crossLinks"
            :key="link.to"
            :to="link.to"
            class="group inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3.5 py-2.5 text-xs font-bold uppercase tracking-tight text-black transition-colors hover:text-red-600 md:border-0 md:px-0 md:py-0 md:text-sm"
          >
            {{ link.label }}
            <ArrowRight class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </NuxtLink>
        </nav>
      </div>
    </section>
  </div>
</template>
