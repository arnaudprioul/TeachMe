export interface ICourse {
  slug: string
  /** Path to SVG flag icon in /public/flags/ */
  flag: string
  color: string
  colorLight: string
  colorSubtle: string
  route: string
  status: 'available' | 'coming_soon'
}

export const COURSES: ICourse[] = [
  {
    slug: 'korean',
    flag: '/flags/kr.svg',
    color: '#ff9600',
    colorLight: '#ffb340',
    colorSubtle: '#fff4e0',
    route: '/korean',
    status: 'available',
  },
  {
    slug: 'japanese',
    flag: '/flags/jp.svg',
    color: '#ff4b6e',
    colorLight: '#ff7a93',
    colorSubtle: '#ffe4ea',
    route: '/japanese',
    status: 'available',
  },
  {
    slug: 'chinese',
    flag: '/flags/cn.svg',
    color: '#e63946',
    colorLight: '#ef6b77',
    colorSubtle: '#fde8ea',
    route: '/chinese',
    status: 'coming_soon',
  },
  {
    slug: 'spanish',
    flag: '/flags/es.svg',
    color: '#f59e0b',
    colorLight: '#fbbf24',
    colorSubtle: '#fef3c7',
    route: '/spanish',
    status: 'coming_soon',
  },
  {
    slug: 'german',
    flag: '/flags/de.svg',
    color: '#3b82f6',
    colorLight: '#60a5fa',
    colorSubtle: '#dbeafe',
    route: '/german',
    status: 'coming_soon',
  },
  {
    slug: 'italian',
    flag: '/flags/it.svg',
    color: '#10b981',
    colorLight: '#34d399',
    colorSubtle: '#d1fae5',
    route: '/italian',
    status: 'coming_soon',
  },
]

export function useCourses() {
  const available = COURSES.filter(c => c.status === 'available')
  const comingSoon = COURSES.filter(c => c.status === 'coming_soon')

  function getBySlug(slug: string) {
    return COURSES.find(c => c.slug === slug)
  }

  return { courses: COURSES, available, comingSoon, getBySlug }
}
