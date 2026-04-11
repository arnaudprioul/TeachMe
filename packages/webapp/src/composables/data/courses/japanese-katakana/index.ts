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

    // Same gojuon layout as hiragana — same ids, same row structure,
    // same empty cells. Only the rendered glyphs differ since
    // characters.ts uses katakana symbols.
    tableGrid: {
      columnHeaders: ['a', 'i', 'u', 'e', 'o'],
      rows: [
        { header: '∅', cells: ['a',  'i',   'u',   'e',  'o'  ] },
        { header: 'k', cells: ['ka', 'ki',  'ku',  'ke', 'ko' ] },
        { header: 's', cells: ['sa', 'shi', 'su',  'se', 'so' ] },
        { header: 't', cells: ['ta', 'chi', 'tsu', 'te', 'to' ] },
        { header: 'n', cells: ['na', 'ni',  'nu',  'ne', 'no' ] },
        { header: 'h', cells: ['ha', 'hi',  'fu',  'he', 'ho' ] },
        { header: 'm', cells: ['ma', 'mi',  'mu',  'me', 'mo' ] },
        { header: 'y', cells: ['ya', null,  'yu',  null, 'yo' ] },
        { header: 'r', cells: ['ra', 'ri',  'ru',  're', 'ro' ] },
        { header: 'w', cells: ['wa', null,  null,  null, 'wo' ] },
        { header: 'n', cells: ['n',  null,  null,  null, null ] },
      ],
    },

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
