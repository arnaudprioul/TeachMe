import { ref, computed } from 'vue'
import { HANGEUL_CHARS, type IHangeulChar } from './useHangeul'

// ── Types ──

export type TrainingMode = 'smart' | 'custom'
export type Difficulty = 'easy' | 'hard' | 'auto'
export type QuestionType = 'recognition' | 'writing' | 'both'
export type HardInputMethod = 'keyboard' | 'drawing'

export interface ITrainingItem {
  id: string
  symbol: string       // 'ㄱ' or '가'
  romanization: string // 'g' or 'ga'
  type: 'jamo' | 'syllable'
  // For jamo only:
  jamoType?: 'consonant' | 'vowel'
  jamoSubtype?: 'basic' | 'double' | 'compound'
}

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
  includeSyllables: boolean
}

export interface IQuestionResult {
  itemId: string
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
  item: ITrainingItem
  type: 'recognition' | 'writing'
  options: ITrainingItem[]
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
    includeSyllables: true,
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

function pickRandom<T>(arr: T[], count: number, excludeId: string): T[] {
  const filtered = arr.filter((x: any) => x.id !== excludeId)
  return shuffle(filtered).slice(0, count)
}

// Korean syllable composition: only valid initial consonants and medial vowels
// Choseong (initial) Unicode order
const CHOSEONG: Array<{ id: string; rom: string }> = [
  { id: 'giyeok', rom: 'g' },        { id: 'ssang-giyeok', rom: 'kk' },
  { id: 'nieun', rom: 'n' },         { id: 'digeut', rom: 'd' },
  { id: 'ssang-digeut', rom: 'tt' }, { id: 'rieul', rom: 'r' },
  { id: 'mieum', rom: 'm' },         { id: 'bieup', rom: 'b' },
  { id: 'ssang-bieup', rom: 'pp' },  { id: 'siot', rom: 's' },
  { id: 'ssang-siot', rom: 'ss' },   { id: 'ieung', rom: '' },
  { id: 'jieut', rom: 'j' },         { id: 'ssang-jieut', rom: 'jj' },
  { id: 'chieut', rom: 'ch' },       { id: 'kieuk', rom: 'k' },
  { id: 'tieut', rom: 't' },         { id: 'pieup', rom: 'p' },
  { id: 'hieut', rom: 'h' },
]

// Jungseong (medial) Unicode order
const JUNGSEONG: Array<{ id: string; rom: string }> = [
  { id: 'a', rom: 'a' },     { id: 'ae', rom: 'ae' },
  { id: 'ya', rom: 'ya' },   { id: 'yae', rom: 'yae' },
  { id: 'eo', rom: 'eo' },   { id: 'e', rom: 'e' },
  { id: 'yeo', rom: 'yeo' }, { id: 'ye', rom: 'ye' },
  { id: 'o', rom: 'o' },     { id: 'wa', rom: 'wa' },
  { id: 'wae', rom: 'wae' }, { id: 'oe', rom: 'oe' },
  { id: 'yo', rom: 'yo' },   { id: 'u', rom: 'u' },
  { id: 'wo', rom: 'wo' },   { id: 'we', rom: 'we' },
  { id: 'wi', rom: 'wi' },   { id: 'yu', rom: 'yu' },
  { id: 'eu', rom: 'eu' },   { id: 'ui', rom: 'ui' },
  { id: 'i', rom: 'i' },
]

function buildSyllable(ci: number, vi: number): ITrainingItem {
  const code = 0xAC00 + ci * 588 + vi * 28
  const c = CHOSEONG[ci]
  const v = JUNGSEONG[vi]
  return {
    id: `syl-${c.id}-${v.id}`,
    symbol: String.fromCharCode(code),
    romanization: c.rom + v.rom,
    type: 'syllable',
  }
}

function jamoToItem(c: IHangeulChar): ITrainingItem {
  return {
    id: c.id,
    symbol: c.symbol,
    romanization: c.romanization,
    type: 'jamo',
    jamoType: c.type,
    jamoSubtype: c.subtype,
  }
}

// ── Composable ──

export function useTraining() {
  const config = ref<ITrainingConfig>(defaultConfig())
  const session = ref<ITrainingSession | null>(null)
  const streak = ref(0)
  const bestStreak = ref(0)

  // Build the pool of training items based on config
  const pool = computed<ITrainingItem[]>(() => {
    const c = config.value
    const items: ITrainingItem[] = []

    // Add jamo
    for (const ch of HANGEUL_CHARS) {
      if (ch.type === 'consonant' && ch.subtype === 'basic' && !c.includeBasicConsonants) continue
      if (ch.type === 'consonant' && ch.subtype === 'double' && !c.includeDoubleConsonants) continue
      if (ch.type === 'vowel' && ch.subtype === 'basic' && !c.includeBasicVowels) continue
      if (ch.type === 'vowel' && ch.subtype === 'compound' && !c.includeCompoundVowels) continue
      items.push(jamoToItem(ch))
    }

    // Add syllables (CV combinations) — built from selected consonants × vowels
    if (c.includeSyllables) {
      const consonantIds = new Set<string>()
      const vowelIds = new Set<string>()

      if (c.includeBasicConsonants || c.includeDoubleConsonants) {
        for (const ch of HANGEUL_CHARS) {
          if (ch.type !== 'consonant') continue
          if (ch.subtype === 'basic' && !c.includeBasicConsonants) continue
          if (ch.subtype === 'double' && !c.includeDoubleConsonants) continue
          consonantIds.add(ch.id)
        }
      } else {
        // If no consonants selected, syllables can't be built without ㅇ — use ieung
        consonantIds.add('ieung')
      }

      for (const ch of HANGEUL_CHARS) {
        if (ch.type !== 'vowel') continue
        if (ch.subtype === 'basic' && !c.includeBasicVowels) continue
        if (ch.subtype === 'compound' && !c.includeCompoundVowels) continue
        vowelIds.add(ch.id)
      }

      CHOSEONG.forEach((cs, ci) => {
        if (!consonantIds.has(cs.id)) return
        JUNGSEONG.forEach((vs, vi) => {
          if (!vowelIds.has(vs.id)) return
          items.push(buildSyllable(ci, vi))
        })
      })
    }

    return items
  })

  const poolCount = computed(() => pool.value.length)

  function generateQuestions(): ITrainingQuestion[] {
    const items = shuffle(pool.value)
    const limit = Math.min(config.value.questionLimit, items.length)
    const selected = items.slice(0, limit)
    const allItems = pool.value

    return selected.map(item => {
      let type: 'recognition' | 'writing'
      if (config.value.questionType === 'both') {
        type = Math.random() > 0.5 ? 'recognition' : 'writing'
      } else {
        type = config.value.questionType
      }

      const distractors = pickRandom(allItems, 3, item.id)
      const options = shuffle([item, ...distractors])

      return { item, type, options }
    })
  }

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

  function answer(itemId: string) {
    if (!session.value || !currentQuestion.value) return
    const correct = itemId === currentQuestion.value.item.id
    session.value.results.push({
      itemId: currentQuestion.value.item.id,
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

  function answerText(text: string) {
    if (!currentQuestion.value) return false
    const expected = currentQuestion.value.item.romanization.split(' / ')[0].trim().toLowerCase()
    const correct = text.trim().toLowerCase() === expected

    if (session.value) {
      session.value.results.push({
        itemId: currentQuestion.value.item.id,
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

  function skip() {
    if (!session.value || !currentQuestion.value) return
    session.value.results.push({
      itemId: currentQuestion.value.item.id,
      correct: false,
      type: currentQuestion.value.type,
      answeredAt: Date.now(),
    })
    streak.value = 0
  }

  function overrideLastResult(correct: boolean) {
    if (!session.value || session.value.results.length === 0) return
    const last = session.value.results[session.value.results.length - 1]
    const wasCorrect = last.correct
    last.correct = correct

    if (correct && !wasCorrect) {
      streak.value++
      if (streak.value > bestStreak.value) bestStreak.value = streak.value
    } else if (!correct && wasCorrect) {
      streak.value = 0
    }
  }

  function next() {
    if (!session.value) return
    if (session.value.currentIndex < session.value.questions.length - 1) {
      session.value.currentIndex++
    } else {
      session.value.finishedAt = Date.now()
    }
  }

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
