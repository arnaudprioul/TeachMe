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
        matches: c => c.type === 'consonant' && c.subtype === 'basic',
      },
      {
        id: 'dakuten',
        labelKey: 'courses.japanese.katakana.dakuten',
        matches: c => c.subtype === 'dakuten' || c.subtype === 'handakuten',
      },
      {
        id: 'yoon',
        labelKey: 'courses.japanese.katakana.yoon',
        matches: c => c.subtype === 'yoon',
      },
    ],
    toTrainingItem: undefined,
    nonDrawableTypes: [],

    // Same grid structure as hiragana — same ids, same row layout,
    // same empty cells. Only the rendered glyphs differ.
    tableGrids: [
      {
        titleKey: 'courses.japanese.katakana.gojuon',
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
      {
        titleKey: 'courses.japanese.katakana.dakuten',
        columnHeaders: ['a', 'i', 'u', 'e', 'o'],
        rows: [
          { header: 'g', cells: ['ga', 'gi', 'gu', 'ge', 'go'] },
          { header: 'z', cells: ['za', 'ji', 'zu', 'ze', 'zo'] },
          { header: 'd', cells: ['da', 'dji', 'dzu', 'de', 'do'] },
          { header: 'b', cells: ['ba', 'bi', 'bu', 'be', 'bo'] },
          { header: 'p', cells: ['pa', 'pi', 'pu', 'pe', 'po'] },
        ],
      },
      {
        titleKey: 'courses.japanese.katakana.yoon',
        columnHeaders: ['ya', 'yu', 'yo'],
        rows: [
          { header: 'k', cells: ['kya', 'kyu', 'kyo'] },
          { header: 's', cells: ['sha', 'shu', 'sho'] },
          { header: 't', cells: ['cha', 'chu', 'cho'] },
          { header: 'n', cells: ['nya', 'nyu', 'nyo'] },
          { header: 'h', cells: ['hya', 'hyu', 'hyo'] },
          { header: 'm', cells: ['mya', 'myu', 'myo'] },
          { header: 'r', cells: ['rya', 'ryu', 'ryo'] },
          { header: 'g', cells: ['gya', 'gyu', 'gyo'] },
          { header: 'j', cells: ['ja',  'ju',  'jo' ] },
          { header: 'b', cells: ['bya', 'byu', 'byo'] },
          { header: 'p', cells: ['pya', 'pyu', 'pyo'] },
        ],
      },
    ],

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
