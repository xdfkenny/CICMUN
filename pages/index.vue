<script setup lang="ts">
// UiButton is auto-imported

const { role } = useAuth()

useSeoMeta({
  title: 'Inicio',
  ogTitle: 'CICMUN 2026 - Colegio Internacional de Caracas Model United Nations',
  description: 'Bienvenidos al portal oficial de CICMUN 2026. Liderazgo, diplomacia y ciudadanía global en el Colegio Internacional de Caracas.',
  ogDescription: 'Bienvenidos al portal oficial de CICMUN 2026. Liderazgo, diplomacia y ciudadanía global en el Colegio Internacional de Caracas.',
  ogImage: '/images/og-image.png',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Hero Section -->
    <section class="flex-1 bg-gradient-to-br from-red-700 via-red-600 to-black text-white py-20 px-4 md:py-32">
      <div class="container max-w-6xl mx-auto grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
        <div class="text-center md:text-left">
          <div class="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
            CICMUN 2026
          </div>

          <div class="mt-6 space-y-4">
            <h1 class="text-5xl md:text-7xl font-bold leading-tight font-montserrat">
              Welcome to CICMUN
            </h1>
            <p class="text-xl md:text-2xl font-light text-gray-100">
              Where Future Leaders Are Forged
            </p>
            <p class="text-lg md:text-xl text-gray-200 max-w-2xl md:max-w-none leading-relaxed">
              Experience diplomacy, leadership, and global citizenship at the Colegio Internacional de Caracas Model United Nations. Join delegates from across South America for an unforgettable conference.
            </p>
          </div>
        </div>

        <div class="grid gap-6">
          <div class="rounded-3xl border border-white/15 bg-white/10 p-6 md:p-7 shadow-2xl backdrop-blur-md">
            <div class="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/70 font-semibold">
              <span>Start Here</span>
              <span class="text-white/50">New to MUN?</span>
            </div>
            <h2 class="mt-4 text-2xl font-bold text-white">Quick tour and next steps</h2>
            <p class="mt-2 text-sm text-white/80">
              Take the quick tour, then register your delegation or head to the teacher dashboard.
            </p>
            <div class="mt-5 grid gap-3 sm:grid-cols-2">
              <NuxtLink to="/onboarding">
                <UiButton class="w-full bg-white text-red-700 hover:bg-gray-100 px-6 py-3 font-bold">
                  Open Tour
                </UiButton>
              </NuxtLink>
              <NuxtLink :to="role === 'teacher' ? '/teacher' : '/register'">
                <UiButton class="w-full bg-red-500 text-white hover:bg-red-400 px-6 py-3 font-bold">
                  {{ role === 'teacher' ? 'Teacher Dashboard' : 'Register Delegation' }}
                </UiButton>
              </NuxtLink>
            </div>
          </div>

          <div class="rounded-3xl border border-white/25 bg-gradient-to-br from-white/20 via-white/10 to-white/5 p-6 md:p-8 text-center shadow-xl backdrop-blur-md">
            <p class="text-xs uppercase tracking-[0.3em] text-white/70 font-semibold">Countdown</p>
            <p class="mt-2 text-lg font-semibold text-white">Counting down to JMUN 2026</p>
            <div class="mt-4">
              <CountdownTimer target-date="2026-04-24T09:00:00" />
            </div>
            <p class="mt-4 text-xs text-white/60">April 24, 2026 • 9:00 AM</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Intro Video -->
    <section class="bg-slate-900 py-16 px-4">
      <div class="container max-w-6xl mx-auto grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr] text-white">
        <div class="text-center md:text-left">
          <h2 class="text-3xl md:text-4xl font-bold mb-4 font-montserrat">Welcome to CICMUN 2026</h2>
          <p class="text-gray-200">
            Watch a short introduction to our conference and community.
          </p>
        </div>
        <div class="aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <iframe
            class="w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="CICMUN Introduction"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="bg-white py-16 md:py-24 px-4">
      <div class="container max-w-5xl mx-auto grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
        <div class="text-center md:text-left">
          <h2 class="text-4xl font-bold text-black mb-4 font-montserrat">About CICMUN</h2>
          <p class="text-gray-600 text-lg">A legacy of diplomacy, leadership, and global citizenship.</p>
        </div>
        <div class="text-gray-700 text-lg leading-relaxed space-y-6">
          <p>
            The Colegio Internacional de Caracas Model United Nations (CICMUN) is one of South America's premier Model UN conferences. Since 1990, CIC has hosted the South American Model United Nations (SAMUN), bringing together hundreds of delegates to engage in diplomatic simulations.
          </p>
          <p>
            Our conference features authentic committees, challenging topics, and an environment that fosters critical thinking, public speaking, and international relations skills.
          </p>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <TeamSection />

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
