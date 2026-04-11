import type { ICourseModule } from '../types'
import { CHARACTERS } from './characters'
import { STROKES } from './strokes'
import { PHONETICS } from './phonetics'
import { SPEECH } from './speech'

// Hero image for the Japanese landing page. Symlinked to a generic
// placeholder for now — replace with a real Japan photo (Mount Fuji,
// Tokyo skyline, etc.) under assets/images/courses/japanese-hiragana/
// when we have one.
import heroImage from '~/assets/images/courses/korean-hangeul/hero.jpg'

export const japaneseHiragana: ICourseModule = {
  key: 'japanese-hiragana',
  lang: 'japanese',
  course: 'hiragana',
  characters: CHARACTERS,
  strokes: STROKES,
  phonetics: PHONETICS,
  speech: SPEECH,
  // No syllables composer — kana ARE syllables, they don't compose
  // further (dakuten / handakuten / yōon are derived characters that
  // would each be their own ICourseCharacter entry, not a composition).
  syllables: undefined,
  config: {
    heroImage,
    ttsLang: 'ja-JP',
    ttsVoicePrefs: ['Kyoko', 'Otoya', 'Google 日本語', 'Microsoft Nanami', 'Microsoft Ayumi'],
    localePrefix: 'courses.japanese.hiragana',

    // Two training categories: pure vowels and the rest of gojuon.
    categories: [
      {
        id: 'vowels',
        labelKey: 'courses.japanese.hiragana.vowels',
        matches: c => c.type === 'vowel',
      },
      {
        id: 'gojuon',
        labelKey: 'courses.japanese.hiragana.gojuon',
        matches: c => c.type === 'consonant',
      },
    ],
    // No special training-item transform — kana display as-is.
    toTrainingItem: undefined,
    // Every kana can be drawn (we don't have stroke data yet, but the
    // online recognizer doesn't need it).
    nonDrawableTypes: [],

    // Landing-page sections. Hiragana has its own historical narrative
    // (Heian period, court women's literature, the Tale of Genji…)
    // even though it doesn't have a Hangeul-style cosmology or a
    // silent-ㅇ rule.
    hasOriginStory: true,
    hasCosmology: false,
    hasSilentInitialRule: false,
    hasSyllableComposition: false,

    hasSyllables: false, // legacy
  },
}
