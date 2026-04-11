<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCourseContext } from '~/composables/useCourseContext'

const props = withDefaults(
  defineProps<{
    charId: string
    /**
     * When true, the SVG character guide and its toggle are completely
     * hidden so the learner has to draw the character from memory
     * (used by the training quiz). Defaults to false (practice mode).
     */
    quizMode?: boolean
  }>(),
  { quizMode: false },
)
const { t } = useI18n()
const { courseKey, tKey } = useCourseContext()

// Load SVG guide overlay (across all courses)
const svgModules = import.meta.glob('~/assets/images/courses/*/strokes/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

const svgGuide = computed(() => {
  const key = courseKey.value
  for (const [path, raw] of Object.entries(svgModules)) {
    if (!path.includes(`/courses/${key}/strokes/`)) continue
    const id = (path.split('/').pop() ?? '').replace('.svg', '').replace(/^\d+_/, '')
    if (id === props.charId) return raw
  }
  return ''
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
// In quiz mode the guide must stay off and the toggle is hidden so the
// learner can't reveal the answer.
const showGuide = ref(!props.quizMode)
const showCenterGrid = ref(true)
const show3x3Grid = ref(true)
const showDiagonals = ref(false)
const showMargin = ref(true)

const isDrawing = ref(false)
const strokes = ref<{ x: number; y: number }[][]>([])

let ctx: CanvasRenderingContext2D | null = null
let size = 0
let dpr = 1

function init() {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')
  resize()
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas || !ctx) return
  const rect = canvas.getBoundingClientRect()
  dpr = window.devicePixelRatio || 1
  size = rect.width
  canvas.width = size * dpr
  canvas.height = size * dpr
  ctx.scale(dpr, dpr)
  redraw()
}

function redraw() {
  if (!ctx) return
  ctx.clearRect(0, 0, size, size)
  drawGrids()
  for (const stroke of strokes.value) drawStroke(stroke)
}

function drawGrids() {
  if (!ctx) return
  const s = size

  if (showMargin.value) {
    const m = s * 0.08
    ctx.strokeStyle = '#d4d4d8'
    ctx.lineWidth = 1
    ctx.strokeRect(m, m, s - m * 2, s - m * 2)
  }

  if (showCenterGrid.value) {
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(150,150,160,0.2)'
    ctx.lineWidth = 1
    ctx.setLineDash([6, 4])
    ctx.moveTo(s / 2, 0); ctx.lineTo(s / 2, s)
    ctx.moveTo(0, s / 2); ctx.lineTo(s, s / 2)
    ctx.stroke()
    ctx.setLineDash([])
  }

  if (show3x3Grid.value) {
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(150,150,160,0.12)'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    for (let i = 1; i < 3; i++) {
      ctx.moveTo(s * i / 3, 0); ctx.lineTo(s * i / 3, s)
      ctx.moveTo(0, s * i / 3); ctx.lineTo(s, s * i / 3)
    }
    ctx.stroke()
    ctx.setLineDash([])
  }

  if (showDiagonals.value) {
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(150,150,160,0.1)'
    ctx.lineWidth = 1
    ctx.setLineDash([6, 4])
    ctx.moveTo(0, 0); ctx.lineTo(s, s)
    ctx.moveTo(s, 0); ctx.lineTo(0, s)
    ctx.stroke()
    ctx.setLineDash([])
  }
}

function drawStroke(points: { x: number; y: number }[]) {
  if (!ctx || points.length < 2) return
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y)
  ctx.strokeStyle = '#18181b'
  ctx.lineWidth = 5
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.stroke()
}

function getPoint(e: PointerEvent) {
  const rect = canvasRef.value!.getBoundingClientRect()
  return { x: e.clientX - rect.left, y: e.clientY - rect.top }
}

function onPointerDown(e: PointerEvent) {
  e.preventDefault()
  isDrawing.value = true
  strokes.value.push([getPoint(e)])
  canvasRef.value?.setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!isDrawing.value) return
  e.preventDefault()
  const pt = getPoint(e)
  const cur = strokes.value[strokes.value.length - 1]
  cur.push(pt)
  redraw()
}

function onPointerUp(e: PointerEvent) {
  isDrawing.value = false
  canvasRef.value?.releasePointerCapture(e.pointerId)
}

function clear() {
  strokes.value = []
  redraw()
}

watch([showGuide, showCenterGrid, show3x3Grid, showDiagonals, showMargin], redraw)
watch(() => props.charId, () => { strokes.value = []; nextTick(redraw) })

onMounted(() => { init(); window.addEventListener('resize', resize) })
onUnmounted(() => { window.removeEventListener('resize', resize) })

// Exposed so the parent (training quiz) can read the user's drawn strokes
// and current canvas size to feed them to the geometric verifier.
//
// We deliberately use explicit getter functions instead of exposing the
// ref directly: defineExpose() goes through Vue's expose proxy which auto-
// unwraps refs *most* of the time, but the behaviour is fragile across
// versions and inconsistent when the parent typing is `any`. Function
// returns are unambiguous.
defineExpose({
  getStrokes: () => strokes.value,
  getCanvasSize: () => size,
  clear,
})
</script>

<template>
  <div class="wc">
    <!-- Canvas area with SVG guide underneath -->
    <div class="wc__area">
      <div class="wc__stack">
        <!-- SVG guide layer (below canvas) — never rendered in quiz mode -->
        <div
          v-if="!quizMode && showGuide && svgGuide"
          class="wc__guide"
          v-html="svgGuide"
        />

        <!-- Drawing canvas (on top, transparent bg) -->
        <canvas
          ref="canvasRef"
          class="wc__canvas"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointerleave="onPointerUp"
        />
      </div>
    </div>

    <!-- Character guide toggle (hidden in quiz mode so the answer can't be revealed) -->
    <button v-if="!quizMode" class="wc__toggle" :class="{ 'wc__toggle--on': showGuide }" @click="showGuide = !showGuide">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <template v-if="showGuide"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></template>
        <template v-else><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></template>
      </svg>
      {{ t(tKey('practice.guidedMode')) }}
    </button>

    <!-- Guides visibility -->
    <div class="wc__guides">
      <span class="wc__guides-label">{{ t(tKey('practice.guidesVisibility')) }}</span>
      <div class="wc__guide-btns">
        <button class="wc__gbtn" :class="{ 'wc__gbtn--on': showCenterGrid }" @click="showCenterGrid = !showCenterGrid">
          <svg width="16" height="16" viewBox="0 0 16 16"><line x1="8" y1="0" x2="8" y2="16" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 2"/><line x1="0" y1="8" x2="16" y2="8" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 2"/></svg>
          <span>Center</span>
        </button>
        <button class="wc__gbtn" :class="{ 'wc__gbtn--on': show3x3Grid }" @click="show3x3Grid = !show3x3Grid">
          <svg width="16" height="16" viewBox="0 0 16 16"><line x1="5.3" y1="0" x2="5.3" y2="16" stroke="currentColor" stroke-width="1"/><line x1="10.6" y1="0" x2="10.6" y2="16" stroke="currentColor" stroke-width="1"/><line x1="0" y1="5.3" x2="16" y2="5.3" stroke="currentColor" stroke-width="1"/><line x1="0" y1="10.6" x2="16" y2="10.6" stroke="currentColor" stroke-width="1"/></svg>
          <span>3×3</span>
        </button>
        <button class="wc__gbtn" :class="{ 'wc__gbtn--on': showDiagonals }" @click="showDiagonals = !showDiagonals">
          <svg width="16" height="16" viewBox="0 0 16 16"><line x1="0" y1="0" x2="16" y2="16" stroke="currentColor" stroke-width="1"/><line x1="16" y1="0" x2="0" y2="16" stroke="currentColor" stroke-width="1"/></svg>
          <span>Diag.</span>
        </button>
        <button class="wc__gbtn" :class="{ 'wc__gbtn--on': showMargin }" @click="showMargin = !showMargin">
          <svg width="16" height="16" viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
          <span>Margin</span>
        </button>
      </div>
    </div>

    <!-- Clear -->
    <div class="wc__bottom">
      <button class="wc__clear" @click="clear">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
        {{ t(tKey('practice.clearCanvas')) }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.wc {
  display: flex; flex-direction: column; gap: var(--space-4);
  flex: 1;
}

.wc__area {
  display: flex; justify-content: center; padding: 0 var(--space-4);
}

.wc__stack {
  position: relative;
  width: 100%;
  max-width: 480px;
  aspect-ratio: 1;
}

/* SVG guide underneath */
.wc__guide {
  position: absolute; inset: 0;
  opacity: 0.12;
  pointer-events: none;
}

.wc__guide :deep(svg) { width: 100%; height: 100%; }
.wc__guide :deep(.jamo) { fill: var(--color-text); }
.wc__guide :deep(.stroke-number) { display: none; }
.wc__guide :deep(.order-arrow) { display: none; }

/* Canvas on top */
.wc__canvas {
  position: absolute; inset: 0;
  width: 100%;
  height: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: transparent;
  cursor: crosshair;
  touch-action: none;
}

/* Character guide toggle */
.wc__toggle {
  display: flex; align-items: center; gap: var(--space-2);
  margin: 0 var(--space-4); padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg); border: 1px solid var(--color-border);
  background: var(--color-bg-surface); color: var(--color-text-muted);
  font-size: var(--text-sm); font-weight: 500; cursor: pointer;
  transition: all 150ms;
}
.wc__toggle--on { color: var(--color-primary); border-color: var(--color-primary); background: var(--color-primary-subtle); }

/* Guides section */
.wc__guides {
  display: flex; flex-direction: column; gap: var(--space-2);
  margin: 0 var(--space-4);
}
.wc__guides-label {
  font-size: var(--text-xs); font-weight: 600; color: var(--color-text-muted);
  text-transform: uppercase; letter-spacing: 0.05em;
}
.wc__guide-btns { display: flex; gap: var(--space-2); }
.wc__gbtn {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: var(--space-1);
  padding: var(--space-3) var(--space-2);
  border-radius: var(--radius-lg); border: 1px solid var(--color-border);
  background: var(--color-bg-surface); color: var(--color-text-subtle);
  font-size: 0.65rem; font-weight: 500; cursor: pointer;
  transition: all 150ms;
}
.wc__gbtn--on { color: var(--color-primary); border-color: var(--color-primary); background: var(--color-primary-subtle); }

/* Clear */
.wc__bottom { display: flex; justify-content: flex-end; padding: 0 var(--space-4); }
.wc__clear {
  display: flex; align-items: center; gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-lg); border: none;
  background: transparent; color: var(--color-text-muted);
  font-size: var(--text-sm); font-weight: 500; cursor: pointer;
}
.wc__clear:hover { color: var(--color-error); }
</style>
