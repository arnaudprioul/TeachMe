import { ref } from 'vue'
import { useCourseContext } from './useCourseContext'

/**
 * TTS playback for the active course, backed by the `/api/v1/tts` Nitro
 * proxy (which itself talks to Google Translate's audio endpoint).
 *
 * We deliberately don't use `window.speechSynthesis` here:
 *   - Native voices vary wildly across OS/browser combos (Yuna, Heami,
 *     Google 한국의, Microsoft Heami, …) and produce inconsistent
 *     pronunciation, especially for tricky CJK syllables like Hangeul `의`
 *     which gets read as the genitive particle `/e/` half the time.
 *   - The cancel/cut behaviour is unreliable on macOS Chrome.
 *   - There's no way to pre-fetch / cache speech.
 *
 * The HTMLAudioElement path is dead simple by comparison: build a URL,
 * play it, pause it. The browser caches the audio response by URL
 * (long Cache-Control set by the proxy), so the second time the user
 * lands on the same character the audio is instant and offline-friendly.
 */
export function useCourseAudio() {
  const { module } = useCourseContext()

  const isSpeaking = ref(false)
  // True from the moment `speak()` is called until either the audio
  // actually starts playing (onplay) or the request fails. UIs use this
  // to show a spinner on the speaker button while the bytes are being
  // fetched from the proxy / Google, so the user knows the click was
  // registered even on a cold cache (~1s round-trip).
  const isLoading = ref(false)
  // The proxy is always reachable in normal operation, so we report
  // "supported" unconditionally. The UI uses this only to decide whether
  // to render the speaker button at all.
  const isSupported = ref(true)

  let currentAudio: HTMLAudioElement | null = null

  function ttsLangCode(): string {
    // module.config.ttsLang is in IETF form (`ko-KR`, `ja-JP`, …) but
    // Google Translate TTS expects only the language part.
    const full = module.value?.config.ttsLang ?? 'ko'
    return full.split('-')[0] || 'ko'
  }

  function buildUrl(text: string, lang?: string): string {
    const l = lang ?? ttsLangCode()
    return `/api/v1/tts?text=${encodeURIComponent(text)}&lang=${encodeURIComponent(l)}`
  }

  /**
   * Warm the browser HTTP cache for a given speech text *before* the user
   * actually clicks the speaker button. The proxy sets a long
   * `Cache-Control: immutable` so the next time anyone (including the
   * `<audio>` element on click) fetches the same URL, it comes straight
   * from cache with zero network latency. Fire-and-forget — we don't
   * care about the result, only that the bytes are sitting in cache.
   *
   * Call this on:
   *  - the page mount (preload the current character)
   *  - prev/next navigation (preload neighbors)
   *  - question change in the quiz (preload the next question's audio)
   */
  function preload(text: string) {
    if (typeof window === 'undefined' || !text) return
    fetch(buildUrl(text), { method: 'GET', cache: 'force-cache' }).catch(() => { /* silent */ })
  }

  /**
   * @param text Text to speak
   * @param lang Optional IETF lang code override (e.g. 'en', 'fr'). Defaults to course lang.
   */
  function speak(text: string, lang?: string) {
    if (typeof window === 'undefined') return
    if (!text) return
    stop()

    const url = buildUrl(text, lang)
    isLoading.value = true

    const audio = new Audio(url)
    audio.preload = 'auto'
    audio.onplay = () => {
      isLoading.value = false
      isSpeaking.value = true
    }
    audio.onended = () => {
      isSpeaking.value = false
      if (currentAudio === audio) currentAudio = null
    }
    audio.onerror = () => {
      // eslint-disable-next-line no-console
      console.warn('[useCourseAudio] audio element error', {
        url,
        networkState: audio.networkState,
        readyState: audio.readyState,
        error: audio.error,
      })
      isLoading.value = false
      isSpeaking.value = false
      if (currentAudio === audio) currentAudio = null
    }

    currentAudio = audio
    audio.play().catch((err) => {
      // eslint-disable-next-line no-console
      console.warn('[useCourseAudio] audio.play() rejected', { url, err })
      isLoading.value = false
      isSpeaking.value = false
      if (currentAudio === audio) currentAudio = null
    })
  }

  function stop() {
    if (currentAudio) {
      currentAudio.pause()
      try { currentAudio.currentTime = 0 } catch { /* noop */ }
      currentAudio = null
    }
    isLoading.value = false
    isSpeaking.value = false
  }

  return { speak, preload, stop, isSpeaking, isLoading, isSupported }
}
