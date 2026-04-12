import type { ICourseModule, ICourseCharacter, ITrainingItemBase } from '../types'
import { CHARACTERS } from './characters'
import { STROKES } from './strokes'
import { PHONETICS } from './phonetics'
import { SPEECH } from './speech'
import { SYLLABLES } from './syllables'
import heroImage from '~/assets/images/courses/korean-hangeul/hero.jpg'

/**
 * Wrap a vowel character in its canonical `ㅇ + vowel` syllable form so the
 * training quiz never displays a bare `ㅏ / ㅓ / …` jamo. Korean writing
 * always renders standalone vowels with the silent ieung; teaching them
 * bare encourages the wrong reading habit.
 */
function vowelToIeungItem(c: ICourseCharacter): ITrainingItemBase | null {
  if (!SYLLABLES) return null
  const ieungIdx = SYLLABLES.initials.findIndex(i => i.id === 'ieung')
  const vowelIdx = SYLLABLES.medials.findIndex(v => v.id === c.id)
  if (ieungIdx < 0 || vowelIdx < 0) return null
  const built = SYLLABLES.build(ieungIdx, vowelIdx)
  if (!built.id) return null
  return {
    id: c.id,                  // keep the bare-vowel id for SRS / stats
    symbol: built.symbol,      // 아 instead of ㅏ
    romanization: c.romanization,
    type: 'jamo',
    jamoType: c.type,
    jamoSubtype: c.subtype,
  }
}

export const koreanHangeul: ICourseModule = {
  key: 'korean-hangeul',
  lang: 'korean',
  course: 'hangeul',
  characters: CHARACTERS,
  strokes: STROKES,
  phonetics: PHONETICS,
  speech: SPEECH,
  syllables: SYLLABLES,
  config: {
    heroImage,
    ttsLang: 'ko-KR',
    ttsVoicePrefs: ['Yuna', 'Heami', 'Google 한국의', 'Microsoft Heami', 'Microsoft SunHi'],
    localePrefix: 'courses.korean.hangeul',

    // Training pool: 4 toggles, one per Korean jamo group.
    categories: [
      {
        id: 'basic-consonants',
        labelKey: 'courses.korean.hangeul.basicConsonants',
        matches: c => c.type === 'consonant' && c.subtype === 'basic',
      },
      {
        id: 'double-consonants',
        labelKey: 'courses.korean.hangeul.doubleConsonants',
        matches: c => c.type === 'consonant' && c.subtype === 'double',
      },
      {
        id: 'basic-vowels',
        labelKey: 'courses.korean.hangeul.basicVowels',
        matches: c => c.type === 'vowel' && c.subtype === 'basic',
      },
      {
        id: 'compound-vowels',
        labelKey: 'courses.korean.hangeul.compoundVowels',
        matches: c => c.type === 'vowel' && c.subtype === 'compound',
      },
    ],
    // Korean wraps vowels in `ㅇ + vowel` for display in the quiz pool.
    toTrainingItem: (c) => {
      if (c.type === 'vowel') return vowelToIeungItem(c)
      return null  // fall back to default jamoToItem
    },
    // Vowels are displayed as `아 / 어 / …` syllables but the verifier
    // only has stroke data for the bare jamo, so they can't be drawn.
    nonDrawableTypes: ['vowel'],

    // Landing-page sections specific to Hangeul.
    hasOriginStory: true,
    hasCosmology: true,
    hasSilentInitialRule: true,
    hasSyllableComposition: true,

    hasSyllables: true, // legacy
  },
}
