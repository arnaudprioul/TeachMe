/**
 * Japanese katakana TTS map. Same shape as the hiragana one — one entry
 * per kana, the value is the kana itself which Google Translate's
 * Japanese TTS pronounces correctly when spoken in isolation.
 */
export const SPEECH: Record<string, string> = {
  // Vowels
  'a': 'ア', 'i': 'イ', 'u': 'ウ', 'e': 'エ', 'o': 'オ',

  // K-row
  'ka': 'カ', 'ki': 'キ', 'ku': 'ク', 'ke': 'ケ', 'ko': 'コ',

  // S-row
  'sa': 'サ', 'shi': 'シ', 'su': 'ス', 'se': 'セ', 'so': 'ソ',

  // T-row
  'ta': 'タ', 'chi': 'チ', 'tsu': 'ツ', 'te': 'テ', 'to': 'ト',

  // N-row
  'na': 'ナ', 'ni': 'ニ', 'nu': 'ヌ', 'ne': 'ネ', 'no': 'ノ',

  // H-row
  'ha': 'ハ', 'hi': 'ヒ', 'fu': 'フ', 'he': 'ヘ', 'ho': 'ホ',

  // M-row
  'ma': 'マ', 'mi': 'ミ', 'mu': 'ム', 'me': 'メ', 'mo': 'モ',

  // Y-row
  'ya': 'ヤ', 'yu': 'ユ', 'yo': 'ヨ',

  // R-row
  'ra': 'ラ', 'ri': 'リ', 'ru': 'ル', 're': 'レ', 'ro': 'ロ',

  // W-row + ン
  'wa': 'ワ', 'wo': 'ヲ', 'n': 'ン',
}
