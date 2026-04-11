import { useTheme } from '~/composables/useTheme'

/**
 * Ensures the theme module is imported (and therefore hydrated from
 * localStorage) at app boot, even on layouts/pages that don't reference
 * useTheme() themselves — e.g. /auth/login. Without this, a fresh load on
 * the auth pages would render with the system default until the user
 * navigates into the app.
 */
export default defineNuxtPlugin({
  name: 'theme-init',
  enforce: 'pre',
  setup() {
    useTheme()
  },
})
