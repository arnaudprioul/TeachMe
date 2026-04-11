import type { ICourseModule } from '../types'
import { CHARACTERS } from './characters'
import { STROKES } from './strokes'
import { PHONETICS } from './phonetics'
import { SPEECH } from './speech'
import { SYLLABLES } from './syllables'
import heroImage from '~/assets/images/courses/korean-hangeul/hero.jpg'

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
    hasSyllables: true,
    hasCosmology: true,
  },
}
