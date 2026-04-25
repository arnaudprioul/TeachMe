import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ILessonProgress, TExerciseDifficulty } from '~/composables/data/courses/lesson-types'
import { useAuthStore } from './auth.store'

const STORAGE_KEY = 'teachme_lesson_progress'
const EXERCISES_KEY = 'teachme_exercise_progress'

function progressKey(courseKey: string, lessonId: number): string {
  return `${courseKey}:${lessonId}`
}

function exerciseKey(courseKey: string, lessonId: number, difficulty: TExerciseDifficulty): string {
  return `${courseKey}:${lessonId}:${difficulty}`
}

export interface IExerciseProgress {
  bestScore: number
  bestStreak: number
  attempts: number
  lastAttemptAt: number | null
}

function authHeaders(): Record<string, string> {
  const auth = useAuthStore()
  return auth.token ? { Authorization: `Bearer ${auth.token}` } : {}
}

function isAuthenticated(): boolean {
  const auth = useAuthStore()
  return auth.isAuthenticated
}

export const useLessonProgressStore = defineStore('lesson-progress', () => {
  const byLesson = ref<Record<string, ILessonProgress>>({})
  const byExercise = ref<Record<string, IExerciseProgress>>({})

  const initialized = ref(false)

  /** Load from localStorage (fast, sync). */
  function loadFromCache() {
    if (typeof localStorage === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) byLesson.value = JSON.parse(raw)
    } catch {}
    try {
      const raw = localStorage.getItem(EXERCISES_KEY)
      if (raw) byExercise.value = JSON.parse(raw)
    } catch {}
  }

  /** Initialize: load cache + fetch from API. Called once by auth middleware. */
  async function init() {
    if (initialized.value) return
    loadFromCache()
    if (isAuthenticated()) {
      await fetchAndMergeAll()
    }
    initialized.value = true
  }

  function persist() {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(byLesson.value))
    localStorage.setItem(EXERCISES_KEY, JSON.stringify(byExercise.value))
  }

  /** Fetch progress from the API for a specific course and merge with local state. */
  async function fetchAndMerge(courseKey: string) {
    if (!isAuthenticated()) return
    try {
      const res = await $fetch<{
        data: {
          lessons: Array<{
            lessonId: string
            completed: boolean
            bestScore: number
            attempts: number
            lastAttemptAt: string | null
          }>
          exercises: Array<{
            lessonId: string
            difficulty: string
            bestScore: number
            bestStreak: number
            attempts: number
            lastAttemptAt: string | null
          }>
        }
      }>(`/api/v1/progress?courseKey=${encodeURIComponent(courseKey)}`, {
        headers: authHeaders(),
      })

      // Merge lesson progress — keep the best values
      for (const remote of res.data.lessons) {
        const key = progressKey(courseKey, Number(remote.lessonId))
        const local = byLesson.value[key]
        byLesson.value[key] = {
          lessonId: Number(remote.lessonId),
          completed: (local?.completed || remote.completed),
          bestScore: Math.max(local?.bestScore ?? 0, remote.bestScore),
          attempts: Math.max(local?.attempts ?? 0, remote.attempts),
          lastAttemptAt: Math.max(local?.lastAttemptAt ?? 0, remote.lastAttemptAt ? new Date(remote.lastAttemptAt).getTime() : 0) || null,
        }
      }

      // Merge exercise progress — keep the best values
      for (const remote of res.data.exercises) {
        const key = exerciseKey(courseKey, Number(remote.lessonId), remote.difficulty as TExerciseDifficulty)
        const local = byExercise.value[key]
        byExercise.value[key] = {
          bestScore: Math.max(local?.bestScore ?? 0, remote.bestScore),
          bestStreak: Math.max(local?.bestStreak ?? 0, remote.bestStreak),
          attempts: Math.max(local?.attempts ?? 0, remote.attempts),
          lastAttemptAt: Math.max(local?.lastAttemptAt ?? 0, remote.lastAttemptAt ? new Date(remote.lastAttemptAt).getTime() : 0) || null,
        }
      }

      persist()
    } catch (err) {
      console.warn('[lesson-progress.store] fetchAndMerge failed', err)
    }
  }

  /** Fetch progress for all courses found in local state. */
  async function fetchAndMergeAll() {
    if (!isAuthenticated()) return
    // Extract unique course keys from local state
    const courseKeys = new Set<string>()
    for (const key of Object.keys(byLesson.value)) {
      const parts = key.split(':')
      if (parts.length >= 2) courseKeys.add(parts.slice(0, -1).join(':'))
    }
    for (const key of Object.keys(byExercise.value)) {
      const parts = key.split(':')
      if (parts.length >= 3) courseKeys.add(parts.slice(0, -2).join(':'))
    }
    for (const courseKey of courseKeys) {
      await fetchAndMerge(courseKey)
    }
  }

  function recordAttempt(courseKey: string, lessonId: number, scorePercent: number, markComplete = false) {
    const key = progressKey(courseKey, lessonId)
    const existing = byLesson.value[key] ?? {
      lessonId,
      completed: false,
      bestScore: 0,
      attempts: 0,
      lastAttemptAt: null,
    }
    const bestScore = Math.max(existing.bestScore, scorePercent)
    const attempts = existing.attempts + 1
    // completed only changes to true when explicitly requested via markComplete
    const completed = existing.completed || markComplete
    byLesson.value[key] = {
      lessonId,
      completed,
      bestScore,
      attempts,
      lastAttemptAt: Date.now(),
    }
    persist()

    // Fire API call in background
    if (isAuthenticated()) {
      $fetch('/api/v1/progress/lesson', {
        method: 'POST',
        headers: authHeaders(),
        body: { courseKey, lessonId, completed, bestScore, attempts },
      }).catch((err) => console.warn('[lesson-progress.store] API save lesson failed', err))
    }
  }

  function getProgress(courseKey: string, lessonId: number): ILessonProgress {
    const key = progressKey(courseKey, lessonId)
    return byLesson.value[key] ?? {
      lessonId,
      completed: false,
      bestScore: 0,
      attempts: 0,
      lastAttemptAt: null,
    }
  }

  function isCompleted(courseKey: string, lessonId: number): boolean {
    return getProgress(courseKey, lessonId).completed
  }

  function isUnlocked(courseKey: string, lessonId: number): boolean {
    return lessonId <= 1 || isCompleted(courseKey, lessonId - 1)
  }

  /** Exam (lessonId 0) is unlocked when ALL lessons in the level are completed. */
  function isExamUnlocked(courseKey: string, totalLessons: number): boolean {
    for (let i = 1; i <= totalLessons; i++) {
      if (!isCompleted(courseKey, i)) return false
    }
    return totalLessons > 0
  }

  /** Returns true if the exam (lessonId 0) has been passed (score >= 70). */
  function isExamPassed(courseKey: string): boolean {
    return getProgress(courseKey, 0).bestScore >= 70
  }

  /** Returns true if the level is fully completed (exam passed). */
  function isLevelCompleted(courseKey: string): boolean {
    return isExamPassed(courseKey)
  }

  // ── Exercise progress per difficulty ──

  function recordExerciseAttempt(
    courseKey: string, lessonId: number, difficulty: TExerciseDifficulty,
    params: { scorePercent: number; bestStreak: number },
  ) {
    const key = exerciseKey(courseKey, lessonId, difficulty)
    const existing = byExercise.value[key] ?? {
      bestScore: 0, bestStreak: 0, attempts: 0, lastAttemptAt: null,
    }
    const bestScore = Math.max(existing.bestScore, params.scorePercent)
    const bestStreak = Math.max(existing.bestStreak, params.bestStreak)
    byExercise.value[key] = {
      bestScore,
      bestStreak,
      attempts: existing.attempts + 1,
      lastAttemptAt: Date.now(),
    }
    persist()

    // Fire API call in background
    if (isAuthenticated()) {
      $fetch('/api/v1/progress/exercise', {
        method: 'POST',
        headers: authHeaders(),
        body: { courseKey, lessonId, difficulty, bestScore, bestStreak },
      }).catch((err) => console.warn('[lesson-progress.store] API save exercise failed', err))
    }
  }

  function getExerciseProgress(courseKey: string, lessonId: number, difficulty: TExerciseDifficulty): IExerciseProgress {
    const key = exerciseKey(courseKey, lessonId, difficulty)
    return byExercise.value[key] ?? {
      bestScore: 0, bestStreak: 0, attempts: 0, lastAttemptAt: null,
    }
  }

  /** Push all local progress to the API. Call on login to sync offline progress. */
  async function sync() {
    if (!isAuthenticated()) return

    const promises: Promise<unknown>[] = []

    for (const [key, progress] of Object.entries(byLesson.value)) {
      const parts = key.split(':')
      const lessonId = Number(parts.pop())
      const courseKey = parts.join(':')
      if (isNaN(lessonId)) continue

      promises.push(
        $fetch('/api/v1/progress/lesson', {
          method: 'POST',
          headers: authHeaders(),
          body: {
            courseKey,
            lessonId,
            completed: progress.completed,
            bestScore: progress.bestScore,
            attempts: progress.attempts,
          },
        }).catch((err) => console.warn('[lesson-progress.store] sync lesson failed', err))
      )
    }

    for (const [key, progress] of Object.entries(byExercise.value)) {
      const parts = key.split(':')
      const difficulty = parts.pop()
      const lessonId = Number(parts.pop())
      const courseKey = parts.join(':')
      if (isNaN(lessonId) || !difficulty) continue

      promises.push(
        $fetch('/api/v1/progress/exercise', {
          method: 'POST',
          headers: authHeaders(),
          body: {
            courseKey,
            lessonId,
            difficulty,
            bestScore: progress.bestScore,
            bestStreak: progress.bestStreak,
          },
        }).catch((err) => console.warn('[lesson-progress.store] sync exercise failed', err))
      )
    }

    await Promise.all(promises)

    // After syncing, fetch back to get merged server state
    await fetchAndMergeAll()
  }

  // Load cache immediately (sync, no API call)
  loadFromCache()

  return {
    byLesson,
    byExercise,
    initialized,
    init,
    recordAttempt,
    getProgress,
    isCompleted,
    isUnlocked,
    isExamUnlocked,
    isExamPassed,
    isLevelCompleted,
    recordExerciseAttempt,
    getExerciseProgress,
    fetchAndMerge,
    sync,
  }
})
