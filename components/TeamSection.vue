<script setup lang="ts">
import { User, Shield, Megaphone, GraduationCap, Star, Truck } from 'lucide-vue-next'

const leadership = [
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
  }
]

const operations = [
  {
    name: 'Kenny',
    role: 'Community Manager',
    icon: Megaphone,
    color: 'text-black',
    bg: 'bg-gray-50'
  },
  {
    name: 'Selene',
    role: 'Logistics',
    icon: Truck,
    color: 'text-red-600',
    bg: 'bg-red-50'
  },
  {
    name: 'Cesar',
    role: 'Logistics',
    icon: Truck,
    color: 'text-red-600',
    bg: 'bg-red-50'
  }
]

const faculties = ['Millan', 'Oriana', 'Claudia']
</script>

<template>
  <section class="bg-white py-24 px-4 md:py-32 border-t border-gray-100">
    <div class="container max-w-6xl mx-auto">
      <!-- Header Section -->
      <div class="text-center mb-20">
        <h2 class="text-4xl md:text-5xl font-extrabold text-black mb-6 font-montserrat tracking-tight uppercase leading-tight">
          Meet the Team
        </h2>
        <div class="h-1.5 w-24 bg-red-600 mx-auto rounded-full mb-8"></div>
        <p class="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto font-semibold leading-relaxed">
          The dedicated leaders and educators behind CICMUN 2026.
        </p>
      </div>

      <!-- Team Rows Container -->
      <div class="flex flex-col gap-12 mb-24">
        <!-- Leadership Row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="member in leadership" 
            :key="member.name"
            class="group bg-white rounded-2xl py-8 px-5 sm:py-12 sm:px-6 border-2 border-gray-50 transition-all duration-300 ease-in-out hover:border-red-600/20 hover:shadow-[0_20px_50px_rgba(220,38,38,0.1)] hover:-translate-y-2 text-center w-full max-w-[280px] mx-auto"
          >
            <div :class="['inline-flex p-4 sm:p-5 rounded-3xl mb-6 sm:mb-8 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110', member.bg]">
              <component :is="member.icon" :class="['w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-300', member.color]" />
            </div>
            
            <div class="flex flex-col gap-1 sm:gap-2">
              <h3 class="text-xl sm:text-2xl font-extrabold text-black font-montserrat tracking-tight">{{ member.name }}</h3>
              <p class="text-red-600 font-bold uppercase tracking-[0.15em] text-[9px] md:text-xs">
                {{ member.role }}
              </p>
            </div>
          </div>
        </div>

        <!-- Operations Row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="member in operations" 
            :key="member.name"
            class="group bg-white rounded-2xl py-8 px-5 sm:py-12 sm:px-6 border-2 border-gray-50 transition-all duration-300 ease-in-out hover:border-red-600/20 hover:shadow-[0_20px_50px_rgba(220,38,38,0.1)] hover:-translate-y-2 text-center w-full max-w-[280px] mx-auto"
          >
            <div :class="['inline-flex p-4 sm:p-5 rounded-3xl mb-6 sm:mb-8 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110', member.bg]">
              <component :is="member.icon" :class="['w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-300', member.color]" />
            </div>
            
            <div class="flex flex-col gap-1 sm:gap-2">
              <h3 class="text-xl sm:text-2xl font-extrabold text-black font-montserrat tracking-tight">{{ member.name }}</h3>
              <p class="text-red-600 font-bold uppercase tracking-[0.15em] text-[9px] md:text-xs">
                {{ member.role }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Faculties Section -->
      <div class="bg-gray-900 rounded-[2.5rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
        <!-- Abstract Background Decor -->
        <div class="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]"></div>
        <div class="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]"></div>

        <div class="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-20">
          <div class="flex-shrink-0 bg-red-600 p-6 rounded-[2rem] shadow-[0_15px_30px_rgba(220,38,38,0.3)] group transition-transform duration-500 hover:rotate-3">
            <GraduationCap class="w-14 h-14 text-white" />
          </div>
          
          <div class="flex-1 text-center md:text-left">
            <div class="flex flex-col gap-3 mb-8">
              <h3 class="text-3xl md:text-4xl font-bold font-montserrat tracking-tight leading-tight">Our Faculties</h3>
              <p class="text-gray-400 text-lg md:text-xl font-medium opacity-80">Guiding and mentoring the next generation of diplomats.</p>
            </div>
            
            <div class="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6">
              <div 
                v-for="faculty in faculties" 
                :key="faculty"
                class="group px-8 py-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 font-bold text-red-500 transition-all duration-300 hover:bg-white/15 hover:scale-105 hover:shadow-[0_10px_20px_rgba(220,38,38,0.15)] flex items-center gap-3"
              >
                <div class="w-2 h-2 rounded-full bg-red-600 group-hover:animate-pulse"></div>
                {{ faculty }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
