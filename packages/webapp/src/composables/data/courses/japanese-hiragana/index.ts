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

    // Five training categories: vowels, base gojuon (consonant + basic
    // subtype), dakuten (g/z/d/b rows), handakuten (p row), and yōon
    // (palatalised combinations). Each one is an independent toggle on
    // the training settings page so learners can drill any subset.
    categories: [
      {
        id: 'vowels',
        labelKey: 'courses.japanese.hiragana.vowels',
        matches: c => c.type === 'vowel',
      },
      {
        id: 'gojuon',
        labelKey: 'courses.japanese.hiragana.gojuon',
        matches: c => c.type === 'consonant' && c.subtype === 'basic',
      },
      {
        id: 'dakuten',
        labelKey: 'courses.japanese.hiragana.dakuten',
        matches: c => c.subtype === 'dakuten' || c.subtype === 'handakuten',
      },
      {
        id: 'yoon',
        labelKey: 'courses.japanese.hiragana.yoon',
        matches: c => c.subtype === 'yoon',
      },
    ],
    // No special training-item transform — kana display as-is.
    toTrainingItem: undefined,
    // Every kana can be drawn (we don't have stroke data yet, but the
    // online recognizer doesn't need it).
    nonDrawableTypes: [],

    // Three separate table layouts: gojuon (the 46 base kana), dakuten
    // / handakuten (voicing marks: が, ぱ…), and yōon (palatalised
    // combinations: きゃ, しゅ, ちょ…). Each grid is rendered as its
    // own labelled section on the table page so the eye can jump
    // straight to the family it's looking for.
    tableGrids: [
      // ── Gojuon: 5 vowel columns × 11 rows ──
      // The historical ordering preserves the empty cells in the y-row
      // (no い/え), the w-row (no い/う/え) and the standalone ん row,
      // so the grid visually matches every Japanese textbook.
      {
        titleKey: 'courses.japanese.hiragana.gojuon',
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

      // ── Dakuten + handakuten: voiced and semi-voiced consonants ──
      // g/z/d come from k/s/t with the dakuten mark; b and p both
      // derive from h (b = dakuten, p = handakuten), so they share
      // the same row positions. The h-row column headers reuse the
      // gojuon vowel labels so the alignment is obvious.
      {
        titleKey: 'courses.japanese.hiragana.dakuten',
        columnHeaders: ['a', 'i', 'u', 'e', 'o'],
        rows: [
          { header: 'g', cells: ['ga', 'gi', 'gu', 'ge', 'go'] },
          { header: 'z', cells: ['za', 'ji', 'zu', 'ze', 'zo'] },
          { header: 'd', cells: ['da', 'dji', 'dzu', 'de', 'do'] },
          { header: 'b', cells: ['ba', 'bi', 'bu', 'be', 'bo'] },
          { header: 'p', cells: ['pa', 'pi', 'pu', 'pe', 'po'] },
        ],
      },

      // ── Yōon: palatalised mora (consonant + small ya/yu/yo) ──
      // Only き/し/ち/に/ひ/み/り and the dakuten/handakuten consonants
      // can take a yōon. The grid is k/s/t/n/h/m/r + g/j/d/b/p × 3.
      {
        titleKey: 'courses.japanese.hiragana.yoon',
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
