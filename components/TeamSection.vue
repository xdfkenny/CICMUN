<script setup lang="ts">
import { User, Shield, Megaphone, GraduationCap, Star, Truck } from 'lucide-vue-next'

const leadership = [
  {
    name: 'Caterina',
    role: 'Secretary General',
    icon: Star,
    color: 'text-white',
    bg: 'bg-red-600',
    image: '/TEAM PHOTOS/Caterina.png'
  },
  {
    name: 'Oriana',
    role: 'Deputy Secretary',
    icon: Shield,
    color: 'text-white',
    bg: 'bg-black',
    image: '/TEAM PHOTOS/Oriana.png'
  },
  {
    name: 'Santiago',
    role: 'Head Delegate',
    icon: User,
    color: 'text-white',
    bg: 'bg-red-600',
    image: '/TEAM PHOTOS/Santiago.png'
  }
]

const operations = [
  {
    name: 'Kenny',
    role: 'Community Manager',
    icon: Megaphone,
    color: 'text-white',
    bg: 'bg-black',
    image: '/TEAM PHOTOS/Kenny.png'
  },
  {
    name: 'Selene',
    role: 'Logistics',
    icon: Truck,
    color: 'text-white',
    bg: 'bg-red-600',
    image: '/TEAM PHOTOS/Selene.png'
  },
  {
    name: 'Cesar',
    role: 'Logistics',
    icon: Truck,
    color: 'text-white',
    bg: 'bg-black',
    image: '/TEAM PHOTOS/Cesar.png'
  }
]

const faculties = ['Millan', 'Oriana', 'Claudia']
</script>

<template>
  <section class="bg-white py-16 px-4 md:py-32 border-t border-gray-100">
    <div class="container max-w-6xl mx-auto">
      <!-- Header Section -->
      <div class="text-center mb-16 md:mb-20">
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black mb-6 font-montserrat tracking-tight uppercase leading-tight">
          Meet the Team
        </h2>
        <div class="h-1.5 w-24 bg-red-600 mx-auto rounded-full mb-8"></div>
        <p class="text-lg sm:text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto font-semibold leading-relaxed px-4">
          The dedicated leaders and educators behind CICMUN 2026.
        </p>
      </div>

      <!-- Team Rows Container -->
      <div class="flex flex-col gap-8 md:gap-12 mb-20 md:mb-24">
        <!-- Leadership Row -->
        <div class="flex flex-wrap justify-center gap-4 sm:gap-8">
          <div 
            v-for="member in leadership" 
            :key="member.name"
            class="group bg-white rounded-2xl py-6 px-4 sm:py-12 sm:px-6 border-2 border-gray-50 transition-all duration-300 ease-in-out hover:border-red-600/20 hover:shadow-[0_20px_50px_rgba(220,38,38,0.1)] hover:-translate-y-2 text-center w-[calc(50%-0.5rem)] sm:w-[280px]"
          >
            <div class="relative inline-flex mb-4 sm:mb-8 mx-auto">
              <!-- Team Member Image -->
              <div class="w-24 h-24 sm:w-40 sm:h-40 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-gray-100 transition-all duration-300 group-hover:scale-105">
                <img 
                  :src="member.image" 
                  :alt="member.name"
                  class="w-full h-full object-cover"
                />
              </div>
              
              <!-- Icon Badge -->
              <div :class="['absolute -bottom-2 -right-2 p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-lg', member.bg]">
                <component :is="member.icon" :class="['w-4 h-4 sm:w-6 sm:h-6', member.color]" />
              </div>
            </div>

            
            <div class="flex flex-col gap-1 sm:gap-2">
              <h3 class="text-base sm:text-2xl font-extrabold text-black font-montserrat tracking-tight leading-tight">{{ member.name }}</h3>
              <p class="text-red-600 font-bold uppercase tracking-[0.1em] sm:tracking-[0.15em] text-[8px] sm:text-xs">
                {{ member.role }}
              </p>
            </div>
          </div>
        </div>

        <!-- Operations Row -->
        <div class="flex flex-wrap justify-center gap-4 sm:gap-8">
          <div 
            v-for="member in operations" 
            :key="member.name"
            class="group bg-white rounded-2xl py-6 px-4 sm:py-12 sm:px-6 border-2 border-gray-50 transition-all duration-300 ease-in-out hover:border-red-600/20 hover:shadow-[0_20px_50px_rgba(220,38,38,0.1)] hover:-translate-y-2 text-center w-[calc(50%-0.5rem)] sm:w-[280px]"
          >
            <div class="relative inline-flex mb-4 sm:mb-8 mx-auto">
              <!-- Team Member Image -->
              <div class="w-24 h-24 sm:w-40 sm:h-40 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-gray-100 transition-all duration-300 group-hover:scale-105">
                <img 
                  :src="member.image" 
                  :alt="member.name"
                  class="w-full h-full object-cover"
                />
              </div>
              
              <!-- Icon Badge -->
              <div :class="['absolute -bottom-2 -right-2 p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-lg', member.bg]">
                <component :is="member.icon" :class="['w-4 h-4 sm:w-6 sm:h-6', member.color]" />
              </div>
            </div>

            
            <div class="flex flex-col gap-1 sm:gap-2">
              <h3 class="text-base sm:text-2xl font-extrabold text-black font-montserrat tracking-tight leading-tight">{{ member.name }}</h3>
              <p class="text-red-600 font-bold uppercase tracking-[0.1em] sm:tracking-[0.15em] text-[8px] sm:text-xs">
                {{ member.role }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Faculties Section -->
      <div class="bg-gray-900 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
        <!-- Abstract Background Decor -->
        <div class="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]"></div>
        <div class="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]"></div>

        <div class="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-20">
          <div class="flex-shrink-0 bg-red-600 p-5 md:p-6 rounded-2xl md:rounded-[2rem] shadow-[0_15px_30px_rgba(220,38,38,0.3)] group transition-transform duration-500 hover:rotate-3">
            <GraduationCap class="w-12 h-12 md:w-14 md:h-14 text-white" />
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
