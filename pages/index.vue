<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
// UiButton is auto-imported

useSeoMeta({
  title: 'Inicio',
  ogTitle: 'CICMUN 2026 - Colegio Internacional de Caracas Model United Nations',
  description: 'Bienvenidos al portal oficial de CICMUN 2026. Liderazgo, diplomacia y ciudadanía global en el Colegio Internacional de Caracas.',
  ogDescription: 'Bienvenidos al portal oficial de CICMUN 2026. Liderazgo, diplomacia y ciudadanía global en el Colegio Internacional de Caracas.',
  ogImage: '/images/og-image.jpg', // Placeholder image for social media
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Hero Section -->
    <section class="flex-1 bg-gradient-to-br from-red-600 via-red-500 to-black text-white py-20 px-4 md:py-32">
      <div class="container max-w-4xl mx-auto text-center">
        <div class="mb-8">
          <h1 class="text-5xl md:text-7xl font-bold mb-4 leading-tight font-montserrat">
            Welcome to CICMUN
          </h1>
          <p class="text-xl md:text-2xl font-light mb-8 text-gray-100">
            Where Future Leaders Are Forged
          </p>
        </div>

        <p class="text-lg md:text-xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">
          Experience diplomacy, leadership, and global citizenship at the Colegio Internacional de Caracas Model United Nations. Join delegates from across South America for an unforgettable conference.
        </p>

        <div class="mb-12">
          <p class="text-white font-bold mb-4 uppercase tracking-widest text-sm">Counting down to JMUN 2026</p>
          <CountdownTimer target-date="2026-04-24T09:00:00" />
        </div>

        <!-- Call to Action Button -->
        <NuxtLink to="/delegates">
          <UiButton
            size="lg"
            class="bg-white text-red-600 hover:bg-gray-100 font-bold text-lg px-8 py-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform inline-flex items-center gap-2"
          >
            Delegates Enter Here
            <ArrowRight class="w-5 h-5" />
          </UiButton>
        </NuxtLink>
      </div>
    </section>

    <!-- About Section -->
    <section class="bg-white py-16 md:py-24 px-4">
      <div class="container max-w-3xl mx-auto text-center">
        <h2 class="text-4xl font-bold text-black mb-6 font-montserrat">About CICMUN</h2>
        <p class="text-gray-700 text-lg mb-6 leading-relaxed">
          The Colegio Internacional de Caracas Model United Nations (CICMUN) is one of South America's premier Model UN conferences. Since 1990, CIC has hosted the South American Model United Nations (SAMUN), bringing together hundreds of delegates to engage in diplomatic simulations.
        </p>
        <p class="text-gray-700 text-lg leading-relaxed">
          Our conference features authentic committees, challenging topics, and an environment that fosters critical thinking, public speaking, and international relations skills.
        </p>
      </div>
    </section>

    <!-- CIC Values Section -->
    <section class="bg-gray-50 py-16 md:py-24 px-4">
      <div class="container max-w-4xl mx-auto">
        <h2 class="text-4xl font-bold text-center text-black mb-12 font-montserrat">CIC Values</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="(value, idx) in [
            { title: 'Respect', description: 'Valuing diverse perspectives and cultures' },
            { title: 'Integrity', description: 'Conducting ourselves with honesty and ethics' },
            { title: 'Leadership', description: 'Developing tomorrow\'s global leaders' },
          ]" :key="idx" class="bg-white p-6 rounded-lg border-l-4 border-red-600 shadow-md">
            <h3 class="text-xl font-bold text-red-600 mb-3 font-montserrat">{{ value.title }}</h3>
            <p class="text-gray-700">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
