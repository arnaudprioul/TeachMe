import { ref, computed, watch } from 'vue'
import { HANGEUL_CHARS, type IHangeulChar } from './useHangeul'

// ── Types ──

export type TrainingMode = 'smart' | 'custom'
export type Difficulty = 'easy' | 'hard' | 'auto'
export type QuestionType = 'recognition' | 'writing' | 'both'
export type HardInputMethod = 'keyboard' | 'drawing'

export interface ITrainingConfig {
  mode: TrainingMode
  difficulty: Difficulty
  questionType: QuestionType
  questionLimit: number
  autoSound: boolean
  // Custom mode filters
  includeBasicConsonants: boolean
  includeDoubleConsonants: boolean
  includeBasicVowels: boolean
  includeCompoundVowels: boolean
}

export interface IQuestionResult {
  charId: string
  correct: boolean
  type: 'recognition' | 'writing'
  answeredAt: number
}

export interface ITrainingSession {
  config: ITrainingConfig
  questions: ITrainingQuestion[]
  results: IQuestionResult[]
  currentIndex: number
  startedAt: number
  finishedAt: number | null
}

export interface ITrainingQuestion {
  char: IHangeulChar
  type: 'recognition' | 'writing'
  options: IHangeulChar[] // 4 choices for easy mode
}

// ── Default config ──

function defaultConfig(): ITrainingConfig {
  return {
    mode: 'smart',
    difficulty: 'easy',
    questionType: 'both',
    questionLimit: 20,
    autoSound: true,
    includeBasicConsonants: true,
    includeDoubleConsonants: true,
    includeBasicVowels: true,
    includeCompoundVowels: true,
  }
}

// ── Helpers ──

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickRandom<T>(arr: T[], count: number, exclude?: T): T[] {
  const filtered = exclude ? arr.filter(x => x !== exclude) : [...arr]
  return shuffle(filtered).slice(0, count)
}

// ── Composable ──

export function useTraining() {
  const config = ref<ITrainingConfig>(defaultConfig())
  const session = ref<ITrainingSession | null>(null)
  const streak = ref(0)
  const bestStreak = ref(0)

  // Filtered character pool based on config
  const pool = computed(() => {
    const c = config.value
    return HANGEUL_CHARS.filter(ch => {
      if (ch.type === 'consonant' && ch.subtype === 'basic' && !c.includeBasicConsonants) return false
      if (ch.type === 'consonant' && ch.subtype === 'double' && !c.includeDoubleConsonants) return false
      if (ch.type === 'vowel' && ch.subtype === 'basic' && !c.includeBasicVowels) return false
      if (ch.type === 'vowel' && (ch.subtype === 'compound') && !c.includeCompoundVowels) return false
      return true
    })
  })

  const poolCount = computed(() => pool.value.length)

  // Generate questions
  function generateQuestions(): ITrainingQuestion[] {
    const chars = shuffle(pool.value)
    const limit = Math.min(config.value.questionLimit, chars.length)
    const selected = chars.slice(0, limit)
    const allChars = pool.value

    return selected.map(char => {
      // Determine question type
      let type: 'recognition' | 'writing'
      if (config.value.questionType === 'both') {
        type = Math.random() > 0.5 ? 'recognition' : 'writing'
      } else {
        type = config.value.questionType
      }

      // Generate 4 options (including correct)
      const distractors = pickRandom(allChars, 3, char)
      const options = shuffle([char, ...distractors])

      return { char, type, options }
    })
  }

  // Start session
  function start() {
    const questions = generateQuestions()
    session.value = {
      config: { ...config.value },
      questions,
      results: [],
      currentIndex: 0,
      startedAt: Date.now(),
      finishedAt: null,
    }
    streak.value = 0
    bestStreak.value = 0
  }

  // Current question
  const currentQuestion = computed(() => {
    if (!session.value) return null
    return session.value.questions[session.value.currentIndex] ?? null
  })

  const progress = computed(() => {
    if (!session.value) return { current: 0, total: 0 }
    return {
      current: session.value.currentIndex + 1,
      total: session.value.questions.length,
    }
  })

  const isFinished = computed(() => {
    if (!session.value) return false
    return session.value.finishedAt !== null
  })

  const score = computed(() => {
    if (!session.value) return { correct: 0, total: 0, percentage: 0 }
    const correct = session.value.results.filter(r => r.correct).length
    const total = session.value.results.length
    return {
      correct,
      total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
    }
  })

  // Answer current question
  function answer(charId: string) {
    if (!session.value || !currentQuestion.value) return

    const correct = charId === currentQuestion.value.char.id
    session.value.results.push({
      charId: currentQuestion.value.char.id,
      correct,
      type: currentQuestion.value.type,
      answeredAt: Date.now(),
    })

    if (correct) {
      streak.value++
      if (streak.value > bestStreak.value) bestStreak.value = streak.value
    } else {
      streak.value = 0
    }

    return correct
  }

  // Answer for keyboard mode (type romanization)
  function answerText(text: string) {
    if (!currentQuestion.value) return false
    const correct = text.trim().toLowerCase() === currentQuestion.value.char.romanization.split(' / ')[0].trim().toLowerCase()

    if (session.value) {
      session.value.results.push({
        charId: currentQuestion.value.char.id,
        correct,
        type: currentQuestion.value.type,
        answeredAt: Date.now(),
      })
    }

    if (correct) {
      streak.value++
      if (streak.value > bestStreak.value) bestStreak.value = streak.value
    } else {
      streak.value = 0
    }

    return correct
  }

  // Skip question (counts as wrong)
  function skip() {
    if (!session.value || !currentQuestion.value) return
    session.value.results.push({
      charId: currentQuestion.value.char.id,
      correct: false,
      type: currentQuestion.value.type,
      answeredAt: Date.now(),
    })
    streak.value = 0
  }

  // Override last result
  function overrideLastResult(correct: boolean) {
    if (!session.value || session.value.results.length === 0) return
    const last = session.value.results[session.value.results.length - 1]
    const wasCorrect = last.correct
    last.correct = correct

    // Recalculate streak
    if (correct && !wasCorrect) {
      streak.value++
      if (streak.value > bestStreak.value) bestStreak.value = streak.value
    } else if (!correct && wasCorrect) {
      streak.value = 0
    }
  }

  // Move to next question
  function next() {
    if (!session.value) return
    if (session.value.currentIndex < session.value.questions.length - 1) {
      session.value.currentIndex++
    } else {
      session.value.finishedAt = Date.now()
    }
  }

  // Reset
  function reset() {
    session.value = null
    streak.value = 0
    bestStreak.value = 0
  }

  return {
    config,
    session,
    pool,
    poolCount,
    currentQuestion,
    progress,
    isFinished,
    score,
    streak,
    bestStreak,
    start,
    answer,
    answerText,
    skip,
    overrideLastResult,
    next,
    reset,
  }
}
