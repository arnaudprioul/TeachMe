import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'teachme_stats'

export interface ILanguageStats {
  totalSessions: number
  totalAnswered: number
  totalCorrect: number
  bestStreak: number
  lastSessionAt: number | null
}

export const useStatsStore = defineStore('stats', () => {
  const byLanguage = ref<Record<string, ILanguageStats>>({})

  function load() {
    if (typeof localStorage === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) byLanguage.value = JSON.parse(raw)
    } catch {}
  }

  function persist() {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(byLanguage.value))
  }

  function recordSession(langSlug: string, params: { answered: number; correct: number; bestStreak: number }) {
    const existing = byLanguage.value[langSlug] ?? {
      totalSessions: 0, totalAnswered: 0, totalCorrect: 0, bestStreak: 0, lastSessionAt: null,
    }
    byLanguage.value[langSlug] = {
      totalSessions: existing.totalSessions + 1,
      totalAnswered: existing.totalAnswered + params.answered,
      totalCorrect: existing.totalCorrect + params.correct,
      bestStreak: Math.max(existing.bestStreak, params.bestStreak),
      lastSessionAt: Date.now(),
    }
    persist()
  }

  function getStats(langSlug: string): ILanguageStats {
    return byLanguage.value[langSlug] ?? {
      totalSessions: 0, totalAnswered: 0, totalCorrect: 0, bestStreak: 0, lastSessionAt: null,
    }
  }

  const totals = computed(() => {
    const all = Object.values(byLanguage.value)
    return {
      sessions: all.reduce((s, x) => s + x.totalSessions, 0),
      answered: all.reduce((s, x) => s + x.totalAnswered, 0),
      correct: all.reduce((s, x) => s + x.totalCorrect, 0),
      bestStreak: all.reduce((s, x) => Math.max(s, x.bestStreak), 0),
    }
  })

  const accuracy = computed(() => {
    const t = totals.value
    return t.answered > 0 ? Math.round((t.correct / t.answered) * 100) : 0
  })

  const activeLanguages = computed(() => Object.keys(byLanguage.value))

  load()

  return { byLanguage, totals, accuracy, activeLanguages, recordSession, getStats }
})
