<script setup lang="ts">
import type { Committee } from '~~/shared/types'

const props = defineProps<{ committee: Committee }>()

const ringClass = computed(() => {
  return props.committee.type === 'SAMUN' ? 'hover:ring-red-600' : 'hover:ring-black'
})

const bgClass = computed(() => {
  return props.committee.type === 'SAMUN' ? 'bg-red-600' : 'bg-black'
})

const borderClass = computed(() => {
  return props.committee.type === 'SAMUN' ? 'border-red-600' : 'border-black'
})

const textClass = computed(() => {
  return props.committee.type === 'SAMUN' ? 'text-red-600' : 'text-black'
})

const lightBgClass = computed(() => {
  return props.committee.type === 'SAMUN' ? 'bg-red-50' : 'bg-gray-50'
})

const darkTextClass = computed(() => {
  return props.committee.type === 'SAMUN' ? 'text-red-700' : 'text-black'
})

const hoverTextClass = computed(() => {
  return props.committee.type === 'SAMUN' ? 'group-hover:text-red-600' : 'group-hover:text-black'
})
</script>

<template>
  <NuxtLink :to="`/committees/${committee.id}`" class="block h-full">
    <UiCard 
      class="group overflow-hidden transition-all duration-300 border-0 shadow-sm hover:shadow-xl bg-white h-full hover:ring-2"
      :class="ringClass"
    >
      <div 
        class="h-2 transition-colors duration-300"
        :class="bgClass"
      ></div>

      <!-- Committee Image Header -->
      <div v-if="committee.image" class="relative h-48 overflow-hidden">
        <NuxtImg
          :src="committee.image" 
          :alt="committee.name"
          format="webp"
          width="800"
          height="450"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div class="absolute bottom-4 left-6">
          <span class="px-2 py-1 rounded bg-white/20 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-widest border border-white/30">
            {{ committee.type }}
          </span>
        </div>
      </div>

      <UiCardContent class="pt-8 px-6 pb-6">
        <UiCardTitle :class="'text-2xl font-bold mb-4 font-montserrat tracking-tight transition-colors duration-300 ' + hoverTextClass">
          {{ committee.name }}
        </UiCardTitle>

        <p v-if="committee.summary" class="text-sm text-black mb-6 line-clamp-2 leading-relaxed">
          {{ committee.summary }}
        </p>

        <div class="space-y-6">
          <!-- Staff Section -->
          <div class="grid grid-cols-1 gap-4">
            <!-- Chair -->
            <div class="flex items-center gap-4 p-3 rounded-lg bg-gray-50/50 border border-transparent transition-colors hover:bg-white hover:border-gray-100">
              <div 
                class="w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0 bg-white"
                :class="borderClass"
              >
                <NuxtImg
                  v-if="committee.chairPhoto"
                  :src="committee.chairPhoto"
                  :alt="committee.chairName"
                  format="webp"
                  width="96"
                  height="96"
                  class="w-full h-full rounded-full object-cover"
                />
                <span v-else class="font-bold text-xs" :class="textClass">CH</span>
              </div>
              <div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-black">Chair</p>
                <p class="font-semibold text-black leading-tight">{{ committee.chairName }}</p>
              </div>
            </div>

            <!-- Co-Chair -->
            <div v-if="committee.coChairName" class="flex items-center gap-4 p-3 rounded-lg bg-gray-50/50 border border-transparent transition-colors hover:bg-white hover:border-gray-100">
              <div 
                class="w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0 bg-white"
                :class="committee.type === 'SAMUN' ? 'border-blue-600' : 'border-black'"
              >
                <NuxtImg
                  v-if="committee.coChairPhoto"
                  :src="committee.coChairPhoto"
                  :alt="committee.coChairName"
                  format="webp"
                  width="96"
                  height="96"
                  class="w-full h-full rounded-full object-cover"
                />
                <span v-else class="font-bold text-xs" :class="committee.type === 'SAMUN' ? 'text-blue-600' : 'text-black'">CC</span>
              </div>
              <div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-black">Co-Chair</p>
                <p class="font-semibold text-black leading-tight">{{ committee.coChairName }}</p>
              </div>
            </div>

            <!-- Secretary -->
            <div v-if="committee.secretaryName" class="flex items-center gap-4 p-3 rounded-lg bg-gray-50/50 border border-transparent transition-colors hover:bg-white hover:border-gray-100">
              <div 
                class="w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0 bg-white"
                :class="committee.type === 'SAMUN' ? 'border-green-600' : 'border-black'"
              >
                <NuxtImg
                  v-if="committee.secretaryPhoto"
                  :src="committee.secretaryPhoto"
                  :alt="committee.secretaryName"
                  format="webp"
                  width="96"
                  height="96"
                  class="w-full h-full rounded-full object-cover"
                />
                <span v-else class="font-bold text-xs" :class="committee.type === 'SAMUN' ? 'text-green-600' : 'text-black'">SE</span>
              </div>
              <div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-black">Secretary</p>
                <p class="font-semibold text-black leading-tight">{{ committee.secretaryName }}</p>
              </div>
            </div>
          </div>

          <!-- Topics -->
          <div class="pt-6 border-t border-gray-100">
            <p class="text-[10px] font-bold uppercase tracking-widest text-black mb-4">Topics</p>
            <div class="space-y-3">
              <div 
                class="p-4 rounded-xl transition-all duration-300 hover:translate-x-1 border-l-4"
                :class="[lightBgClass, borderClass]"
              >
                <p class="text-[10px] font-bold uppercase mb-1" :class="darkTextClass">Topic A</p>
                <p class="text-sm font-medium text-black leading-snug">{{ committee.topicA }}</p>
              </div>
              <div 
                v-if="committee.topicB"
                class="p-4 rounded-xl bg-gray-50 border-l-4 border-gray-300 transition-all duration-300 hover:translate-x-1 hover:bg-white hover:border-gray-400"
              >
                <p class="text-[10px] font-bold uppercase mb-1 text-black">Topic B</p>
                <p class="text-sm font-medium text-black leading-snug">{{ committee.topicB }}</p>
              </div>
            </div>
          </div>
        </div>
      </UiCardContent>
    </UiCard>
  </NuxtLink>
</template>
