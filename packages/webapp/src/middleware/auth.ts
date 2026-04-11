import { useAuthStore } from '~/stores/auth.store'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  auth.restoreFromStorage()
  if (!auth.isAuthenticated) {
    return navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath },
    })
  }
})
