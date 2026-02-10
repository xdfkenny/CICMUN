<script setup lang="ts">
import { Instagram } from 'lucide-vue-next'
</script>

<template>
  <footer class="bg-gray-50 py-10 mt-auto border-t border-gray-100">
    <div class="container mx-auto px-4 flex flex-col items-center justify-center gap-6">
      <div class="flex items-center gap-2">
        <img src="/LOGO.png" alt="CICMUN Logo" class="w-8 h-8 opacity-50 grayscale" />
        <span class="text-gray-400 font-bold tracking-widest text-sm">CICMUN</span>
      </div>

      <a 
        href="https://www.instagram.com/cicmunve/" 
        target="_blank" 
        rel="noopener noreferrer"
        class="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg hover:shadow-pink-500/20"
      >
        <Instagram class="w-5 h-5" />
        Follow @cicmunve
      </a>

      <div class="flex flex-col items-center gap-2">
        <a 
          href="https://github.com/xdfkenny" 
          target="_blank" 
          rel="noopener noreferrer"
          class="text-xs text-gray-300 font-mono opacity-40 hover:opacity-100 transition-opacity duration-300 cursor-pointer hover:underline"
        >
          made by xdfkenny
        </a>
        <p class="text-[10px] text-gray-300">
          © {{ new Date().getFullYear() }} Colegio Internacional de Caracas
        </p>
      </div>
    </div>
  </footer>
</template>
