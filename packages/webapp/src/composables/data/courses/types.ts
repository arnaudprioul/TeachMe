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

// ── Course config ──
export interface ICourseConfig {
  heroImage: string
  ttsLang: string
  ttsVoicePrefs: string[]
  localePrefix: string
  hasSyllables: boolean
  hasCosmology: boolean
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
