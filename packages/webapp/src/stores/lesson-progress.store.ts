import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ILessonProgress, TExerciseDifficulty } from '~/composables/data/courses/lesson-types'

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

export const useLessonProgressStore = defineStore('lesson-progress', () => {
  const byLesson = ref<Record<string, ILessonProgress>>({})
  const byExercise = ref<Record<string, IExerciseProgress>>({})

  function load() {
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

  function persist() {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(byLesson.value))
    localStorage.setItem(EXERCISES_KEY, JSON.stringify(byExercise.value))
  }

  function recordAttempt(courseKey: string, lessonId: number, scorePercent: number) {
    const key = progressKey(courseKey, lessonId)
    const existing = byLesson.value[key] ?? {
      lessonId,
      completed: false,
      bestScore: 0,
      attempts: 0,
      lastAttemptAt: null,
    }
    const bestScore = Math.max(existing.bestScore, scorePercent)
    byLesson.value[key] = {
      lessonId,
      completed: bestScore >= 60,
      bestScore,
      attempts: existing.attempts + 1,
      lastAttemptAt: Date.now(),
    }
    persist()
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

  function isUnlocked(_courseKey: string, _lessonId: number): boolean {
    // All lessons are freely accessible — users should be able to browse
    // ahead or revisit at any time. If we want progression gating later,
    // re-enable: `return lessonId <= 1 || isCompleted(courseKey, lessonId - 1)`
    return true
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
    byExercise.value[key] = {
      bestScore: Math.max(existing.bestScore, params.scorePercent),
      bestStreak: Math.max(existing.bestStreak, params.bestStreak),
      attempts: existing.attempts + 1,
      lastAttemptAt: Date.now(),
    }
    persist()
  }

  function getExerciseProgress(courseKey: string, lessonId: number, difficulty: TExerciseDifficulty): IExerciseProgress {
    const key = exerciseKey(courseKey, lessonId, difficulty)
    return byExercise.value[key] ?? {
      bestScore: 0, bestStreak: 0, attempts: 0, lastAttemptAt: null,
    }
  }

  load()

  return {
    byLesson,
    byExercise,
    recordAttempt,
    getProgress,
    isCompleted,
    isUnlocked,
    recordExerciseAttempt,
    getExerciseProgress,
  }
})
