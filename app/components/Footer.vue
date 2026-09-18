<script setup lang="ts">
import { Instagram, Mail } from 'lucide-vue-next'
</script>

<template>
  <footer class="mt-auto border-t border-white/10 bg-gray-950 py-12 text-white">
    <div class="container mx-auto flex flex-col items-center gap-8 px-4">
      <img src="/LOGO.png" alt="CICMUN Logo" class="h-12 w-12 object-contain invert brightness-110" />
      <div class="flex items-center gap-3">
        <a href="https://www.instagram.com/cicmunve/" target="_blank" rel="noopener noreferrer" aria-label="CICMUN on Instagram" class="rounded-full border border-white/20 p-3 transition-colors hover:border-red-500 hover:text-red-500"><Instagram class="h-5 w-5" /></a>
        <a href="mailto:samun@ciccaracas.com.ve" aria-label="Email CICMUN" class="rounded-full border border-white/20 p-3 transition-colors hover:border-red-500 hover:text-red-500"><Mail class="h-5 w-5" /></a>
      </div>
      <p class="text-center text-xs text-gray-500">© {{ new Date().getFullYear() }} Colegio Internacional de Caracas</p>
    </div>
  </footer>
</template>
