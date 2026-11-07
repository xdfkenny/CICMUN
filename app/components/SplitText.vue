<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

/**
 * SplitText — Vue Bits-style split-text entrance (port of React Bits'
 * SplitText component to this Nuxt/Vue codebase, using GSAP's free SplitText
 * plugin). Splits the heading into words + chars and staggers the chars up
 * into place when the element scrolls into view.
 *
 * Reduced motion: the text renders as-is (no split, no tween).
 */

const props = withDefaults(defineProps<{
  text: string
  as?: string
  /** Seconds between each char. */
  stagger?: number
  /** Entrance duration per char (s). */
  duration?: number
  delay?: number
}>(), {
  as: 'h2',
  stagger: 0.03,
  duration: 0.6,
  delay: 0,
})

const el = ref<HTMLElement | null>(null)
let split: SplitText | null = null
let mm: gsap.MatchMedia | null = null

onMounted(() => {
  if (!el.value) return
  mm = gsap.matchMedia(el.value)

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.registerPlugin(SplitText)
    split = SplitText.create(el.value!, { type: 'words,chars', charsClass: 'split-char' })
    // Callback-only trigger + imperative tween: a tween attached via the
    // scrollTrigger config is owned by ScrollTrigger, and refreshes can force
    // or revert it — leaving chars stuck invisible. This way the tween can
    // always play through to its natural end.
    const st = ScrollTrigger.create({
      trigger: el.value!,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.from(split?.chars ?? [], {
          yPercent: 110,
          opacity: 0,
          duration: props.duration,
          delay: props.delay,
          stagger: props.stagger,
          ease: 'power3.out',
        })
      },
    })
    return () => {
      st.kill()
      split?.revert()
      split = null
    }
  })
})

onBeforeUnmount(() => {
  mm?.revert()
  mm = null
})

// `as` is constrained to heading-ish tags by usage; cast for dynamic component.
const tag = computed(() => props.as as any)
</script>

<template>
  <component
    :is="tag"
    ref="el"
    class="split-text"
  >{{ text }}</component>
</template>

<style scoped>
.split-text {
  /* Chars overflow their line box while flying in. */
  overflow: hidden;
  display: block;
}
.split-text :deep(.split-char) {
  display: inline-block;
  will-change: transform, opacity;
}
</style>
