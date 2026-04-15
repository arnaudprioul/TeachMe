import { defineStore } from 'pinia'
import { createLessonQuiz } from '~/composables/useLessonQuiz'

export const useLessonQuizStore = defineStore('lesson-quiz', () => createLessonQuiz())
