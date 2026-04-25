import { useAuthStore } from '~/stores/auth.store'
import { useLessonProgressStore } from '~/stores/lesson-progress.store'
import { useReviewsStore } from '~/stores/reviews.store'

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()
  if (!auth.isAuthenticated) {
    return navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath },
    })
  }

  // Load data from API on first visit (then cached in stores)
  const progressStore = useLessonProgressStore()
  if (!progressStore.initialized) {
    await progressStore.init()
  }

  const reviewsStore = useReviewsStore()
  if (!reviewsStore.loaded) {
    await reviewsStore.load()
  }
})
