/**
 * Korean speech text per jamo for TTS pronunciation.
 *
 * The Web Speech API can't pronounce isolated jamo correctly because:
 * - A consonant alone has no audible sound (it needs a vowel to be voiced)
 * - A vowel alone is sometimes mispronounced
 *
 * Solution: use the official Korean name of each jamo (which is what
 * Koreans say when they spell out the alphabet), or for vowels use
 * the voiced form with silent ieung (ㅇ).
 *
 * Reference: https://en.wikipedia.org/wiki/Hangul#Letter_names
 */
export const HANGEUL_SPEECH: Record<string, string> = {
  // ── Basic consonants — use official Korean names ──
  'giyeok':  '기역',
  'nieun':   '니은',
  'digeut':  '디귿',
  'rieul':   '리을',
  'mieum':   '미음',
  'bieup':   '비읍',
  'siot':    '시옷',
  'ieung':   '이응',
  'jieut':   '지읒',
  'chieut':  '치읓',
  'kieuk':   '키읔',
  'tieut':   '티읕',
  'pieup':   '피읖',
  'hieut':   '히읗',

  // ── Double consonants — use ssang + official name ──
  'ssang-giyeok': '쌍기역',
  'ssang-digeut': '쌍디귿',
  'ssang-bieup':  '쌍비읍',
  'ssang-siot':   '쌍시옷',
  'ssang-jieut':  '쌍지읒',

  // ── Basic vowels — use the voiced syllable with silent ㅇ ──
  'a':   '아',
  'ya':  '야',
  'eo':  '어',
  'yeo': '여',
  'o':   '오',
  'yo':  '요',
  'u':   '우',
  'yu':  '유',
  'eu':  '으',
  'i':   '이',

  // ── Compound vowels — same with silent ㅇ ──
  'ae':  '애',
  'yae': '얘',
  'e':   '에',
  'ye':  '예',
  'wa':  '와',
  'wae': '왜',
  'oe':  '외',
  'wo':  '워',
  'we':  '웨',
  'wi':  '위',
  'ui':  '의',
}

export function getSpeechText(charId: string, fallback: string): string {
  return HANGEUL_SPEECH[charId] ?? fallback
}
