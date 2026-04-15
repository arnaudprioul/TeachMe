import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ILessonProgress } from '~/composables/data/courses/lesson-types'

const STORAGE_KEY = 'teachme_lesson_progress'

function progressKey(courseKey: string, lessonId: number): string {
  return `${courseKey}:${lessonId}`
}

export const useLessonProgressStore = defineStore('lesson-progress', () => {
  const byLesson = ref<Record<string, ILessonProgress>>({})

  function load() {
    if (typeof localStorage === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) byLesson.value = JSON.parse(raw)
    } catch {}
  }

  function persist() {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(byLesson.value))
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

  load()

  return { byLesson, recordAttempt, getProgress, isCompleted, isUnlocked }
})
