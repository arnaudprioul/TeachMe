import { ref, computed } from 'vue'
import type { ILessonExercise, ILessonWord, TExerciseDifficulty } from './data/courses/lesson-types'
import { LESSON_EXERCISE_TYPE } from './data/courses/lesson-types'

let _uid = 0
function uid(): string {
  return `${++_uid}-${Math.random().toString(36).slice(2, 8)}`
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
 * Normalize text for answer comparison:
 * - lowercase, trim, strip punctuation
 * - accept romaji, hiragana, katakana, kanji as equivalent
 */
function normalizeAnswer(text: string): string {
  return text.trim().toLowerCase().replace(/[.!?,。、！？\s]/g, '')
}

function answersMatch(input: string, accepted: string[]): boolean {
  const norm = normalizeAnswer(input)
  const hira = romajiToHiragana(norm)
  return accepted.some(a => {
    const aNorm = normalizeAnswer(a)
    return norm === aNorm || hira === aNorm || norm === romajiToHiragana(aNorm)
  })
}

/**
 * Compute character-level similarity between two strings (0..1).
 * Uses Levenshtein distance: similarity = 1 - (distance / maxLen).
 */
function fuzzyScore(a: string, b: string): number {
  if (a === b) return 1
  const la = a.length
  const lb = b.length
  if (la === 0 || lb === 0) return 0
  const maxLen = Math.max(la, lb)

  // Simple Levenshtein via single-row DP
  let prev = Array.from({ length: lb + 1 }, (_, i) => i)
  for (let i = 1; i <= la; i++) {
    const curr = [i]
    for (let j = 1; j <= lb; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost)
    }
    prev = curr
  }
  return 1 - prev[lb] / maxLen
}

// Basic romaji → hiragana conversion table
const ROMAJI_TO_HIRAGANA: Record<string, string> = {
  a:'あ',i:'い',u:'う',e:'え',o:'お',
  ka:'か',ki:'き',ku:'く',ke:'け',ko:'こ',
  sa:'さ',shi:'し',si:'し',su:'す',se:'せ',so:'そ',
  ta:'た',chi:'ち',ti:'ち',tsu:'つ',tu:'つ',te:'て',to:'と',
  na:'な',ni:'に',nu:'ぬ',ne:'ね',no:'の',
  ha:'は',hi:'ひ',fu:'ふ',hu:'ふ',he:'へ',ho:'ほ',
  ma:'ま',mi:'み',mu:'む',me:'め',mo:'も',
  ya:'や',yu:'ゆ',yo:'よ',
  ra:'ら',ri:'り',ru:'る',re:'れ',ro:'ろ',
  wa:'わ',wi:'ゐ',we:'ゑ',wo:'を',n:'ん',
  ga:'が',gi:'ぎ',gu:'ぐ',ge:'げ',go:'ご',
  za:'ざ',ji:'じ',zi:'じ',zu:'ず',ze:'ぜ',zo:'ぞ',
  da:'だ',di:'ぢ',du:'づ',de:'で',do:'ど',
  ba:'ば',bi:'び',bu:'ぶ',be:'べ',bo:'ぼ',
  pa:'ぱ',pi:'ぴ',pu:'ぷ',pe:'ぺ',po:'ぽ',
  kya:'きゃ',kyu:'きゅ',kyo:'きょ',
  sha:'しゃ',shu:'しゅ',sho:'しょ',
  cha:'ちゃ',chu:'ちゅ',cho:'ちょ',
  nya:'にゃ',nyu:'にゅ',nyo:'にょ',
  hya:'ひゃ',hyu:'ひゅ',hyo:'ひょ',
  mya:'みゃ',myu:'みゅ',myo:'みょ',
  rya:'りゃ',ryu:'りゅ',ryo:'りょ',
  gya:'ぎゃ',gyu:'ぎゅ',gyo:'ぎょ',
  ja:'じゃ',ju:'じゅ',jo:'じょ',
  bya:'びゃ',byu:'びゅ',byo:'びょ',
  pya:'ぴゃ',pyu:'ぴゅ',pyo:'ぴょ',
}

/** Convert romaji string to hiragana (best effort) */
function romajiToHiragana(text: string): string {
  let result = ''
  let i = 0
  const s = text.toLowerCase()
  while (i < s.length) {
    // Try 3-char, 2-char, 1-char matches
    if (i + 3 <= s.length && ROMAJI_TO_HIRAGANA[s.slice(i, i + 3)]) {
      result += ROMAJI_TO_HIRAGANA[s.slice(i, i + 3)]
      i += 3
    } else if (i + 2 <= s.length && ROMAJI_TO_HIRAGANA[s.slice(i, i + 2)]) {
      result += ROMAJI_TO_HIRAGANA[s.slice(i, i + 2)]
      i += 2
    } else if (ROMAJI_TO_HIRAGANA[s[i]]) {
      result += ROMAJI_TO_HIRAGANA[s[i]]
      i += 1
    } else {
      // Double consonant → っ
      if (i + 1 < s.length && s[i] === s[i + 1] && /[bcdfghjklmnpqrstvwxyz]/.test(s[i])) {
        result += 'っ'
        i += 1
      } else {
        result += s[i]
        i += 1
      }
    }
  }
  return result
}

/**
 * For each accepted answer, find matching vocab words and add all their
 * script variants. Also auto-generate hiragana from romaji answers.
 */
function enrichWithVocabVariants(accepted: string[], words: ILessonWord[]) {
  const toAdd: string[] = []

  for (const ans of accepted) {
    const norm = normalizeAnswer(ans)

    // Find matching vocab word and add all its forms
    for (const w of words) {
      if (normalizeAnswer(w.word) === norm || normalizeAnswer(w.romanization) === norm || (w.audioText && normalizeAnswer(w.audioText) === norm)) {
        toAdd.push(w.word, w.romanization)
        if (w.audioText) toAdd.push(w.audioText)
      }
    }

    // Auto-convert romaji → hiragana and add as variant
    if (/^[a-z\s-]+$/i.test(ans)) {
      toAdd.push(romajiToHiragana(ans))
    }
    // Also try converting the answer itself to hiragana if it's short
    const hira = romajiToHiragana(norm)
    if (hira !== norm) toAdd.push(hira)
  }

  for (const a of toAdd) {
    if (a && !accepted.includes(a)) accepted.push(a)
  }
}

/**
 * Generate dynamic exercises from vocabulary words to increase variety.
 * Creates QCM, TRANSLATE, FILL_BLANK, and REORDER exercises on the fly.
 */
function generateDynamicExercises(words: ILessonWord[], difficulty: TExerciseDifficulty, count: number): ILessonExercise[] {
  if (words.length < 4) return []
  const exercises: ILessonExercise[] = []
  const shuffledWords = shuffle(words)

  for (let i = 0; i < Math.min(count, shuffledWords.length); i++) {
    const word = shuffledWords[i]
    const distractors = shuffle(words.filter(w => w.id !== word.id)).slice(0, 3)
    const exerciseType = i % 6 // Rotate between 6 types

    if (exerciseType === 0 && distractors.length >= 3) {
      // QCM: "What does [word] mean?"
      const options = shuffle([
        { labelKey: `__raw:${word.translation}`, correct: true },
        { labelKey: `__raw:${distractors[0].translation}`, correct: false },
        { labelKey: `__raw:${distractors[1].translation}`, correct: false },
        { labelKey: `__raw:${distractors[2].translation}`, correct: false },
      ])
      exercises.push({
        id: `dyn-qcm-${word.id}-${uid()}`,
        type: LESSON_EXERCISE_TYPE.QCM,
        difficulty,
        questionKey: `__raw:${word.word} (${word.romanization})`,
        options,
      })
    } else if (exerciseType === 1) {
      // TRANSLATE: translate from English to target language
      // Accept: word in native script, romanization, any script variant
      const accepted = [word.word, word.romanization]
      if (word.audioText) accepted.push(word.audioText)
      exercises.push({
        id: `dyn-tr-${word.id}-${uid()}`,
        type: LESSON_EXERCISE_TYPE.TRANSLATE,
        difficulty,
        sourceKey: `__raw:${word.translation}`,
        targetAnswer: word.word,
        acceptedAnswers: accepted,
      })
    } else if (exerciseType === 2 && distractors.length >= 3) {
      // QCM reverse: "Which word means [translation]?"
      const options = shuffle([
        { labelKey: `__raw:${word.word}`, correct: true },
        { labelKey: `__raw:${distractors[0]?.word ?? '---'}`, correct: false },
        { labelKey: `__raw:${distractors[1]?.word ?? '---'}`, correct: false },
        { labelKey: `__raw:${distractors[2]?.word ?? '---'}`, correct: false },
      ])
      exercises.push({
        id: `dyn-qcm2-${word.id}-${uid()}`,
        type: LESSON_EXERCISE_TYPE.QCM,
        difficulty,
        questionKey: `__raw:${word.translation}`,
        options,
      })
    } else if (exerciseType === 3 && word.word.length >= 3) {
      // FILL_BLANK from vocabulary: blank out part of the word
      const wordChars = word.word
      const blankLen = Math.max(1, Math.ceil(wordChars.length / 2))
      const blankedPart = wordChars.slice(0, blankLen)
      const visiblePart = wordChars.slice(blankLen)
      const template = `___${visiblePart}`
      // Accept the blanked part in native script + approximate romaji
      const romPart = word.romanization.slice(0, Math.ceil(word.romanization.length / 2))
      const accepted = [blankedPart, romPart]

      // Hint varies by difficulty:
      // easy: translation + romanization, medium: translation only, hard: translation only (no audio auto-play)
      let hint = ''
      if (difficulty === 'easy') hint = `${word.translation} (${word.romanization})`
      else hint = word.translation

      exercises.push({
        id: `dyn-fb-${word.id}-${uid()}`,
        type: LESSON_EXERCISE_TYPE.FILL_BLANK,
        difficulty,
        sentenceTemplate: template,
        answer: blankedPart,
        acceptedAnswers: accepted,
        sourceKey: `__raw:${hint}`,
      })
    } else if (exerciseType === 4) {
      // REORDER from vocabulary: build a small phrase to reorder
      const word2 = distractors[0]
      const word3 = distractors[1]
      if (word2 && word3) {
        const correctOrder = [word.word, word2.word, word3.word]
        exercises.push({
          id: `dyn-ro-${word.id}-${uid()}`,
          type: LESSON_EXERCISE_TYPE.REORDER,
          difficulty,
          correctOrder,
          sourceKey: `__raw:${word.translation}, ${word2.translation}, ${word3.translation}`,
        })
      } else {
        // Fallback to translate if not enough words for reorder
        exercises.push({
          id: `dyn-tr2-${word.id}-${uid()}`,
          type: LESSON_EXERCISE_TYPE.TRANSLATE,
          difficulty,
          sourceKey: `__raw:${word.translation}`,
          targetAnswer: word.word,
          acceptedAnswers: [word.word, word.romanization],
        })
      }
    } else if (exerciseType === 5) {
      // SPEAK: user must pronounce the word aloud
      exercises.push({
        id: `dyn-sp-${word.id}-${uid()}`,
        type: LESSON_EXERCISE_TYPE.SPEAK,
        difficulty,
        speakText: word.word,
        speakRomanization: word.romanization,
        sourceKey: `__raw:${word.translation}`,
      })
    } else {
      // Fallback: QCM reverse
      if (distractors.length >= 3) {
        const options = shuffle([
          { labelKey: `__raw:${word.word}`, correct: true },
          { labelKey: `__raw:${distractors[0]?.word ?? '---'}`, correct: false },
          { labelKey: `__raw:${distractors[1]?.word ?? '---'}`, correct: false },
          { labelKey: `__raw:${distractors[2]?.word ?? '---'}`, correct: false },
        ])
        exercises.push({
          id: `dyn-qcm3-${word.id}-${uid()}`,
          type: LESSON_EXERCISE_TYPE.QCM,
          difficulty,
          questionKey: `__raw:${word.translation}`,
          options,
        })
      }
    }
  }
  return exercises
}

export interface IExerciseResult {
  exerciseId: string
  correct: boolean
  answeredAt: number
  /** Number of attempts (1 on first-try correct, 2+ when retry used). */
  attempts: number
}

export interface IExerciseSession {
  lessonId: number
  difficulty: TExerciseDifficulty
  exercises: ILessonExercise[]
  words: ILessonWord[]
  results: IExerciseResult[]
  currentIndex: number
  startedAt: number
  finishedAt: number | null
}

export function createLessonExercise() {
  const session = ref<IExerciseSession | null>(null)
  const streak = ref(0)
  const bestStreak = ref(0)
  /** Attempts counter for the current exercise (resets on `next()`). */
  const currentAttempts = ref(0)

  function start(lessonId: number, exercises: ILessonExercise[], difficulty: TExerciseDifficulty, skipFilter = false, words: ILessonWord[] = []) {
    let filtered = skipFilter ? shuffle(exercises) : shuffle(exercises.filter(e => e.difficulty === difficulty))

    // Generate dynamic exercises from vocabulary to add variety
    if (words.length >= 4 && !skipFilter) {
      const dynamicCount = Math.max(6, Math.ceil(words.length * 0.8))
      const dynamic = generateDynamicExercises(words, difficulty, dynamicCount)
      // Mix static + dynamic, then pick a subset — target 12-15 exercises per session
      const all = shuffle([...filtered, ...dynamic])
      const targetSize = Math.max(filtered.length, Math.min(15, all.length))
      filtered = all.slice(0, Math.max(targetSize, 12))
    }

    // Shuffle QCM options so answers aren't always in the same position
    // Also aggressively re-shuffle REORDER correctOrder to avoid predictable patterns
    for (const ex of filtered) {
      if (ex.type === LESSON_EXERCISE_TYPE.QCM && ex.options) {
        ex.options = shuffle([...ex.options])
      }
    }
    session.value = {
      lessonId,
      difficulty,
      exercises: filtered,
      words,
      results: [],
      currentIndex: 0,
      startedAt: Date.now(),
      finishedAt: null,
    }
    streak.value = 0
    bestStreak.value = 0
    currentAttempts.value = 0
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

  const isFinished = computed(() => session.value?.finishedAt != null)

  const score = computed(() => {
    if (!session.value) return { correct: 0, total: 0, percentage: 0 }
    const total = session.value.results.length
    const correct = session.value.results.filter(r => r.correct).length
    return { correct, total, percentage: total > 0 ? Math.round((correct / total) * 100) : 0 }
  })

  /**
   * Commit the answer for the current exercise. If `correct` is true, the
   * result is finalized. If false, the caller can show a retry UI — the
   * result is NOT yet committed so the user has a chance to try again.
   * `commit` forces the false result to be committed (after skip or
   * give-up).
   */
  function record(correct: boolean, commit = false) {
    if (!session.value) return
    // Capture exercise reference synchronously to avoid reactivity issues
    const exercise = session.value.exercises[session.value.currentIndex]
    if (!exercise) return
    currentAttempts.value++
    if (correct) {
      streak.value++
      if (streak.value > bestStreak.value) bestStreak.value = streak.value
    } else {
      streak.value = 0
    }
    // Push the result immediately for both correct and wrong answers when committed
    if (correct || commit) {
      session.value.results = [...session.value.results, {
        exerciseId: exercise.id,
        correct,
        answeredAt: Date.now(),
        attempts: currentAttempts.value,
      }]
    }
  }

  function answerQcm(optionIndex: number): boolean {
    const ex = currentExercise.value
    if (!ex || ex.type !== LESSON_EXERCISE_TYPE.QCM) return false
    const correct = ex.options?.[optionIndex]?.correct === true
    record(correct, true) // always commit — no retry
    return correct
  }

  function answerFillBlank(text: string): boolean {
    const ex = currentExercise.value
    if (!ex || ex.type !== LESSON_EXERCISE_TYPE.FILL_BLANK) return false
    const accepted = [ex.answer!, ...(ex.acceptedAnswers ?? [])]
    // Also accept any vocab word form that matches the answer
    enrichWithVocabVariants(accepted, session.value?.words ?? [])
    const correct = answersMatch(text, accepted)
    record(correct, true)
    return correct
  }

  function answerReorder(ordered: string[]): boolean {
    const ex = currentExercise.value
    if (!ex || ex.type !== LESSON_EXERCISE_TYPE.REORDER) return false
    const correct = JSON.stringify(ordered) === JSON.stringify(ex.correctOrder)
    record(correct, true)
    return correct
  }

  function answerTranslate(text: string): boolean {
    const ex = currentExercise.value
    if (!ex || ex.type !== LESSON_EXERCISE_TYPE.TRANSLATE) return false
    const accepted = [ex.targetAnswer!, ...(ex.acceptedAnswers ?? [])]
    enrichWithVocabVariants(accepted, session.value?.words ?? [])
    const correct = answersMatch(text, accepted)
    record(correct, true)
    return correct
  }

  /**
   * Answer a SPEAK exercise by comparing the spoken transcript against the
   * expected text using fuzzy matching (speech recognition is imperfect).
   */
  function answerSpeak(spokenText: string): boolean {
    const ex = currentExercise.value
    if (!ex || ex.type !== LESSON_EXERCISE_TYPE.SPEAK) return false

    const candidates = [ex.speakText ?? '', ex.speakRomanization ?? ''].filter(Boolean)
    // Also add vocab variants
    enrichWithVocabVariants(candidates, session.value?.words ?? [])

    const norm = normalizeAnswer(spokenText)

    // First try exact match (after normalization)
    if (answersMatch(spokenText, candidates)) {
      record(true, true)
      return true
    }

    // Fuzzy match: check character similarity >= 70%
    const correct = candidates.some(c => {
      const cn = normalizeAnswer(c)
      return fuzzyScore(norm, cn) >= 0.7 || fuzzyScore(norm, romajiToHiragana(cn)) >= 0.7
    })

    record(correct, true)
    return correct
  }

  /** Give up on the current exercise — commits a false result. */
  function skip() {
    record(false, /* commit */ true)
  }

  /** Go to the next exercise (or finish if last). */
  function next() {
    if (!session.value) return
    currentAttempts.value = 0
    const nextIdx = session.value.currentIndex + 1
    if (nextIdx >= session.value.exercises.length) {
      session.value.finishedAt = Date.now()
    } else {
      session.value.currentIndex = nextIdx
    }
  }

  function reset() {
    session.value = null
    streak.value = 0
    bestStreak.value = 0
    currentAttempts.value = 0
  }

  return {
    session,
    currentExercise,
    progress,
    isFinished,
    score,
    streak,
    bestStreak,
    currentAttempts,
    start,
    answerQcm,
    answerFillBlank,
    answerReorder,
    answerTranslate,
    answerSpeak,
    record,
    skip,
    next,
    reset,
  }
}
