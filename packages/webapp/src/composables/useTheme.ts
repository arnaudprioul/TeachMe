import { ref, watch, onMounted } from 'vue'

export type ThemeMode = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'teachme_theme'

const mode = ref<ThemeMode>('system')

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

function init() {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
    if (stored && ['system', 'light', 'dark'].includes(stored)) {
      mode.value = stored
    }
  }
  applyTheme()

  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (mode.value === 'system') applyTheme()
    })
  }
}

export function useTheme() {
  onMounted(init)

  const resolvedTheme = computed(() => {
    if (mode.value === 'system') return getSystemPreference()
    return mode.value
  })

  return { mode, resolvedTheme, setTheme }
}
