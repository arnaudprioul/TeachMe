import { ref, computed } from 'vue'
import type { ILesson, ILessonWord, ILessonQuizQuestion, ILessonQuizResult, ILessonQuizSession } from './data/courses/lesson-types'
import { LESSON_QUIZ_TYPE } from './data/courses/lesson-types'

// ── Helpers ──

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickDistractors(target: ILessonWord, pool: ILessonWord[], count: number): ILessonWord[] {
  const others = pool.filter(w => w.id !== target.id)
  return shuffle(others).slice(0, count)
}

function buildOptions(target: ILessonWord, pool: ILessonWord[]): ILessonWord[] {
  const distractors = pickDistractors(target, pool, 3)
  return shuffle([target, ...distractors])
}

// ── Question generation ──

function generateQuestions(lesson: ILesson): ILessonQuizQuestion[] {
  const words = lesson.words
  if (words.length < 4) return []

  const types = [
    LESSON_QUIZ_TYPE.IMAGE_SELECT_WORD,
    LESSON_QUIZ_TYPE.IMAGE_TYPE_WORD,
    LESSON_QUIZ_TYPE.IMAGE_WORDS_SELECT,
  ]

  const questions: ILessonQuizQuestion[] = []

  // First pass: one question per word with a rotating type
  for (let i = 0; i < words.length; i++) {
    const type = types[i % types.length]
    const q: ILessonQuizQuestion = { type, word: words[i] }
    if (type !== LESSON_QUIZ_TYPE.IMAGE_TYPE_WORD) {
      q.options = buildOptions(words[i], words)
    }
    questions.push(q)
  }

  // Second pass: ~50% of words get a second question with a different type
  const secondPassWords = shuffle([...words]).slice(0, Math.ceil(words.length / 2))
  for (let i = 0; i < secondPassWords.length; i++) {
    const w = secondPassWords[i]
    // Pick a type different from the first-pass question for this word
    const firstIdx = words.indexOf(w)
    const firstType = types[firstIdx % types.length]
    const altTypes = types.filter(t => t !== firstType)
    const type = altTypes[i % altTypes.length]

    const q: ILessonQuizQuestion = { type, word: w }
    if (type !== LESSON_QUIZ_TYPE.IMAGE_TYPE_WORD) {
      q.options = buildOptions(w, words)
    }
    questions.push(q)
  }

  return shuffle(questions)
}

// ── Composable factory ──

export function createLessonQuiz() {
  const lesson = ref<ILesson | null>(null)
  const session = ref<ILessonQuizSession | null>(null)
  const streak = ref(0)
  const bestStreak = ref(0)

  function bind(l: ILesson) {
    lesson.value = l
    reset()
  }

  function start() {
    if (!lesson.value) return
    session.value = {
      lessonId: lesson.value.id,
      questions: generateQuestions(lesson.value),
      results: [],
      currentIndex: 0,
      startedAt: Date.now(),
      finishedAt: null,
    }
    streak.value = 0
    bestStreak.value = 0
  }

  const currentQuestion = computed(() => {
    if (!session.value) return null
    return session.value.questions[session.value.currentIndex] ?? null
  })

  const progress = computed(() => {
    if (!session.value) return { current: 0, total: 0, percentage: 0 }
    const total = session.value.questions.length
    const current = session.value.currentIndex + 1
    return { current, total, percentage: Math.round((current / total) * 100) }
  })

  const isFinished = computed(() => {
    if (!session.value) return false
    return session.value.finishedAt !== null
  })

  const score = computed(() => {
    if (!session.value) return { correct: 0, total: 0, percentage: 0 }
    const total = session.value.results.length
    const correct = session.value.results.filter(r => r.correct).length
    return {
      correct,
      total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
    }
  })

  function recordResult(wordId: string, correct: boolean) {
    if (!session.value) return
    session.value.results.push({ wordId, correct, answeredAt: Date.now() })
    if (correct) {
      streak.value++
      if (streak.value > bestStreak.value) bestStreak.value = streak.value
    } else {
      streak.value = 0
    }
  }

  function answerSelect(selectedWordId: string): boolean {
    const q = currentQuestion.value
    if (!q || !session.value) return false
    const correct = selectedWordId === q.word.id
    recordResult(q.word.id, correct)
    return correct
  }

  function answerText(text: string): boolean {
    const q = currentQuestion.value
    if (!q || !session.value) return false
    const input = text.trim().toLowerCase()
    const correct =
      input === q.word.word.toLowerCase() ||
      input === q.word.romanization.toLowerCase()
    recordResult(q.word.id, correct)
    return correct
  }

  function skip() {
    const q = currentQuestion.value
    if (!q || !session.value) return
    recordResult(q.word.id, false)
  }

  function next() {
    if (!session.value) return
    const nextIdx = session.value.currentIndex + 1
    if (nextIdx >= session.value.questions.length) {
      session.value.finishedAt = Date.now()
    } else {
      session.value.currentIndex = nextIdx
    }
  }

  function reset() {
    session.value = null
    streak.value = 0
    bestStreak.value = 0
  }

  return {
    lesson,
    session,
    streak,
    bestStreak,
    currentQuestion,
    progress,
    isFinished,
    score,
    bind,
    start,
    answerSelect,
    answerText,
    skip,
    next,
    reset,
  }
}
