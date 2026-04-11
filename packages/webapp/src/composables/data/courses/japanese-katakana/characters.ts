import type { ICourseCharacter } from '../types'

/**
 * The 46 base katakana — same gojuon set as hiragana, with the same
 * romanizations, just different glyphs. Used in Japanese to write
 * loanwords (gairaigo), foreign names, onomatopoeia and emphasis.
 *
 * Same classification as hiragana:
 *  - 5 vowels (アイウエオ)
 *  - 41 consonant + vowel mora
 *
 * Stroke counts from Wikipedia / KanjiVG.
 */
export const CHARACTERS: ICourseCharacter[] = [
  // ── Vowels ──────────────────────────────────────────────────────────
  { id: 'a',  symbol: 'ア', romanization: 'a',  type: 'vowel', subtype: 'basic', name: 'A',  nameFr: 'A',  pronunciation: 'Like "a" in "father"',          pronunciationFr: 'Comme « a » dans « papa »',         strokeCount: 2 },
  { id: 'i',  symbol: 'イ', romanization: 'i',  type: 'vowel', subtype: 'basic', name: 'I',  nameFr: 'I',  pronunciation: 'Like "ee" in "see", short',     pronunciationFr: 'Comme « i » dans « ici »',          strokeCount: 2 },
  { id: 'u',  symbol: 'ウ', romanization: 'u',  type: 'vowel', subtype: 'basic', name: 'U',  nameFr: 'U',  pronunciation: 'Like "oo" in "boot", unrounded', pronunciationFr: 'Comme « ou » dans « roue »',        strokeCount: 3 },
  { id: 'e',  symbol: 'エ', romanization: 'e',  type: 'vowel', subtype: 'basic', name: 'E',  nameFr: 'E',  pronunciation: 'Like "e" in "pet"',             pronunciationFr: 'Comme « é » dans « été »',          strokeCount: 3 },
  { id: 'o',  symbol: 'オ', romanization: 'o',  type: 'vowel', subtype: 'basic', name: 'O',  nameFr: 'O',  pronunciation: 'Like "o" in "more"',            pronunciationFr: 'Comme « o » dans « moto »',         strokeCount: 3 },

  // ── K-row ───────────────────────────────────────────────────────────
  { id: 'ka', symbol: 'カ', romanization: 'ka', type: 'consonant', subtype: 'basic', name: 'Ka', nameFr: 'Ka', pronunciation: 'Like "ka" in "karma"', pronunciationFr: 'Comme « ka »', strokeCount: 2 },
  { id: 'ki', symbol: 'キ', romanization: 'ki', type: 'consonant', subtype: 'basic', name: 'Ki', nameFr: 'Ki', pronunciation: 'Like "key"',           pronunciationFr: 'Comme « ki »', strokeCount: 3 },
  { id: 'ku', symbol: 'ク', romanization: 'ku', type: 'consonant', subtype: 'basic', name: 'Ku', nameFr: 'Ku', pronunciation: 'Like "coo"',          pronunciationFr: 'Comme « kou »', strokeCount: 2 },
  { id: 'ke', symbol: 'ケ', romanization: 'ke', type: 'consonant', subtype: 'basic', name: 'Ke', nameFr: 'Ke', pronunciation: 'Like "ke" in "ketchup"', pronunciationFr: 'Comme « ké »', strokeCount: 3 },
  { id: 'ko', symbol: 'コ', romanization: 'ko', type: 'consonant', subtype: 'basic', name: 'Ko', nameFr: 'Ko', pronunciation: 'Like "ko" in "Kobe"', pronunciationFr: 'Comme « ko »', strokeCount: 2 },

  // ── S-row ───────────────────────────────────────────────────────────
  { id: 'sa',  symbol: 'サ', romanization: 'sa',  type: 'consonant', subtype: 'basic', name: 'Sa',  nameFr: 'Sa',  pronunciation: 'Like "sa" in "sand"',  pronunciationFr: 'Comme « sa »',  strokeCount: 3 },
  { id: 'shi', symbol: 'シ', romanization: 'shi', type: 'consonant', subtype: 'basic', name: 'Shi', nameFr: 'Shi', pronunciation: 'Like "she"',          pronunciationFr: 'Comme « chi »', strokeCount: 3 },
  { id: 'su',  symbol: 'ス', romanization: 'su',  type: 'consonant', subtype: 'basic', name: 'Su',  nameFr: 'Su',  pronunciation: 'Like "su" in "Sue"',   pronunciationFr: 'Comme « sou »', strokeCount: 2 },
  { id: 'se',  symbol: 'セ', romanization: 'se',  type: 'consonant', subtype: 'basic', name: 'Se',  nameFr: 'Se',  pronunciation: 'Like "se" in "set"',   pronunciationFr: 'Comme « sé »',  strokeCount: 2 },
  { id: 'so',  symbol: 'ソ', romanization: 'so',  type: 'consonant', subtype: 'basic', name: 'So',  nameFr: 'So',  pronunciation: 'Like "so"',           pronunciationFr: 'Comme « so »',  strokeCount: 2 },

  // ── T-row ───────────────────────────────────────────────────────────
  { id: 'ta',  symbol: 'タ', romanization: 'ta',  type: 'consonant', subtype: 'basic', name: 'Ta',  nameFr: 'Ta',  pronunciation: 'Like "ta" in "taco"', pronunciationFr: 'Comme « ta »',   strokeCount: 3 },
  { id: 'chi', symbol: 'チ', romanization: 'chi', type: 'consonant', subtype: 'basic', name: 'Chi', nameFr: 'Chi', pronunciation: 'Like "chee"',         pronunciationFr: 'Comme « tchi »', strokeCount: 3 },
  { id: 'tsu', symbol: 'ツ', romanization: 'tsu', type: 'consonant', subtype: 'basic', name: 'Tsu', nameFr: 'Tsu', pronunciation: 'Like "tsu" in "tsunami"', pronunciationFr: 'Comme « tsou »', strokeCount: 3 },
  { id: 'te',  symbol: 'テ', romanization: 'te',  type: 'consonant', subtype: 'basic', name: 'Te',  nameFr: 'Te',  pronunciation: 'Like "te" in "ten"',  pronunciationFr: 'Comme « té »',   strokeCount: 3 },
  { id: 'to',  symbol: 'ト', romanization: 'to',  type: 'consonant', subtype: 'basic', name: 'To',  nameFr: 'To',  pronunciation: 'Like "toe"',          pronunciationFr: 'Comme « to »',   strokeCount: 2 },

  // ── N-row ───────────────────────────────────────────────────────────
  { id: 'na', symbol: 'ナ', romanization: 'na', type: 'consonant', subtype: 'basic', name: 'Na', nameFr: 'Na', pronunciation: 'Like "na" in "nacho"', pronunciationFr: 'Comme « na »', strokeCount: 2 },
  { id: 'ni', symbol: 'ニ', romanization: 'ni', type: 'consonant', subtype: 'basic', name: 'Ni', nameFr: 'Ni', pronunciation: 'Like "knee"',          pronunciationFr: 'Comme « ni »', strokeCount: 2 },
  { id: 'nu', symbol: 'ヌ', romanization: 'nu', type: 'consonant', subtype: 'basic', name: 'Nu', nameFr: 'Nu', pronunciation: 'Like "noo" in "noodle"', pronunciationFr: 'Comme « nou »', strokeCount: 2 },
  { id: 'ne', symbol: 'ネ', romanization: 'ne', type: 'consonant', subtype: 'basic', name: 'Ne', nameFr: 'Ne', pronunciation: 'Like "ne" in "nest"',  pronunciationFr: 'Comme « né »', strokeCount: 4 },
  { id: 'no', symbol: 'ノ', romanization: 'no', type: 'consonant', subtype: 'basic', name: 'No', nameFr: 'No', pronunciation: 'Like "no"',            pronunciationFr: 'Comme « no »', strokeCount: 1 },

  // ── H-row ───────────────────────────────────────────────────────────
  { id: 'ha', symbol: 'ハ', romanization: 'ha', type: 'consonant', subtype: 'basic', name: 'Ha', nameFr: 'Ha', pronunciation: 'Like "ha" in "ha-ha"', pronunciationFr: 'Comme « ha »', strokeCount: 2 },
  { id: 'hi', symbol: 'ヒ', romanization: 'hi', type: 'consonant', subtype: 'basic', name: 'Hi', nameFr: 'Hi', pronunciation: 'Like "he"',           pronunciationFr: 'Comme « hi »', strokeCount: 2 },
  { id: 'fu', symbol: 'フ', romanization: 'fu', type: 'consonant', subtype: 'basic', name: 'Fu', nameFr: 'Fu', pronunciation: 'Between "hu" and "fu"', pronunciationFr: 'Entre « hou » et « fou »', strokeCount: 1 },
  { id: 'he', symbol: 'ヘ', romanization: 'he', type: 'consonant', subtype: 'basic', name: 'He', nameFr: 'He', pronunciation: 'Like "he" in "help"', pronunciationFr: 'Comme « hé »', strokeCount: 1 },
  { id: 'ho', symbol: 'ホ', romanization: 'ho', type: 'consonant', subtype: 'basic', name: 'Ho', nameFr: 'Ho', pronunciation: 'Like "ho" in "ho-ho"', pronunciationFr: 'Comme « ho »', strokeCount: 4 },

  // ── M-row ───────────────────────────────────────────────────────────
  { id: 'ma', symbol: 'マ', romanization: 'ma', type: 'consonant', subtype: 'basic', name: 'Ma', nameFr: 'Ma', pronunciation: 'Like "ma" in "mama"', pronunciationFr: 'Comme « ma »', strokeCount: 2 },
  { id: 'mi', symbol: 'ミ', romanization: 'mi', type: 'consonant', subtype: 'basic', name: 'Mi', nameFr: 'Mi', pronunciation: 'Like "me"',           pronunciationFr: 'Comme « mi »', strokeCount: 3 },
  { id: 'mu', symbol: 'ム', romanization: 'mu', type: 'consonant', subtype: 'basic', name: 'Mu', nameFr: 'Mu', pronunciation: 'Like "moo"',          pronunciationFr: 'Comme « mou »', strokeCount: 2 },
  { id: 'me', symbol: 'メ', romanization: 'me', type: 'consonant', subtype: 'basic', name: 'Me', nameFr: 'Me', pronunciation: 'Like "me" in "met"',  pronunciationFr: 'Comme « mé »', strokeCount: 2 },
  { id: 'mo', symbol: 'モ', romanization: 'mo', type: 'consonant', subtype: 'basic', name: 'Mo', nameFr: 'Mo', pronunciation: 'Like "mo" in "mole"', pronunciationFr: 'Comme « mo »', strokeCount: 3 },

  // ── Y-row ───────────────────────────────────────────────────────────
  { id: 'ya', symbol: 'ヤ', romanization: 'ya', type: 'consonant', subtype: 'basic', name: 'Ya', nameFr: 'Ya', pronunciation: 'Like "ya" in "yard"', pronunciationFr: 'Comme « ya »', strokeCount: 2 },
  { id: 'yu', symbol: 'ユ', romanization: 'yu', type: 'consonant', subtype: 'basic', name: 'Yu', nameFr: 'Yu', pronunciation: 'Like "you"',          pronunciationFr: 'Comme « you »', strokeCount: 2 },
  { id: 'yo', symbol: 'ヨ', romanization: 'yo', type: 'consonant', subtype: 'basic', name: 'Yo', nameFr: 'Yo', pronunciation: 'Like "yo" in "yo-yo"', pronunciationFr: 'Comme « yo »', strokeCount: 3 },

  // ── R-row ───────────────────────────────────────────────────────────
  { id: 'ra', symbol: 'ラ', romanization: 'ra', type: 'consonant', subtype: 'basic', name: 'Ra', nameFr: 'Ra', pronunciation: 'Between "ra" and "la", flap', pronunciationFr: 'Entre « ra » et « la »', strokeCount: 2 },
  { id: 'ri', symbol: 'リ', romanization: 'ri', type: 'consonant', subtype: 'basic', name: 'Ri', nameFr: 'Ri', pronunciation: 'Between "ri" and "li"',       pronunciationFr: 'Entre « ri » et « li »', strokeCount: 2 },
  { id: 'ru', symbol: 'ル', romanization: 'ru', type: 'consonant', subtype: 'basic', name: 'Ru', nameFr: 'Ru', pronunciation: 'Between "ru" and "lu"',       pronunciationFr: 'Entre « rou » et « lou »', strokeCount: 2 },
  { id: 're', symbol: 'レ', romanization: 're', type: 'consonant', subtype: 'basic', name: 'Re', nameFr: 'Re', pronunciation: 'Between "re" and "le"',       pronunciationFr: 'Entre « ré » et « lé »',  strokeCount: 1 },
  { id: 'ro', symbol: 'ロ', romanization: 'ro', type: 'consonant', subtype: 'basic', name: 'Ro', nameFr: 'Ro', pronunciation: 'Between "ro" and "lo"',       pronunciationFr: 'Entre « ro » et « lo »',  strokeCount: 3 },

  // ── W-row + standalone ン ─────────────────────────────────────────
  { id: 'wa', symbol: 'ワ', romanization: 'wa', type: 'consonant', subtype: 'basic', name: 'Wa', nameFr: 'Wa', pronunciation: 'Like "wa" in "wand"', pronunciationFr: 'Comme « wa »', strokeCount: 2 },
  { id: 'wo', symbol: 'ヲ', romanization: 'wo', type: 'consonant', subtype: 'basic', name: 'Wo', nameFr: 'Wo', pronunciation: 'Pronounced "o" — particle only', pronunciationFr: 'Prononcé « o » — particule', strokeCount: 3 },
  { id: 'n',  symbol: 'ン', romanization: 'n',  type: 'consonant', subtype: 'basic', name: 'N',  nameFr: 'N',  pronunciation: 'Standalone nasal "n/m/ng"',     pronunciationFr: 'Nasale « n/m/ng »',           strokeCount: 2 },
]
