import { computed } from 'vue'
import { listCoursesForLanguage } from './data/courses'

export interface ILanguageHighlight {
  icon: string
  titleKey: string
  descKey: string
}

export interface ILanguageCourse {
  slug: string
  titleKey: string
  descKey: string
  icon: string
  route: string
  available: boolean
}

export interface ILanguageProfile {
  slug: string
  nameKey: string
  flag: string
  heroTitleKey: string
  heroSubKey: string
  highlights: ILanguageHighlight[]
  facts: { labelKey: string; value: string }[]
}

const PROFILES: Record<string, ILanguageProfile> = {
  korean: {
    slug: 'korean',
    nameKey: 'courses.korean.name',
    flag: '\u{1F1F0}\u{1F1F7}',
    heroTitleKey: 'langProfile.korean.heroTitle',
    heroSubKey: 'langProfile.korean.heroSub',
    highlights: [
      { icon: '🎵', titleKey: 'langProfile.korean.musicTitle', descKey: 'langProfile.korean.musicDesc' },
      { icon: '🍜', titleKey: 'langProfile.korean.foodTitle', descKey: 'langProfile.korean.foodDesc' },
      { icon: '🎬', titleKey: 'langProfile.korean.dramaTitle', descKey: 'langProfile.korean.dramaDesc' },
      { icon: '🏛️', titleKey: 'langProfile.korean.historyTitle', descKey: 'langProfile.korean.historyDesc' },
    ],
    facts: [
      { labelKey: 'langProfile.korean.factSpeakers', value: '80M+' },
      { labelKey: 'langProfile.korean.factAlphabet', value: '40' },
      { labelKey: 'langProfile.korean.factRanking', value: '#13' },
      { labelKey: 'langProfile.korean.factCountry', value: '🇰🇷 🇰🇵' },
    ],
  },
  japanese: {
    slug: 'japanese',
    nameKey: 'courses.japanese.name',
    flag: '\u{1F1EF}\u{1F1F5}',
    heroTitleKey: 'langProfile.japanese.heroTitle',
    heroSubKey: 'langProfile.japanese.heroSub',
    highlights: [
      { icon: '🍣', titleKey: 'langProfile.japanese.foodTitle',    descKey: 'langProfile.japanese.foodDesc' },
      { icon: '🎌', titleKey: 'langProfile.japanese.cultureTitle', descKey: 'langProfile.japanese.cultureDesc' },
      { icon: '🌸', titleKey: 'langProfile.japanese.animeTitle',   descKey: 'langProfile.japanese.animeDesc' },
      { icon: '⛩️', titleKey: 'langProfile.japanese.historyTitle', descKey: 'langProfile.japanese.historyDesc' },
    ],
    facts: [
      { labelKey: 'langProfile.japanese.factSpeakers', value: '125M+' },
      { labelKey: 'langProfile.japanese.factAlphabet', value: '46+46' },
      { labelKey: 'langProfile.japanese.factRanking',  value: '#9' },
      { labelKey: 'langProfile.japanese.factCountry',  value: '🇯🇵' },
    ],
  },
}

const COURSE_ICONS: Record<string, string> = {
  hangeul: '한',
  hiragana: 'あ',
  katakana: 'ア',
  pinyin: '汉',
}

export function useLanguageProfile(slug: string) {
  const profile = PROFILES[slug]

  const courses = computed<ILanguageCourse[]>(() =>
    listCoursesForLanguage(slug).map(m => ({
      slug: m.course,
      titleKey: `courses.${m.lang}.${m.course}.title`,
      descKey: `courses.${m.lang}.${m.course}.desc`,
      icon: COURSE_ICONS[m.course] ?? '?',
      route: `/${m.lang}/${m.course}`,
      available: true,
    })),
  )

  return { profile, courses }
}
