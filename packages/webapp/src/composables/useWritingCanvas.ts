import { ref, onMounted, onUnmounted, type Ref } from 'vue'

interface IPoint { x: number; y: number }

export function useWritingCanvas(
  canvasRef: Ref<HTMLCanvasElement | null>,
  options: { guideSymbol?: Ref<string>; guideFont?: string } = {},
) {
  const isDrawing = ref(false)
  const showGuide = ref(true)
  const strokes = ref<IPoint[][]>([])
  const lineWidth = 6
  const lineColor = '#18181b'

  let ctx: CanvasRenderingContext2D | null = null
  let rect: DOMRect | null = null

  function init() {
    const canvas = canvasRef.value
    if (!canvas) return
    ctx = canvas.getContext('2d')
    resize()
  }

  function resize() {
    const canvas = canvasRef.value
    if (!canvas || !ctx) return
    const dpr = window.devicePixelRatio || 1
    rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    redraw()
  }

  function getPoint(e: PointerEvent): IPoint {
    if (!rect) rect = canvasRef.value!.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function drawGuide() {
    if (!ctx || !rect || !showGuide.value) return
    const symbol = options.guideSymbol?.value
    if (!symbol) return
    ctx.save()
    ctx.fillStyle = 'rgba(0, 0, 0, 0.06)'
    ctx.font = `${rect.width * 0.7}px ${options.guideFont || 'sans-serif'}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(symbol, rect.width / 2, rect.height / 2)
    ctx.restore()
  }

  function drawStroke(points: IPoint[]) {
    if (!ctx || points.length < 2) return
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y)
    }
    ctx.strokeStyle = lineColor
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
  }

  function redraw() {
    if (!ctx || !rect) return
    ctx.clearRect(0, 0, rect.width, rect.height)
    drawGuide()
    for (const stroke of strokes.value) {
      drawStroke(stroke)
    }
  }

  function onPointerDown(e: PointerEvent) {
    e.preventDefault()
    isDrawing.value = true
    const pt = getPoint(e)
    strokes.value.push([pt])
    canvasRef.value?.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: PointerEvent) {
    if (!isDrawing.value) return
    e.preventDefault()
    const pt = getPoint(e)
    const current = strokes.value[strokes.value.length - 1]
    current.push(pt)
    drawStroke(current)
  }

  function onPointerUp(e: PointerEvent) {
    isDrawing.value = false
    canvasRef.value?.releasePointerCapture(e.pointerId)
  }

  function clear() {
    strokes.value = []
    redraw()
  }

  function undo() {
    strokes.value.pop()
    redraw()
  }

  function toggleGuide() {
    showGuide.value = !showGuide.value
    redraw()
  }

  onMounted(() => {
    init()
    window.addEventListener('resize', resize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', resize)
  })

  return {
    isDrawing,
    showGuide,
    strokes,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    clear,
    undo,
    toggleGuide,
    redraw,
  }
}
