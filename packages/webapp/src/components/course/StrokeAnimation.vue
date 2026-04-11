<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import { useCourseContext } from '~/composables/useCourseContext'

const props = defineProps<{ charId: string }>()
const { module, courseKey } = useCourseContext()

// Static SVGs across ALL courses (Vite requires literal globs)
const svgModules = import.meta.glob('~/assets/images/courses/*/strokes/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

const svgRaw = computed(() => {
  const key = courseKey.value
  for (const [path, raw] of Object.entries(svgModules)) {
    if (!path.includes(`/courses/${key}/strokes/`)) continue
    const id = (path.split('/').pop() ?? '').replace('.svg', '').replace(/^\d+_/, '')
    if (id === props.charId) return raw
  }
  return ''
})

// Center-line stroke data for animation
const strokeData = computed(() => module.value?.strokes[props.charId])

// Animation state
const isPlaying = ref(false)
const currentStroke = ref(-1)
const drawProgress = ref<number[]>([])
const lengths = ref<number[]>([])
let rafId = 0

function measure() {
  nextTick(() => {
    const els = document.querySelectorAll('.sa-stroke') as NodeListOf<SVGPathElement>
    lengths.value = Array.from(els).map(el => {
      try { return el.getTotalLength() } catch { return 300 }
    })
  })
}

function play() {
  stop()
  const count = strokeData.value?.strokes.length ?? 0
  if (!count) return

  drawProgress.value = new Array(count).fill(0)
  currentStroke.value = 0
  isPlaying.value = true

  nextTick(() => {
    measure()
    nextTick(startLoop)
  })
}

function startLoop() {
  const count = strokeData.value?.strokes.length ?? 0
  const MS_DRAW = 1800
  const MS_PAUSE = 300
  let phase: 'draw' | 'pause' = 'draw'
  let phaseStart = performance.now()

  function tick(now: number) {
    if (!isPlaying.value) return
    const elapsed = now - phaseStart

    if (phase === 'draw') {
      const t = Math.min(elapsed / MS_DRAW, 1)
      drawProgress.value[currentStroke.value] = 1 - (1 - t) * (1 - t)
      if (t >= 1) {
        drawProgress.value[currentStroke.value] = 1
        phase = 'pause'
        phaseStart = now
      }
    } else {
      if (elapsed >= MS_PAUSE) {
        currentStroke.value++
        if (currentStroke.value >= count) {
          // Stay on final state briefly then reset
          setTimeout(() => { isPlaying.value = false }, 800)
          return
        }
        phase = 'draw'
        phaseStart = now
      }
    }
    rafId = requestAnimationFrame(tick)
  }
  rafId = requestAnimationFrame(tick)
}

function stop() {
  cancelAnimationFrame(rafId)
  isPlaying.value = false
  currentStroke.value = -1
}

function dashOffset(i: number): number {
  const len = lengths.value[i] || 300
  return len * (1 - (drawProgress.value[i] ?? 0))
}

watch(() => props.charId, stop)
onUnmounted(stop)

defineExpose({ play, stop, isPlaying })
</script>

<template>
  <div class="sa">
    <!-- Default: static SVG with stroke numbers and arrows -->
    <div v-if="!isPlaying && svgRaw" class="sa__static" v-html="svgRaw" />

    <!-- Default fallback: just the character in font -->
    <div v-if="!isPlaying && !svgRaw" class="sa__fallback">
      <span>{{ charId }}</span>
    </div>

    <!-- Playing: animate center-line strokes -->
    <svg
      v-if="isPlaying && strokeData"
      :viewBox="strokeData.viewBox"
      class="sa__anim"
    >
      <!-- Ghost shapes (faint target) -->
      <path
        v-for="(stroke, i) in strokeData.strokes"
        :key="`g-${i}`"
        :d="stroke.d"
        fill="var(--color-border)"
        fill-opacity="0.12"
      />

      <!-- Animated center-line strokes -->
      <path
        v-for="(stroke, i) in strokeData.strokes"
        :key="`s-${i}`"
        class="sa-stroke"
        :d="stroke.center || stroke.d"
        fill="none"
        :stroke="i <= currentStroke ? 'var(--color-course, var(--color-primary))' : 'transparent'"
        stroke-width="8"
        stroke-linecap="round"
        stroke-linejoin="round"
        :stroke-dasharray="lengths[i] || 300"
        :stroke-dashoffset="dashOffset(i)"
      />

      <!-- Stroke numbers -->
      <g v-for="(stroke, i) in strokeData.strokes" :key="`n-${i}`">
        <circle
          :cx="stroke.startX" :cy="stroke.startY" r="7"
          :fill="i <= currentStroke ? 'var(--color-course, var(--color-primary))' : 'var(--color-text-subtle)'"
          :opacity="i > currentStroke ? 0.2 : 0.85"
        />
        <text
          :x="stroke.startX" :y="stroke.startY + 3"
          text-anchor="middle" font-size="8" font-weight="700" fill="#fff"
          :opacity="i > currentStroke ? 0.2 : 1"
          style="font-family: sans-serif"
        >{{ i + 1 }}</text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.sa {
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Static SVG display */
.sa__static { width: 100%; height: 100%; }
.sa__static :deep(svg) { width: 100%; height: 100%; }
.sa__static :deep(.jamo) { fill: var(--color-text); opacity: 0.85; }
.sa__static :deep(.stroke-number path) { fill: var(--color-course, var(--color-primary)); }
.sa__static :deep(.order-arrow) { fill: var(--color-course, var(--color-primary)); opacity: 0.7; }

/* Animation SVG */
.sa__anim { width: 100%; height: 100%; }

/* Fallback */
.sa__fallback {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  background: var(--color-bg-muted); border-radius: var(--radius-xl);
  overflow: hidden;
}
.sa__fallback span {
  font-family: var(--font-cjk-kr);
  /* Cap at the container's height so a multi-char fallback can never burst
     out of the parent (e.g. a syllable id like "syl-giyeok-a"). */
  font-size: clamp(2rem, 60%, 8rem);
  font-weight: 600; color: var(--color-text); opacity: 0.85;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 var(--space-2);
}
</style>
