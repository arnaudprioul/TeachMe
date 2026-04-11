/**
 * Japanese hiragana TTS map.
 *
 * Unlike Korean (which had to dodge the silent ㅇ ambiguity by feeding
 * canonical syllable forms to the TTS), every hiragana already
 * pronounces itself unambiguously when spoken in isolation by Google
 * Translate's Japanese TTS — `あ` → "a", `か` → "ka", `ん` → "n", etc.
 *
 * So this map is just `id → kana`. Defining it explicitly (rather than
 * letting `speechTextOf` fall back to `item.symbol`) lets us tweak any
 * problem character later without touching the data.
 */
export const SPEECH: Record<string, string> = {
  // Vowels
  'a': 'あ', 'i': 'い', 'u': 'う', 'e': 'え', 'o': 'お',

  // K-row
  'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',

  // S-row
  'sa': 'さ', 'shi': 'し', 'su': 'す', 'se': 'せ', 'so': 'そ',

  // T-row
  'ta': 'た', 'chi': 'ち', 'tsu': 'つ', 'te': 'て', 'to': 'と',

  // N-row
  'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',

  // H-row
  'ha': 'は', 'hi': 'ひ', 'fu': 'ふ', 'he': 'へ', 'ho': 'ほ',

  // M-row
  'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',

  // Y-row
  'ya': 'や', 'yu': 'ゆ', 'yo': 'よ',

  // R-row
  'ra': 'ら', 'ri': 'り', 'ru': 'る', 're': 'れ', 'ro': 'ろ',

  // W-row + ん
  'wa': 'わ', 'wo': 'を', 'n': 'ん',
}
