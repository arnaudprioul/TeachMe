import { defineStore } from 'pinia'
import { createLessonExercise } from '~/composables/useLessonExercise'

export const useLessonExerciseStore = defineStore('lesson-exercise', () => createLessonExercise())
