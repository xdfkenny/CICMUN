<script setup lang="ts">
import QRCode from 'qrcode'

const props = defineProps<{
  payload: string
  title: string
  hint?: string
}>()

const dataUrl = ref<string>('')
const errorMessage = ref<string | null>(null)

const generate = async () => {
  if (!props.payload) {
    dataUrl.value = ''
    errorMessage.value = null
    return
  }
  try {
    dataUrl.value = await QRCode.toDataURL(props.payload, {
      margin: 2,
      width: 220,
      color: {
        dark: '#111111',
        light: '#ffffff',
      },
    })
    errorMessage.value = null
  } catch (err) {
    console.error('Failed to generate QR code', err)
    dataUrl.value = ''
    errorMessage.value = 'Unable to generate QR code.'
  }
}

watch(() => props.payload, generate, { immediate: true })
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
    <h3 class="text-xl font-bold font-montserrat mb-2">{{ title }}</h3>
    <p v-if="hint" class="text-sm text-gray-500 mb-4">{{ hint }}</p>
    <div class="flex items-center justify-center">
      <img v-if="dataUrl" :src="dataUrl" alt="QR code" class="w-56 h-56 object-contain" />
    </div>
    <p v-if="errorMessage" class="mt-3 text-xs text-red-600">{{ errorMessage }}</p>
    <p class="mt-4 text-xs text-gray-400 break-all">{{ payload }}</p>
  </div>
</template>
