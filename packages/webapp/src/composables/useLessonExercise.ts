import { ref, computed } from 'vue'
import type { ILessonExercise, TExerciseDifficulty } from './data/courses/lesson-types'
import { LESSON_EXERCISE_TYPE } from './data/courses/lesson-types'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export interface IExerciseResult {
  exerciseId: string
  correct: boolean
  answeredAt: number
}

export interface IExerciseSession {
  lessonId: number
  difficulty: TExerciseDifficulty
  exercises: ILessonExercise[]
  results: IExerciseResult[]
  currentIndex: number
  startedAt: number
  finishedAt: number | null
}

export function createLessonExercise() {
  const session = ref<IExerciseSession | null>(null)

  function start(lessonId: number, exercises: ILessonExercise[], difficulty: TExerciseDifficulty) {
    const filtered = exercises.filter(e => e.difficulty === difficulty)
    session.value = {
      lessonId,
      difficulty,
      exercises: shuffle(filtered),
      results: [],
      currentIndex: 0,
      startedAt: Date.now(),
      finishedAt: null,
    }
  }

  const currentExercise = computed(() => {
    if (!session.value) return null
    return session.value.exercises[session.value.currentIndex] ?? null
  })

  const progress = computed(() => {
    if (!session.value) return { current: 0, total: 0, percentage: 0 }
    const total = session.value.exercises.length
    const current = session.value.currentIndex + 1
    return { current, total, percentage: Math.round((current / total) * 100) }
  })

  const isFinished = computed(() => session.value?.finishedAt !== null)

  const score = computed(() => {
    if (!session.value) return { correct: 0, total: 0, percentage: 0 }
    const total = session.value.results.length
    const correct = session.value.results.filter(r => r.correct).length
    return { correct, total, percentage: total > 0 ? Math.round((correct / total) * 100) : 0 }
  })

  function answerQcm(optionIndex: number): boolean {
    const ex = currentExercise.value
    if (!ex || !session.value || ex.type !== LESSON_EXERCISE_TYPE.QCM) return false
    const correct = ex.options?.[optionIndex]?.correct === true
    session.value.results.push({ exerciseId: ex.id, correct, answeredAt: Date.now() })
    return correct
  }

  function answerFillBlank(text: string): boolean {
    const ex = currentExercise.value
    if (!ex || !session.value || ex.type !== LESSON_EXERCISE_TYPE.FILL_BLANK) return false
    const input = text.trim().toLowerCase()
    const accepted = [ex.answer!, ...(ex.acceptedAnswers ?? [])].map(a => a.toLowerCase())
    const correct = accepted.includes(input)
    session.value.results.push({ exerciseId: ex.id, correct, answeredAt: Date.now() })
    return correct
  }

  function answerReorder(ordered: string[]): boolean {
    const ex = currentExercise.value
    if (!ex || !session.value || ex.type !== LESSON_EXERCISE_TYPE.REORDER) return false
    const correct = JSON.stringify(ordered) === JSON.stringify(ex.correctOrder)
    session.value.results.push({ exerciseId: ex.id, correct, answeredAt: Date.now() })
    return correct
  }

  function answerTranslate(text: string): boolean {
    const ex = currentExercise.value
    if (!ex || !session.value || ex.type !== LESSON_EXERCISE_TYPE.TRANSLATE) return false
    const input = text.trim().toLowerCase().replace(/[.!?,]/g, '')
    const accepted = [ex.targetAnswer!, ...(ex.acceptedAnswers ?? [])].map(a => a.toLowerCase().replace(/[.!?,]/g, ''))
    const correct = accepted.includes(input)
    session.value.results.push({ exerciseId: ex.id, correct, answeredAt: Date.now() })
    return correct
  }

  function skip() {
    const ex = currentExercise.value
    if (!ex || !session.value) return
    session.value.results.push({ exerciseId: ex.id, correct: false, answeredAt: Date.now() })
  }

  function next() {
    if (!session.value) return
    const nextIdx = session.value.currentIndex + 1
    if (nextIdx >= session.value.exercises.length) {
      session.value.finishedAt = Date.now()
    } else {
      session.value.currentIndex = nextIdx
    }
  }

  function reset() {
    session.value = null
  }

  return {
    session,
    currentExercise,
    progress,
    isFinished,
    score,
    start,
    answerQcm,
    answerFillBlank,
    answerReorder,
    answerTranslate,
    skip,
    next,
    reset,
  }
}
