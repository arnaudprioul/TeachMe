import { ref, onMounted } from 'vue'

export function useHangeulAudio() {
  const isSpeaking = ref(false)
  const isSupported = ref(false)
  let koreanVoice: SpeechSynthesisVoice | null = null

  function loadVoices() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    const voices = window.speechSynthesis.getVoices()
    const koreanVoices = voices.filter(v => v.lang.toLowerCase().startsWith('ko'))

    // Prefer high-quality named voices in this order
    const preferred = [
      'Yuna',          // macOS / iOS native
      'Heami',         // Windows
      'Google 한국의', // Chrome
      'Microsoft Heami',
      'Microsoft SunHi',
    ]

    for (const name of preferred) {
      const v = koreanVoices.find(x => x.name === name || x.name.includes(name))
      if (v) { koreanVoice = v; break }
    }

    // Fallback: any Korean voice that's not "remote/default"
    if (!koreanVoice) {
      koreanVoice = koreanVoices.find(v => v.localService) ?? koreanVoices[0] ?? null
    }

    isSupported.value = koreanVoice !== null
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
