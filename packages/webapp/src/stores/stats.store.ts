import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'teachme_stats'

export interface ICourseStats {
  totalSessions: number
  totalAnswered: number
  totalCorrect: number
  bestStreak: number
  lastSessionAt: number | null
}

export const useStatsStore = defineStore('stats', () => {
  // keyed by compound `${lang}-${course}`
  const byCourse = ref<Record<string, ICourseStats>>({})

  function load() {
    if (typeof localStorage === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        byCourse.value = parsed

        // Migration: legacy 'korean' key → 'korean-hangeul'
        if (parsed.korean && !parsed['korean-hangeul']) {
          byCourse.value['korean-hangeul'] = parsed.korean
          delete byCourse.value.korean
          persist()
        }
      }
    } catch {}
  }

  function persist() {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(byCourse.value))
  }

  function recordSession(courseKey: string, params: { answered: number; correct: number; bestStreak: number }) {
    const existing = byCourse.value[courseKey] ?? {
      totalSessions: 0, totalAnswered: 0, totalCorrect: 0, bestStreak: 0, lastSessionAt: null,
    }
    byCourse.value[courseKey] = {
      totalSessions: existing.totalSessions + 1,
      totalAnswered: existing.totalAnswered + params.answered,
      totalCorrect: existing.totalCorrect + params.correct,
      bestStreak: Math.max(existing.bestStreak, params.bestStreak),
      lastSessionAt: Date.now(),
    }
    persist()
  }

  function getStats(courseKey: string): ICourseStats {
    return byCourse.value[courseKey] ?? {
      totalSessions: 0, totalAnswered: 0, totalCorrect: 0, bestStreak: 0, lastSessionAt: null,
    }
  }

  const totals = computed(() => {
    const all = Object.values(byCourse.value)
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

  const activeCourses = computed(() => Object.keys(byCourse.value))

  load()

  return { byCourse, totals, accuracy, activeCourses, recordSession, getStats }
})
