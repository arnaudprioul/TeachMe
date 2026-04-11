import { defineStore } from 'pinia'
import { createCourseTraining } from '~/composables/useCourseTraining'

export const useTrainingStore = defineStore('training', () => createCourseTraining())
