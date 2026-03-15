import tailwindcss from "@tailwindcss/vite";

const isProduction = process.env.NODE_ENV === 'production'

const securityHeaders = {
  "content-security-policy": [
    "default-src 'self'",
    "base-uri 'self'",
    "connect-src 'self'",
    "font-src 'self' https://fonts.gstatic.com data:",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "frame-src https://www.google.com",
    "img-src 'self' data: https:",
    "object-src 'none'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  ].join("; "),
  "permissions-policy": "camera=(), geolocation=(), microphone=()",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-content-type-options": "nosniff",
  "x-frame-options": "SAMEORIGIN",
};

const withSecurityHeaders = (rule: Record<string, any> = {}) => ({
  ...rule,
  headers: {
    ...securityHeaders,
    ...(rule.headers ?? {}),
  },
});

export default defineNuxtConfig({
  srcDir: 'app',
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
    '/**': withSecurityHeaders(),
    '/gallery/**': withSecurityHeaders({
      headers: {
        'cache-control': 'public, max-age=604800, stale-while-revalidate=86400',
      },
    }),
    '/gallery-origins/**': withSecurityHeaders({
      headers: {
        'cache-control': 'public, max-age=604800, stale-while-revalidate=86400',
      },
    }),
    '/gallery/__thumbs/**': withSecurityHeaders({
      headers: {
        'cache-control': 'public, max-age=31536000, immutable',
      },
    }),
    '/api/committee/**': withSecurityHeaders({
      swr: 3600,
    }),
    '/api/committees': withSecurityHeaders({
      swr: 3600,
    }),
    '/api/committees/**': withSecurityHeaders({
      swr: 3600,
    }),
    '/api/events': withSecurityHeaders({
      swr: 3600,
    }),
    '/api/gallery': withSecurityHeaders(isProduction ? {
      swr: 3600,
    } : {}),
    '/api/health': withSecurityHeaders({
      headers: {
        'cache-control': 'no-store',
      },
    }),
    '/api/resources': withSecurityHeaders({
      swr: 3600,
    }),
    '/api/schedule': withSecurityHeaders({
      swr: 3600,
    }),
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
