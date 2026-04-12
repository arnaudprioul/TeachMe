import { computed } from 'vue'
import { useCourseContext } from './useCourseContext'
import type { ICourseCharacter } from './data/courses/types'

/**
 * Generic helpers around the active course's character list.
 */
export function useCourseData() {
  const { module } = useCourseContext()

  const all = computed<ICourseCharacter[]>(() => module.value?.characters ?? [])

  const consonants = computed(() => all.value.filter(c => c.type === 'consonant'))
  const vowels = computed(() => all.value.filter(c => c.type === 'vowel'))
  const basicConsonants = computed(() => consonants.value.filter(c => c.subtype === 'basic'))
  const doubleConsonants = computed(() => consonants.value.filter(c => c.subtype === 'double'))
  const basicVowels = computed(() => vowels.value.filter(v => v.subtype === 'basic'))
  const compoundVowels = computed(() => vowels.value.filter(v => v.subtype === 'compound'))

  function getById(id: string): ICourseCharacter | undefined {
    return all.value.find(c => c.id === id)
  }

  function getPrev(id: string): ICourseCharacter | undefined {
    const i = all.value.findIndex(c => c.id === id)
    return i > 0 ? all.value[i - 1] : undefined
  }

  function getNext(id: string): ICourseCharacter | undefined {
    const i = all.value.findIndex(c => c.id === id)
    return i >= 0 && i < all.value.length - 1 ? all.value[i + 1] : undefined
  }

  function phoneticsOf(id: string, locale: string) {
    const data = module.value?.phonetics[id]
    return data?.[locale] ?? data?.en
  }

  function speechTextOf(id: string, fallback: string): string {
    return module.value?.speech[id] ?? fallback
  }

  return {
    all,
    consonants, vowels,
    basicConsonants, doubleConsonants, basicVowels, compoundVowels,
    getById, getPrev, getNext,
    phoneticsOf, speechTextOf,
  }
}
