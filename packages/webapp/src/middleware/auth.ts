import { useAuthStore } from '~/stores/auth.store'

export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()
  auth.restoreFromStorage()
  if (!auth.isAuthenticated) return navigateTo('/auth/login')
})
