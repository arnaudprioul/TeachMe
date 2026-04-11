import type { ICourseModule } from '../types'
import { CHARACTERS } from './characters'
import { STROKES } from './strokes'
import { PHONETICS } from './phonetics'
import { SPEECH } from './speech'

import heroImage from '~/assets/images/courses/korean-hangeul/hero.jpg'

export const japaneseKatakana: ICourseModule = {
  key: 'japanese-katakana',
  lang: 'japanese',
  course: 'katakana',
  characters: CHARACTERS,
  strokes: STROKES,
  phonetics: PHONETICS,
  speech: SPEECH,
  syllables: undefined,
  config: {
    heroImage,
    ttsLang: 'ja-JP',
    ttsVoicePrefs: ['Kyoko', 'Otoya', 'Google 日本語', 'Microsoft Nanami', 'Microsoft Ayumi'],
    localePrefix: 'courses.japanese.katakana',

    categories: [
      {
        id: 'vowels',
        labelKey: 'courses.japanese.katakana.vowels',
        matches: c => c.type === 'vowel',
      },
      {
        id: 'gojuon',
        labelKey: 'courses.japanese.katakana.gojuon',
        matches: c => c.type === 'consonant',
      },
    ],
    toTrainingItem: undefined,
    nonDrawableTypes: [],

    // Katakana has its own historical narrative — invented in the 9th
    // century by Buddhist monks as a shorthand for annotating Chinese
    // texts. Each katakana is a fragment of a kanji.
    hasOriginStory: true,
    hasCosmology: false,
    hasSilentInitialRule: false,
    hasSyllableComposition: false,

    hasSyllables: false,
  },
}
