import { ref, computed } from 'vue'
import { HANGEUL_CHARS, type IHangeulChar } from './useHangeul'

export type QuizMode = 'recognition' | 'writing'

// recognition: show symbol → pick romanization
// writing:     show romanization → pick symbol

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildOptions(correct: IHangeulChar, all: IHangeulChar[], count = 4): IHangeulChar[] {
  const pool = all.filter((c) => c.id !== correct.id)
  const distractors = shuffle(pool).slice(0, count - 1)
  return shuffle([correct, ...distractors])
}

export function useQuiz(mode: QuizMode) {
  const chars = HANGEUL_CHARS
  const questions = shuffle(chars)

  const currentIndex = ref(0)
  const selected = ref<string | null>(null)
  const score = ref(0)
  const finished = ref(false)

  const current = computed(() => questions[currentIndex.value])
  const options = computed(() => buildOptions(current.value, chars))

  const isCorrect = computed(() =>
    selected.value !== null && selected.value === current.value.id
  )

  function select(id: string) {
    if (selected.value !== null) return
    selected.value = id
    if (id === current.value.id) score.value++
  }

  function next() {
    if (currentIndex.value < questions.length - 1) {
      currentIndex.value++
      selected.value = null
    } else {
      finished.value = true
    }
  }

  function restart() {
    currentIndex.value = 0
    selected.value = null
    score.value = 0
    finished.value = false
    // re-shuffle in place
    questions.splice(0, questions.length, ...shuffle(chars))
  }

  return {
    mode,
    current,
    options,
    currentIndex,
    total: questions.length,
    selected,
    isCorrect,
    score,
    finished,
    select,
    next,
    restart,
  }
}
