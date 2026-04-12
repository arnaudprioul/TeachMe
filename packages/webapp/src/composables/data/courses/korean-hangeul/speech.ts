/**
 * Korean speech text per jamo for TTS pronunciation.
 * Uses official Korean names (e.g. ㄱ → 기역) for consonants
 * and silent-ㅇ syllables for vowels (e.g. ㅏ → 아).
 *
 * The Korean TTS engine (Google Translate TTS via /api/v1/tts proxy) is
 * the canonical pronunciation source, no carrier-word hacks.
 */
export const SPEECH: Record<string, string> = {
  // Basic consonants — official Korean names
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

  // Double consonants
  'ssang-giyeok': '쌍기역',
  'ssang-digeut': '쌍디귿',
  'ssang-bieup':  '쌍비읍',
  'ssang-siot':   '쌍시옷',
  'ssang-jieut':  '쌍지읒',

  // Basic vowels — silent ㅇ syllable
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

  // Compound vowels
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
