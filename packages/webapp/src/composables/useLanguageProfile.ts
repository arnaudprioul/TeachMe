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
  // Hero
  heroTitleKey: string
  heroSubKey: string
  heroImage?: string // optional background/illustration
  // Cultural highlights (3-4 cards)
  highlights: ILanguageHighlight[]
  // Courses / writing systems
  courses: ILanguageCourse[]
  // Fun facts (displayed in a band)
  facts: { labelKey: string; value: string }[]
}

const PROFILES: Record<string, ILanguageProfile> = {
  korean: {
    slug: 'korean',
    nameKey: 'courses.korean',
    flag: '\u{1F1F0}\u{1F1F7}',
    heroTitleKey: 'langProfile.korean.heroTitle',
    heroSubKey: 'langProfile.korean.heroSub',
    highlights: [
      { icon: '🎵', titleKey: 'langProfile.korean.musicTitle', descKey: 'langProfile.korean.musicDesc' },
      { icon: '🍜', titleKey: 'langProfile.korean.foodTitle', descKey: 'langProfile.korean.foodDesc' },
      { icon: '🎬', titleKey: 'langProfile.korean.dramaTitle', descKey: 'langProfile.korean.dramaDesc' },
      { icon: '🏛️', titleKey: 'langProfile.korean.historyTitle', descKey: 'langProfile.korean.historyDesc' },
    ],
    courses: [
      { slug: 'hangeul', titleKey: 'korean.hangeul', descKey: 'korean.hangeulDesc', icon: '한', route: '/korean/hangeul', available: true },
    ],
    facts: [
      { labelKey: 'langProfile.korean.factSpeakers', value: '80M+' },
      { labelKey: 'langProfile.korean.factAlphabet', value: '40' },
      { labelKey: 'langProfile.korean.factRanking', value: '#13' },
      { labelKey: 'langProfile.korean.factCountry', value: '🇰🇷 🇰🇵' },
    ],
  },
}

export function useLanguageProfile(slug: string) {
  const profile = PROFILES[slug]
  return { profile }
}
