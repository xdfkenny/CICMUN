import tailwindcss from "@tailwindcss/vite";

const parseIdList = (value?: string) => {
  if (!value) return []
  return value
    .split(',')
    .map(entry => entry.trim())
    .filter(Boolean)
}

const warnDeprecatedRoleEnv = () => {
  const deprecated = [
    'NUXT_PUBLIC_STAFF_EMAILS',
    'NUXT_PUBLIC_ADMIN_EMAILS',
    'NUXT_PUBLIC_SUPER_ADMIN_EMAILS',
  ].filter((key) => !!process.env[key])
  if (deprecated.length) {
    console.warn(`[CICMUN] Remove deprecated role env vars: ${deprecated.join(', ')}. Use NUXT_STAFF_IDS, NUXT_ADMIN_IDS, NUXT_SUPER_ADMIN_IDS.`)
  }
}

warnDeprecatedRoleEnv()

export default defineNuxtConfig({

  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/color-mode', '@pinia/nuxt'],
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
    '/api/events': {
      swr: 3600,
    },
    '/api/resources': {
      swr: 3600,
    },
    '/api/announcements': {
      swr: 300,
    },
    '/api/briefs': {
      swr: 3600,
    },
    '/api/glossary': {
      swr: 3600,
    },
    '/api/allocations': {
      swr: 300,
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
  },
  runtimeConfig: {
    firebaseAdmin: {
      projectId: '',
      clientEmail: '',
      privateKey: '',
    },
    checkInSecret: process.env.NUXT_CHECK_IN_SECRET || '',
    staffIds: parseIdList(process.env.NUXT_STAFF_IDS),
    adminIds: parseIdList(process.env.NUXT_ADMIN_IDS),
    superAdminIds: parseIdList(process.env.NUXT_SUPER_ADMIN_IDS),
    public: {
      firebase: {
        apiKey: "AIzaSyD3CHM17_kRD9BDe7r9296wB422Fw16SqU",
        authDomain: "studio-2833367368-d365f.firebaseapp.com",
        projectId: "studio-2833367368-d365f",
        storageBucket: "studio-2833367368-d365f.firebasestorage.app",
        messagingSenderId: "1036862077463",
        appId: "1:1036862077463:web:93583a34eb9f99ed48fa52"
      }
    }
  }
})
