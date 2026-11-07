import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * motion.client — Lenis smooth scroll integrated with GSAP ScrollTrigger.
 *
 * GSAP's ticker is the single raf loop that feeds Lenis — the canonical
 * Lenis↔ScrollTrigger pairing (one frame loop owns both, so scroll-linked
 * effects never lag behind native scroll). Scroll-triggered animations are
 * provided by the `v-reveal` directive (see plugins/reveal.ts).
 *
 * With prefers-reduced-motion, Lenis is skipped entirely (native scroll).
 */

export default defineNuxtPlugin((nuxtApp) => {
  gsap.registerPlugin(ScrollTrigger)

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let lenis: Lenis | null = null
  if (!prefersReduced) {
    lenis = new Lenis({ lerp: 0.12 })

    // Sync ScrollTrigger with Lenis and let the GSAP ticker drive the raf loop.
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis?.raf(time * 1000)) // ticker passes seconds
    gsap.ticker.lagSmoothing(0)

    // Smooth in-page anchor jumps (native hash jumps bypass Lenis).
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const hash = a.getAttribute('href')
        if (!hash) return
        const target = document.querySelector(hash)
        if (!target) return
        e.preventDefault()
        lenis?.scrollTo(target as HTMLElement, { offset: -80 })
      })
    })
  }

  // Recalculate trigger positions after route swaps (layout shifts invalidate
  // them), and reset to top on client-side navigation.
  nuxtApp.hook('page:finish', () => {
    lenis?.scrollTo(0, { immediate: true })
    ScrollTrigger.refresh()
  })

  // Keep trigger positions honest while the page settles after hydration:
  // fonts and late-loading images change layout, and stale start values leave
  // triggers stuck (never firing) or firing at the wrong spot.
  const refresh = () => ScrollTrigger.refresh()
  if (document.readyState !== 'complete') {
    window.addEventListener('load', refresh, { once: true })
  }
  document.fonts?.ready.then(refresh).catch(() => {})
  requestAnimationFrame(() => requestAnimationFrame(refresh))
  document.querySelectorAll('img').forEach((img) => {
    if (!img.complete) img.addEventListener('load', refresh, { once: true })
  })

  return {
    provide: {
      lenis,
    },
  }
})
