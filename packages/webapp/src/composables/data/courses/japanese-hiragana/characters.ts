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
 *
 * `examples` are short, common Japanese words that visibly contain the
 * focused kana — they're rendered on the practice page as a small grid
 * of "word + romaji" tiles, mirroring the Korean syllable examples.
 */
export const CHARACTERS: ICourseCharacter[] = [
  // ── Vowels ──────────────────────────────────────────────────────────
  {
    id: 'a',  symbol: 'あ', romanization: 'a',  type: 'vowel', subtype: 'basic',
    name: 'A',  nameFr: 'A',
    pronunciation: 'Like "a" in "father"',          pronunciationFr: 'Comme « a » dans « papa »',
    strokeCount: 3,
    examples: [
      { syllable: 'あめ', romanization: 'ame (rain)' },
      { syllable: 'あさ', romanization: 'asa (morning)' },
    ],
  },
  {
    id: 'i',  symbol: 'い', romanization: 'i',  type: 'vowel', subtype: 'basic',
    name: 'I',  nameFr: 'I',
    pronunciation: 'Like "ee" in "see", short',     pronunciationFr: 'Comme « i » dans « ici »',
    strokeCount: 2,
    examples: [
      { syllable: 'いえ', romanization: 'ie (house)' },
      { syllable: 'いし', romanization: 'ishi (stone)' },
    ],
  },
  {
    id: 'u',  symbol: 'う', romanization: 'u',  type: 'vowel', subtype: 'basic',
    name: 'U',  nameFr: 'U',
    pronunciation: 'Like "oo" in "boot", unrounded', pronunciationFr: 'Comme « ou » dans « roue »',
    strokeCount: 2,
    examples: [
      { syllable: 'うみ', romanization: 'umi (sea)' },
      { syllable: 'うた', romanization: 'uta (song)' },
    ],
  },
  {
    id: 'e',  symbol: 'え', romanization: 'e',  type: 'vowel', subtype: 'basic',
    name: 'E',  nameFr: 'E',
    pronunciation: 'Like "e" in "pet"',             pronunciationFr: 'Comme « é » dans « été »',
    strokeCount: 2,
    examples: [
      { syllable: 'えき', romanization: 'eki (station)' },
      { syllable: 'え',   romanization: 'e (picture)' },
    ],
  },
  {
    id: 'o',  symbol: 'お', romanization: 'o',  type: 'vowel', subtype: 'basic',
    name: 'O',  nameFr: 'O',
    pronunciation: 'Like "o" in "more"',            pronunciationFr: 'Comme « o » dans « moto »',
    strokeCount: 3,
    examples: [
      { syllable: 'おに', romanization: 'oni (ogre)' },
      { syllable: 'おか', romanization: 'oka (hill)' },
    ],
  },

  // ── K-row ───────────────────────────────────────────────────────────
  {
    id: 'ka', symbol: 'か', romanization: 'ka', type: 'consonant', subtype: 'basic',
    name: 'Ka', nameFr: 'Ka',
    pronunciation: 'Like "ka" in "karma"', pronunciationFr: 'Comme « ka »',
    strokeCount: 3,
    examples: [
      { syllable: 'かさ', romanization: 'kasa (umbrella)' },
      { syllable: 'かに', romanization: 'kani (crab)' },
    ],
  },
  {
    id: 'ki', symbol: 'き', romanization: 'ki', type: 'consonant', subtype: 'basic',
    name: 'Ki', nameFr: 'Ki',
    pronunciation: 'Like "key"',           pronunciationFr: 'Comme « ki »',
    strokeCount: 4,
    examples: [
      { syllable: 'き',   romanization: 'ki (tree)' },
      { syllable: 'きく', romanization: 'kiku (to listen)' },
    ],
  },
  {
    id: 'ku', symbol: 'く', romanization: 'ku', type: 'consonant', subtype: 'basic',
    name: 'Ku', nameFr: 'Ku',
    pronunciation: 'Like "coo"',          pronunciationFr: 'Comme « kou »',
    strokeCount: 1,
    examples: [
      { syllable: 'くも', romanization: 'kumo (cloud)' },
      { syllable: 'くち', romanization: 'kuchi (mouth)' },
    ],
  },
  {
    id: 'ke', symbol: 'け', romanization: 'ke', type: 'consonant', subtype: 'basic',
    name: 'Ke', nameFr: 'Ke',
    pronunciation: 'Like "ke" in "ketchup"', pronunciationFr: 'Comme « ké »',
    strokeCount: 3,
    examples: [
      { syllable: 'いけ',   romanization: 'ike (pond)' },
      { syllable: 'けむり', romanization: 'kemuri (smoke)' },
    ],
  },
  {
    id: 'ko', symbol: 'こ', romanization: 'ko', type: 'consonant', subtype: 'basic',
    name: 'Ko', nameFr: 'Ko',
    pronunciation: 'Like "ko" in "Kobe"', pronunciationFr: 'Comme « ko »',
    strokeCount: 2,
    examples: [
      { syllable: 'こえ',   romanization: 'koe (voice)' },
      { syllable: 'こころ', romanization: 'kokoro (heart)' },
    ],
  },

  // ── S-row ───────────────────────────────────────────────────────────
  {
    id: 'sa',  symbol: 'さ', romanization: 'sa',  type: 'consonant', subtype: 'basic',
    name: 'Sa',  nameFr: 'Sa',
    pronunciation: 'Like "sa" in "sand"',  pronunciationFr: 'Comme « sa »',
    strokeCount: 3,
    examples: [
      { syllable: 'さくら', romanization: 'sakura (cherry blossom)' },
      { syllable: 'さかな', romanization: 'sakana (fish)' },
    ],
  },
  {
    id: 'shi', symbol: 'し', romanization: 'shi', type: 'consonant', subtype: 'basic',
    name: 'Shi', nameFr: 'Shi',
    pronunciation: 'Like "she"',          pronunciationFr: 'Comme « chi »',
    strokeCount: 1,
    examples: [
      { syllable: 'しお', romanization: 'shio (salt)' },
      { syllable: 'しろ', romanization: 'shiro (white)' },
    ],
  },
  {
    id: 'su',  symbol: 'す', romanization: 'su',  type: 'consonant', subtype: 'basic',
    name: 'Su',  nameFr: 'Su',
    pronunciation: 'Like "su" in "Sue"',   pronunciationFr: 'Comme « sou »',
    strokeCount: 2,
    examples: [
      { syllable: 'すし', romanization: 'sushi (sushi)' },
      { syllable: 'いす', romanization: 'isu (chair)' },
    ],
  },
  {
    id: 'se',  symbol: 'せ', romanization: 'se',  type: 'consonant', subtype: 'basic',
    name: 'Se',  nameFr: 'Se',
    pronunciation: 'Like "se" in "set"',   pronunciationFr: 'Comme « sé »',
    strokeCount: 3,
    examples: [
      { syllable: 'せかい', romanization: 'sekai (world)' },
      { syllable: 'せみ',   romanization: 'semi (cicada)' },
    ],
  },
  {
    id: 'so',  symbol: 'そ', romanization: 'so',  type: 'consonant', subtype: 'basic',
    name: 'So',  nameFr: 'So',
    pronunciation: 'Like "so"',           pronunciationFr: 'Comme « so »',
    strokeCount: 1,
    examples: [
      { syllable: 'そら', romanization: 'sora (sky)' },
      { syllable: 'みそ', romanization: 'miso (miso)' },
    ],
  },

  // ── T-row ───────────────────────────────────────────────────────────
  {
    id: 'ta',  symbol: 'た', romanization: 'ta',  type: 'consonant', subtype: 'basic',
    name: 'Ta',  nameFr: 'Ta',
    pronunciation: 'Like "ta" in "taco"', pronunciationFr: 'Comme « ta »',
    strokeCount: 4,
    examples: [
      { syllable: 'たこ',   romanization: 'tako (octopus)' },
      { syllable: 'たまご', romanization: 'tamago (egg)' },
    ],
  },
  {
    id: 'chi', symbol: 'ち', romanization: 'chi', type: 'consonant', subtype: 'basic',
    name: 'Chi', nameFr: 'Chi',
    pronunciation: 'Like "chee"',         pronunciationFr: 'Comme « tchi »',
    strokeCount: 2,
    examples: [
      { syllable: 'いち', romanization: 'ichi (one)' },
      { syllable: 'ちち', romanization: 'chichi (father)' },
    ],
  },
  {
    id: 'tsu', symbol: 'つ', romanization: 'tsu', type: 'consonant', subtype: 'basic',
    name: 'Tsu', nameFr: 'Tsu',
    pronunciation: 'Like "tsu" in "tsunami"', pronunciationFr: 'Comme « tsou »',
    strokeCount: 1,
    examples: [
      { syllable: 'つき',   romanization: 'tsuki (moon)' },
      { syllable: 'つくえ', romanization: 'tsukue (desk)' },
    ],
  },
  {
    id: 'te',  symbol: 'て', romanization: 'te',  type: 'consonant', subtype: 'basic',
    name: 'Te',  nameFr: 'Te',
    pronunciation: 'Like "te" in "ten"',  pronunciationFr: 'Comme « té »',
    strokeCount: 1,
    examples: [
      { syllable: 'て',   romanization: 'te (hand)' },
      { syllable: 'てら', romanization: 'tera (temple)' },
    ],
  },
  {
    id: 'to',  symbol: 'と', romanization: 'to',  type: 'consonant', subtype: 'basic',
    name: 'To',  nameFr: 'To',
    pronunciation: 'Like "toe"',          pronunciationFr: 'Comme « to »',
    strokeCount: 2,
    examples: [
      { syllable: 'とり', romanization: 'tori (bird)' },
      { syllable: 'と',   romanization: 'to (door)' },
    ],
  },

  // ── N-row ───────────────────────────────────────────────────────────
  {
    id: 'na', symbol: 'な', romanization: 'na', type: 'consonant', subtype: 'basic',
    name: 'Na', nameFr: 'Na',
    pronunciation: 'Like "na" in "nacho"', pronunciationFr: 'Comme « na »',
    strokeCount: 4,
    examples: [
      { syllable: 'なつ',   romanization: 'natsu (summer)' },
      { syllable: 'さかな', romanization: 'sakana (fish)' },
    ],
  },
  {
    id: 'ni', symbol: 'に', romanization: 'ni', type: 'consonant', subtype: 'basic',
    name: 'Ni', nameFr: 'Ni',
    pronunciation: 'Like "knee"',          pronunciationFr: 'Comme « ni »',
    strokeCount: 3,
    examples: [
      { syllable: 'にし', romanization: 'nishi (west)' },
      { syllable: 'にく', romanization: 'niku (meat)' },
    ],
  },
  {
    id: 'nu', symbol: 'ぬ', romanization: 'nu', type: 'consonant', subtype: 'basic',
    name: 'Nu', nameFr: 'Nu',
    pronunciation: 'Like "noo" in "noodle"', pronunciationFr: 'Comme « nou »',
    strokeCount: 2,
    examples: [
      { syllable: 'いぬ', romanization: 'inu (dog)' },
      { syllable: 'ぬの', romanization: 'nuno (cloth)' },
    ],
  },
  {
    id: 'ne', symbol: 'ね', romanization: 'ne', type: 'consonant', subtype: 'basic',
    name: 'Ne', nameFr: 'Ne',
    pronunciation: 'Like "ne" in "nest"',  pronunciationFr: 'Comme « né »',
    strokeCount: 2,
    examples: [
      { syllable: 'ねこ', romanization: 'neko (cat)' },
      { syllable: 'ねつ', romanization: 'netsu (fever)' },
    ],
  },
  {
    id: 'no', symbol: 'の', romanization: 'no', type: 'consonant', subtype: 'basic',
    name: 'No', nameFr: 'No',
    pronunciation: 'Like "no"',            pronunciationFr: 'Comme « no »',
    strokeCount: 1,
    examples: [
      { syllable: 'のり', romanization: 'nori (seaweed)' },
      { syllable: 'もの', romanization: 'mono (thing)' },
    ],
  },

  // ── H-row ───────────────────────────────────────────────────────────
  {
    id: 'ha', symbol: 'は', romanization: 'ha', type: 'consonant', subtype: 'basic',
    name: 'Ha', nameFr: 'Ha',
    pronunciation: 'Like "ha" in "ha-ha"', pronunciationFr: 'Comme « ha »',
    strokeCount: 3,
    examples: [
      { syllable: 'はな', romanization: 'hana (flower)' },
      { syllable: 'はし', romanization: 'hashi (chopsticks)' },
    ],
  },
  {
    id: 'hi', symbol: 'ひ', romanization: 'hi', type: 'consonant', subtype: 'basic',
    name: 'Hi', nameFr: 'Hi',
    pronunciation: 'Like "he"',           pronunciationFr: 'Comme « hi »',
    strokeCount: 1,
    examples: [
      { syllable: 'ひと', romanization: 'hito (person)' },
      { syllable: 'ひ',   romanization: 'hi (fire/sun)' },
    ],
  },
  {
    id: 'fu', symbol: 'ふ', romanization: 'fu', type: 'consonant', subtype: 'basic',
    name: 'Fu', nameFr: 'Fu',
    pronunciation: 'Between "hu" and "fu"', pronunciationFr: 'Entre « hou » et « fou »',
    strokeCount: 4,
    examples: [
      { syllable: 'ふね', romanization: 'fune (boat)' },
      { syllable: 'ふゆ', romanization: 'fuyu (winter)' },
    ],
  },
  {
    id: 'he', symbol: 'へ', romanization: 'he', type: 'consonant', subtype: 'basic',
    name: 'He', nameFr: 'He',
    pronunciation: 'Like "he" in "help"', pronunciationFr: 'Comme « hé »',
    strokeCount: 1,
    examples: [
      { syllable: 'へや', romanization: 'heya (room)' },
      { syllable: 'へい', romanization: 'hei (fence)' },
    ],
  },
  {
    id: 'ho', symbol: 'ほ', romanization: 'ho', type: 'consonant', subtype: 'basic',
    name: 'Ho', nameFr: 'Ho',
    pronunciation: 'Like "ho" in "ho-ho"', pronunciationFr: 'Comme « ho »',
    strokeCount: 4,
    examples: [
      { syllable: 'ほし', romanization: 'hoshi (star)' },
      { syllable: 'ほん', romanization: 'hon (book)' },
    ],
  },

  // ── M-row ───────────────────────────────────────────────────────────
  {
    id: 'ma', symbol: 'ま', romanization: 'ma', type: 'consonant', subtype: 'basic',
    name: 'Ma', nameFr: 'Ma',
    pronunciation: 'Like "ma" in "mama"', pronunciationFr: 'Comme « ma »',
    strokeCount: 3,
    examples: [
      { syllable: 'まめ', romanization: 'mame (bean)' },
      { syllable: 'まち', romanization: 'machi (town)' },
    ],
  },
  {
    id: 'mi', symbol: 'み', romanization: 'mi', type: 'consonant', subtype: 'basic',
    name: 'Mi', nameFr: 'Mi',
    pronunciation: 'Like "me"',           pronunciationFr: 'Comme « mi »',
    strokeCount: 2,
    examples: [
      { syllable: 'みみ', romanization: 'mimi (ear)' },
      { syllable: 'みち', romanization: 'michi (road)' },
    ],
  },
  {
    id: 'mu', symbol: 'む', romanization: 'mu', type: 'consonant', subtype: 'basic',
    name: 'Mu', nameFr: 'Mu',
    pronunciation: 'Like "moo"',          pronunciationFr: 'Comme « mou »',
    strokeCount: 3,
    examples: [
      { syllable: 'むし', romanization: 'mushi (insect)' },
      { syllable: 'むら', romanization: 'mura (village)' },
    ],
  },
  {
    id: 'me', symbol: 'め', romanization: 'me', type: 'consonant', subtype: 'basic',
    name: 'Me', nameFr: 'Me',
    pronunciation: 'Like "me" in "met"',  pronunciationFr: 'Comme « mé »',
    strokeCount: 2,
    examples: [
      { syllable: 'め',   romanization: 'me (eye)' },
      { syllable: 'あめ', romanization: 'ame (rain)' },
    ],
  },
  {
    id: 'mo', symbol: 'も', romanization: 'mo', type: 'consonant', subtype: 'basic',
    name: 'Mo', nameFr: 'Mo',
    pronunciation: 'Like "mo" in "mole"', pronunciationFr: 'Comme « mo »',
    strokeCount: 3,
    examples: [
      { syllable: 'もも', romanization: 'momo (peach)' },
      { syllable: 'くも', romanization: 'kumo (cloud)' },
    ],
  },

  // ── Y-row (semi-vowels) ─────────────────────────────────────────────
  {
    id: 'ya', symbol: 'や', romanization: 'ya', type: 'consonant', subtype: 'basic',
    name: 'Ya', nameFr: 'Ya',
    pronunciation: 'Like "ya" in "yard"', pronunciationFr: 'Comme « ya »',
    strokeCount: 3,
    examples: [
      { syllable: 'やま', romanization: 'yama (mountain)' },
      { syllable: 'やね', romanization: 'yane (roof)' },
    ],
  },
  {
    id: 'yu', symbol: 'ゆ', romanization: 'yu', type: 'consonant', subtype: 'basic',
    name: 'Yu', nameFr: 'Yu',
    pronunciation: 'Like "you"',          pronunciationFr: 'Comme « you »',
    strokeCount: 2,
    examples: [
      { syllable: 'ゆき', romanization: 'yuki (snow)' },
      { syllable: 'ゆめ', romanization: 'yume (dream)' },
    ],
  },
  {
    id: 'yo', symbol: 'よ', romanization: 'yo', type: 'consonant', subtype: 'basic',
    name: 'Yo', nameFr: 'Yo',
    pronunciation: 'Like "yo" in "yo-yo"', pronunciationFr: 'Comme « yo »',
    strokeCount: 2,
    examples: [
      { syllable: 'よる', romanization: 'yoru (night)' },
      { syllable: 'よん', romanization: 'yon (four)' },
    ],
  },

  // ── R-row ───────────────────────────────────────────────────────────
  {
    id: 'ra', symbol: 'ら', romanization: 'ra', type: 'consonant', subtype: 'basic',
    name: 'Ra', nameFr: 'Ra',
    pronunciation: 'Between "ra" and "la", flap', pronunciationFr: 'Entre « ra » et « la »',
    strokeCount: 2,
    examples: [
      { syllable: 'さくら', romanization: 'sakura (cherry blossom)' },
      { syllable: 'そら',   romanization: 'sora (sky)' },
    ],
  },
  {
    id: 'ri', symbol: 'り', romanization: 'ri', type: 'consonant', subtype: 'basic',
    name: 'Ri', nameFr: 'Ri',
    pronunciation: 'Between "ri" and "li"',       pronunciationFr: 'Entre « ri » et « li »',
    strokeCount: 2,
    examples: [
      { syllable: 'とり', romanization: 'tori (bird)' },
      { syllable: 'りす', romanization: 'risu (squirrel)' },
    ],
  },
  {
    id: 'ru', symbol: 'る', romanization: 'ru', type: 'consonant', subtype: 'basic',
    name: 'Ru', nameFr: 'Ru',
    pronunciation: 'Between "ru" and "lu"',       pronunciationFr: 'Entre « rou » et « lou »',
    strokeCount: 1,
    examples: [
      { syllable: 'さる', romanization: 'saru (monkey)' },
      { syllable: 'よる', romanization: 'yoru (night)' },
    ],
  },
  {
    id: 're', symbol: 'れ', romanization: 're', type: 'consonant', subtype: 'basic',
    name: 'Re', nameFr: 'Re',
    pronunciation: 'Between "re" and "le"',       pronunciationFr: 'Entre « ré » et « lé »',
    strokeCount: 1,
    examples: [
      { syllable: 'これ', romanization: 'kore (this)' },
      { syllable: 'はれ', romanization: 'hare (sunny)' },
    ],
  },
  {
    id: 'ro', symbol: 'ろ', romanization: 'ro', type: 'consonant', subtype: 'basic',
    name: 'Ro', nameFr: 'Ro',
    pronunciation: 'Between "ro" and "lo"',       pronunciationFr: 'Entre « ro » et « lo »',
    strokeCount: 1,
    examples: [
      { syllable: 'しろ', romanization: 'shiro (white)' },
      { syllable: 'ふろ', romanization: 'furo (bath)' },
    ],
  },

  // ── W-row + standalone ん ──────────────────────────────────────────
  {
    id: 'wa', symbol: 'わ', romanization: 'wa', type: 'consonant', subtype: 'basic',
    name: 'Wa', nameFr: 'Wa',
    pronunciation: 'Like "wa" in "wand"', pronunciationFr: 'Comme « wa »',
    strokeCount: 2,
    examples: [
      { syllable: 'わたし', romanization: 'watashi (I/me)' },
      { syllable: 'かわ',   romanization: 'kawa (river)' },
    ],
  },
  {
    id: 'wo', symbol: 'を', romanization: 'wo', type: 'consonant', subtype: 'basic',
    name: 'Wo', nameFr: 'Wo',
    pronunciation: 'Pronounced "o" — particle only', pronunciationFr: 'Prononcé « o » — particule',
    strokeCount: 3,
    examples: [
      { syllable: 'ほんを', romanization: 'hon-wo (book + obj.)' },
      { syllable: 'えを',   romanization: 'e-wo (picture + obj.)' },
    ],
  },
  {
    id: 'n',  symbol: 'ん', romanization: 'n',  type: 'consonant', subtype: 'basic',
    name: 'N',  nameFr: 'N',
    pronunciation: 'Standalone nasal "n/m/ng"',     pronunciationFr: 'Nasale « n/m/ng »',
    strokeCount: 1,
    examples: [
      { syllable: 'ほん',   romanization: 'hon (book)' },
      { syllable: 'みかん', romanization: 'mikan (tangerine)' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  // ── Dakuten (voiced consonants) ──
  // Adding ゛ (dakuten mark) to k/s/t/h-row kana voices the consonant:
  //   k → g, s → z, t → d, h → b
  // ══════════════════════════════════════════════════════════════════════

  // ── G-row (from k-row + dakuten) ────────────────────────────────────
  {
    id: 'ga', symbol: 'が', romanization: 'ga', type: 'consonant', subtype: 'dakuten',
    name: 'Ga', nameFr: 'Ga',
    pronunciation: 'Like "ga" in "garden"', pronunciationFr: 'Comme « ga »',
    strokeCount: 4,
    examples: [
      { syllable: 'がっこう', romanization: 'gakkou (school)' },
      { syllable: 'がいこく', romanization: 'gaikoku (foreign)' },
    ],
  },
  {
    id: 'gi', symbol: 'ぎ', romanization: 'gi', type: 'consonant', subtype: 'dakuten',
    name: 'Gi', nameFr: 'Gi',
    pronunciation: 'Like "gi" in "give"', pronunciationFr: 'Comme « gui »',
    strokeCount: 6,
    examples: [
      { syllable: 'ぎん', romanization: 'gin (silver)' },
      { syllable: 'かぎ', romanization: 'kagi (key)' },
    ],
  },
  {
    id: 'gu', symbol: 'ぐ', romanization: 'gu', type: 'consonant', subtype: 'dakuten',
    name: 'Gu', nameFr: 'Gu',
    pronunciation: 'Like "goo"', pronunciationFr: 'Comme « gou »',
    strokeCount: 3,
    examples: [
      { syllable: 'ぐん', romanization: 'gun (army)' },
      { syllable: 'くすぐる', romanization: 'kusuguru (tickle)' },
    ],
  },
  {
    id: 'ge', symbol: 'げ', romanization: 'ge', type: 'consonant', subtype: 'dakuten',
    name: 'Ge', nameFr: 'Ge',
    pronunciation: 'Like "ge" in "get"', pronunciationFr: 'Comme « gué »',
    strokeCount: 5,
    examples: [
      { syllable: 'げんき', romanization: 'genki (energy)' },
      { syllable: 'かげ',   romanization: 'kage (shadow)' },
    ],
  },
  {
    id: 'go', symbol: 'ご', romanization: 'go', type: 'consonant', subtype: 'dakuten',
    name: 'Go', nameFr: 'Go',
    pronunciation: 'Like "go"', pronunciationFr: 'Comme « go »',
    strokeCount: 4,
    examples: [
      { syllable: 'ごはん', romanization: 'gohan (rice/meal)' },
      { syllable: 'ごご',   romanization: 'gogo (afternoon)' },
    ],
  },

  // ── Z-row (from s-row + dakuten) ────────────────────────────────────
  {
    id: 'za', symbol: 'ざ', romanization: 'za', type: 'consonant', subtype: 'dakuten',
    name: 'Za', nameFr: 'Za',
    pronunciation: 'Like "za" in "pizza"', pronunciationFr: 'Comme « za »',
    strokeCount: 5,
    examples: [
      { syllable: 'ざっし', romanization: 'zasshi (magazine)' },
      { syllable: 'ござ',   romanization: 'goza (straw mat)' },
    ],
  },
  {
    id: 'ji', symbol: 'じ', romanization: 'ji', type: 'consonant', subtype: 'dakuten',
    name: 'Ji', nameFr: 'Ji',
    pronunciation: 'Like "jee"', pronunciationFr: 'Comme « dji »',
    strokeCount: 3,
    examples: [
      { syllable: 'じかん', romanization: 'jikan (time)' },
      { syllable: 'かんじ', romanization: 'kanji (kanji)' },
    ],
  },
  {
    id: 'zu', symbol: 'ず', romanization: 'zu', type: 'consonant', subtype: 'dakuten',
    name: 'Zu', nameFr: 'Zu',
    pronunciation: 'Like "zoo"', pronunciationFr: 'Comme « zou »',
    strokeCount: 4,
    examples: [
      { syllable: 'みず', romanization: 'mizu (water)' },
      { syllable: 'ずっと', romanization: 'zutto (always)' },
    ],
  },
  {
    id: 'ze', symbol: 'ぜ', romanization: 'ze', type: 'consonant', subtype: 'dakuten',
    name: 'Ze', nameFr: 'Ze',
    pronunciation: 'Like "ze" in "zero"', pronunciationFr: 'Comme « zé »',
    strokeCount: 5,
    examples: [
      { syllable: 'ぜんぶ', romanization: 'zenbu (all)' },
      { syllable: 'かぜ',   romanization: 'kaze (wind)' },
    ],
  },
  {
    id: 'zo', symbol: 'ぞ', romanization: 'zo', type: 'consonant', subtype: 'dakuten',
    name: 'Zo', nameFr: 'Zo',
    pronunciation: 'Like "zo" in "zone"', pronunciationFr: 'Comme « zo »',
    strokeCount: 3,
    examples: [
      { syllable: 'ぞう', romanization: 'zou (elephant)' },
      { syllable: 'かぞく', romanization: 'kazoku (family)' },
    ],
  },

  // ── D-row (from t-row + dakuten) ────────────────────────────────────
  {
    id: 'da', symbol: 'だ', romanization: 'da', type: 'consonant', subtype: 'dakuten',
    name: 'Da', nameFr: 'Da',
    pronunciation: 'Like "da" in "dad"', pronunciationFr: 'Comme « da »',
    strokeCount: 6,
    examples: [
      { syllable: 'だいがく', romanization: 'daigaku (university)' },
      { syllable: 'だれ',     romanization: 'dare (who)' },
    ],
  },
  {
    id: 'dji', symbol: 'ぢ', romanization: 'ji', type: 'consonant', subtype: 'dakuten',
    name: 'Di/Ji', nameFr: 'Di/Ji',
    pronunciation: 'Same as じ (ji) — rare', pronunciationFr: 'Comme « dji » — rare',
    strokeCount: 4,
    examples: [
      { syllable: 'はなぢ', romanization: 'hanaji (nosebleed)' },
      { syllable: 'ちぢむ', romanization: 'chijimu (shrink)' },
    ],
  },
  {
    id: 'dzu', symbol: 'づ', romanization: 'zu', type: 'consonant', subtype: 'dakuten',
    name: 'Du/Zu', nameFr: 'Du/Zu',
    pronunciation: 'Same as ず (zu) — rare', pronunciationFr: 'Comme « dzou » — rare',
    strokeCount: 3,
    examples: [
      { syllable: 'つづく', romanization: 'tsuzuku (continue)' },
      { syllable: 'みかづき', romanization: 'mikazuki (crescent moon)' },
    ],
  },
  {
    id: 'de', symbol: 'で', romanization: 'de', type: 'consonant', subtype: 'dakuten',
    name: 'De', nameFr: 'De',
    pronunciation: 'Like "de" in "desk"', pronunciationFr: 'Comme « dé »',
    strokeCount: 3,
    examples: [
      { syllable: 'でんわ', romanization: 'denwa (telephone)' },
      { syllable: 'できる', romanization: 'dekiru (can do)' },
    ],
  },
  {
    id: 'do', symbol: 'ど', romanization: 'do', type: 'consonant', subtype: 'dakuten',
    name: 'Do', nameFr: 'Do',
    pronunciation: 'Like "do" in "door"', pronunciationFr: 'Comme « do »',
    strokeCount: 4,
    examples: [
      { syllable: 'どうぶつ', romanization: 'doubutsu (animal)' },
      { syllable: 'まど',     romanization: 'mado (window)' },
    ],
  },

  // ── B-row (from h-row + dakuten) ────────────────────────────────────
  {
    id: 'ba', symbol: 'ば', romanization: 'ba', type: 'consonant', subtype: 'dakuten',
    name: 'Ba', nameFr: 'Ba',
    pronunciation: 'Like "ba" in "bar"', pronunciationFr: 'Comme « ba »',
    strokeCount: 5,
    examples: [
      { syllable: 'ばしょ', romanization: 'basho (place)' },
      { syllable: 'そば',   romanization: 'soba (noodles)' },
    ],
  },
  {
    id: 'bi', symbol: 'び', romanization: 'bi', type: 'consonant', subtype: 'dakuten',
    name: 'Bi', nameFr: 'Bi',
    pronunciation: 'Like "bee"', pronunciationFr: 'Comme « bi »',
    strokeCount: 3,
    examples: [
      { syllable: 'びん',   romanization: 'bin (bottle)' },
      { syllable: 'えび',   romanization: 'ebi (shrimp)' },
    ],
  },
  {
    id: 'bu', symbol: 'ぶ', romanization: 'bu', type: 'consonant', subtype: 'dakuten',
    name: 'Bu', nameFr: 'Bu',
    pronunciation: 'Like "boo"', pronunciationFr: 'Comme « bou »',
    strokeCount: 6,
    examples: [
      { syllable: 'ぶた', romanization: 'buta (pig)' },
      { syllable: 'あそぶ', romanization: 'asobu (to play)' },
    ],
  },
  {
    id: 'be', symbol: 'べ', romanization: 'be', type: 'consonant', subtype: 'dakuten',
    name: 'Be', nameFr: 'Be',
    pronunciation: 'Like "be" in "bed"', pronunciationFr: 'Comme « bé »',
    strokeCount: 3,
    examples: [
      { syllable: 'べんり', romanization: 'benri (convenient)' },
      { syllable: 'たべる', romanization: 'taberu (to eat)' },
    ],
  },
  {
    id: 'bo', symbol: 'ぼ', romanization: 'bo', type: 'consonant', subtype: 'dakuten',
    name: 'Bo', nameFr: 'Bo',
    pronunciation: 'Like "bo" in "boat"', pronunciationFr: 'Comme « bo »',
    strokeCount: 6,
    examples: [
      { syllable: 'ぼうし', romanization: 'boushi (hat)' },
      { syllable: 'あきぼ', romanization: 'akibo (autumn)' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  // ── Handakuten (semi-voiced: h → p) ──
  // Adding ゜ (handakuten mark) only applies to the h-row.
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 'pa', symbol: 'ぱ', romanization: 'pa', type: 'consonant', subtype: 'handakuten',
    name: 'Pa', nameFr: 'Pa',
    pronunciation: 'Like "pa" in "park"', pronunciationFr: 'Comme « pa »',
    strokeCount: 5,
    examples: [
      { syllable: 'ぱん',   romanization: 'pan (bread)' },
      { syllable: 'すっぱい', romanization: 'suppai (sour)' },
    ],
  },
  {
    id: 'pi', symbol: 'ぴ', romanization: 'pi', type: 'consonant', subtype: 'handakuten',
    name: 'Pi', nameFr: 'Pi',
    pronunciation: 'Like "pee"', pronunciationFr: 'Comme « pi »',
    strokeCount: 3,
    examples: [
      { syllable: 'ぴかぴか', romanization: 'pikapika (sparkly)' },
      { syllable: 'えんぴつ', romanization: 'enpitsu (pencil)' },
    ],
  },
  {
    id: 'pu', symbol: 'ぷ', romanization: 'pu', type: 'consonant', subtype: 'handakuten',
    name: 'Pu', nameFr: 'Pu',
    pronunciation: 'Like "poo"', pronunciationFr: 'Comme « pou »',
    strokeCount: 6,
    examples: [
      { syllable: 'てんぷら', romanization: 'tempura (tempura)' },
      { syllable: 'しんぷる', romanization: 'shinpuru (simple)' },
    ],
  },
  {
    id: 'pe', symbol: 'ぺ', romanization: 'pe', type: 'consonant', subtype: 'handakuten',
    name: 'Pe', nameFr: 'Pe',
    pronunciation: 'Like "pe" in "pet"', pronunciationFr: 'Comme « pé »',
    strokeCount: 3,
    examples: [
      { syllable: 'ぺん',   romanization: 'pen (pen)' },
      { syllable: 'ぺこぺこ', romanization: 'pekopeko (hungry)' },
    ],
  },
  {
    id: 'po', symbol: 'ぽ', romanization: 'po', type: 'consonant', subtype: 'handakuten',
    name: 'Po', nameFr: 'Po',
    pronunciation: 'Like "po" in "pole"', pronunciationFr: 'Comme « po »',
    strokeCount: 6,
    examples: [
      { syllable: 'たんぽぽ', romanization: 'tanpopo (dandelion)' },
      { syllable: 'にっぽん', romanization: 'nippon (Japan)' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  // ── Yōon (palatalised combinations: consonant + small ゃ/ゅ/ょ) ──
  // Counted as a single mora (one beat), written as two characters.
  // Stroke counts sum the base kana + the small kana.
  // ══════════════════════════════════════════════════════════════════════

  // ── k-row yōon ──
  { id: 'kya', symbol: 'きゃ', romanization: 'kya', type: 'consonant', subtype: 'yoon', name: 'Kya', nameFr: 'Kya', pronunciation: 'Like "kya" — quick', pronunciationFr: 'Comme « kya »', strokeCount: 7, examples: [{ syllable: 'きゃく', romanization: 'kyaku (guest)' }] },
  { id: 'kyu', symbol: 'きゅ', romanization: 'kyu', type: 'consonant', subtype: 'yoon', name: 'Kyu', nameFr: 'Kyu', pronunciation: 'Like "queue"', pronunciationFr: 'Comme « kyou »', strokeCount: 6, examples: [{ syllable: 'きゅう', romanization: 'kyuu (nine)' }] },
  { id: 'kyo', symbol: 'きょ', romanization: 'kyo', type: 'consonant', subtype: 'yoon', name: 'Kyo', nameFr: 'Kyo', pronunciation: 'Like "kyo" in "Kyoto"', pronunciationFr: 'Comme « kyo »', strokeCount: 6, examples: [{ syllable: 'きょう', romanization: 'kyou (today)' }] },

  // ── s-row yōon (sha/shu/sho) ──
  { id: 'sha', symbol: 'しゃ', romanization: 'sha', type: 'consonant', subtype: 'yoon', name: 'Sha', nameFr: 'Sha', pronunciation: 'Like "sha" in "shark"', pronunciationFr: 'Comme « cha »', strokeCount: 4, examples: [{ syllable: 'しゃしん', romanization: 'shashin (photo)' }] },
  { id: 'shu', symbol: 'しゅ', romanization: 'shu', type: 'consonant', subtype: 'yoon', name: 'Shu', nameFr: 'Shu', pronunciation: 'Like "shoe"', pronunciationFr: 'Comme « chou »', strokeCount: 3, examples: [{ syllable: 'しゅくだい', romanization: 'shukudai (homework)' }] },
  { id: 'sho', symbol: 'しょ', romanization: 'sho', type: 'consonant', subtype: 'yoon', name: 'Sho', nameFr: 'Sho', pronunciation: 'Like "show"', pronunciationFr: 'Comme « cho »', strokeCount: 3, examples: [{ syllable: 'しょくじ', romanization: 'shokuji (meal)' }] },

  // ── t-row yōon (cha/chu/cho) ──
  { id: 'cha', symbol: 'ちゃ', romanization: 'cha', type: 'consonant', subtype: 'yoon', name: 'Cha', nameFr: 'Cha', pronunciation: 'Like "cha" in "chai"', pronunciationFr: 'Comme « tcha »', strokeCount: 5, examples: [{ syllable: 'おちゃ', romanization: 'ocha (tea)' }] },
  { id: 'chu', symbol: 'ちゅ', romanization: 'chu', type: 'consonant', subtype: 'yoon', name: 'Chu', nameFr: 'Chu', pronunciation: 'Like "chew"', pronunciationFr: 'Comme « tchou »', strokeCount: 4, examples: [{ syllable: 'ちゅうい', romanization: 'chuui (caution)' }] },
  { id: 'cho', symbol: 'ちょ', romanization: 'cho', type: 'consonant', subtype: 'yoon', name: 'Cho', nameFr: 'Cho', pronunciation: 'Like "cho" in "chocolate"', pronunciationFr: 'Comme « tcho »', strokeCount: 4, examples: [{ syllable: 'ちょっと', romanization: 'chotto (a little)' }] },

  // ── n-row yōon ──
  { id: 'nya', symbol: 'にゃ', romanization: 'nya', type: 'consonant', subtype: 'yoon', name: 'Nya', nameFr: 'Nya', pronunciation: 'Like "nya"', pronunciationFr: 'Comme « nia »', strokeCount: 6, examples: [{ syllable: 'にゃんこ', romanization: 'nyanko (kitty)' }] },
  { id: 'nyu', symbol: 'にゅ', romanization: 'nyu', type: 'consonant', subtype: 'yoon', name: 'Nyu', nameFr: 'Nyu', pronunciation: 'Like "new"', pronunciationFr: 'Comme « niou »', strokeCount: 5, examples: [{ syllable: 'にゅうがく', romanization: 'nyuugaku (enrollment)' }] },
  { id: 'nyo', symbol: 'にょ', romanization: 'nyo', type: 'consonant', subtype: 'yoon', name: 'Nyo', nameFr: 'Nyo', pronunciation: 'Like "nyo"', pronunciationFr: 'Comme « nio »', strokeCount: 5, examples: [{ syllable: 'にょうぼう', romanization: 'nyoubou (wife)' }] },

  // ── h-row yōon ──
  { id: 'hya', symbol: 'ひゃ', romanization: 'hya', type: 'consonant', subtype: 'yoon', name: 'Hya', nameFr: 'Hya', pronunciation: 'Like "hya"', pronunciationFr: 'Comme « hya »', strokeCount: 4, examples: [{ syllable: 'ひゃく', romanization: 'hyaku (hundred)' }] },
  { id: 'hyu', symbol: 'ひゅ', romanization: 'hyu', type: 'consonant', subtype: 'yoon', name: 'Hyu', nameFr: 'Hyu', pronunciation: 'Like "hew"', pronunciationFr: 'Comme « hyou »', strokeCount: 3, examples: [{ syllable: 'ひゅうが', romanization: 'hyuuga (Hyuga)' }] },
  { id: 'hyo', symbol: 'ひょ', romanization: 'hyo', type: 'consonant', subtype: 'yoon', name: 'Hyo', nameFr: 'Hyo', pronunciation: 'Like "hyo"', pronunciationFr: 'Comme « hyo »', strokeCount: 3, examples: [{ syllable: 'ひょう', romanization: 'hyou (hail)' }] },

  // ── m-row yōon ──
  { id: 'mya', symbol: 'みゃ', romanization: 'mya', type: 'consonant', subtype: 'yoon', name: 'Mya', nameFr: 'Mya', pronunciation: 'Like "mya"', pronunciationFr: 'Comme « mya »', strokeCount: 5, examples: [{ syllable: 'みゃく', romanization: 'myaku (pulse)' }] },
  { id: 'myu', symbol: 'みゅ', romanization: 'myu', type: 'consonant', subtype: 'yoon', name: 'Myu', nameFr: 'Myu', pronunciation: 'Like "mew"', pronunciationFr: 'Comme « myou »', strokeCount: 4, examples: [{ syllable: 'みゅーじっく', romanization: 'myuujikku (music)' }] },
  { id: 'myo', symbol: 'みょ', romanization: 'myo', type: 'consonant', subtype: 'yoon', name: 'Myo', nameFr: 'Myo', pronunciation: 'Like "myo"', pronunciationFr: 'Comme « myo »', strokeCount: 4, examples: [{ syllable: 'みょうじ', romanization: 'myouji (surname)' }] },

  // ── r-row yōon ──
  { id: 'rya', symbol: 'りゃ', romanization: 'rya', type: 'consonant', subtype: 'yoon', name: 'Rya', nameFr: 'Rya', pronunciation: 'Between "rya" and "lya"', pronunciationFr: 'Entre « rya » et « lya »', strokeCount: 5, examples: [{ syllable: 'りゃく', romanization: 'ryaku (abbreviation)' }] },
  { id: 'ryu', symbol: 'りゅ', romanization: 'ryu', type: 'consonant', subtype: 'yoon', name: 'Ryu', nameFr: 'Ryu', pronunciation: 'Between "ryu" and "lyu"', pronunciationFr: 'Entre « ryou » et « lyou »', strokeCount: 4, examples: [{ syllable: 'りゅう', romanization: 'ryuu (dragon)' }] },
  { id: 'ryo', symbol: 'りょ', romanization: 'ryo', type: 'consonant', subtype: 'yoon', name: 'Ryo', nameFr: 'Ryo', pronunciation: 'Between "ryo" and "lyo"', pronunciationFr: 'Entre « ryo » et « lyo »', strokeCount: 4, examples: [{ syllable: 'りょこう', romanization: 'ryokou (travel)' }] },

  // ── g-row yōon (voiced k) ──
  { id: 'gya', symbol: 'ぎゃ', romanization: 'gya', type: 'consonant', subtype: 'yoon', name: 'Gya', nameFr: 'Gya', pronunciation: 'Like "gya"', pronunciationFr: 'Comme « gya »', strokeCount: 9, examples: [{ syllable: 'ぎゃく', romanization: 'gyaku (reverse)' }] },
  { id: 'gyu', symbol: 'ぎゅ', romanization: 'gyu', type: 'consonant', subtype: 'yoon', name: 'Gyu', nameFr: 'Gyu', pronunciation: 'Like "gyu"', pronunciationFr: 'Comme « gyou »', strokeCount: 8, examples: [{ syllable: 'ぎゅうにく', romanization: 'gyuuniku (beef)' }] },
  { id: 'gyo', symbol: 'ぎょ', romanization: 'gyo', type: 'consonant', subtype: 'yoon', name: 'Gyo', nameFr: 'Gyo', pronunciation: 'Like "gyo"', pronunciationFr: 'Comme « gyo »', strokeCount: 8, examples: [{ syllable: 'ぎょうざ', romanization: 'gyouza (dumpling)' }] },

  // ── j-row yōon (voiced s: ja/ju/jo) ──
  { id: 'ja', symbol: 'じゃ', romanization: 'ja', type: 'consonant', subtype: 'yoon', name: 'Ja', nameFr: 'Ja', pronunciation: 'Like "ja" in "jar"', pronunciationFr: 'Comme « dja »', strokeCount: 6, examples: [{ syllable: 'じゃま', romanization: 'jama (obstacle)' }] },
  { id: 'ju', symbol: 'じゅ', romanization: 'ju', type: 'consonant', subtype: 'yoon', name: 'Ju', nameFr: 'Ju', pronunciation: 'Like "jew"', pronunciationFr: 'Comme « djou »', strokeCount: 5, examples: [{ syllable: 'じゅう', romanization: 'juu (ten)' }] },
  { id: 'jo', symbol: 'じょ', romanization: 'jo', type: 'consonant', subtype: 'yoon', name: 'Jo', nameFr: 'Jo', pronunciation: 'Like "Joe"', pronunciationFr: 'Comme « djo »', strokeCount: 5, examples: [{ syllable: 'じょうず', romanization: 'jouzu (skilled)' }] },

  // ── b-row yōon ──
  { id: 'bya', symbol: 'びゃ', romanization: 'bya', type: 'consonant', subtype: 'yoon', name: 'Bya', nameFr: 'Bya', pronunciation: 'Like "bya"', pronunciationFr: 'Comme « bya »', strokeCount: 6, examples: [{ syllable: 'びゃくや', romanization: 'byakuya (white night)' }] },
  { id: 'byu', symbol: 'びゅ', romanization: 'byu', type: 'consonant', subtype: 'yoon', name: 'Byu', nameFr: 'Byu', pronunciation: 'Like "byu"', pronunciationFr: 'Comme « byou »', strokeCount: 5, examples: [{ syllable: 'びゅうびゅう', romanization: 'byuubyuu (whistling wind)' }] },
  { id: 'byo', symbol: 'びょ', romanization: 'byo', type: 'consonant', subtype: 'yoon', name: 'Byo', nameFr: 'Byo', pronunciation: 'Like "byo"', pronunciationFr: 'Comme « byo »', strokeCount: 5, examples: [{ syllable: 'びょういん', romanization: 'byouin (hospital)' }] },

  // ── p-row yōon ──
  { id: 'pya', symbol: 'ぴゃ', romanization: 'pya', type: 'consonant', subtype: 'yoon', name: 'Pya', nameFr: 'Pya', pronunciation: 'Like "pya"', pronunciationFr: 'Comme « pya »', strokeCount: 8, examples: [{ syllable: 'ろっぴゃく', romanization: 'roppyaku (six hundred)' }] },
  { id: 'pyu', symbol: 'ぴゅ', romanization: 'pyu', type: 'consonant', subtype: 'yoon', name: 'Pyu', nameFr: 'Pyu', pronunciation: 'Like "pew"', pronunciationFr: 'Comme « pyou »', strokeCount: 5, examples: [{ syllable: 'ぴゅうぴゅう', romanization: 'pyuupyuu (whoosh)' }] },
  { id: 'pyo', symbol: 'ぴょ', romanization: 'pyo', type: 'consonant', subtype: 'yoon', name: 'Pyo', nameFr: 'Pyo', pronunciation: 'Like "pyo"', pronunciationFr: 'Comme « pyo »', strokeCount: 5, examples: [{ syllable: 'ぴょんぴょん', romanization: 'pyonpyon (hop hop)' }] },
]
