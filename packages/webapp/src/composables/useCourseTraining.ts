import { ref, computed } from 'vue'
import type { ICourseModule, ICourseCharacter } from './data/courses/types'

// ── Types (re-exported for backward compatibility) ──

export type TrainingMode = 'smart' | 'custom'
export type Difficulty = 'easy' | 'hard' | 'auto'
export type QuestionType = 'recognition' | 'writing' | 'both'
export type HardInputMethod = 'keyboard' | 'drawing'

export interface ITrainingItem {
  id: string
  symbol: string
  romanization: string
  type: 'jamo' | 'syllable'
  jamoType?: 'consonant' | 'vowel' | string
  jamoSubtype?: 'basic' | 'double' | 'compound' | string
}

export interface ITrainingConfig {
  mode: TrainingMode
  difficulty: Difficulty
  questionType: QuestionType
  questionLimit: number
  autoSound: boolean
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

export interface ITrainingQuestion {
  item: ITrainingItem
  type: 'recognition' | 'writing'
  /**
   * How the question is *prompted* to the learner.
   * - 'visual': the symbol (recognition) or the romanization (writing) is
   *   shown on screen — historic default.
   * - 'audio':  no visual hint, the prompt is the spoken pronunciation
   *   only. Used in hard mode to add a third exercise variant
   *   ("retrouve le symbole à partir de la phonétique").
   */
  prompt: 'visual' | 'audio'
  options: ITrainingItem[]
}

export interface ITrainingSession {
  config: ITrainingConfig
  questions: ITrainingQuestion[]
  results: IQuestionResult[]
  currentIndex: number
  startedAt: number
  finishedAt: number | null
  courseKey: string
}

// ── Defaults / helpers ──

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

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Pick QCM distractors that are guaranteed to be visually distinct from
 * the target *and* from each other.
 *
 * Two pitfalls the simple "filter by id and slice" approach falls into:
 * 1. The jamo ㅡ (id=`eu`, rom=`eu`) and the syllable 으 (id=`syl-ieung-eu`,
 *    rom=`eu`) share the same romanization. A QCM showing both is
 *    unwinnable: the user can't tell which "eu" is the right one.
 * 2. Two different distractors might also share a display value (e.g.
 *    `ㅓ` and `ㅔ` both rendering as `eo` in some systems), creating the
 *    same ambiguity even if the target is unique.
 *
 * We dedupe on the *displayed* value, which is the romanization in
 * recognition mode and the symbol in writing mode.
 */
function pickDistractors(
  pool: ITrainingItem[],
  target: ITrainingItem,
  count: number,
  display: (i: ITrainingItem) => string,
): ITrainingItem[] {
  const targetDisplay = display(target)
  const seen = new Set<string>([targetDisplay])
  const out: ITrainingItem[] = []
  for (const candidate of shuffle(pool)) {
    if (out.length >= count) break
    if (candidate.id === target.id) continue
    const d = display(candidate)
    if (seen.has(d)) continue
    seen.add(d)
    out.push(candidate)
  }
  return out
}

function jamoToItem(c: ICourseCharacter): ITrainingItem {
  return {
    id: c.id,
    symbol: c.symbol,
    romanization: c.romanization,
    type: 'jamo',
    jamoType: c.type,
    jamoSubtype: c.subtype,
  }
}

/**
 * Build a training item for a vowel that always displays the **canonical
 * written form** of that vowel — i.e. the silent ieung syllable `ㅇ + vowel`.
 *
 * Bare vowels never appear in real Korean writing: a syllable that starts
 * with a vowel sound is always written `아 / 어 / 우 …` with the silent ㅇ
 * placeholder. Showing `ㅏ` or `ㅓ` alone in the quiz teaches the wrong
 * habit, so we wrap each vowel in its ieung syllable form for display.
 *
 * The `id` stays the bare vowel id (so SRS / stats keep tracking the
 * underlying vowel), the `romanization` stays the vowel sound (ieung is
 * silent → no extra letter), only `symbol` is replaced.
 *
 * Returns the wrapped item, or `null` if the module has no syllable
 * composer or no ieung initial — caller should fall back to the bare jamo.
 */
function vowelToIeungItem(c: ICourseCharacter, m: ICourseModule): ITrainingItem | null {
  if (!m.syllables) return null
  const ieungIdx = m.syllables.initials.findIndex(i => i.id === 'ieung')
  const vowelIdx = m.syllables.medials.findIndex(v => v.id === c.id)
  if (ieungIdx < 0 || vowelIdx < 0) return null
  const built = m.syllables.build(ieungIdx, vowelIdx)
  if (!built.id) return null
  return {
    id: c.id,                  // SRS keeps tracking the bare vowel
    symbol: built.symbol,      // 아 instead of ㅏ
    romanization: c.romanization,
    type: 'jamo',
    jamoType: c.type,
    jamoSubtype: c.subtype,
  }
}

// ── Factory ──

export function createCourseTraining() {
  const activeModule = ref<ICourseModule | null>(null)
  const config = ref<ITrainingConfig>(defaultConfig())
  const session = ref<ITrainingSession | null>(null)
  const streak = ref(0)
  const bestStreak = ref(0)

  /** Bind a course module. Resets session when course changes. */
  function bind(module: ICourseModule) {
    if (activeModule.value?.key !== module.key) {
      activeModule.value = module
      session.value = null
      streak.value = 0
      bestStreak.value = 0
      config.value = defaultConfig()
    }
  }

  // Pool of items based on the active module + config
  const pool = computed<ITrainingItem[]>(() => {
    const m = activeModule.value
    if (!m) return []
    const c = config.value
    const items: ITrainingItem[] = []

    for (const ch of m.characters) {
      if (ch.type === 'consonant' && ch.subtype === 'basic' && !c.includeBasicConsonants) continue
      if (ch.type === 'consonant' && ch.subtype === 'double' && !c.includeDoubleConsonants) continue
      if (ch.type === 'vowel' && ch.subtype === 'basic' && !c.includeBasicVowels) continue
      if (ch.type === 'vowel' && ch.subtype === 'compound' && !c.includeCompoundVowels) continue
      // Vowels are wrapped in their canonical `ㅇ + vowel` syllable form so
      // the quiz never shows a bare ㅏ / ㅓ / etc. — see vowelToIeungItem.
      const item = ch.type === 'vowel'
        ? (vowelToIeungItem(ch, m) ?? jamoToItem(ch))
        : jamoToItem(ch)
      items.push(item)
    }

    if (c.includeSyllables && m.syllables) {
      const consonantIds = new Set<string>()
      const vowelIds = new Set<string>()

      if (c.includeBasicConsonants || c.includeDoubleConsonants) {
        for (const ch of m.characters) {
          if (ch.type !== 'consonant') continue
          if (ch.subtype === 'basic' && !c.includeBasicConsonants) continue
          if (ch.subtype === 'double' && !c.includeDoubleConsonants) continue
          consonantIds.add(ch.id)
        }
      } else {
        // Need at least ieung as a placeholder for vowel-only syllables
        consonantIds.add('ieung')
      }

      for (const ch of m.characters) {
        if (ch.type !== 'vowel') continue
        if (ch.subtype === 'basic' && !c.includeBasicVowels) continue
        if (ch.subtype === 'compound' && !c.includeCompoundVowels) continue
        vowelIds.add(ch.id)
      }

      m.syllables.initials.forEach((cs, ci) => {
        if (!consonantIds.has(cs.id)) return
        m.syllables!.medials.forEach((vs, vi) => {
          if (!vowelIds.has(vs.id)) return
          const built = m.syllables!.build(ci, vi)
          if (built.id) {
            items.push({
              id: `syl-${built.id}`,
              symbol: built.symbol,
              romanization: built.romanization,
              type: 'syllable',
            })
          }
        })
      })
    }

    return items
  })

  const poolCount = computed(() => pool.value.length)

  /**
   * Build the list of exercise variants the session is allowed to produce,
   * given the user's questionType + difficulty settings.
   *
   * Each variant is a `(type, prompt)` pair. In hard mode the audio prompt
   * unlocks a third "écriture manuelle à partir du son" exercise on top of
   * the two existing visual variants. Easy mode (QCM) ignores the audio
   * prompt — there's nothing to listen to in a multiple-choice quiz.
   */
  function buildVariantPool(): { type: 'recognition' | 'writing'; prompt: 'visual' | 'audio' }[] {
    const variants: { type: 'recognition' | 'writing'; prompt: 'visual' | 'audio' }[] = []
    const allowsRecognition = config.value.questionType === 'recognition' || config.value.questionType === 'both'
    const allowsWriting = config.value.questionType === 'writing' || config.value.questionType === 'both'

    if (allowsRecognition) variants.push({ type: 'recognition', prompt: 'visual' })
    if (allowsWriting) variants.push({ type: 'writing', prompt: 'visual' })

    // Audio prompt only makes sense outside of QCM (easy mode), since the
    // multiple-choice grid needs a visible prompt to anchor the options.
    if (config.value.difficulty !== 'easy') {
      if (allowsWriting) variants.push({ type: 'writing', prompt: 'audio' })
    }
    return variants
  }

  function generateQuestions(): ITrainingQuestion[] {
    const items = shuffle(pool.value)
    const limit = Math.min(config.value.questionLimit, items.length)
    const selected = items.slice(0, limit)
    const all = pool.value
    const variants = buildVariantPool()
    if (variants.length === 0) return []

    // Build a balanced sequence of variants instead of doing a per-question
    // coin flip — that way the learner is *guaranteed* to see every active
    // variant rather than getting unlucky 5-in-a-row distributions.
    const sequence: typeof variants = []
    while (sequence.length < limit) {
      const chunk = shuffle(variants)
      for (const v of chunk) {
        if (sequence.length >= limit) break
        sequence.push(v)
      }
    }

    return selected.map((item, i) => {
      let v = sequence[i]
      // Items that don't have matching stroke data for the verifier must be
      // kept off the canvas-drawing variants:
      //  - syllables: no per-syllable stroke data exists in the registry.
      //  - vowels: we display them as `ㅇ + vowel` (canonical written form),
      //    but only have stroke data for the bare vowel — asking the user
      //    to draw `아` and verifying against `ㅏ` would always fail.
      // Both cases get downgraded to a visual recognition variant.
      const isVowelJamo = item.type === 'jamo' && item.jamoType === 'vowel'
      if ((item.type === 'syllable' || isVowelJamo) && v.type === 'writing') {
        v = { type: 'recognition', prompt: 'visual' }
      }
      // Distractors must be visually distinct from the target *and* from
      // each other on whichever value the QCM actually displays — that's
      // the romanization in recognition mode, the symbol in writing mode.
      const display = v.type === 'recognition'
        ? (it: ITrainingItem) => it.romanization
        : (it: ITrainingItem) => it.symbol
      const distractors = pickDistractors(all, item, 3, display)
      const options = shuffle([item, ...distractors])
      return { item, type: v.type, prompt: v.prompt, options }
    })
  }

  function start() {
    if (!activeModule.value) return
    const questions = generateQuestions()
    session.value = {
      config: { ...config.value },
      questions,
      results: [],
      currentIndex: 0,
      startedAt: Date.now(),
      finishedAt: null,
      courseKey: activeModule.value.key,
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

  const isFinished = computed(() => session.value?.finishedAt !== null && session.value !== null)

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
    activeModule, bind,
    config, session, pool, poolCount,
    streak, bestStreak,
    currentQuestion, progress, isFinished, score,
    start, answer, answerText, skip, overrideLastResult, next, reset,
  }
}
