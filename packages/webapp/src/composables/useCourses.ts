export interface ICourse {
  slug: string
  flag: string
  color: string
  colorLight: string
  colorSubtle: string
  route: string
  status: 'available' | 'coming_soon'
}

const COURSES: ICourse[] = [
  {
    slug: 'korean',
    flag: '\u{1F1F0}\u{1F1F7}',
    color: '#ff9600',
    colorLight: '#ffb340',
    colorSubtle: '#fff4e0',
    route: '/korean',
    status: 'available',
  },
  {
    slug: 'japanese',
    flag: '\u{1F1EF}\u{1F1F5}',
    color: '#ff4b6e',
    colorLight: '#ff7a93',
    colorSubtle: '#ffe4ea',
    route: '/japanese',
    status: 'available',
  },
  {
    slug: 'chinese',
    flag: '\u{1F1E8}\u{1F1F3}',
    color: '#e63946',
    colorLight: '#ef6b77',
    colorSubtle: '#fde8ea',
    route: '/chinese',
    status: 'coming_soon',
  },
  {
    slug: 'spanish',
    flag: '\u{1F1EA}\u{1F1F8}',
    color: '#f59e0b',
    colorLight: '#fbbf24',
    colorSubtle: '#fef3c7',
    route: '/spanish',
    status: 'coming_soon',
  },
  {
    slug: 'german',
    flag: '\u{1F1E9}\u{1F1EA}',
    color: '#3b82f6',
    colorLight: '#60a5fa',
    colorSubtle: '#dbeafe',
    route: '/german',
    status: 'coming_soon',
  },
  {
    slug: 'italian',
    flag: '\u{1F1EE}\u{1F1F9}',
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
