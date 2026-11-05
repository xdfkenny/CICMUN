import tailwindcss from "@tailwindcss/vite";
import { siteConfig } from "./app/config/siteConfig";

const isProduction = process.env.NODE_ENV === 'production'
const withApiSWR = (seconds: number) => (isProduction ? { swr: seconds } : {})

const securityHeaders = {
  "content-security-policy": [
    "default-src 'self'",
    "base-uri 'self'",
    "connect-src 'self' https://cloudflareinsights.com",
    "font-src 'self' data:",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "frame-src 'self' https://www.google.com",
    "img-src 'self' data: https:",
    "object-src 'none'",
    "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
    "style-src 'self' 'unsafe-inline'",
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
  modules: ['@nuxt/image'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss() as any,
    ],
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'class-variance-authority',
        'clsx',
        'radix-vue',
        'tailwind-merge',
      ],
    },
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
    '/api/committee/**': withSecurityHeaders(withApiSWR(3600)),
    '/api/committees': withSecurityHeaders(withApiSWR(3600)),
    '/api/committees/**': withSecurityHeaders(withApiSWR(3600)),
    '/api/events': withSecurityHeaders(withApiSWR(3600)),
    '/api/gallery': withSecurityHeaders(isProduction ? {
      swr: 3600,
    } : {}),
    '/api/health': withSecurityHeaders({
      headers: {
        'cache-control': 'no-store',
      },
    }),
    '/api/resources': withSecurityHeaders(withApiSWR(3600)),
    '/api/schedule': withSecurityHeaders(withApiSWR(3600)),
  },
  app: {
    head: {
      title: 'CICMUN Delegate Portal',
      titleTemplate: `%s | ${siteConfig.brand} ${siteConfig.edition}`,
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: `Official delegate portal for ${siteConfig.brand} ${siteConfig.edition} — committees, schedules, resources, and the conference photo gallery of the Colegio Internacional de Caracas Model United Nations.` },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#ffffff' },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        /* Open Graph / Twitter defaults — per-page useSeoMeta overrides
           og:title / og:description / og:image where set. og:url is set
           per-route in app.vue from the canonical URL. */
        { property: 'og:site_name', content: `${siteConfig.brand} ${siteConfig.edition}` },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:image', content: `${siteConfig.siteUrl}/LOGO.png` },
        { property: 'og:image:alt', content: `${siteConfig.brand} ${siteConfig.edition} logo` },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: `${siteConfig.siteUrl}/LOGO.png` }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'sitemap', type: 'application/xml', href: `${siteConfig.siteUrl}/sitemap.xml` }
      ],
      script: [
        /* Progressive enhancement gate: mark JS as available as early as
           possible so .reveal elements animate only for JS clients, while
           staying fully visible for crawlers/no-JS contexts. */
        { innerHTML: 'document.documentElement.classList.add("js")' }
      ]
    }
  }
})
