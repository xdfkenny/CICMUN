<script setup lang="ts">
import { User, Shield, Megaphone, GraduationCap, Star, Truck, UserRound } from 'lucide-vue-next'

type TeamMember = {
  name: string
  role: string
  icon: typeof Star
  color: string
  bg: string
  image?: string
}

const leadership: TeamMember[] = [
  {
    name: 'Oriana',
    role: 'Secretary General',
    icon: Star,
    color: 'text-white',
    bg: 'bg-red-600',
    image: '/team-photos/Oriana.png'
  },
  {
    name: 'Ariana',
    role: 'Deputy Secretary',
    icon: Shield,
    color: 'text-white',
    bg: 'bg-black',
    image: '/team-photos/Ariana.png'
  },
  {
    name: 'Santiago',
    role: 'Head Delegate',
    icon: User,
    color: 'text-white',
    bg: 'bg-red-600',
    image: '/team-photos/Santiago.png'
  },
  {
    name: 'Giovanna',
    role: 'Head Delegate',
    icon: User,
    color: 'text-white',
    bg: 'bg-red-600',
    image: '/team-photos/Giovanna.png'
  }
]

const operations = [
  {
    name: 'Kenny',
    role: 'Community Manager',
    icon: Megaphone,
    color: 'text-white',
    bg: 'bg-black',
    image: '/team-photos/Kenny.png'
  },
  {
    name: 'Selene',
    role: 'Logistics',
    icon: Truck,
    color: 'text-white',
    bg: 'bg-red-600',
    image: '/team-photos/Selene.png'
  },
  {
    name: 'Cesar',
    role: 'Logistics',
    icon: Truck,
    color: 'text-white',
    bg: 'bg-black',
    image: '/team-photos/Cesar.png'
  }
]

const faculties: TeamMember[] = [

  {
    name: 'Ricardo Millan',
    role: 'Faculty Supervisor',
    icon: UserRound,
    color: 'text-white',
    bg: 'bg-red-600',
    image: '/team-photos/Ricardo.JPG'
  },
  {
    name: 'Oriana',
    role: 'Faculty Supervisor',
    icon: UserRound,
    color: 'text-white',
    bg: 'bg-red-600',
    image: '/team-photos/Oriana.JPG'
  },
  {
    name: 'Claudia',
    role: 'Faculty Supervisor',
    icon: UserRound,
    color: 'text-white',
    bg: 'bg-red-600',
    image: '/team-photos/Claudia.JPG'
  }
]

const getInitials = (name: string) =>
  name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
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
              <div class="w-24 h-24 sm:w-40 sm:h-40 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-gray-100 transition-all duration-300 group-hover:scale-105 bg-gray-100 flex items-center justify-center">
                <template v-if="member.image">
                  <img 
                    :src="member.image" 
                    :alt="member.name"
                    class="w-full h-full object-cover"
                  />
                </template>
                <span v-else class="text-xl sm:text-4xl font-extrabold text-gray-900 font-montserrat tracking-tight">{{ getInitials(member.name) }}</span>
              </div>
              
              <!-- Icon Badge -->
              <div :class="['absolute -bottom-2 -right-2 p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-lg', member.bg]">
                <component :is="member.icon" :class="['w-4 h-4 sm:w-6 sm:h-6', member.color]" />
              </div>
            </div>

            
            <div class="flex flex-col gap-1 sm:gap-2">
              <h3 class="text-base sm:text-2xl font-extrabold text-black font-montserrat tracking-tight leading-tight uppercase">{{ member.name }}</h3>
              <p class="text-red-600 font-bold uppercase tracking-[0.1em] sm:tracking-[0.15em] text-xs sm:text-xs">
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
              <h3 class="text-base sm:text-2xl font-extrabold text-black font-montserrat tracking-tight leading-tight uppercase">{{ member.name }}</h3>
              <p class="text-red-600 font-bold uppercase tracking-[0.1em] sm:tracking-[0.15em] text-xs sm:text-xs">
                {{ member.role }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Faculties Section -->
      <div class="bg-gray-950 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <!-- Abstract Background Decor -->
        <div class="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]"></div>
        <div class="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]"></div>

        <div class="relative z-10">
          <div class="mb-8 flex items-end justify-between gap-6">
            <div>
              <p class="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-red-500">Meet the team behind CICMUN</p>
              <h3 class="text-3xl font-bold font-montserrat tracking-tight leading-tight md:text-4xl">Our Faculty Supervisors</h3>
            </div>
            <GraduationCap class="hidden h-12 w-12 text-red-500 md:block" aria-hidden="true" />
          </div>
          <div class="grid gap-4 md:grid-cols-3">
            <div v-for="faculty in faculties" :key="faculty.name" class="group flex min-h-64 flex-col items-center border border-white/15 bg-white/[0.04] p-6 text-center transition-colors hover:border-red-500 hover:bg-white/[0.08]">
              <div class="relative inline-flex mb-8">
                <div class="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/15 transition-all duration-300 group-hover:scale-105 bg-white/10 flex items-center justify-center">
                  <template v-if="faculty.image">
                    <img
                      :src="faculty.image"
                      :alt="faculty.name"
                      class="w-full h-full object-cover"
                    />
                  </template>
                  <span v-else class="text-2xl font-extrabold text-white font-montserrat tracking-tight">{{ getInitials(faculty.name) }}</span>
                </div>
                <div :class="['absolute -bottom-2 -right-2 p-2 rounded-xl transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-lg', faculty.bg]">
                  <component :is="faculty.icon" :class="['w-4 h-4', faculty.color]" aria-hidden="true" />
                </div>
              </div>
              <h4 class="mb-3 text-xl font-bold">{{ faculty.name }}</h4>
              <p class="text-red-500 text-sm font-bold uppercase tracking-widest">{{ faculty.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
