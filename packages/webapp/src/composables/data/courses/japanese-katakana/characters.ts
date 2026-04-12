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
 *
 * `examples` are short, recognizable katakana loanwords (gairaigo) that
 * visibly contain the focused kana — coffee, hotel, tomato, etc. They're
 * rendered on the practice page as a small grid of "word + romaji" tiles.
 */
export const CHARACTERS: ICourseCharacter[] = [
  // ── Vowels ──────────────────────────────────────────────────────────
  {
    id: 'a',  symbol: 'ア', romanization: 'a',  type: 'vowel', subtype: 'basic',
    name: 'A',  nameFr: 'A',
    pronunciation: 'Like "a" in "father"',          pronunciationFr: 'Comme « a » dans « papa »',
    strokeCount: 2,
    examples: [
      { syllable: 'アイス',   romanization: 'aisu (ice)' },
      { syllable: 'アメリカ', romanization: 'amerika (USA)' },
    ],
  },
  {
    id: 'i',  symbol: 'イ', romanization: 'i',  type: 'vowel', subtype: 'basic',
    name: 'I',  nameFr: 'I',
    pronunciation: 'Like "ee" in "see", short',     pronunciationFr: 'Comme « i » dans « ici »',
    strokeCount: 2,
    examples: [
      { syllable: 'イギリス', romanization: 'igirisu (UK)' },
      { syllable: 'インク',   romanization: 'inku (ink)' },
    ],
  },
  {
    id: 'u',  symbol: 'ウ', romanization: 'u',  type: 'vowel', subtype: 'basic',
    name: 'U',  nameFr: 'U',
    pronunciation: 'Like "oo" in "boot", unrounded', pronunciationFr: 'Comme « ou » dans « roue »',
    strokeCount: 3,
    examples: [
      { syllable: 'ウール',   romanization: 'uuru (wool)' },
      { syllable: 'ウイスキー', romanization: 'uisukii (whisky)' },
    ],
  },
  {
    id: 'e',  symbol: 'エ', romanization: 'e',  type: 'vowel', subtype: 'basic',
    name: 'E',  nameFr: 'E',
    pronunciation: 'Like "e" in "pet"',             pronunciationFr: 'Comme « é » dans « été »',
    strokeCount: 3,
    examples: [
      { syllable: 'エアコン', romanization: 'eakon (AC)' },
      { syllable: 'エコ',     romanization: 'eko (eco)' },
    ],
  },
  {
    id: 'o',  symbol: 'オ', romanization: 'o',  type: 'vowel', subtype: 'basic',
    name: 'O',  nameFr: 'O',
    pronunciation: 'Like "o" in "more"',            pronunciationFr: 'Comme « o » dans « moto »',
    strokeCount: 3,
    examples: [
      { syllable: 'オープン', romanization: 'oopun (open)' },
      { syllable: 'オイル',   romanization: 'oiru (oil)' },
    ],
  },

  // ── K-row ───────────────────────────────────────────────────────────
  {
    id: 'ka', symbol: 'カ', romanization: 'ka', type: 'consonant', subtype: 'basic',
    name: 'Ka', nameFr: 'Ka',
    pronunciation: 'Like "ka" in "karma"', pronunciationFr: 'Comme « ka »',
    strokeCount: 2,
    examples: [
      { syllable: 'カメラ', romanization: 'kamera (camera)' },
      { syllable: 'カード', romanization: 'kaado (card)' },
    ],
  },
  {
    id: 'ki', symbol: 'キ', romanization: 'ki', type: 'consonant', subtype: 'basic',
    name: 'Ki', nameFr: 'Ki',
    pronunciation: 'Like "key"',           pronunciationFr: 'Comme « ki »',
    strokeCount: 3,
    examples: [
      { syllable: 'キス',  romanization: 'kisu (kiss)' },
      { syllable: 'キロ',  romanization: 'kiro (kilo)' },
    ],
  },
  {
    id: 'ku', symbol: 'ク', romanization: 'ku', type: 'consonant', subtype: 'basic',
    name: 'Ku', nameFr: 'Ku',
    pronunciation: 'Like "coo"',          pronunciationFr: 'Comme « kou »',
    strokeCount: 2,
    examples: [
      { syllable: 'クラス',   romanization: 'kurasu (class)' },
      { syllable: 'クリーム', romanization: 'kuriimu (cream)' },
    ],
  },
  {
    id: 'ke', symbol: 'ケ', romanization: 'ke', type: 'consonant', subtype: 'basic',
    name: 'Ke', nameFr: 'Ke',
    pronunciation: 'Like "ke" in "ketchup"', pronunciationFr: 'Comme « ké »',
    strokeCount: 3,
    examples: [
      { syllable: 'ケーキ', romanization: 'keeki (cake)' },
      { syllable: 'ケース', romanization: 'keesu (case)' },
    ],
  },
  {
    id: 'ko', symbol: 'コ', romanization: 'ko', type: 'consonant', subtype: 'basic',
    name: 'Ko', nameFr: 'Ko',
    pronunciation: 'Like "ko" in "Kobe"', pronunciationFr: 'Comme « ko »',
    strokeCount: 2,
    examples: [
      { syllable: 'コーヒー', romanization: 'koohii (coffee)' },
      { syllable: 'コーラ',   romanization: 'koora (cola)' },
    ],
  },

  // ── S-row ───────────────────────────────────────────────────────────
  {
    id: 'sa',  symbol: 'サ', romanization: 'sa',  type: 'consonant', subtype: 'basic',
    name: 'Sa',  nameFr: 'Sa',
    pronunciation: 'Like "sa" in "sand"',  pronunciationFr: 'Comme « sa »',
    strokeCount: 3,
    examples: [
      { syllable: 'サッカー', romanization: 'sakkaa (soccer)' },
      { syllable: 'サイン',   romanization: 'sain (sign)' },
    ],
  },
  {
    id: 'shi', symbol: 'シ', romanization: 'shi', type: 'consonant', subtype: 'basic',
    name: 'Shi', nameFr: 'Shi',
    pronunciation: 'Like "she"',          pronunciationFr: 'Comme « chi »',
    strokeCount: 3,
    examples: [
      { syllable: 'シール', romanization: 'shiiru (sticker)' },
      { syllable: 'シーン', romanization: 'shiin (scene)' },
    ],
  },
  {
    id: 'su',  symbol: 'ス', romanization: 'su',  type: 'consonant', subtype: 'basic',
    name: 'Su',  nameFr: 'Su',
    pronunciation: 'Like "su" in "Sue"',   pronunciationFr: 'Comme « sou »',
    strokeCount: 2,
    examples: [
      { syllable: 'スープ', romanization: 'suupu (soup)' },
      { syllable: 'スキー', romanization: 'sukii (ski)' },
    ],
  },
  {
    id: 'se',  symbol: 'セ', romanization: 'se',  type: 'consonant', subtype: 'basic',
    name: 'Se',  nameFr: 'Se',
    pronunciation: 'Like "se" in "set"',   pronunciationFr: 'Comme « sé »',
    strokeCount: 2,
    examples: [
      { syllable: 'セット',   romanization: 'setto (set)' },
      { syllable: 'センター', romanization: 'sentaa (center)' },
    ],
  },
  {
    id: 'so',  symbol: 'ソ', romanization: 'so',  type: 'consonant', subtype: 'basic',
    name: 'So',  nameFr: 'So',
    pronunciation: 'Like "so"',           pronunciationFr: 'Comme « so »',
    strokeCount: 2,
    examples: [
      { syllable: 'ソース', romanization: 'soosu (sauce)' },
      { syllable: 'ソロ',   romanization: 'soro (solo)' },
    ],
  },

  // ── T-row ───────────────────────────────────────────────────────────
  {
    id: 'ta',  symbol: 'タ', romanization: 'ta',  type: 'consonant', subtype: 'basic',
    name: 'Ta',  nameFr: 'Ta',
    pronunciation: 'Like "ta" in "taco"', pronunciationFr: 'Comme « ta »',
    strokeCount: 3,
    examples: [
      { syllable: 'タクシー', romanization: 'takushii (taxi)' },
      { syllable: 'タオル',   romanization: 'taoru (towel)' },
    ],
  },
  {
    id: 'chi', symbol: 'チ', romanization: 'chi', type: 'consonant', subtype: 'basic',
    name: 'Chi', nameFr: 'Chi',
    pronunciation: 'Like "chee"',         pronunciationFr: 'Comme « tchi »',
    strokeCount: 3,
    examples: [
      { syllable: 'チーム',     romanization: 'chiimu (team)' },
      { syllable: 'チケット',   romanization: 'chiketto (ticket)' },
    ],
  },
  {
    id: 'tsu', symbol: 'ツ', romanization: 'tsu', type: 'consonant', subtype: 'basic',
    name: 'Tsu', nameFr: 'Tsu',
    pronunciation: 'Like "tsu" in "tsunami"', pronunciationFr: 'Comme « tsou »',
    strokeCount: 3,
    examples: [
      { syllable: 'ツアー', romanization: 'tsuaa (tour)' },
      { syllable: 'ツナ',   romanization: 'tsuna (tuna)' },
    ],
  },
  {
    id: 'te',  symbol: 'テ', romanization: 'te',  type: 'consonant', subtype: 'basic',
    name: 'Te',  nameFr: 'Te',
    pronunciation: 'Like "te" in "ten"',  pronunciationFr: 'Comme « té »',
    strokeCount: 3,
    examples: [
      { syllable: 'テスト',   romanization: 'tesuto (test)' },
      { syllable: 'テニス',   romanization: 'tenisu (tennis)' },
    ],
  },
  {
    id: 'to',  symbol: 'ト', romanization: 'to',  type: 'consonant', subtype: 'basic',
    name: 'To',  nameFr: 'To',
    pronunciation: 'Like "toe"',          pronunciationFr: 'Comme « to »',
    strokeCount: 2,
    examples: [
      { syllable: 'トマト',   romanization: 'tomato (tomato)' },
      { syllable: 'トラック', romanization: 'torakku (truck)' },
    ],
  },

  // ── N-row ───────────────────────────────────────────────────────────
  {
    id: 'na', symbol: 'ナ', romanization: 'na', type: 'consonant', subtype: 'basic',
    name: 'Na', nameFr: 'Na',
    pronunciation: 'Like "na" in "nacho"', pronunciationFr: 'Comme « na »',
    strokeCount: 2,
    examples: [
      { syllable: 'ナイフ', romanization: 'naifu (knife)' },
      { syllable: 'ナイト', romanization: 'naito (night)' },
    ],
  },
  {
    id: 'ni', symbol: 'ニ', romanization: 'ni', type: 'consonant', subtype: 'basic',
    name: 'Ni', nameFr: 'Ni',
    pronunciation: 'Like "knee"',          pronunciationFr: 'Comme « ni »',
    strokeCount: 2,
    examples: [
      { syllable: 'テニス', romanization: 'tenisu (tennis)' },
      { syllable: 'ニット', romanization: 'nitto (knit)' },
    ],
  },
  {
    id: 'nu', symbol: 'ヌ', romanization: 'nu', type: 'consonant', subtype: 'basic',
    name: 'Nu', nameFr: 'Nu',
    pronunciation: 'Like "noo" in "noodle"', pronunciationFr: 'Comme « nou »',
    strokeCount: 2,
    examples: [
      { syllable: 'カヌー',     romanization: 'kanuu (canoe)' },
      { syllable: 'ヌードル',   romanization: 'nuudoru (noodle)' },
    ],
  },
  {
    id: 'ne', symbol: 'ネ', romanization: 'ne', type: 'consonant', subtype: 'basic',
    name: 'Ne', nameFr: 'Ne',
    pronunciation: 'Like "ne" in "nest"',  pronunciationFr: 'Comme « né »',
    strokeCount: 4,
    examples: [
      { syllable: 'ネット',     romanization: 'netto (net)' },
      { syllable: 'ネクタイ',   romanization: 'nekutai (necktie)' },
    ],
  },
  {
    id: 'no', symbol: 'ノ', romanization: 'no', type: 'consonant', subtype: 'basic',
    name: 'No', nameFr: 'No',
    pronunciation: 'Like "no"',            pronunciationFr: 'Comme « no »',
    strokeCount: 1,
    examples: [
      { syllable: 'ノート', romanization: 'nooto (notebook)' },
      { syllable: 'ピアノ', romanization: 'piano (piano)' },
    ],
  },

  // ── H-row ───────────────────────────────────────────────────────────
  {
    id: 'ha', symbol: 'ハ', romanization: 'ha', type: 'consonant', subtype: 'basic',
    name: 'Ha', nameFr: 'Ha',
    pronunciation: 'Like "ha" in "ha-ha"', pronunciationFr: 'Comme « ha »',
    strokeCount: 2,
    examples: [
      { syllable: 'ハム',   romanization: 'hamu (ham)' },
      { syllable: 'ハート', romanization: 'haato (heart)' },
    ],
  },
  {
    id: 'hi', symbol: 'ヒ', romanization: 'hi', type: 'consonant', subtype: 'basic',
    name: 'Hi', nameFr: 'Hi',
    pronunciation: 'Like "he"',           pronunciationFr: 'Comme « hi »',
    strokeCount: 2,
    examples: [
      { syllable: 'ヒーロー', romanization: 'hiiroo (hero)' },
      { syllable: 'ヒント',   romanization: 'hinto (hint)' },
    ],
  },
  {
    id: 'fu', symbol: 'フ', romanization: 'fu', type: 'consonant', subtype: 'basic',
    name: 'Fu', nameFr: 'Fu',
    pronunciation: 'Between "hu" and "fu"', pronunciationFr: 'Entre « hou » et « fou »',
    strokeCount: 1,
    examples: [
      { syllable: 'フランス', romanization: 'furansu (France)' },
      { syllable: 'フライ',   romanization: 'furai (fried)' },
    ],
  },
  {
    id: 'he', symbol: 'ヘ', romanization: 'he', type: 'consonant', subtype: 'basic',
    name: 'He', nameFr: 'He',
    pronunciation: 'Like "he" in "help"', pronunciationFr: 'Comme « hé »',
    strokeCount: 1,
    examples: [
      { syllable: 'ヘア',     romanization: 'hea (hair)' },
      { syllable: 'ヘリ',     romanization: 'heri (helicopter)' },
    ],
  },
  {
    id: 'ho', symbol: 'ホ', romanization: 'ho', type: 'consonant', subtype: 'basic',
    name: 'Ho', nameFr: 'Ho',
    pronunciation: 'Like "ho" in "ho-ho"', pronunciationFr: 'Comme « ho »',
    strokeCount: 4,
    examples: [
      { syllable: 'ホテル', romanization: 'hoteru (hotel)' },
      { syllable: 'ホーム', romanization: 'hoomu (home)' },
    ],
  },

  // ── M-row ───────────────────────────────────────────────────────────
  {
    id: 'ma', symbol: 'マ', romanization: 'ma', type: 'consonant', subtype: 'basic',
    name: 'Ma', nameFr: 'Ma',
    pronunciation: 'Like "ma" in "mama"', pronunciationFr: 'Comme « ma »',
    strokeCount: 2,
    examples: [
      { syllable: 'マスク',   romanization: 'masuku (mask)' },
      { syllable: 'マラソン', romanization: 'marason (marathon)' },
    ],
  },
  {
    id: 'mi', symbol: 'ミ', romanization: 'mi', type: 'consonant', subtype: 'basic',
    name: 'Mi', nameFr: 'Mi',
    pronunciation: 'Like "me"',           pronunciationFr: 'Comme « mi »',
    strokeCount: 3,
    examples: [
      { syllable: 'ミルク', romanization: 'miruku (milk)' },
      { syllable: 'ミニ',   romanization: 'mini (mini)' },
    ],
  },
  {
    id: 'mu', symbol: 'ム', romanization: 'mu', type: 'consonant', subtype: 'basic',
    name: 'Mu', nameFr: 'Mu',
    pronunciation: 'Like "moo"',          pronunciationFr: 'Comme « mou »',
    strokeCount: 2,
    examples: [
      { syllable: 'ムード',   romanization: 'muudo (mood)' },
      { syllable: 'チーム',   romanization: 'chiimu (team)' },
    ],
  },
  {
    id: 'me', symbol: 'メ', romanization: 'me', type: 'consonant', subtype: 'basic',
    name: 'Me', nameFr: 'Me',
    pronunciation: 'Like "me" in "met"',  pronunciationFr: 'Comme « mé »',
    strokeCount: 2,
    examples: [
      { syllable: 'メモ',   romanization: 'memo (memo)' },
      { syllable: 'メール', romanization: 'meeru (mail)' },
    ],
  },
  {
    id: 'mo', symbol: 'モ', romanization: 'mo', type: 'consonant', subtype: 'basic',
    name: 'Mo', nameFr: 'Mo',
    pronunciation: 'Like "mo" in "mole"', pronunciationFr: 'Comme « mo »',
    strokeCount: 3,
    examples: [
      { syllable: 'モーター', romanization: 'mootaa (motor)' },
      { syllable: 'メモ',     romanization: 'memo (memo)' },
    ],
  },

  // ── Y-row ───────────────────────────────────────────────────────────
  {
    id: 'ya', symbol: 'ヤ', romanization: 'ya', type: 'consonant', subtype: 'basic',
    name: 'Ya', nameFr: 'Ya',
    pronunciation: 'Like "ya" in "yard"', pronunciationFr: 'Comme « ya »',
    strokeCount: 2,
    examples: [
      { syllable: 'タイヤ',   romanization: 'taiya (tire)' },
      { syllable: 'イヤホン', romanization: 'iyahon (earphone)' },
    ],
  },
  {
    id: 'yu', symbol: 'ユ', romanization: 'yu', type: 'consonant', subtype: 'basic',
    name: 'Yu', nameFr: 'Yu',
    pronunciation: 'Like "you"',          pronunciationFr: 'Comme « you »',
    strokeCount: 2,
    examples: [
      { syllable: 'ユーロ',   romanization: 'yuuro (euro)' },
      { syllable: 'ユニット', romanization: 'yunitto (unit)' },
    ],
  },
  {
    id: 'yo', symbol: 'ヨ', romanization: 'yo', type: 'consonant', subtype: 'basic',
    name: 'Yo', nameFr: 'Yo',
    pronunciation: 'Like "yo" in "yo-yo"', pronunciationFr: 'Comme « yo »',
    strokeCount: 3,
    examples: [
      { syllable: 'ヨット',     romanization: 'yotto (yacht)' },
      { syllable: 'ヨーロッパ', romanization: 'yooroppa (Europe)' },
    ],
  },

  // ── R-row ───────────────────────────────────────────────────────────
  {
    id: 'ra', symbol: 'ラ', romanization: 'ra', type: 'consonant', subtype: 'basic',
    name: 'Ra', nameFr: 'Ra',
    pronunciation: 'Between "ra" and "la", flap', pronunciationFr: 'Entre « ra » et « la »',
    strokeCount: 2,
    examples: [
      { syllable: 'ライト',   romanization: 'raito (light)' },
      { syllable: 'ラーメン', romanization: 'raamen (ramen)' },
    ],
  },
  {
    id: 'ri', symbol: 'リ', romanization: 'ri', type: 'consonant', subtype: 'basic',
    name: 'Ri', nameFr: 'Ri',
    pronunciation: 'Between "ri" and "li"',       pronunciationFr: 'Entre « ri » et « li »',
    strokeCount: 2,
    examples: [
      { syllable: 'リスト', romanization: 'risuto (list)' },
      { syllable: 'リンク', romanization: 'rinku (link)' },
    ],
  },
  {
    id: 'ru', symbol: 'ル', romanization: 'ru', type: 'consonant', subtype: 'basic',
    name: 'Ru', nameFr: 'Ru',
    pronunciation: 'Between "ru" and "lu"',       pronunciationFr: 'Entre « rou » et « lou »',
    strokeCount: 2,
    examples: [
      { syllable: 'ルール', romanization: 'ruuru (rule)' },
      { syllable: 'ルーム', romanization: 'ruumu (room)' },
    ],
  },
  {
    id: 're', symbol: 'レ', romanization: 're', type: 'consonant', subtype: 'basic',
    name: 'Re', nameFr: 'Re',
    pronunciation: 'Between "re" and "le"',       pronunciationFr: 'Entre « ré » et « lé »',
    strokeCount: 1,
    examples: [
      { syllable: 'レモン',     romanization: 'remon (lemon)' },
      { syllable: 'レストラン', romanization: 'resutoran (restaurant)' },
    ],
  },
  {
    id: 'ro', symbol: 'ロ', romanization: 'ro', type: 'consonant', subtype: 'basic',
    name: 'Ro', nameFr: 'Ro',
    pronunciation: 'Between "ro" and "lo"',       pronunciationFr: 'Entre « ro » et « lo »',
    strokeCount: 3,
    examples: [
      { syllable: 'ロボット', romanization: 'robotto (robot)' },
      { syllable: 'ロック',   romanization: 'rokku (rock)' },
    ],
  },

  // ── W-row + standalone ン ─────────────────────────────────────────
  {
    id: 'wa', symbol: 'ワ', romanization: 'wa', type: 'consonant', subtype: 'basic',
    name: 'Wa', nameFr: 'Wa',
    pronunciation: 'Like "wa" in "wand"', pronunciationFr: 'Comme « wa »',
    strokeCount: 2,
    examples: [
      { syllable: 'ワイン', romanization: 'wain (wine)' },
      { syllable: 'ワイヤ', romanization: 'waiya (wire)' },
    ],
  },
  {
    id: 'wo', symbol: 'ヲ', romanization: 'wo', type: 'consonant', subtype: 'basic',
    name: 'Wo', nameFr: 'Wo',
    pronunciation: 'Pronounced "o" — particle only', pronunciationFr: 'Prononcé « o » — particule',
    strokeCount: 3,
    examples: [
      { syllable: 'ヲ',       romanization: 'wo (rare in modern use)' },
      { syllable: 'ヲタク',   romanization: 'wotaku (otaku, stylized)' },
    ],
  },
  {
    id: 'n',  symbol: 'ン', romanization: 'n',  type: 'consonant', subtype: 'basic',
    name: 'N',  nameFr: 'N',
    pronunciation: 'Standalone nasal "n/m/ng"',     pronunciationFr: 'Nasale « n/m/ng »',
    strokeCount: 2,
    examples: [
      { syllable: 'ペン',   romanization: 'pen (pen)' },
      { syllable: 'パン',   romanization: 'pan (bread)' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  // ── Dakuten (voiced consonants) ──
  // ══════════════════════════════════════════════════════════════════════

  // ── G-row ───────────────────────────────────────────────────────────
  {
    id: 'ga', symbol: 'ガ', romanization: 'ga', type: 'consonant', subtype: 'dakuten',
    name: 'Ga', nameFr: 'Ga',
    pronunciation: 'Like "ga" in "garden"', pronunciationFr: 'Comme « ga »',
    strokeCount: 4,
    examples: [
      { syllable: 'ガス',   romanization: 'gasu (gas)' },
      { syllable: 'ガラス', romanization: 'garasu (glass)' },
    ],
  },
  {
    id: 'gi', symbol: 'ギ', romanization: 'gi', type: 'consonant', subtype: 'dakuten',
    name: 'Gi', nameFr: 'Gi',
    pronunciation: 'Like "gi" in "give"', pronunciationFr: 'Comme « gui »',
    strokeCount: 5,
    examples: [
      { syllable: 'ギター', romanization: 'gitaa (guitar)' },
      { syllable: 'ギフト', romanization: 'gifuto (gift)' },
    ],
  },
  {
    id: 'gu', symbol: 'グ', romanization: 'gu', type: 'consonant', subtype: 'dakuten',
    name: 'Gu', nameFr: 'Gu',
    pronunciation: 'Like "goo"', pronunciationFr: 'Comme « gou »',
    strokeCount: 4,
    examples: [
      { syllable: 'グループ', romanization: 'guruupu (group)' },
      { syllable: 'グラス',   romanization: 'gurasu (glass)' },
    ],
  },
  {
    id: 'ge', symbol: 'ゲ', romanization: 'ge', type: 'consonant', subtype: 'dakuten',
    name: 'Ge', nameFr: 'Ge',
    pronunciation: 'Like "ge" in "get"', pronunciationFr: 'Comme « gué »',
    strokeCount: 5,
    examples: [
      { syllable: 'ゲーム', romanization: 'geemu (game)' },
      { syllable: 'ゲスト', romanization: 'gesuto (guest)' },
    ],
  },
  {
    id: 'go', symbol: 'ゴ', romanization: 'go', type: 'consonant', subtype: 'dakuten',
    name: 'Go', nameFr: 'Go',
    pronunciation: 'Like "go"', pronunciationFr: 'Comme « go »',
    strokeCount: 4,
    examples: [
      { syllable: 'ゴール', romanization: 'gooru (goal)' },
      { syllable: 'ゴルフ', romanization: 'gorufu (golf)' },
    ],
  },

  // ── Z-row ───────────────────────────────────────────────────────────
  {
    id: 'za', symbol: 'ザ', romanization: 'za', type: 'consonant', subtype: 'dakuten',
    name: 'Za', nameFr: 'Za',
    pronunciation: 'Like "za" in "pizza"', pronunciationFr: 'Comme « za »',
    strokeCount: 5,
    examples: [
      { syllable: 'デザイン', romanization: 'dezain (design)' },
      { syllable: 'ピザ',     romanization: 'piza (pizza)' },
    ],
  },
  {
    id: 'ji', symbol: 'ジ', romanization: 'ji', type: 'consonant', subtype: 'dakuten',
    name: 'Ji', nameFr: 'Ji',
    pronunciation: 'Like "jee"', pronunciationFr: 'Comme « dji »',
    strokeCount: 5,
    examples: [
      { syllable: 'ジュース', romanization: 'juusu (juice)' },
      { syllable: 'イメージ', romanization: 'imeeji (image)' },
    ],
  },
  {
    id: 'zu', symbol: 'ズ', romanization: 'zu', type: 'consonant', subtype: 'dakuten',
    name: 'Zu', nameFr: 'Zu',
    pronunciation: 'Like "zoo"', pronunciationFr: 'Comme « zou »',
    strokeCount: 4,
    examples: [
      { syllable: 'チーズ', romanization: 'chiizu (cheese)' },
      { syllable: 'サイズ', romanization: 'saizu (size)' },
    ],
  },
  {
    id: 'ze', symbol: 'ゼ', romanization: 'ze', type: 'consonant', subtype: 'dakuten',
    name: 'Ze', nameFr: 'Ze',
    pronunciation: 'Like "ze" in "zero"', pronunciationFr: 'Comme « zé »',
    strokeCount: 4,
    examples: [
      { syllable: 'ゼロ', romanization: 'zero (zero)' },
      { syllable: 'ゼリー', romanization: 'zerii (jelly)' },
    ],
  },
  {
    id: 'zo', symbol: 'ゾ', romanization: 'zo', type: 'consonant', subtype: 'dakuten',
    name: 'Zo', nameFr: 'Zo',
    pronunciation: 'Like "zo" in "zone"', pronunciationFr: 'Comme « zo »',
    strokeCount: 4,
    examples: [
      { syllable: 'ゾーン', romanization: 'zoon (zone)' },
      { syllable: 'アマゾン', romanization: 'amazon (Amazon)' },
    ],
  },

  // ── D-row ───────────────────────────────────────────────────────────
  {
    id: 'da', symbol: 'ダ', romanization: 'da', type: 'consonant', subtype: 'dakuten',
    name: 'Da', nameFr: 'Da',
    pronunciation: 'Like "da" in "dad"', pronunciationFr: 'Comme « da »',
    strokeCount: 5,
    examples: [
      { syllable: 'ダンス', romanization: 'dansu (dance)' },
      { syllable: 'ダイヤ', romanization: 'daiya (diamond)' },
    ],
  },
  {
    id: 'dji', symbol: 'ヂ', romanization: 'ji', type: 'consonant', subtype: 'dakuten',
    name: 'Di/Ji', nameFr: 'Di/Ji',
    pronunciation: 'Same as ジ (ji) — rare', pronunciationFr: 'Comme « dji » — rare',
    strokeCount: 5,
    examples: [
      { syllable: 'ヂ', romanization: 'ji (rare in modern use)' },
    ],
  },
  {
    id: 'dzu', symbol: 'ヅ', romanization: 'zu', type: 'consonant', subtype: 'dakuten',
    name: 'Du/Zu', nameFr: 'Du/Zu',
    pronunciation: 'Same as ズ (zu) — rare', pronunciationFr: 'Comme « dzou » — rare',
    strokeCount: 5,
    examples: [
      { syllable: 'ヅ', romanization: 'zu (rare in modern use)' },
    ],
  },
  {
    id: 'de', symbol: 'デ', romanization: 'de', type: 'consonant', subtype: 'dakuten',
    name: 'De', nameFr: 'De',
    pronunciation: 'Like "de" in "desk"', pronunciationFr: 'Comme « dé »',
    strokeCount: 5,
    examples: [
      { syllable: 'デザート', romanization: 'dezaato (dessert)' },
      { syllable: 'デート',   romanization: 'deeto (date)' },
    ],
  },
  {
    id: 'do', symbol: 'ド', romanization: 'do', type: 'consonant', subtype: 'dakuten',
    name: 'Do', nameFr: 'Do',
    pronunciation: 'Like "do" in "door"', pronunciationFr: 'Comme « do »',
    strokeCount: 4,
    examples: [
      { syllable: 'ドア',   romanization: 'doa (door)' },
      { syllable: 'ドラマ', romanization: 'dorama (drama)' },
    ],
  },

  // ── B-row ───────────────────────────────────────────────────────────
  {
    id: 'ba', symbol: 'バ', romanization: 'ba', type: 'consonant', subtype: 'dakuten',
    name: 'Ba', nameFr: 'Ba',
    pronunciation: 'Like "ba" in "bar"', pronunciationFr: 'Comme « ba »',
    strokeCount: 4,
    examples: [
      { syllable: 'バス',   romanization: 'basu (bus)' },
      { syllable: 'バター', romanization: 'bataa (butter)' },
    ],
  },
  {
    id: 'bi', symbol: 'ビ', romanization: 'bi', type: 'consonant', subtype: 'dakuten',
    name: 'Bi', nameFr: 'Bi',
    pronunciation: 'Like "bee"', pronunciationFr: 'Comme « bi »',
    strokeCount: 4,
    examples: [
      { syllable: 'ビール', romanization: 'biiru (beer)' },
      { syllable: 'ビデオ', romanization: 'bideo (video)' },
    ],
  },
  {
    id: 'bu', symbol: 'ブ', romanization: 'bu', type: 'consonant', subtype: 'dakuten',
    name: 'Bu', nameFr: 'Bu',
    pronunciation: 'Like "boo"', pronunciationFr: 'Comme « bou »',
    strokeCount: 3,
    examples: [
      { syllable: 'ブログ', romanization: 'burogu (blog)' },
      { syllable: 'ブーツ', romanization: 'buutsu (boots)' },
    ],
  },
  {
    id: 'be', symbol: 'ベ', romanization: 'be', type: 'consonant', subtype: 'dakuten',
    name: 'Be', nameFr: 'Be',
    pronunciation: 'Like "be" in "bed"', pronunciationFr: 'Comme « bé »',
    strokeCount: 3,
    examples: [
      { syllable: 'ベッド',   romanization: 'beddo (bed)' },
      { syllable: 'ベスト',   romanization: 'besuto (best)' },
    ],
  },
  {
    id: 'bo', symbol: 'ボ', romanization: 'bo', type: 'consonant', subtype: 'dakuten',
    name: 'Bo', nameFr: 'Bo',
    pronunciation: 'Like "bo" in "boat"', pronunciationFr: 'Comme « bo »',
    strokeCount: 6,
    examples: [
      { syllable: 'ボール', romanization: 'booru (ball)' },
      { syllable: 'ボタン', romanization: 'botan (button)' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  // ── Handakuten (h → p) ──
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'pa', symbol: 'パ', romanization: 'pa', type: 'consonant', subtype: 'handakuten',
    name: 'Pa', nameFr: 'Pa',
    pronunciation: 'Like "pa" in "park"', pronunciationFr: 'Comme « pa »',
    strokeCount: 4,
    examples: [
      { syllable: 'パーティー', romanization: 'paatii (party)' },
      { syllable: 'パン',       romanization: 'pan (bread)' },
    ],
  },
  {
    id: 'pi', symbol: 'ピ', romanization: 'pi', type: 'consonant', subtype: 'handakuten',
    name: 'Pi', nameFr: 'Pi',
    pronunciation: 'Like "pee"', pronunciationFr: 'Comme « pi »',
    strokeCount: 4,
    examples: [
      { syllable: 'ピアノ', romanization: 'piano (piano)' },
      { syllable: 'ピザ',   romanization: 'piza (pizza)' },
    ],
  },
  {
    id: 'pu', symbol: 'プ', romanization: 'pu', type: 'consonant', subtype: 'handakuten',
    name: 'Pu', nameFr: 'Pu',
    pronunciation: 'Like "poo"', pronunciationFr: 'Comme « pou »',
    strokeCount: 3,
    examples: [
      { syllable: 'プール',     romanization: 'puuru (pool)' },
      { syllable: 'プログラム', romanization: 'puroguramu (program)' },
    ],
  },
  {
    id: 'pe', symbol: 'ペ', romanization: 'pe', type: 'consonant', subtype: 'handakuten',
    name: 'Pe', nameFr: 'Pe',
    pronunciation: 'Like "pe" in "pet"', pronunciationFr: 'Comme « pé »',
    strokeCount: 3,
    examples: [
      { syllable: 'ペン',   romanization: 'pen (pen)' },
      { syllable: 'ページ', romanization: 'peeji (page)' },
    ],
  },
  {
    id: 'po', symbol: 'ポ', romanization: 'po', type: 'consonant', subtype: 'handakuten',
    name: 'Po', nameFr: 'Po',
    pronunciation: 'Like "po" in "pole"', pronunciationFr: 'Comme « po »',
    strokeCount: 6,
    examples: [
      { syllable: 'ポスト', romanization: 'posuto (post)' },
      { syllable: 'ポケット', romanization: 'poketto (pocket)' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  // ── Yōon (consonant + small ャ/ュ/ョ) ──
  // ══════════════════════════════════════════════════════════════════════

  // ── k-row yōon ──
  { id: 'kya', symbol: 'キャ', romanization: 'kya', type: 'consonant', subtype: 'yoon', name: 'Kya', nameFr: 'Kya', pronunciation: 'Like "kya"', pronunciationFr: 'Comme « kya »', strokeCount: 5, examples: [{ syllable: 'キャンプ', romanization: 'kyanpu (camp)' }] },
  { id: 'kyu', symbol: 'キュ', romanization: 'kyu', type: 'consonant', subtype: 'yoon', name: 'Kyu', nameFr: 'Kyu', pronunciation: 'Like "queue"', pronunciationFr: 'Comme « kyou »', strokeCount: 5, examples: [{ syllable: 'キュート', romanization: 'kyuuto (cute)' }] },
  { id: 'kyo', symbol: 'キョ', romanization: 'kyo', type: 'consonant', subtype: 'yoon', name: 'Kyo', nameFr: 'Kyo', pronunciation: 'Like "kyo"', pronunciationFr: 'Comme « kyo »', strokeCount: 6, examples: [{ syllable: 'トーキョー', romanization: 'tookyoo (Tokyo)' }] },

  // ── s-row yōon ──
  { id: 'sha', symbol: 'シャ', romanization: 'sha', type: 'consonant', subtype: 'yoon', name: 'Sha', nameFr: 'Sha', pronunciation: 'Like "sha" in "shark"', pronunciationFr: 'Comme « cha »', strokeCount: 5, examples: [{ syllable: 'シャツ', romanization: 'shatsu (shirt)' }] },
  { id: 'shu', symbol: 'シュ', romanization: 'shu', type: 'consonant', subtype: 'yoon', name: 'Shu', nameFr: 'Shu', pronunciation: 'Like "shoe"', pronunciationFr: 'Comme « chou »', strokeCount: 5, examples: [{ syllable: 'シュート', romanization: 'shuuto (shoot)' }] },
  { id: 'sho', symbol: 'ショ', romanization: 'sho', type: 'consonant', subtype: 'yoon', name: 'Sho', nameFr: 'Sho', pronunciation: 'Like "show"', pronunciationFr: 'Comme « cho »', strokeCount: 6, examples: [{ syllable: 'ショップ', romanization: 'shoppu (shop)' }] },

  // ── t-row yōon ──
  { id: 'cha', symbol: 'チャ', romanization: 'cha', type: 'consonant', subtype: 'yoon', name: 'Cha', nameFr: 'Cha', pronunciation: 'Like "cha"', pronunciationFr: 'Comme « tcha »', strokeCount: 5, examples: [{ syllable: 'チャンス', romanization: 'chansu (chance)' }] },
  { id: 'chu', symbol: 'チュ', romanization: 'chu', type: 'consonant', subtype: 'yoon', name: 'Chu', nameFr: 'Chu', pronunciation: 'Like "chew"', pronunciationFr: 'Comme « tchou »', strokeCount: 5, examples: [{ syllable: 'チューブ', romanization: 'chuubu (tube)' }] },
  { id: 'cho', symbol: 'チョ', romanization: 'cho', type: 'consonant', subtype: 'yoon', name: 'Cho', nameFr: 'Cho', pronunciation: 'Like "cho"', pronunciationFr: 'Comme « tcho »', strokeCount: 6, examples: [{ syllable: 'チョコ', romanization: 'choko (chocolate)' }] },

  // ── n-row yōon ──
  { id: 'nya', symbol: 'ニャ', romanization: 'nya', type: 'consonant', subtype: 'yoon', name: 'Nya', nameFr: 'Nya', pronunciation: 'Like "nya"', pronunciationFr: 'Comme « nia »', strokeCount: 4, examples: [{ syllable: 'ニャンコ', romanization: 'nyanko (kitty)' }] },
  { id: 'nyu', symbol: 'ニュ', romanization: 'nyu', type: 'consonant', subtype: 'yoon', name: 'Nyu', nameFr: 'Nyu', pronunciation: 'Like "new"', pronunciationFr: 'Comme « niou »', strokeCount: 4, examples: [{ syllable: 'ニュース', romanization: 'nyuusu (news)' }] },
  { id: 'nyo', symbol: 'ニョ', romanization: 'nyo', type: 'consonant', subtype: 'yoon', name: 'Nyo', nameFr: 'Nyo', pronunciation: 'Like "nyo"', pronunciationFr: 'Comme « nio »', strokeCount: 5, examples: [{ syllable: 'ニョッキ', romanization: 'nyokki (gnocchi)' }] },

  // ── h-row yōon ──
  { id: 'hya', symbol: 'ヒャ', romanization: 'hya', type: 'consonant', subtype: 'yoon', name: 'Hya', nameFr: 'Hya', pronunciation: 'Like "hya"', pronunciationFr: 'Comme « hya »', strokeCount: 4, examples: [{ syllable: 'ヒャク', romanization: 'hyaku (hundred)' }] },
  { id: 'hyu', symbol: 'ヒュ', romanization: 'hyu', type: 'consonant', subtype: 'yoon', name: 'Hyu', nameFr: 'Hyu', pronunciation: 'Like "hew"', pronunciationFr: 'Comme « hyou »', strokeCount: 4, examples: [{ syllable: 'ヒューズ', romanization: 'hyuuzu (fuse)' }] },
  { id: 'hyo', symbol: 'ヒョ', romanization: 'hyo', type: 'consonant', subtype: 'yoon', name: 'Hyo', nameFr: 'Hyo', pronunciation: 'Like "hyo"', pronunciationFr: 'Comme « hyo »', strokeCount: 5, examples: [{ syllable: 'ヒョウ', romanization: 'hyou (hail)' }] },

  // ── m-row yōon ──
  { id: 'mya', symbol: 'ミャ', romanization: 'mya', type: 'consonant', subtype: 'yoon', name: 'Mya', nameFr: 'Mya', pronunciation: 'Like "mya"', pronunciationFr: 'Comme « mya »', strokeCount: 5, examples: [{ syllable: 'ミャンマー', romanization: 'myanmaa (Myanmar)' }] },
  { id: 'myu', symbol: 'ミュ', romanization: 'myu', type: 'consonant', subtype: 'yoon', name: 'Myu', nameFr: 'Myu', pronunciation: 'Like "mew"', pronunciationFr: 'Comme « myou »', strokeCount: 5, examples: [{ syllable: 'ミュージック', romanization: 'myuujikku (music)' }] },
  { id: 'myo', symbol: 'ミョ', romanization: 'myo', type: 'consonant', subtype: 'yoon', name: 'Myo', nameFr: 'Myo', pronunciation: 'Like "myo"', pronunciationFr: 'Comme « myo »', strokeCount: 6, examples: [{ syllable: 'ミョウジ', romanization: 'myouji (surname)' }] },

  // ── r-row yōon ──
  { id: 'rya', symbol: 'リャ', romanization: 'rya', type: 'consonant', subtype: 'yoon', name: 'Rya', nameFr: 'Rya', pronunciation: 'Between "rya" and "lya"', pronunciationFr: 'Entre « rya » et « lya »', strokeCount: 4, examples: [{ syllable: 'リャク', romanization: 'ryaku (abbreviation)' }] },
  { id: 'ryu', symbol: 'リュ', romanization: 'ryu', type: 'consonant', subtype: 'yoon', name: 'Ryu', nameFr: 'Ryu', pronunciation: 'Between "ryu" and "lyu"', pronunciationFr: 'Entre « ryou » et « lyou »', strokeCount: 4, examples: [{ syllable: 'リュック', romanization: 'ryukku (backpack)' }] },
  { id: 'ryo', symbol: 'リョ', romanization: 'ryo', type: 'consonant', subtype: 'yoon', name: 'Ryo', nameFr: 'Ryo', pronunciation: 'Between "ryo" and "lyo"', pronunciationFr: 'Entre « ryo » et « lyo »', strokeCount: 5, examples: [{ syllable: 'リョコウ', romanization: 'ryokou (travel)' }] },

  // ── g-row yōon ──
  { id: 'gya', symbol: 'ギャ', romanization: 'gya', type: 'consonant', subtype: 'yoon', name: 'Gya', nameFr: 'Gya', pronunciation: 'Like "gya"', pronunciationFr: 'Comme « gya »', strokeCount: 7, examples: [{ syllable: 'ギャラリー', romanization: 'gyararii (gallery)' }] },
  { id: 'gyu', symbol: 'ギュ', romanization: 'gyu', type: 'consonant', subtype: 'yoon', name: 'Gyu', nameFr: 'Gyu', pronunciation: 'Like "gyu"', pronunciationFr: 'Comme « gyou »', strokeCount: 7, examples: [{ syllable: 'ギュウニク', romanization: 'gyuuniku (beef)' }] },
  { id: 'gyo', symbol: 'ギョ', romanization: 'gyo', type: 'consonant', subtype: 'yoon', name: 'Gyo', nameFr: 'Gyo', pronunciation: 'Like "gyo"', pronunciationFr: 'Comme « gyo »', strokeCount: 8, examples: [{ syllable: 'ギョウザ', romanization: 'gyouza (dumpling)' }] },

  // ── j-row yōon ──
  { id: 'ja', symbol: 'ジャ', romanization: 'ja', type: 'consonant', subtype: 'yoon', name: 'Ja', nameFr: 'Ja', pronunciation: 'Like "ja" in "jar"', pronunciationFr: 'Comme « dja »', strokeCount: 7, examples: [{ syllable: 'ジャム', romanization: 'jamu (jam)' }] },
  { id: 'ju', symbol: 'ジュ', romanization: 'ju', type: 'consonant', subtype: 'yoon', name: 'Ju', nameFr: 'Ju', pronunciation: 'Like "jew"', pronunciationFr: 'Comme « djou »', strokeCount: 7, examples: [{ syllable: 'ジュース', romanization: 'juusu (juice)' }] },
  { id: 'jo', symbol: 'ジョ', romanization: 'jo', type: 'consonant', subtype: 'yoon', name: 'Jo', nameFr: 'Jo', pronunciation: 'Like "Joe"', pronunciationFr: 'Comme « djo »', strokeCount: 8, examples: [{ syllable: 'ジョギング', romanization: 'jogingu (jogging)' }] },

  // ── b-row yōon ──
  { id: 'bya', symbol: 'ビャ', romanization: 'bya', type: 'consonant', subtype: 'yoon', name: 'Bya', nameFr: 'Bya', pronunciation: 'Like "bya"', pronunciationFr: 'Comme « bya »', strokeCount: 6, examples: [{ syllable: 'ビャクヤ', romanization: 'byakuya (white night)' }] },
  { id: 'byu', symbol: 'ビュ', romanization: 'byu', type: 'consonant', subtype: 'yoon', name: 'Byu', nameFr: 'Byu', pronunciation: 'Like "byu"', pronunciationFr: 'Comme « byou »', strokeCount: 6, examples: [{ syllable: 'レビュー', romanization: 'rebyuu (review)' }] },
  { id: 'byo', symbol: 'ビョ', romanization: 'byo', type: 'consonant', subtype: 'yoon', name: 'Byo', nameFr: 'Byo', pronunciation: 'Like "byo"', pronunciationFr: 'Comme « byo »', strokeCount: 7, examples: [{ syllable: 'ビョウイン', romanization: 'byouin (hospital)' }] },

  // ── p-row yōon ──
  { id: 'pya', symbol: 'ピャ', romanization: 'pya', type: 'consonant', subtype: 'yoon', name: 'Pya', nameFr: 'Pya', pronunciation: 'Like "pya"', pronunciationFr: 'Comme « pya »', strokeCount: 6, examples: [{ syllable: 'ロッピャク', romanization: 'roppyaku (six hundred)' }] },
  { id: 'pyu', symbol: 'ピュ', romanization: 'pyu', type: 'consonant', subtype: 'yoon', name: 'Pyu', nameFr: 'Pyu', pronunciation: 'Like "pew"', pronunciationFr: 'Comme « pyou »', strokeCount: 6, examples: [{ syllable: 'コンピューター', romanization: 'konpyuutaa (computer)' }] },
  { id: 'pyo', symbol: 'ピョ', romanization: 'pyo', type: 'consonant', subtype: 'yoon', name: 'Pyo', nameFr: 'Pyo', pronunciation: 'Like "pyo"', pronunciationFr: 'Comme « pyo »', strokeCount: 7, examples: [{ syllable: 'ピョンピョン', romanization: 'pyonpyon (hop hop)' }] },
]
