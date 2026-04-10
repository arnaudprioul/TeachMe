import { ref, onMounted } from 'vue'

export function useHangeulAudio() {
  const isSpeaking = ref(false)
  const isSupported = ref(false)
  let koreanVoice: SpeechSynthesisVoice | null = null

  function loadVoices() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    const voices = window.speechSynthesis.getVoices()
    koreanVoice = voices.find(v => v.lang.startsWith('ko')) ?? null
    isSupported.value = koreanVoice !== null || voices.length > 0
  }

  onMounted(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    loadVoices()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
  })

  function speak(text: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ko-KR'
    utterance.rate = 0.7
    if (koreanVoice) utterance.voice = koreanVoice

    utterance.onstart = () => { isSpeaking.value = true }
    utterance.onend = () => { isSpeaking.value = false }
    utterance.onerror = () => { isSpeaking.value = false }

    window.speechSynthesis.speak(utterance)
  }

  function stop() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    isSpeaking.value = false
  }

  return { speak, stop, isSpeaking, isSupported }
}
