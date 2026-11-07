import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * reveal — registers the `v-reveal` directive (universal plugin so SSR knows
 * about it; the directive's mounted/unmounted hooks only ever run on the
 * client). Scroll-triggered entrance animations via GSAP ScrollTrigger that
 * respect prefers-reduced-motion via gsap.matchMedia. Smooth scrolling itself
 * lives in the Lenis plugin (motion.client.ts).
 *
 * Design note: the ScrollTrigger is callback-only (`once: true`, no attached
 * animation) and the entrance tween is created imperatively in onEnter. A
 * tween attached via the `scrollTrigger` config is owned by ScrollTrigger —
 * every refresh() can force its progress or revert it (e.g. after a
 * layout-shifting settle refresh or a jumped-past anchor), which left cards
 * stuck half-faded. A callback trigger can never touch the tween.
 */

export interface RevealOptions {
  /** Vertical offset (px) of the entrance. */
  y?: number
  /** Extra delay before the entrance starts (s). */
  delay?: number
  /** Animate el.children instead of el itself (staggered). */
  children?: boolean
  /** Stagger amount between children (s). */
  stagger?: number
  /** Duration of each tween (s). */
  duration?: number
}

interface RevealElement extends Element {
  __revealCleanup?: () => void
}

export default defineNuxtPlugin((nuxtApp) => {
  gsap.registerPlugin(ScrollTrigger)

  nuxtApp.vueApp.directive<HTMLElement, RevealOptions | undefined>('reveal', {
    mounted(el, binding) {
      const opts = binding.value ?? {}
      const mm = gsap.matchMedia(el)

      // Only animate when the user allows motion; otherwise the element just
      // stays in its natural (final) state — nothing to revert, no FOUC.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const targets = opts.children ? Array.from(el.children) : el
        const els: HTMLElement[] = (Array.isArray(targets) ? targets : [targets]) as HTMLElement[]
        // GSAP must own these properties: a CSS transition (e.g. Tailwind's
        // transition-all on the cards) re-interpolates every inline style
        // GSAP writes, so partial renders leave elements stuck half-faded.
        // Suppressed for the whole reveal, restored once it has finished.
        els.forEach((t) => { t.style.transition = 'none' })

        const duration = opts.duration ?? 0.9
        const totalMs = ((opts.delay ?? 0) + duration
          + (opts.children ? (opts.stagger ?? 0) * el.children.length : 0)) * 1000 + 150
        let restoreTimer = 0
        const restore = () => {
          window.clearTimeout(restoreTimer)
          els.forEach((t) => { t.style.transition = '' })
        }

        const playReveal = () => {
          gsap.from(targets, {
            y: opts.y ?? 32,
            opacity: 0,
            duration,
            delay: opts.delay ?? 0,
            stagger: opts.stagger ?? 0,
            ease: 'power3.out',
            onComplete: restore,
          })
          // Wall-clock fallback: gsap renders can be interrupted (backgrounded
          // tab throttles rAF), so don't rely on onComplete alone.
          restoreTimer = window.setTimeout(restore, totalMs)
        }

        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: playReveal,
        })

        const cleanup = () => {
          window.clearTimeout(restoreTimer)
          restore()
          st.kill()
          delete (el as RevealElement).__revealCleanup
        }
        ;(el as RevealElement).__revealCleanup = cleanup
        return cleanup
      })
    },
    unmounted(el) {
      ;(el as RevealElement).__revealCleanup?.()
    },
    // SSR: render nothing special — elements are server-rendered in final state.
    getSSRProps: () => ({}),
  })
})
