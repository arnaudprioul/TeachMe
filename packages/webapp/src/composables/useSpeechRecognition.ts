import { ref, onBeforeUnmount } from 'vue'

// ── Web Speech API type declarations ──
// Chrome exposes webkitSpeechRecognition; the standard name is SpeechRecognition.
// We declare the minimal subset we use so TypeScript is happy everywhere.
interface ISpeechRecognitionEvent {
  resultIndex: number
  results: {
    length: number
    [index: number]: {
      isFinal: boolean
      length: number
      [index: number]: { transcript: string; confidence: number }
    }
  }
}

interface ISpeechRecognitionErrorEvent {
  error: string
  message?: string
}

interface ISpeechRecognitionInstance extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: ISpeechRecognitionEvent) => void) | null
  onerror: ((event: ISpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  onaudiostart: (() => void) | null
}

type SpeechRecognitionConstructor = new () => ISpeechRecognitionInstance

function getSpeechRecognitionCtor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

/**
 * Wraps the Web Speech Recognition API in a Vue composable.
 *
 * Usage:
 * ```ts
 * const { isSupported, isListening, transcript, error, start, stop } = useSpeechRecognition()
 * start('ja-JP') // IETF lang tag
 * ```
 */
export function useSpeechRecognition() {
  const isSupported = ref(getSpeechRecognitionCtor() !== null)
  const isListening = ref(false)
  const transcript = ref('')
  const error = ref<string | null>(null)

  let recognition: ISpeechRecognitionInstance | null = null

  function start(lang: string) {
    const Ctor = getSpeechRecognitionCtor()
    if (!Ctor) {
      error.value = 'not-supported'
      return
    }

    // Stop any running instance first
    stop()

    error.value = null
    transcript.value = ''

    recognition = new Ctor()
    recognition.lang = lang
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 3

    recognition.onaudiostart = () => {
      isListening.value = true
    }

    recognition.onresult = (event: ISpeechRecognitionEvent) => {
      // Collect the best transcript from all final results
      let best = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal && result[0]) {
          best = result[0].transcript
        }
      }
      if (best) {
        transcript.value = best
      }
    }

    recognition.onerror = (event: ISpeechRecognitionErrorEvent) => {
      // 'no-speech' is not a real error — user just didn't say anything
      if (event.error === 'no-speech') {
        error.value = 'no-speech'
      } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        error.value = 'not-allowed'
      } else if (event.error === 'network') {
        error.value = 'network'
      } else {
        error.value = event.error
      }
      isListening.value = false
    }

    recognition.onend = () => {
      isListening.value = false
    }

    try {
      recognition.start()
    } catch {
      error.value = 'start-failed'
      isListening.value = false
    }
  }

  function stop() {
    if (recognition) {
      try { recognition.abort() } catch { /* noop */ }
      recognition = null
    }
    isListening.value = false
  }

  onBeforeUnmount(() => {
    stop()
  })

  return { isSupported, isListening, transcript, error, start, stop }
}
