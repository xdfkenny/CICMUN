<template>
  <footer class="bg-gray-50 py-8 mt-auto border-t border-gray-100">
    <div class="container mx-auto px-4 flex flex-col items-center justify-center gap-4">
      <div class="flex items-center gap-2">
        <img src="/LOGO.png" alt="CICMUN Logo" class="w-8 h-8 opacity-50 grayscale" />
        <span class="text-gray-400 font-bold tracking-widest text-sm">CICMUN</span>
      </div>
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
  </footer>
</template>
