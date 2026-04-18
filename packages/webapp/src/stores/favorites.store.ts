import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'teachme_favorites'

/** Favorites scoped per course (key = `${lang}-${course}`). */
export const useFavoritesStore = defineStore('favorites', () => {
  const byCourse = ref<Record<string, Set<string>>>({})

  function load() {
    if (typeof localStorage === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)

      // Migration: legacy flat array → korean-hangeul scoped
      if (Array.isArray(parsed)) {
        byCourse.value = { 'korean-hangeul': new Set(parsed) }
        persist()
        return
      }

      // Modern format: { 'korean-hangeul': string[] }
      const normalized: Record<string, Set<string>> = {}
      for (const [key, value] of Object.entries(parsed)) {
        normalized[key] = new Set(Array.isArray(value) ? value : [])
      }
      byCourse.value = normalized
    } catch {}
  }

  function persist() {
    if (typeof localStorage === 'undefined') return
    const serializable: Record<string, string[]> = {}
    for (const [key, set] of Object.entries(byCourse.value)) {
      serializable[key] = [...set]
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable))
  }

  function toggle(courseKey: string, charId: string) {
    if (!byCourse.value[courseKey]) byCourse.value[courseKey] = new Set()
    const set = byCourse.value[courseKey]
    if (set.has(charId)) set.delete(charId)
    else set.add(charId)
    byCourse.value = { ...byCourse.value, [courseKey]: new Set(set) }
    persist()
  }

  function addMany(courseKey: string, charIds: string[]) {
    if (!byCourse.value[courseKey]) byCourse.value[courseKey] = new Set()
    const set = byCourse.value[courseKey]
    for (const id of charIds) set.add(id)
    byCourse.value = { ...byCourse.value, [courseKey]: new Set(set) }
    persist()
  }

  function removeMany(courseKey: string, charIds: string[]) {
    const set = byCourse.value[courseKey]
    if (!set) return
    for (const id of charIds) set.delete(id)
    byCourse.value = { ...byCourse.value, [courseKey]: new Set(set) }
    persist()
  }

  function areAllFavorites(courseKey: string, charIds: string[]): boolean {
    const set = byCourse.value[courseKey]
    if (!set || charIds.length === 0) return false
    return charIds.every(id => set.has(id))
  }

  function isFavorite(courseKey: string, charId: string): boolean {
    return byCourse.value[courseKey]?.has(charId) ?? false
  }

  function listForCourse(courseKey: string): string[] {
    return [...(byCourse.value[courseKey] ?? [])]
  }

  function countForCourse(courseKey: string): number {
    return byCourse.value[courseKey]?.size ?? 0
  }

  const totalCount = computed(() => {
    let n = 0
    for (const s of Object.values(byCourse.value)) n += s.size
    return n
  })

  const courseKeys = computed(() => Object.keys(byCourse.value).filter(k => byCourse.value[k].size > 0))

  load()

  return { byCourse, totalCount, courseKeys, toggle, addMany, removeMany, areAllFavorites, isFavorite, listForCourse, countForCourse }
})
