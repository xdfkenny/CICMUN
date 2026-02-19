<script setup lang="ts">
interface Announcement {
  id: string
  title: string
  message: string
  audience: 'public' | 'delegate' | 'staff'
  startsAt?: string
  endsAt?: string
  priority?: number
}

const { data } = await useFetch<Announcement[]>('/api/announcements', {
  default: () => [],
})

const { effectiveRole, isAuthenticated, ready } = useAuth()

const now = ref(Date.now())
let interval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  now.value = Date.now()
  interval = setInterval(() => {
    now.value = Date.now()
  }, 60000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

const visibleAnnouncements = computed(() => {
  const list = data.value || []
  return list
    .filter(item => {
      const audience = item.audience || 'public'
      if (
        audience === 'delegate' &&
        !(ready.value && isAuthenticated.value && ['delegate', 'staff', 'admin', 'super_admin'].includes(effectiveRole.value))
      ) {
        return false
      }
      if (
        audience === 'staff' &&
        !(ready.value && isAuthenticated.value && ['staff', 'admin', 'super_admin'].includes(effectiveRole.value))
      ) {
        return false
      }
      const start = item.startsAt ? new Date(item.startsAt) : null
      const end = item.endsAt ? new Date(item.endsAt) : null
      const startValid = start ? !Number.isNaN(start.getTime()) : false
      const endValid = end ? !Number.isNaN(end.getTime()) : false
      if (start && !startValid) return false
      if (end && !endValid) return false
      if (startValid && start!.getTime() > now.value) return false
      if (endValid && end!.getTime() < now.value) return false
      return true
    })
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
})
</script>

<template>
  <div v-if="visibleAnnouncements.length" class="bg-black text-white" aria-live="polite">
    <div class="container py-2 flex items-center gap-3">
      <span class="text-xs font-bold uppercase tracking-widest text-red-400">Announcements</span>
      <div class="flex-1 text-sm">
        <span class="font-semibold">{{ visibleAnnouncements[0].title }}:</span>
        <span class="ml-2 text-white/90">{{ visibleAnnouncements[0].message }}</span>
      </div>
    </div>
  </div>
</template>
