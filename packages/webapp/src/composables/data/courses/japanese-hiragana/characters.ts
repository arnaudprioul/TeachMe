import type { ICourseCharacter } from '../types'

/**
 * The 46 base hiragana (gojuon, "fifty sounds" — minus a few historical
 * ones, plus the standalone ん). Stroke counts are the standard ones from
 * Wikipedia / KanjiVG.
 *
 * Classification scheme used here:
 *  - `type: 'vowel'`     → the 5 pure vowels あいうえお
 *  - `type: 'consonant'` → the 41 consonant + vowel mora
 *
 * This isn't strictly linguistically accurate (every kana represents a
 * mora, not a "consonant"), but it lets us reuse the existing
 * `ICourseCharacter` schema and the type/subtype filter style. The
 * `ICourseModule.config.categories` declared in `index.ts` is what
 * actually drives the training pool grouping.
 */
export const CHARACTERS: ICourseCharacter[] = [
  // ── Vowels ──────────────────────────────────────────────────────────
  { id: 'a',  symbol: 'あ', romanization: 'a',  type: 'vowel', subtype: 'basic', name: 'A',  nameFr: 'A',  pronunciation: 'Like "a" in "father"',          pronunciationFr: 'Comme « a » dans « papa »',         strokeCount: 3 },
  { id: 'i',  symbol: 'い', romanization: 'i',  type: 'vowel', subtype: 'basic', name: 'I',  nameFr: 'I',  pronunciation: 'Like "ee" in "see", short',     pronunciationFr: 'Comme « i » dans « ici »',          strokeCount: 2 },
  { id: 'u',  symbol: 'う', romanization: 'u',  type: 'vowel', subtype: 'basic', name: 'U',  nameFr: 'U',  pronunciation: 'Like "oo" in "boot", unrounded', pronunciationFr: 'Comme « ou » dans « roue »',        strokeCount: 2 },
  { id: 'e',  symbol: 'え', romanization: 'e',  type: 'vowel', subtype: 'basic', name: 'E',  nameFr: 'E',  pronunciation: 'Like "e" in "pet"',             pronunciationFr: 'Comme « é » dans « été »',          strokeCount: 2 },
  { id: 'o',  symbol: 'お', romanization: 'o',  type: 'vowel', subtype: 'basic', name: 'O',  nameFr: 'O',  pronunciation: 'Like "o" in "more"',            pronunciationFr: 'Comme « o » dans « moto »',         strokeCount: 3 },

  // ── K-row ───────────────────────────────────────────────────────────
  { id: 'ka', symbol: 'か', romanization: 'ka', type: 'consonant', subtype: 'basic', name: 'Ka', nameFr: 'Ka', pronunciation: 'Like "ka" in "karma"', pronunciationFr: 'Comme « ka »', strokeCount: 3 },
  { id: 'ki', symbol: 'き', romanization: 'ki', type: 'consonant', subtype: 'basic', name: 'Ki', nameFr: 'Ki', pronunciation: 'Like "key"',           pronunciationFr: 'Comme « ki »', strokeCount: 4 },
  { id: 'ku', symbol: 'く', romanization: 'ku', type: 'consonant', subtype: 'basic', name: 'Ku', nameFr: 'Ku', pronunciation: 'Like "coo"',          pronunciationFr: 'Comme « kou »', strokeCount: 1 },
  { id: 'ke', symbol: 'け', romanization: 'ke', type: 'consonant', subtype: 'basic', name: 'Ke', nameFr: 'Ke', pronunciation: 'Like "ke" in "ketchup"', pronunciationFr: 'Comme « ké »', strokeCount: 3 },
  { id: 'ko', symbol: 'こ', romanization: 'ko', type: 'consonant', subtype: 'basic', name: 'Ko', nameFr: 'Ko', pronunciation: 'Like "ko" in "Kobe"', pronunciationFr: 'Comme « ko »', strokeCount: 2 },

  // ── S-row ───────────────────────────────────────────────────────────
  { id: 'sa',  symbol: 'さ', romanization: 'sa',  type: 'consonant', subtype: 'basic', name: 'Sa',  nameFr: 'Sa',  pronunciation: 'Like "sa" in "sand"',  pronunciationFr: 'Comme « sa »',  strokeCount: 3 },
  { id: 'shi', symbol: 'し', romanization: 'shi', type: 'consonant', subtype: 'basic', name: 'Shi', nameFr: 'Shi', pronunciation: 'Like "she"',          pronunciationFr: 'Comme « chi »', strokeCount: 1 },
  { id: 'su',  symbol: 'す', romanization: 'su',  type: 'consonant', subtype: 'basic', name: 'Su',  nameFr: 'Su',  pronunciation: 'Like "su" in "Sue"',   pronunciationFr: 'Comme « sou »', strokeCount: 2 },
  { id: 'se',  symbol: 'せ', romanization: 'se',  type: 'consonant', subtype: 'basic', name: 'Se',  nameFr: 'Se',  pronunciation: 'Like "se" in "set"',   pronunciationFr: 'Comme « sé »',  strokeCount: 3 },
  { id: 'so',  symbol: 'そ', romanization: 'so',  type: 'consonant', subtype: 'basic', name: 'So',  nameFr: 'So',  pronunciation: 'Like "so"',           pronunciationFr: 'Comme « so »',  strokeCount: 1 },

  // ── T-row ───────────────────────────────────────────────────────────
  { id: 'ta',  symbol: 'た', romanization: 'ta',  type: 'consonant', subtype: 'basic', name: 'Ta',  nameFr: 'Ta',  pronunciation: 'Like "ta" in "taco"', pronunciationFr: 'Comme « ta »',   strokeCount: 4 },
  { id: 'chi', symbol: 'ち', romanization: 'chi', type: 'consonant', subtype: 'basic', name: 'Chi', nameFr: 'Chi', pronunciation: 'Like "chee"',         pronunciationFr: 'Comme « tchi »', strokeCount: 2 },
  { id: 'tsu', symbol: 'つ', romanization: 'tsu', type: 'consonant', subtype: 'basic', name: 'Tsu', nameFr: 'Tsu', pronunciation: 'Like "tsu" in "tsunami"', pronunciationFr: 'Comme « tsou »', strokeCount: 1 },
  { id: 'te',  symbol: 'て', romanization: 'te',  type: 'consonant', subtype: 'basic', name: 'Te',  nameFr: 'Te',  pronunciation: 'Like "te" in "ten"',  pronunciationFr: 'Comme « té »',   strokeCount: 1 },
  { id: 'to',  symbol: 'と', romanization: 'to',  type: 'consonant', subtype: 'basic', name: 'To',  nameFr: 'To',  pronunciation: 'Like "toe"',          pronunciationFr: 'Comme « to »',   strokeCount: 2 },

  // ── N-row ───────────────────────────────────────────────────────────
  { id: 'na', symbol: 'な', romanization: 'na', type: 'consonant', subtype: 'basic', name: 'Na', nameFr: 'Na', pronunciation: 'Like "na" in "nacho"', pronunciationFr: 'Comme « na »', strokeCount: 4 },
  { id: 'ni', symbol: 'に', romanization: 'ni', type: 'consonant', subtype: 'basic', name: 'Ni', nameFr: 'Ni', pronunciation: 'Like "knee"',          pronunciationFr: 'Comme « ni »', strokeCount: 3 },
  { id: 'nu', symbol: 'ぬ', romanization: 'nu', type: 'consonant', subtype: 'basic', name: 'Nu', nameFr: 'Nu', pronunciation: 'Like "noo" in "noodle"', pronunciationFr: 'Comme « nou »', strokeCount: 2 },
  { id: 'ne', symbol: 'ね', romanization: 'ne', type: 'consonant', subtype: 'basic', name: 'Ne', nameFr: 'Ne', pronunciation: 'Like "ne" in "nest"',  pronunciationFr: 'Comme « né »', strokeCount: 2 },
  { id: 'no', symbol: 'の', romanization: 'no', type: 'consonant', subtype: 'basic', name: 'No', nameFr: 'No', pronunciation: 'Like "no"',            pronunciationFr: 'Comme « no »', strokeCount: 1 },

  // ── H-row ───────────────────────────────────────────────────────────
  { id: 'ha', symbol: 'は', romanization: 'ha', type: 'consonant', subtype: 'basic', name: 'Ha', nameFr: 'Ha', pronunciation: 'Like "ha" in "ha-ha"', pronunciationFr: 'Comme « ha »', strokeCount: 3 },
  { id: 'hi', symbol: 'ひ', romanization: 'hi', type: 'consonant', subtype: 'basic', name: 'Hi', nameFr: 'Hi', pronunciation: 'Like "he"',           pronunciationFr: 'Comme « hi »', strokeCount: 1 },
  { id: 'fu', symbol: 'ふ', romanization: 'fu', type: 'consonant', subtype: 'basic', name: 'Fu', nameFr: 'Fu', pronunciation: 'Between "hu" and "fu"', pronunciationFr: 'Entre « hou » et « fou »', strokeCount: 4 },
  { id: 'he', symbol: 'へ', romanization: 'he', type: 'consonant', subtype: 'basic', name: 'He', nameFr: 'He', pronunciation: 'Like "he" in "help"', pronunciationFr: 'Comme « hé »', strokeCount: 1 },
  { id: 'ho', symbol: 'ほ', romanization: 'ho', type: 'consonant', subtype: 'basic', name: 'Ho', nameFr: 'Ho', pronunciation: 'Like "ho" in "ho-ho"', pronunciationFr: 'Comme « ho »', strokeCount: 4 },

  // ── M-row ───────────────────────────────────────────────────────────
  { id: 'ma', symbol: 'ま', romanization: 'ma', type: 'consonant', subtype: 'basic', name: 'Ma', nameFr: 'Ma', pronunciation: 'Like "ma" in "mama"', pronunciationFr: 'Comme « ma »', strokeCount: 3 },
  { id: 'mi', symbol: 'み', romanization: 'mi', type: 'consonant', subtype: 'basic', name: 'Mi', nameFr: 'Mi', pronunciation: 'Like "me"',           pronunciationFr: 'Comme « mi »', strokeCount: 2 },
  { id: 'mu', symbol: 'む', romanization: 'mu', type: 'consonant', subtype: 'basic', name: 'Mu', nameFr: 'Mu', pronunciation: 'Like "moo"',          pronunciationFr: 'Comme « mou »', strokeCount: 3 },
  { id: 'me', symbol: 'め', romanization: 'me', type: 'consonant', subtype: 'basic', name: 'Me', nameFr: 'Me', pronunciation: 'Like "me" in "met"',  pronunciationFr: 'Comme « mé »', strokeCount: 2 },
  { id: 'mo', symbol: 'も', romanization: 'mo', type: 'consonant', subtype: 'basic', name: 'Mo', nameFr: 'Mo', pronunciation: 'Like "mo" in "mole"', pronunciationFr: 'Comme « mo »', strokeCount: 3 },

  // ── Y-row (semi-vowels) ─────────────────────────────────────────────
  { id: 'ya', symbol: 'や', romanization: 'ya', type: 'consonant', subtype: 'basic', name: 'Ya', nameFr: 'Ya', pronunciation: 'Like "ya" in "yard"', pronunciationFr: 'Comme « ya »', strokeCount: 3 },
  { id: 'yu', symbol: 'ゆ', romanization: 'yu', type: 'consonant', subtype: 'basic', name: 'Yu', nameFr: 'Yu', pronunciation: 'Like "you"',          pronunciationFr: 'Comme « you »', strokeCount: 2 },
  { id: 'yo', symbol: 'よ', romanization: 'yo', type: 'consonant', subtype: 'basic', name: 'Yo', nameFr: 'Yo', pronunciation: 'Like "yo" in "yo-yo"', pronunciationFr: 'Comme « yo »', strokeCount: 2 },

  // ── R-row ───────────────────────────────────────────────────────────
  { id: 'ra', symbol: 'ら', romanization: 'ra', type: 'consonant', subtype: 'basic', name: 'Ra', nameFr: 'Ra', pronunciation: 'Between "ra" and "la", flap', pronunciationFr: 'Entre « ra » et « la »', strokeCount: 2 },
  { id: 'ri', symbol: 'り', romanization: 'ri', type: 'consonant', subtype: 'basic', name: 'Ri', nameFr: 'Ri', pronunciation: 'Between "ri" and "li"',       pronunciationFr: 'Entre « ri » et « li »', strokeCount: 2 },
  { id: 'ru', symbol: 'る', romanization: 'ru', type: 'consonant', subtype: 'basic', name: 'Ru', nameFr: 'Ru', pronunciation: 'Between "ru" and "lu"',       pronunciationFr: 'Entre « rou » et « lou »', strokeCount: 1 },
  { id: 're', symbol: 'れ', romanization: 're', type: 'consonant', subtype: 'basic', name: 'Re', nameFr: 'Re', pronunciation: 'Between "re" and "le"',       pronunciationFr: 'Entre « ré » et « lé »',  strokeCount: 1 },
  { id: 'ro', symbol: 'ろ', romanization: 'ro', type: 'consonant', subtype: 'basic', name: 'Ro', nameFr: 'Ro', pronunciation: 'Between "ro" and "lo"',       pronunciationFr: 'Entre « ro » et « lo »',  strokeCount: 1 },

  // ── W-row + standalone ん ──────────────────────────────────────────
  { id: 'wa', symbol: 'わ', romanization: 'wa', type: 'consonant', subtype: 'basic', name: 'Wa', nameFr: 'Wa', pronunciation: 'Like "wa" in "wand"', pronunciationFr: 'Comme « wa »', strokeCount: 2 },
  { id: 'wo', symbol: 'を', romanization: 'wo', type: 'consonant', subtype: 'basic', name: 'Wo', nameFr: 'Wo', pronunciation: 'Pronounced "o" — particle only', pronunciationFr: 'Prononcé « o » — particule', strokeCount: 3 },
  { id: 'n',  symbol: 'ん', romanization: 'n',  type: 'consonant', subtype: 'basic', name: 'N',  nameFr: 'N',  pronunciation: 'Standalone nasal "n/m/ng"',     pronunciationFr: 'Nasale « n/m/ng »',           strokeCount: 1 },
]
