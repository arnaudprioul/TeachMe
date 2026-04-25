// ── Lesson vocabulary item ──
export interface ILessonWord {
  id: string
  word: string
  romanization: string
  translation: string
  translationFr: string
  /** Illustration image (imported asset path). Preferred over emoji. */
  image?: string
  /** Fallback emoji if no image is provided. */
  emoji?: string
  /** Override for TTS if the spoken form differs from `word`. */
  audioText?: string
}

// ── Course content block types ──
export enum LESSON_CONTENT_TYPE {
  TEXT = 'TEXT',
  EXAMPLE = 'EXAMPLE',
  DIALOGUE = 'DIALOGUE',
  TIP = 'TIP',
  RULE = 'RULE',
  GRAMMAR_BOARD = 'GRAMMAR_BOARD',
  CHARACTER_PROFILES = 'CHARACTER_PROFILES',
  VOCABULARY_TABLE = 'VOCABULARY_TABLE',
  CULTURAL_NOTE = 'CULTURAL_NOTE',
  PRACTICE_INLINE = 'PRACTICE_INLINE',
  SECTION_HEADER = 'SECTION_HEADER',
  EXAMPLE_GROUP = 'EXAMPLE_GROUP',
  SECTION_CTA = 'SECTION_CTA',
}

export interface ILessonExample {
  sentence: string
  romanization: string
  translationKey: string
}

export interface IDialogueLine {
  speaker: string
  sentence: string
  romanization: string
  translationKey: string
}

// ── Grammar board: colored sentence breakdown ──
export interface IGrammarBoardPart {
  text: string
  /** CSS color for the chip (e.g. '#3b82f6' for subject, '#ef4444' for particle). */
  color: string
  /** Optional i18n key for a label below the chip (e.g. "subject", "particle"). */
  labelKey?: string
}

export interface IGrammarBoardStructure {
  parts: IGrammarBoardPart[]
}

// ── Character profile ──
export interface ICharacterProfile {
  name: string
  nameKr: string
  country: string
  flag: string
  jobKey: string
}

// ── Vocabulary table item ──
export interface IVocabTableItem {
  word: string
  romanization: string
  translationKey: string
}

// ── Inline practice item ──
export enum PRACTICE_MODE {
  /** Show the prompt + 4 buttons; user picks the correct one. */
  SELECT = 'SELECT',
  /** Show the prompt + a text input; user types the answer. */
  WRITE = 'WRITE',
  /** Click the prompt to hear the spoken form, then reveal the answer. */
  SPEAK = 'SPEAK',
  /** Backwards-compat default: click prompt to reveal answer (no validation). */
  REVEAL = 'REVEAL',
}

export interface IPracticeInlineOption {
  /** i18n key for the option label. */
  labelKey: string
}

export interface IPracticeInlineItem {
  /** Defaults to REVEAL when omitted. */
  mode?: PRACTICE_MODE
  /** i18n key for the prompt/question. */
  promptKey: string
  /** i18n key for the canonical answer (shown after success/reveal). */
  answerKey: string
  /** SELECT — the 4 options shown as buttons. The first option in the
   *  list whose `labelKey` resolves to the same string as `answerKey`'s
   *  resolved value is treated as correct. */
  options?: IPracticeInlineOption[]
  /** WRITE — alternative accepted strings (e.g. romanization variants). */
  acceptedAnswers?: string[]
  /** SPEAK — text passed to TTS (defaults to the answerKey's resolved value). */
  speakText?: string
}

export interface ILessonContentBlock {
  type: LESSON_CONTENT_TYPE
  /** i18n key for TEXT, TIP, and CULTURAL_NOTE blocks. */
  textKey?: string
  /** For EXAMPLE blocks. */
  example?: ILessonExample
  /** For DIALOGUE blocks. */
  dialogue?: IDialogueLine[]
  /** For RULE blocks. */
  rule?: {
    patternKey: string
    explanationKey: string
    examples: ILessonExample[]
  }
  /** For GRAMMAR_BOARD blocks. */
  board?: {
    titleKey: string
    structures: IGrammarBoardStructure[]
  }
  /** For CHARACTER_PROFILES blocks. */
  characters?: ICharacterProfile[]
  /** For VOCABULARY_TABLE blocks. */
  vocabTable?: {
    titleKey: string
    items: IVocabTableItem[]
  }
  /** For CULTURAL_NOTE blocks (uses titleKey from a second field). */
  culturalTitleKey?: string
  /** For PRACTICE_INLINE blocks. */
  practiceInline?: {
    instructionKey: string
    items: IPracticeInlineItem[]
  }
  /** For EXAMPLE_GROUP blocks. */
  examples?: ILessonExample[]
  /** For SECTION_HEADER blocks. */
  sectionHeader?: {
    eyebrowKey: string
    titleKey: string
    subtitleKey?: string
    /** Optional i18n key for a word/phrase inside the title to highlight with a gradient.
     *  Must match a substring of the resolved title text. */
    highlightKey?: string
    /** Visual variant. Defaults to 'left'. */
    variant?: 'left' | 'center' | 'split'
  }
  /** For SECTION_CTA blocks. */
  sectionCta?: {
    eyebrowKey?: string
    titleKey: string
    subtitleKey?: string
    ctaLabelKey: string
    ctaHref: string
  }
}

// ── Exercise types ──
export enum LESSON_EXERCISE_TYPE {
  QCM = 'QCM',
  FILL_BLANK = 'FILL_BLANK',
  REORDER = 'REORDER',
  TRANSLATE = 'TRANSLATE',
  SPEAK = 'SPEAK',
}

export type TExerciseDifficulty = 'easy' | 'medium' | 'hard'

export interface ILessonExercise {
  id: string
  type: LESSON_EXERCISE_TYPE
  difficulty: TExerciseDifficulty
  /** QCM — i18n key for the question. */
  questionKey?: string
  /** QCM — options with i18n keys. */
  options?: { labelKey: string; correct: boolean }[]
  /** FILL_BLANK — sentence with ___ as blank. */
  sentenceTemplate?: string
  /** FILL_BLANK — primary answer. */
  answer?: string
  /** FILL_BLANK / TRANSLATE — alternative accepted answers. */
  acceptedAnswers?: string[]
  /** REORDER — words in correct order. */
  correctOrder?: string[]
  /** TRANSLATE — i18n key for the source sentence to translate. */
  sourceKey?: string
  /** TRANSLATE — expected answer in target language. */
  targetAnswer?: string
  /** SPEAK — the text the user must pronounce. */
  speakText?: string
  /** SPEAK — romanization hint shown to the user. */
  speakRomanization?: string
}

// ── Lesson definition ──
export interface ILesson {
  id: number
  /** Course level (1, 2, 3…). MUST match the parent folder's level number.
   *  Validated at runtime via `validateLessons()` in each level's `lessons/index.ts`. */
  level: number
  themeKey: string
  words: ILessonWord[]
  /** Course/grammar content blocks displayed in order. */
  content?: ILessonContentBlock[]
  /** Practice exercises for the course part. */
  exercises?: ILessonExercise[]
}

// ── Quiz question types ──
export enum LESSON_QUIZ_TYPE {
  /** Show emoji → select correct word from 4 options */
  IMAGE_SELECT_WORD = 'IMAGE_SELECT_WORD',
  /** Show emoji → type the word (free input) */
  IMAGE_TYPE_WORD = 'IMAGE_TYPE_WORD',
  /** Show emoji + 4 words → select the correct one */
  IMAGE_WORDS_SELECT = 'IMAGE_WORDS_SELECT',
}

// ── Quiz runtime types ──
export interface ILessonQuizQuestion {
  type: LESSON_QUIZ_TYPE
  word: ILessonWord
  /** 4 options for SELECT types (includes the correct answer). */
  options?: ILessonWord[]
}

export interface ILessonQuizResult {
  wordId: string
  correct: boolean
  answeredAt: number
}

export interface ILessonQuizSession {
  lessonId: number
  questions: ILessonQuizQuestion[]
  results: ILessonQuizResult[]
  currentIndex: number
  startedAt: number
  finishedAt: number | null
}

// ── Level intro (displayed on the level landing page) ──
export interface ILevelIntro {
  /** i18n key for the motivational description paragraph. */
  descriptionKey: string
  /** Learning objectives for the whole level (i18n keys). */
  objectiveKeys: string[]
  /** i18n key explaining what the official level (TOPIK I, JLPT N5…) means
   *  in terms of skills and real-world use (visas, jobs, studies). */
  officialLevelInfoKey?: string
  /** Official link (e.g. TOPIK official site) for more details. */
  officialLevelLink?: string
}

// ── Lesson progress (persisted in localStorage) ──
export interface ILessonProgress {
  lessonId: number
  completed: boolean
  bestScore: number
  attempts: number
  lastAttemptAt: number | null
}
