import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

/**
 * Metadata for every UI language supported by the app.
 *
 * To add a new interface language (e.g. Spanish):
 *   1. Add the entry here with its native name + flag
 *   2. Create `assets/locales/es.json` (mirror every key from en.json)
 *   3. Register it in `nuxt.config.ts` under `i18n.locales`
 *
 * The profile picker reads this map and automatically surfaces any new
 * locale without further code changes.
 */
export interface IUiLocaleMeta {
  code: string        // ISO code ('en', 'fr', 'es', 'ko', 'ja'…)
  nativeName: string  // Displayed to the user in its own language
  flag: string        // Flag emoji (country most-associated with the lang)
}

export const UI_LOCALES: Record<string, IUiLocaleMeta> = {
  en: { code: 'en', nativeName: 'English',  flag: '🇬🇧' },
  fr: { code: 'fr', nativeName: 'Français', flag: '🇫🇷' },
  // Future: add more here. Examples:
  // es: { code: 'es', nativeName: 'Español',  flag: '🇪🇸' },
  // de: { code: 'de', nativeName: 'Deutsch',  flag: '🇩🇪' },
  // ja: { code: 'ja', nativeName: '日本語',    flag: '🇯🇵' },
  // ko: { code: 'ko', nativeName: '한국어',    flag: '🇰🇷' },
  // zh: { code: 'zh', nativeName: '中文',      flag: '🇨🇳' },
}

/**
 * Returns the current locale + the list of available UI locales with
 * their native names and flags.
 */
export function useUiLocales() {
  const { locale, setLocale, availableLocales } = useI18n()

  /** All locales actually registered in nuxt.config, joined with their meta. */
  const locales = computed<IUiLocaleMeta[]>(() =>
    availableLocales.map(code => UI_LOCALES[code] ?? {
      code, nativeName: code.toUpperCase(), flag: '🏳️',
    }),
  )

  const currentMeta = computed<IUiLocaleMeta | undefined>(() => UI_LOCALES[locale.value])

  return { locale, setLocale, locales, currentMeta }
}
