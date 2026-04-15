import type { ICourseModule } from '../types'
import type { ILevelIntro } from '../lesson-types'
import { LESSONS } from './lessons'

const LEVEL_INTRO: ILevelIntro = {
  descriptionKey: 'courses.korean.level1.intro.description',
  objectiveKeys: [
    'courses.korean.level1.intro.obj1',
    'courses.korean.level1.intro.obj2',
    'courses.korean.level1.intro.obj3',
    'courses.korean.level1.intro.obj4',
    'courses.korean.level1.intro.obj5',
  ],
  officialLevelInfoKey: 'courses.korean.level1.intro.officialInfo',
  officialLevelLink: 'https://www.topik.go.kr/',
}

export const koreanLevel1: ICourseModule = {
  key: 'korean-level-1',
  lang: 'korean',
  course: 'level-1',
  lessons: LESSONS,
  levelIntro: LEVEL_INTRO,
  config: {
    heroImage: '',
    ttsLang: 'ko-KR',
    ttsVoicePrefs: ['Yuna', 'Heami', 'Google 한국의', 'Microsoft Heami', 'Microsoft SunHi'],
    localePrefix: 'courses.korean.level1',
    officialLevel: 'TOPIK I',
    estimatedDuration: '~10h',
    categories: [],
  },
}
