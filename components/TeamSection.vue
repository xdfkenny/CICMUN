<script setup lang="ts">
import { User, Shield, Megaphone, GraduationCap, Star } from 'lucide-vue-next'

const coreTeam = [
  {
    name: 'Caterina',
    role: 'Secretary General',
    icon: Star,
    color: 'text-red-600',
    bg: 'bg-red-50'
  },
  {
    name: 'Oriana',
    role: 'Deputy Secretary',
    icon: Shield,
    color: 'text-black',
    bg: 'bg-gray-50'
  },
  {
    name: 'Santiago',
    role: 'Head Delegate',
    icon: User,
    color: 'text-red-600',
    bg: 'bg-red-50'
  },
  {
    name: 'Kenny',
    role: 'Community Manager',
    icon: Megaphone,
    color: 'text-black',
    bg: 'bg-gray-50'
  }
]

const faculties = ['Millan', 'Oriana', 'Claudia']
</script>

<template>
  <section class="bg-white py-20 px-4 md:py-32 border-t border-gray-100">
    <div class="container max-w-6xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-extrabold text-black mb-4 font-montserrat tracking-tight uppercase">
          Meet the Team
        </h2>
        <div class="h-1.5 w-24 bg-red-600 mx-auto rounded-full mb-6"></div>
        <p class="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
          The dedicated leaders and educators behind CICMUN 2026.
        </p>
      </div>

      <!-- Core Leadership Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        <div 
          v-for="member in coreTeam" 
          :key="member.name"
          class="group bg-white rounded-2xl p-8 border-2 border-gray-100 transition-all duration-300 hover:border-red-600 hover:shadow-2xl hover:-translate-y-2 text-center"
        >
          <div :class="['inline-flex p-4 rounded-full mb-6 transition-transform duration-300 group-hover:scale-110', member.bg]">
            <component :is="member.icon" :class="['w-8 h-8', member.color]" />
          </div>
          <h3 class="text-2xl font-bold text-black mb-1 font-montserrat">{{ member.name }}</h3>
          <p class="text-red-600 font-bold uppercase tracking-wider text-xs">{{ member.role }}</p>
        </div>
      </div>

      <!-- Faculties Section -->
      <div class="bg-gray-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
        <!-- Abstract Background Decor -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-red-600/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

        <div class="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div class="flex-shrink-0 bg-red-600 p-5 rounded-2xl shadow-xl shadow-red-900/20">
            <GraduationCap class="w-12 h-12 text-white" />
          </div>
          
          <div class="flex-1 text-center md:text-left">
            <h3 class="text-3xl font-bold mb-2 font-montserrat">Our Faculties</h3>
            <p class="text-gray-400 text-lg mb-6 font-light">Guiding and mentoring the next generation of diplomats.</p>
            
            <div class="flex flex-wrap justify-center md:justify-start gap-4">
              <div 
                v-for="faculty in faculties" 
                :key="faculty"
                class="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 font-bold text-red-500 hover:bg-white/20 transition-colors"
              >
                {{ faculty }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
