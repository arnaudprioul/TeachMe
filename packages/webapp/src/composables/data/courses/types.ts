// ── Articulation places (IPA) — generic ──
export type ArticulationPlace =
  | 'velar' | 'alveolar' | 'alveolar-lateral' | 'bilabial'
  | 'alveolar-fricative' | 'glottal' | 'palatal' | 'glottal-fricative'
  | 'open-central' | 'open-front' | 'mid-back' | 'mid-front'
  | 'close-back' | 'close-front' | 'central'

// ── Generic course character ──
export interface ICourseCharacter {
  id: string
  symbol: string
  romanization: string
  type?: 'consonant' | 'vowel' | string
  subtype?: 'basic' | 'double' | 'compound' | string
  name: string
  nameFr: string
  pronunciation: string
  pronunciationFr: string
  strokeCount: number
  ipa?: string
  articulation?: ArticulationPlace
  examples?: { syllable: string; romanization: string }[]
}

// ── Stroke data ──
export interface IStrokePath {
  d: string
  center: string
  startX: number
  startY: number
}

export interface ICharStrokes {
  viewBox: string
  strokes: IStrokePath[]
}

// ── Phonetics (per locale) ──
export interface IPhoneticInfo {
  soundsLike: string
  mouthDescription: string
  tip: string
}

export type PhoneticsMap = Record<string, Record<string, IPhoneticInfo>>

// ── Syllable composer (optional, for Korean / Japanese gojuon, etc.) ──
export interface ISyllableComposer {
  initials: Array<{ id: string; rom: string }>
  medials: Array<{ id: string; rom: string }>
  build(initialIndex: number, medialIndex: number): {
    id: string
    symbol: string
    romanization: string
  }
  parse(slug: string): { initialId: string; medialId: string } | null
}

// ── Training categories ──
//
// Each course declares its own list of "categories" (basic vowels, double
// consonants, gojuon, dakuten, …). The training pool builder filters
// characters using these categories instead of the old hardcoded Korean
// `includeBasicConsonants / includeDoubleConsonants / includeBasicVowels /
// includeCompoundVowels` flags. The training settings page renders one
// checkbox per category and the user toggles which ones to include.
//
// `matches` is a runtime predicate, so it can express any rule
// (`type === 'consonant' && subtype === 'basic'`, `type === 'vowel'`,
// `subtype === 'dakuten'`, …).
export interface ICourseCategory {
  id: string
  /** Locale key for the human label, resolved at the page level. */
  labelKey: string
  matches: (c: ICourseCharacter) => boolean
}

// Optional course-level transform applied when a character is added to
// the training pool. Korean uses this to wrap bare vowels in their
// canonical `ㅇ + vowel` syllable form (`ㅏ` → `아`). Defaults to a 1:1
// jamo-to-item mapping when not provided.
export interface ITrainingItemBase {
  id: string
  symbol: string
  romanization: string
  type: 'jamo' | 'syllable'
  jamoType?: 'consonant' | 'vowel' | string
  jamoSubtype?: 'basic' | 'double' | 'compound' | string
}
export type ToTrainingItemFn = (
  c: ICourseCharacter,
  m: ICourseModule,
) => ITrainingItemBase | null

// ── Course config ──
export interface ICourseConfig {
  heroImage: string
  ttsLang: string
  ttsVoicePrefs: string[]
  localePrefix: string

  // Training pool description.
  categories: ICourseCategory[]
  /** Optional transform applied to each character on its way into the
   *  training pool (e.g. wrap Korean vowels in `ㅇ + vowel`). */
  toTrainingItem?: ToTrainingItemFn
  /** Item types/subtypes that should never appear in a canvas-drawing
   *  variant of the training (because we don't have stroke data for them
   *  in their displayed form). Match is on `jamoType`. */
  nonDrawableTypes?: string[]

  // Landing page sections (each is rendered iff its flag is true).
  /** "1443 — King Sejong" / Hunminjeongeum-style origin story block. */
  hasOriginStory?: boolean
  /** Korean cosmology section (sky / earth / human elements). */
  hasCosmology?: boolean
  /** Silent ㅇ rule explanation block. */
  hasSilentInitialRule?: boolean
  /** "Characters compose into syllables" section + CV/CVC diagrams.
   *  Implies the table.vue grid uses the syllables composer. */
  hasSyllableComposition?: boolean

  // Legacy flags kept for back-compat with code that hasn't migrated yet.
  hasSyllables?: boolean
}

// ── Full module ──
export interface ICourseModule {
  key: string             // `${lang}-${course}`
  lang: string
  course: string
  characters: ICourseCharacter[]
  strokes: Record<string, ICharStrokes>
  phonetics: PhoneticsMap
  speech: Record<string, string>
  syllables?: ISyllableComposer
  config: ICourseConfig
}
