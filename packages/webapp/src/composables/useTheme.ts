import { ref, computed } from 'vue'

export type ThemeMode = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'teachme_theme'
const VALID_MODES: ThemeMode[] = ['system', 'light', 'dark']

function readStoredMode(): ThemeMode {
  if (typeof localStorage === 'undefined') return 'system'
  const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
  return stored && VALID_MODES.includes(stored) ? stored : 'system'
}

// Module-level singleton — hydrated synchronously on first import.
const mode = ref<ThemeMode>(readStoredMode())

function getSystemPreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme() {
  if (typeof document === 'undefined') return
  const html = document.documentElement
  if (mode.value === 'system') {
    html.removeAttribute('data-theme')
  } else {
    html.setAttribute('data-theme', mode.value)
  }
}

function setTheme(newMode: ThemeMode) {
  mode.value = newMode
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, newMode)
  }
  applyTheme()
}

// One-time side effects on first import (client-only).
let initialized = false
function initOnce() {
  if (initialized) return
  initialized = true
  applyTheme()
  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (mode.value === 'system') applyTheme()
    })
  }
}
if (typeof window !== 'undefined') initOnce()

export function useTheme() {
  // Cover the SSR-then-hydrate edge case: if the module was first evaluated
  // on the server, initOnce() was a no-op. Re-run it now that we're certain
  // to be on the client.
  initOnce()

  const resolvedTheme = computed(() => {
    if (mode.value === 'system') return getSystemPreference()
    return mode.value
  })

  return { mode, resolvedTheme, setTheme }
}
