import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({

  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/color-mode', '@nuxt/image'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss() as any,
    ],
    build: {
      sourcemap: false,
    }
  },
  build: {
    transpile: ['lucide-vue-next']
  },
  nitro: {
    compressPublicAssets: true,
  },
  routeRules: {
    '/Gallery/**': {
      headers: {
        'cache-control': 'public, max-age=604800, stale-while-revalidate=86400',
      },
    },
    '/Gallery/__thumbs/**': {
      headers: {
        'cache-control': 'public, max-age=31536000, immutable',
      },
    },
    '/api/gallery': {
      swr: 3600,
    },
    '/api/resources': {
      swr: 3600,
    },
    '/api/schedule': {
      swr: 3600,
    },
  },
  app: {
    head: {
      title: 'CICMUN Delegate Portal',
      titleTemplate: '%s | CICMUN 2026',
      htmlAttrs: {
        lang: 'es'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Portal oficial de delegados para CICMUN 2026. Accede a recursos, horarios e información de comités del Colegio Internacional de Caracas Model United Nations.' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#ffffff' },
        { name: 'robots', content: 'index, follow' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Open+Sans:wght@400;500;600&display=swap' }
      ]
    }
  }
})
