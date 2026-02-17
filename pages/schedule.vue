<script setup lang="ts">
const { data: schedule, pending, error } = await useFetch('/api/schedule', {
  default: () => [],
})

useSeoMeta({
  title: 'Horario de la Conferencia',
  ogTitle: 'Horario de la Conferencia | CICMUN 2026',
  description: 'Consulta el cronograma detallado de actividades para CICMUN 2026, incluyendo ceremonias y sesiones de comités.',
  ogDescription: 'Consulta el cronograma detallado de actividades para CICMUN 2026, incluyendo ceremonias y sesiones de comités.',
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="container max-w-4xl mx-auto">
      <h1 class="text-4xl md:text-5xl font-bold text-center mb-12 font-montserrat text-black">Conference Schedule</h1>

      <div v-if="pending" class="text-center text-gray-500 py-12">Loading schedule...</div>
      <div v-else-if="error" class="text-center text-red-600 py-12">Unable to load schedule. Please try again.</div>
      <div v-else-if="schedule.length === 0" class="text-center text-gray-500 py-12">Schedule coming soon.</div>

      <div v-else class="space-y-12">
        <div v-for="day in schedule" :key="day.date" class="bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="bg-black text-white p-6">
            <h2 class="text-2xl font-bold font-montserrat">{{ day.day }} - {{ day.date }}</h2>
          </div>
          <div class="p-6">
            <div class="space-y-6">
              <div v-for="event in day.events" :key="`${event.time}-${event.activity}`" class="flex flex-col md:flex-row md:items-center gap-4 border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                <div class="md:w-48 font-bold text-red-600 text-lg">{{ event.time }}</div>
                <div class="flex-1">
                  <div class="font-bold text-xl text-gray-900">{{ event.activity }}</div>
                  <div class="text-gray-600 flex items-center gap-1 mt-1">
                    <span class="text-sm border border-gray-200 rounded px-2 py-0.5 bg-gray-50">{{ event.location }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
