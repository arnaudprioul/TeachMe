import { ref, computed, watch, type Ref } from 'vue'
import { HANGEUL_STROKES, type ICharStrokes } from './data/hangeulStrokes'

export function useHangeulStrokes(charId: Ref<string>) {
  const strokeData = computed<ICharStrokes | undefined>(
    () => HANGEUL_STROKES[charId.value],
  )

  const currentStrokeIndex = ref(-1)
  const isAnimating = ref(false)
  let animationFrame = 0
  let timeouts: ReturnType<typeof setTimeout>[] = []

  const totalStrokes = computed(() => strokeData.value?.strokes.length ?? 0)

  function playAnimation(durationPerStroke = 600) {
    stopAnimation()
    if (!strokeData.value) return

    isAnimating.value = true
    currentStrokeIndex.value = -1

    const count = strokeData.value.strokes.length
    for (let i = 0; i < count; i++) {
      const t = setTimeout(() => {
        currentStrokeIndex.value = i
      }, i * durationPerStroke)
      timeouts.push(t)
    }

    const endT = setTimeout(() => {
      isAnimating.value = false
    }, count * durationPerStroke + 200)
    timeouts.push(endT)
  }

  function stopAnimation() {
    for (const t of timeouts) clearTimeout(t)
    timeouts = []
    if (animationFrame) cancelAnimationFrame(animationFrame)
    isAnimating.value = false
    currentStrokeIndex.value = -1
  }

  watch(charId, () => {
    stopAnimation()
  })

  return {
    strokeData,
    totalStrokes,
    currentStrokeIndex,
    isAnimating,
    playAnimation,
    stopAnimation,
  }
}
