import { onUnmounted, watch, type Ref } from 'vue'

/**
 * Scroll-driven reveal animations via IntersectionObserver.
 *
 * Usage:
 *   const { observe } = useScrollReveal()
 *   <div v-scroll-reveal>         — default fade-up
 *   <div v-scroll-reveal.left>    — slide from left
 *   <div v-scroll-reveal.scale>   — scale up
 *   <div v-scroll-reveal.stagger> — children stagger
 *
 * Or in script:
 *   const el = ref<HTMLElement>()
 *   observe(el, { animation: 'fade-up', delay: 200 })
 */

export type RevealAnimation =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'scale'
  | 'scale-up'
  | 'clip-up'
  | 'blur-in'

export interface RevealOptions {
  animation?: RevealAnimation
  /** Delay in ms before animation starts. */
  delay?: number
  /** Duration in ms. Default 700. */
  duration?: number
  /** Threshold 0-1. Default 0.15. */
  threshold?: number
  /** Stagger children by this many ms. Default 0 (no stagger). */
  stagger?: number
  /** Only animate once. Default true. */
  once?: boolean
}

const DEFAULT_OPTIONS: Required<RevealOptions> = {
  animation: 'fade-up',
  delay: 0,
  duration: 700,
  threshold: 0.15,
  stagger: 0,
  once: true,
}

/** Composable: returns `observe(el, opts)` to register elements. */
export function useScrollReveal() {
  const observers: IntersectionObserver[] = []

  function observe(
    el: Ref<HTMLElement | undefined> | HTMLElement,
    opts: RevealOptions = {},
  ) {
    const o = { ...DEFAULT_OPTIONS, ...opts }

    const setup = (target: HTMLElement) => {
      // Set initial hidden state
      target.style.setProperty('--sr-dur', `${o.duration}ms`)
      target.style.setProperty('--sr-delay', `${o.delay}ms`)
      target.classList.add('sr', `sr--${o.animation}`)

      // If stagger, hide children too
      if (o.stagger > 0) {
        const children = Array.from(target.children) as HTMLElement[]
        children.forEach((child, i) => {
          child.style.setProperty('--sr-child-delay', `${o.delay + i * o.stagger}ms`)
          child.classList.add('sr-child')
        })
      }

      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            target.classList.add('sr--visible')
            if (o.once) io.disconnect()
          } else if (!o.once) {
            target.classList.remove('sr--visible')
          }
        },
        { threshold: o.threshold },
      )
      io.observe(target)
      observers.push(io)
    }

    // Handle both Ref and direct HTMLElement
    if (el instanceof HTMLElement) {
      setup(el)
    } else {
      const stop = watch(
        () => (el as Ref<HTMLElement | undefined>).value,
        (target) => {
          if (target) {
            setup(target)
            stop()
          }
        },
        { immediate: true },
      )
    }
  }

  onUnmounted(() => {
    observers.forEach((io) => io.disconnect())
  })

  return { observe }
}

/**
 * Vue directive: v-scroll-reveal
 * Auto-registers the element for scroll reveal.
 *
 * Modifiers: .left .right .scale .blur .stagger .slow .fast
 * Value: number (delay in ms)
 */
export const vScrollReveal = {
  mounted(el: HTMLElement, binding: { value?: number | RevealOptions; modifiers: Record<string, boolean> }) {
    const mods = binding.modifiers
    let animation: RevealAnimation = 'fade-up'
    if (mods.left) animation = 'fade-left'
    else if (mods.right) animation = 'fade-right'
    else if (mods.down) animation = 'fade-down'
    else if (mods.scale) animation = 'scale'
    else if (mods.clip) animation = 'clip-up'
    else if (mods.blur) animation = 'blur-in'

    const stagger = mods.stagger ? 100 : 0
    const duration = mods.slow ? 1000 : mods.fast ? 400 : 700
    const delay = typeof binding.value === 'number' ? binding.value : (binding.value as RevealOptions)?.delay ?? 0

    // Set initial state
    el.style.setProperty('--sr-dur', `${duration}ms`)
    el.style.setProperty('--sr-delay', `${delay}ms`)
    el.classList.add('sr', `sr--${animation}`)

    if (stagger > 0) {
      const children = Array.from(el.children) as HTMLElement[]
      children.forEach((child, i) => {
        child.style.setProperty('--sr-child-delay', `${delay + i * stagger}ms`)
        child.classList.add('sr-child')
      })
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('sr--visible')
          io.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    io.observe(el)

    // Store for cleanup
    ;(el as any).__sr_observer = io
  },
  unmounted(el: HTMLElement) {
    ;(el as any).__sr_observer?.disconnect()
  },
}