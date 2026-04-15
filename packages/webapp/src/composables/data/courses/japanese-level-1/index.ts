import type { ICourseModule } from '../types'
import type { ILevelIntro } from '../lesson-types'
import { LESSONS } from './lessons'

const LEVEL_INTRO: ILevelIntro = {
  descriptionKey: 'courses.japanese.level1.intro.description',
  objectiveKeys: [
    'courses.japanese.level1.intro.obj1',
    'courses.japanese.level1.intro.obj2',
    'courses.japanese.level1.intro.obj3',
    'courses.japanese.level1.intro.obj4',
    'courses.japanese.level1.intro.obj5',
  ],
  officialLevelInfoKey: 'courses.japanese.level1.intro.officialInfo',
  officialLevelLink: 'https://www.jlpt.jp/e/',
}

export const japaneseLevel1: ICourseModule = {
  key: 'japanese-level-1',
  lang: 'japanese',
  course: 'level-1',
  lessons: LESSONS,
  levelIntro: LEVEL_INTRO,
  config: {
    heroImage: '',
    ttsLang: 'ja-JP',
    ttsVoicePrefs: ['Kyoko', 'Otoya', 'Google 日本語', 'Microsoft Nanami', 'Microsoft Ichiro'],
    localePrefix: 'courses.japanese.level1',
    officialLevel: 'JLPT N5',
    estimatedDuration: '~10h',
    categories: [],
  },
}
