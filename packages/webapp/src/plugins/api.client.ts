import { useAuthStore } from '~/stores/auth.store'

/**
 * Client-side plugin that intercepts 401 responses to:
 * - log the user out
 * - redirect to /auth/login with the current fullPath as `redirect` query param
 *
 * It also injects the Authorization header on every $fetch call when a token exists.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const auth = useAuthStore()

  globalThis.$fetch = $fetch.create({
    onRequest({ options }) {
      auth.restoreFromStorage()
      if (auth.token) {
        const headers = new Headers(options.headers as HeadersInit | undefined)
        headers.set('Authorization', `Bearer ${auth.token}`)
        options.headers = headers
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        auth.logout()
        const router = nuxtApp.$router as any
        const current = router?.currentRoute?.value?.fullPath ?? '/dashboard'
        // Avoid loop if already on login
        if (!current.startsWith('/auth/')) {
          await router.push({ path: '/auth/login', query: { redirect: current } })
        }
      }
    },
  })
})
