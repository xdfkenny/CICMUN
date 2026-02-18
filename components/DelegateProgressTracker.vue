<script setup lang="ts">
const { user } = useAuth()

const defaultSteps = [
  'Read rules of procedure',
  'Picked your country',
  'Researched your topic',
  'Drafted position paper',
  'Submitted position paper',
  'Practiced speeches',
]

const steps = ref(defaultSteps.map(step => ({ label: step, done: false })))

const storageKey = computed(() => {
  const uid = user.value?.uid || 'guest'
  return `cicmun:progress:${uid}`
})

const isValidStep = (item: any): item is { label: string; done: boolean } => {
  return !!item && typeof item.label === 'string' && typeof item.done === 'boolean'
}

const load = () => {
  if (!process.client) return
  const raw = localStorage.getItem(storageKey.value)
  if (!raw) return
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      const validItems = parsed.filter(isValidStep)
      if (validItems.length) {
        steps.value = validItems
      }
    }
  } catch {
    // keep defaults on parse failure
  }
}

const save = () => {
  if (!process.client) return
  localStorage.setItem(storageKey.value, JSON.stringify(steps.value))
}

watch(storageKey, load, { immediate: true })
watch(steps, save, { deep: true })
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-bold font-montserrat">Delegate progress</h3>
      <span class="text-xs text-gray-500">Track your progress. Visible only to your account.</span>
    </div>
    <div class="space-y-3">
      <label
        v-for="(step, index) in steps"
        :key="step.label"
        class="flex items-center gap-3 text-sm font-medium text-gray-700"
      >
        <input
          v-model="steps[index].done"
          type="checkbox"
          class="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
        />
        <span :class="step.done ? 'line-through text-gray-400' : ''">{{ step.label }}</span>
      </label>
    </div>
  </div>
</template>
