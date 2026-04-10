export type HangeulType = 'consonant' | 'vowel'
export type HangeulSubtype = 'basic' | 'double' | 'compound'
export type ArticulationPlace =
  | 'velar' | 'alveolar' | 'alveolar-lateral' | 'bilabial'
  | 'alveolar-fricative' | 'glottal' | 'palatal' | 'glottal-fricative'
  | 'open-central' | 'open-front' | 'mid-back' | 'mid-front'
  | 'close-back' | 'close-front' | 'central'

export interface IHangeulChar {
  id: string
  symbol: string
  romanization: string
  type: HangeulType
  subtype: HangeulSubtype
  name: string
  nameFr: string
  pronunciation: string
  pronunciationFr: string
  strokeCount: number
  ipa: string
  articulation: ArticulationPlace
  examples: { syllable: string; romanization: string }[]
}

export const HANGEUL_CHARS: IHangeulChar[] = [
  // ── Basic consonants ──────────────────────────────────────────────────────
  {
    id: 'giyeok', symbol: 'ㄱ', romanization: 'g / k',
    type: 'consonant', subtype: 'basic',
    name: 'Giyeok', nameFr: 'Giyeok',
    pronunciation: '"g" at the start of a syllable, "k" at the end.',
    pronunciationFr: '« g » en début de syllabe, « k » en fin.',
    strokeCount: 2,
    ipa: 'ɡ~k',
    articulation: 'velar',
    examples: [
      { syllable: '가', romanization: 'ga' }, { syllable: '기', romanization: 'gi' },
      { syllable: '고', romanization: 'go' }, { syllable: '구', romanization: 'gu' },
    ],
  },
  {
    id: 'nieun', symbol: 'ㄴ', romanization: 'n',
    type: 'consonant', subtype: 'basic',
    name: 'Nieun', nameFr: 'Nieun',
    pronunciation: 'Always "n", like in "noon".',
    pronunciationFr: 'Toujours « n », comme dans « non ».',
    strokeCount: 2,
    ipa: 'n',
    articulation: 'alveolar',
    examples: [
      { syllable: '나', romanization: 'na' }, { syllable: '니', romanization: 'ni' },
      { syllable: '노', romanization: 'no' }, { syllable: '누', romanization: 'nu' },
    ],
  },
  {
    id: 'digeut', symbol: 'ㄷ', romanization: 'd / t',
    type: 'consonant', subtype: 'basic',
    name: 'Digeut', nameFr: 'Digeut',
    pronunciation: '"d" at the start, "t" at the end of a syllable.',
    pronunciationFr: '« d » en début, « t » en fin de syllabe.',
    strokeCount: 3,
    ipa: 'd~t',
    articulation: 'alveolar',
    examples: [
      { syllable: '다', romanization: 'da' }, { syllable: '디', romanization: 'di' },
      { syllable: '도', romanization: 'do' }, { syllable: '두', romanization: 'du' },
    ],
  },
  {
    id: 'rieul', symbol: 'ㄹ', romanization: 'r / l',
    type: 'consonant', subtype: 'basic',
    name: 'Rieul', nameFr: 'Rieul',
    pronunciation: '"r" between vowels (flap), "l" at the end of a syllable.',
    pronunciationFr: '« r » entre voyelles (battement), « l » en fin de syllabe.',
    strokeCount: 5,
    ipa: 'ɾ~l',
    articulation: 'alveolar-lateral',
    examples: [
      { syllable: '라', romanization: 'ra' }, { syllable: '리', romanization: 'ri' },
      { syllable: '로', romanization: 'ro' }, { syllable: '루', romanization: 'ru' },
    ],
  },
  {
    id: 'mieum', symbol: 'ㅁ', romanization: 'm',
    type: 'consonant', subtype: 'basic',
    name: 'Mieum', nameFr: 'Mieum',
    pronunciation: 'Always "m", like in "mom".',
    pronunciationFr: 'Toujours « m », comme dans « maman ».',
    strokeCount: 4,
    ipa: 'm',
    articulation: 'bilabial',
    examples: [
      { syllable: '마', romanization: 'ma' }, { syllable: '미', romanization: 'mi' },
      { syllable: '모', romanization: 'mo' }, { syllable: '무', romanization: 'mu' },
    ],
  },
  {
    id: 'bieup', symbol: 'ㅂ', romanization: 'b / p',
    type: 'consonant', subtype: 'basic',
    name: 'Bieup', nameFr: 'Bieup',
    pronunciation: '"b" at the start, "p" at the end of a syllable.',
    pronunciationFr: '« b » en début, « p » en fin de syllabe.',
    strokeCount: 4,
    ipa: 'b~p',
    articulation: 'bilabial',
    examples: [
      { syllable: '바', romanization: 'ba' }, { syllable: '비', romanization: 'bi' },
      { syllable: '보', romanization: 'bo' }, { syllable: '부', romanization: 'bu' },
    ],
  },
  {
    id: 'siot', symbol: 'ㅅ', romanization: 's',
    type: 'consonant', subtype: 'basic',
    name: 'Siot', nameFr: 'Siot',
    pronunciation: '"s" before vowels, "t" at the end of a syllable.',
    pronunciationFr: '« s » avant une voyelle, « t » en fin de syllabe.',
    strokeCount: 2,
    ipa: 's',
    articulation: 'alveolar-fricative',
    examples: [
      { syllable: '사', romanization: 'sa' }, { syllable: '시', romanization: 'si' },
      { syllable: '소', romanization: 'so' }, { syllable: '수', romanization: 'su' },
    ],
  },
  {
    id: 'ieung', symbol: 'ㅇ', romanization: '— / ng',
    type: 'consonant', subtype: 'basic',
    name: 'Ieung', nameFr: 'Ieung',
    pronunciation: 'Silent at the start of a syllable; "ng" (as in "sing") at the end.',
    pronunciationFr: 'Muet en début de syllabe ; « ng » (comme dans « ring ») en fin.',
    strokeCount: 1,
    ipa: 'ŋ',
    articulation: 'glottal',
    examples: [
      { syllable: '아', romanization: 'a' }, { syllable: '이', romanization: 'i' },
      { syllable: '오', romanization: 'o' }, { syllable: '우', romanization: 'u' },
    ],
  },
  {
    id: 'jieut', symbol: 'ㅈ', romanization: 'j',
    type: 'consonant', subtype: 'basic',
    name: 'Jieut', nameFr: 'Jieut',
    pronunciation: '"j" as in "jump". Becomes "t" at the end of a syllable.',
    pronunciationFr: '« j » comme dans « jeu ». Devient « t » en fin de syllabe.',
    strokeCount: 3,
    ipa: 'tɕ',
    articulation: 'palatal',
    examples: [
      { syllable: '자', romanization: 'ja' }, { syllable: '지', romanization: 'ji' },
      { syllable: '조', romanization: 'jo' }, { syllable: '주', romanization: 'ju' },
    ],
  },
  {
    id: 'chieut', symbol: 'ㅊ', romanization: 'ch',
    type: 'consonant', subtype: 'basic',
    name: 'Chieut', nameFr: 'Chieut',
    pronunciation: '"ch" as in "cheese". Aspirated version of ㅈ.',
    pronunciationFr: '« tch » comme dans « tchad ». Version aspirée de ㅈ.',
    strokeCount: 4,
    ipa: 'tɕʰ',
    articulation: 'palatal',
    examples: [
      { syllable: '차', romanization: 'cha' }, { syllable: '치', romanization: 'chi' },
      { syllable: '초', romanization: 'cho' }, { syllable: '추', romanization: 'chu' },
    ],
  },
  {
    id: 'kieuk', symbol: 'ㅋ', romanization: 'k',
    type: 'consonant', subtype: 'basic',
    name: 'Kieuk', nameFr: 'Kieuk',
    pronunciation: 'Aspirated "k", like the "k" in "key".',
    pronunciationFr: '« k » aspiré, comme dans « képi ».',
    strokeCount: 3,
    ipa: 'kʰ',
    articulation: 'velar',
    examples: [
      { syllable: '카', romanization: 'ka' }, { syllable: '키', romanization: 'ki' },
      { syllable: '코', romanization: 'ko' }, { syllable: '쿠', romanization: 'ku' },
    ],
  },
  {
    id: 'tieut', symbol: 'ㅌ', romanization: 't',
    type: 'consonant', subtype: 'basic',
    name: 'Tieut', nameFr: 'Tieut',
    pronunciation: 'Aspirated "t", like the "t" in "top".',
    pronunciationFr: '« t » aspiré, comme dans « toit ».',
    strokeCount: 4,
    ipa: 'tʰ',
    articulation: 'alveolar',
    examples: [
      { syllable: '타', romanization: 'ta' }, { syllable: '티', romanization: 'ti' },
      { syllable: '토', romanization: 'to' }, { syllable: '투', romanization: 'tu' },
    ],
  },
  {
    id: 'pieup', symbol: 'ㅍ', romanization: 'p',
    type: 'consonant', subtype: 'basic',
    name: 'Pieup', nameFr: 'Pieup',
    pronunciation: 'Aspirated "p", like the "p" in "pot".',
    pronunciationFr: '« p » aspiré, comme dans « père ».',
    strokeCount: 4,
    ipa: 'pʰ',
    articulation: 'bilabial',
    examples: [
      { syllable: '파', romanization: 'pa' }, { syllable: '피', romanization: 'pi' },
      { syllable: '포', romanization: 'po' }, { syllable: '푸', romanization: 'pu' },
    ],
  },
  {
    id: 'hieut', symbol: 'ㅎ', romanization: 'h',
    type: 'consonant', subtype: 'basic',
    name: 'Hieut', nameFr: 'Hieut',
    pronunciation: '"h" as in "hat". Can disappear between voiced sounds.',
    pronunciationFr: '« h » aspiré comme en anglais « hat ». Peut disparaître entre sons voisés.',
    strokeCount: 3,
    ipa: 'h',
    articulation: 'glottal-fricative',
    examples: [
      { syllable: '하', romanization: 'ha' }, { syllable: '히', romanization: 'hi' },
      { syllable: '호', romanization: 'ho' }, { syllable: '후', romanization: 'hu' },
    ],
  },

  // ── Double consonants ─────────────────────────────────────────────────────
  {
    id: 'ssang-giyeok', symbol: 'ㄲ', romanization: 'kk',
    type: 'consonant', subtype: 'double',
    name: 'Ssang-giyeok', nameFr: 'Ssang-giyeok',
    pronunciation: 'Tense "k" — like holding your breath before saying "k".',
    pronunciationFr: '« k » tendu — comme si on retenait son souffle avant de dire « k ».',
    strokeCount: 4,
    ipa: 'k͈',
    articulation: 'velar',
    examples: [
      { syllable: '까', romanization: 'kka' }, { syllable: '끼', romanization: 'kki' },
      { syllable: '꼬', romanization: 'kko' }, { syllable: '꾸', romanization: 'kku' },
    ],
  },
  {
    id: 'ssang-digeut', symbol: 'ㄸ', romanization: 'tt',
    type: 'consonant', subtype: 'double',
    name: 'Ssang-digeut', nameFr: 'Ssang-digeut',
    pronunciation: 'Tense "t" — unaspirated and abrupt.',
    pronunciationFr: '« t » tendu — non-aspiré et abrupt.',
    strokeCount: 6,
    ipa: 't͈',
    articulation: 'alveolar',
    examples: [
      { syllable: '따', romanization: 'tta' }, { syllable: '띠', romanization: 'tti' },
      { syllable: '또', romanization: 'tto' }, { syllable: '뚜', romanization: 'ttu' },
    ],
  },
  {
    id: 'ssang-bieup', symbol: 'ㅃ', romanization: 'pp',
    type: 'consonant', subtype: 'double',
    name: 'Ssang-bieup', nameFr: 'Ssang-bieup',
    pronunciation: 'Tense "p" — stronger and more abrupt than ㅂ.',
    pronunciationFr: '« p » tendu — plus fort et plus abrupt que ㅂ.',
    strokeCount: 8,
    ipa: 'p͈',
    articulation: 'bilabial',
    examples: [
      { syllable: '빠', romanization: 'ppa' }, { syllable: '삐', romanization: 'ppi' },
      { syllable: '뽀', romanization: 'ppo' }, { syllable: '뿌', romanization: 'ppu' },
    ],
  },
  {
    id: 'ssang-siot', symbol: 'ㅆ', romanization: 'ss',
    type: 'consonant', subtype: 'double',
    name: 'Ssang-siot', nameFr: 'Ssang-siot',
    pronunciation: 'Tense "s" — sharper and more hissing than ㅅ.',
    pronunciationFr: '« s » tendu — plus sifflant que ㅅ.',
    strokeCount: 4,
    ipa: 's͈',
    articulation: 'alveolar-fricative',
    examples: [
      { syllable: '싸', romanization: 'ssa' }, { syllable: '씨', romanization: 'ssi' },
      { syllable: '쏘', romanization: 'sso' }, { syllable: '쑤', romanization: 'ssu' },
    ],
  },
  {
    id: 'ssang-jieut', symbol: 'ㅉ', romanization: 'jj',
    type: 'consonant', subtype: 'double',
    name: 'Ssang-jieut', nameFr: 'Ssang-jieut',
    pronunciation: 'Tense "j" — stronger and more abrupt than ㅈ.',
    pronunciationFr: '« j » tendu — plus fort et plus abrupt que ㅈ.',
    strokeCount: 6,
    ipa: 'tɕ͈',
    articulation: 'palatal',
    examples: [
      { syllable: '짜', romanization: 'jja' }, { syllable: '찌', romanization: 'jji' },
      { syllable: '쪼', romanization: 'jjo' }, { syllable: '쭈', romanization: 'jju' },
    ],
  },

  // ── Basic vowels ──────────────────────────────────────────────────────────
  {
    id: 'a', symbol: 'ㅏ', romanization: 'a',
    type: 'vowel', subtype: 'basic',
    name: 'A', nameFr: 'A',
    pronunciation: '"a" as in "father".',
    pronunciationFr: '« a » comme dans « patte ».',
    strokeCount: 2,
    ipa: 'a',
    articulation: 'open-central',
    examples: [
      { syllable: '가', romanization: 'ga' }, { syllable: '나', romanization: 'na' },
      { syllable: '사', romanization: 'sa' }, { syllable: '아', romanization: 'a' },
    ],
  },
  {
    id: 'ya', symbol: 'ㅑ', romanization: 'ya',
    type: 'vowel', subtype: 'basic',
    name: 'Ya', nameFr: 'Ya',
    pronunciation: '"ya" as in "yard".',
    pronunciationFr: '« ya » comme dans « yaourt ».',
    strokeCount: 3,
    ipa: 'ja',
    articulation: 'open-central',
    examples: [
      { syllable: '야', romanization: 'ya' }, { syllable: '냐', romanization: 'nya' },
      { syllable: '샤', romanization: 'sha' }, { syllable: '자', romanization: 'ja' },
    ],
  },
  {
    id: 'eo', symbol: 'ㅓ', romanization: 'eo',
    type: 'vowel', subtype: 'basic',
    name: 'Eo', nameFr: 'Eo',
    pronunciation: '"uh" as in "sun" — mid-back unrounded vowel.',
    pronunciationFr: '« eu » court, comme dans « peur » sans arrondi.',
    strokeCount: 2,
    ipa: 'ʌ',
    articulation: 'mid-back',
    examples: [
      { syllable: '거', romanization: 'geo' }, { syllable: '너', romanization: 'neo' },
      { syllable: '서', romanization: 'seo' }, { syllable: '어', romanization: 'eo' },
    ],
  },
  {
    id: 'yeo', symbol: 'ㅕ', romanization: 'yeo',
    type: 'vowel', subtype: 'basic',
    name: 'Yeo', nameFr: 'Yeo',
    pronunciation: '"yuh" — "y" + eo.',
    pronunciationFr: '« yeu » — « y » + eo.',
    strokeCount: 3,
    ipa: 'jʌ',
    articulation: 'mid-back',
    examples: [
      { syllable: '겨', romanization: 'gyeo' }, { syllable: '녀', romanization: 'nyeo' },
      { syllable: '셔', romanization: 'syeo' }, { syllable: '여', romanization: 'yeo' },
    ],
  },
  {
    id: 'o', symbol: 'ㅗ', romanization: 'o',
    type: 'vowel', subtype: 'basic',
    name: 'O', nameFr: 'O',
    pronunciation: '"o" as in "boat".',
    pronunciationFr: '« o » comme dans « eau ».',
    strokeCount: 2,
    ipa: 'o',
    articulation: 'close-back',
    examples: [
      { syllable: '고', romanization: 'go' }, { syllable: '노', romanization: 'no' },
      { syllable: '소', romanization: 'so' }, { syllable: '오', romanization: 'o' },
    ],
  },
  {
    id: 'yo', symbol: 'ㅛ', romanization: 'yo',
    type: 'vowel', subtype: 'basic',
    name: 'Yo', nameFr: 'Yo',
    pronunciation: '"yo" as in "yoghurt".',
    pronunciationFr: '« yo » comme dans « yogi ».',
    strokeCount: 3,
    ipa: 'jo',
    articulation: 'close-back',
    examples: [
      { syllable: '교', romanization: 'gyo' }, { syllable: '뇨', romanization: 'nyo' },
      { syllable: '쇼', romanization: 'syo' }, { syllable: '요', romanization: 'yo' },
    ],
  },
  {
    id: 'u', symbol: 'ㅜ', romanization: 'u',
    type: 'vowel', subtype: 'basic',
    name: 'U', nameFr: 'U',
    pronunciation: '"oo" as in "moon".',
    pronunciationFr: '« ou » comme dans « loup ».',
    strokeCount: 2,
    ipa: 'u',
    articulation: 'close-back',
    examples: [
      { syllable: '구', romanization: 'gu' }, { syllable: '누', romanization: 'nu' },
      { syllable: '수', romanization: 'su' }, { syllable: '우', romanization: 'u' },
    ],
  },
  {
    id: 'yu', symbol: 'ㅠ', romanization: 'yu',
    type: 'vowel', subtype: 'basic',
    name: 'Yu', nameFr: 'Yu',
    pronunciation: '"yu" as in "you".',
    pronunciationFr: '« you » comme en anglais.',
    strokeCount: 3,
    ipa: 'ju',
    articulation: 'close-back',
    examples: [
      { syllable: '규', romanization: 'gyu' }, { syllable: '뉴', romanization: 'nyu' },
      { syllable: '수', romanization: 'su' }, { syllable: '유', romanization: 'yu' },
    ],
  },
  {
    id: 'eu', symbol: 'ㅡ', romanization: 'eu',
    type: 'vowel', subtype: 'basic',
    name: 'Eu', nameFr: 'Eu',
    pronunciation: '"eu" — like the vowel in "taken" but with spread lips.',
    pronunciationFr: '« eu » avec les lèvres étirées (comme sourire forcé).',
    strokeCount: 1,
    ipa: 'ɯ',
    articulation: 'central',
    examples: [
      { syllable: '그', romanization: 'geu' }, { syllable: '느', romanization: 'neu' },
      { syllable: '스', romanization: 'seu' }, { syllable: '으', romanization: 'eu' },
    ],
  },
  {
    id: 'i', symbol: 'ㅣ', romanization: 'i',
    type: 'vowel', subtype: 'basic',
    name: 'I', nameFr: 'I',
    pronunciation: '"ee" as in "see".',
    pronunciationFr: '« i » comme dans « vie ».',
    strokeCount: 1,
    ipa: 'i',
    articulation: 'close-front',
    examples: [
      { syllable: '기', romanization: 'gi' }, { syllable: '니', romanization: 'ni' },
      { syllable: '시', romanization: 'si' }, { syllable: '이', romanization: 'i' },
    ],
  },

  // ── Compound vowels ───────────────────────────────────────────────────────
  {
    id: 'ae', symbol: 'ㅐ', romanization: 'ae',
    type: 'vowel', subtype: 'compound',
    name: 'Ae', nameFr: 'Ae',
    pronunciation: '"e" as in "bed".',
    pronunciationFr: '« è » comme dans « fête ».',
    strokeCount: 3,
    ipa: 'ɛ',
    articulation: 'open-front',
    examples: [
      { syllable: '개', romanization: 'gae' }, { syllable: '내', romanization: 'nae' },
      { syllable: '새', romanization: 'sae' }, { syllable: '애', romanization: 'ae' },
    ],
  },
  {
    id: 'yae', symbol: 'ㅒ', romanization: 'yae',
    type: 'vowel', subtype: 'compound',
    name: 'Yae', nameFr: 'Yae',
    pronunciation: '"yae" — rarely used; same sound as ㅖ in modern Korean.',
    pronunciationFr: '« yè » — rare ; même son que ㅖ en coréen moderne.',
    strokeCount: 4,
    ipa: 'jɛ',
    articulation: 'open-front',
    examples: [
      { syllable: '얘', romanization: 'yae' }, { syllable: '걔', romanization: 'gyae' },
      { syllable: '쟤', romanization: 'jyae' }, { syllable: '쌔', romanization: 'ssae' },
    ],
  },
  {
    id: 'e', symbol: 'ㅔ', romanization: 'e',
    type: 'vowel', subtype: 'compound',
    name: 'E', nameFr: 'E',
    pronunciation: '"e" as in "bed" — same sound as ㅐ in modern Korean.',
    pronunciationFr: '« è » — même son que ㅐ en coréen moderne.',
    strokeCount: 3,
    ipa: 'e',
    articulation: 'mid-front',
    examples: [
      { syllable: '게', romanization: 'ge' }, { syllable: '네', romanization: 'ne' },
      { syllable: '세', romanization: 'se' }, { syllable: '에', romanization: 'e' },
    ],
  },
  {
    id: 'ye', symbol: 'ㅖ', romanization: 'ye',
    type: 'vowel', subtype: 'compound',
    name: 'Ye', nameFr: 'Ye',
    pronunciation: '"ye" as in "yes".',
    pronunciationFr: '« yè » comme dans « yeux ».',
    strokeCount: 4,
    ipa: 'je',
    articulation: 'mid-front',
    examples: [
      { syllable: '계', romanization: 'gye' }, { syllable: '네', romanization: 'ne' },
      { syllable: '세', romanization: 'se' }, { syllable: '예', romanization: 'ye' },
    ],
  },
  {
    id: 'wa', symbol: 'ㅘ', romanization: 'wa',
    type: 'vowel', subtype: 'compound',
    name: 'Wa', nameFr: 'Wa',
    pronunciation: '"wa" as in "water".',
    pronunciationFr: '« wa » comme dans « wagonnet ».',
    strokeCount: 4,
    ipa: 'wa',
    articulation: 'open-central',
    examples: [
      { syllable: '봐', romanization: 'bwa' }, { syllable: '봐', romanization: 'bwa' },
      { syllable: '봐', romanization: 'bwa' }, { syllable: '와', romanization: 'wa' },
    ],
  },
  {
    id: 'wae', symbol: 'ㅙ', romanization: 'wae',
    type: 'vowel', subtype: 'compound',
    name: 'Wae', nameFr: 'Wae',
    pronunciation: '"wae" — same sound as ㅚ and ㅞ in modern Korean.',
    pronunciationFr: '« wè » — même son que ㅚ et ㅞ en coréen moderne.',
    strokeCount: 5,
    ipa: 'wɛ',
    articulation: 'open-front',
    examples: [
      { syllable: '봬', romanization: 'bwae' }, { syllable: '돼', romanization: 'dwae' },
      { syllable: '봬', romanization: 'bwae' }, { syllable: '왜', romanization: 'wae' },
    ],
  },
  {
    id: 'oe', symbol: 'ㅚ', romanization: 'oe',
    type: 'vowel', subtype: 'compound',
    name: 'Oe', nameFr: 'Oe',
    pronunciation: '"we" — same sound as ㅙ in modern speech.',
    pronunciationFr: '« wè » — même son que ㅙ en parole moderne.',
    strokeCount: 3,
    ipa: 'we',
    articulation: 'mid-front',
    examples: [
      { syllable: '괴', romanization: 'goe' }, { syllable: '뇌', romanization: 'noe' },
      { syllable: '소', romanization: 'so' }, { syllable: '외', romanization: 'oe' },
    ],
  },
  {
    id: 'wo', symbol: 'ㅝ', romanization: 'wo',
    type: 'vowel', subtype: 'compound',
    name: 'Wo', nameFr: 'Wo',
    pronunciation: '"wo" — "w" + eo.',
    pronunciationFr: '« weu » — « w » + eo.',
    strokeCount: 4,
    ipa: 'wʌ',
    articulation: 'mid-back',
    examples: [
      { syllable: '궈', romanization: 'gwo' }, { syllable: '눠', romanization: 'nwo' },
      { syllable: '숴', romanization: 'swo' }, { syllable: '워', romanization: 'wo' },
    ],
  },
  {
    id: 'we', symbol: 'ㅞ', romanization: 'we',
    type: 'vowel', subtype: 'compound',
    name: 'We', nameFr: 'We',
    pronunciation: '"we" — same sound as ㅙ and ㅚ in modern Korean.',
    pronunciationFr: '« wè » — même son que ㅙ et ㅚ en coréen moderne.',
    strokeCount: 5,
    ipa: 'we',
    articulation: 'mid-front',
    examples: [
      { syllable: '궤', romanization: 'gwe' }, { syllable: '뒤', romanization: 'dwi' },
      { syllable: '쉐', romanization: 'swe' }, { syllable: '웨', romanization: 'we' },
    ],
  },
  {
    id: 'wi', symbol: 'ㅟ', romanization: 'wi',
    type: 'vowel', subtype: 'compound',
    name: 'Wi', nameFr: 'Wi',
    pronunciation: '"wi" as in "week".',
    pronunciationFr: '« wi » comme dans « oui ».',
    strokeCount: 3,
    ipa: 'wi',
    articulation: 'close-front',
    examples: [
      { syllable: '귀', romanization: 'gwi' }, { syllable: '뉘', romanization: 'nwi' },
      { syllable: '쉬', romanization: 'swi' }, { syllable: '위', romanization: 'wi' },
    ],
  },
  {
    id: 'ui', symbol: 'ㅢ', romanization: 'ui',
    type: 'vowel', subtype: 'compound',
    name: 'Ui', nameFr: 'Ui',
    pronunciation: '"eu-i" glide — unique to Korean. Context changes its sound.',
    pronunciationFr: 'Glissement « eu-i » — unique au coréen. Le son varie selon le contexte.',
    strokeCount: 2,
    ipa: 'ɰi',
    articulation: 'central',
    examples: [
      { syllable: '의', romanization: 'ui' }, { syllable: '희', romanization: 'hui' },
      { syllable: '띄', romanization: 'ttwi' }, { syllable: '의', romanization: 'ui' },
    ],
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────

export function useHangeul() {
  const consonants = HANGEUL_CHARS.filter((c) => c.type === 'consonant')
  const vowels = HANGEUL_CHARS.filter((c) => c.type === 'vowel')

  const basicConsonants = consonants.filter((c) => c.subtype === 'basic')
  const doubleConsonants = consonants.filter((c) => c.subtype === 'double')
  const basicVowels = vowels.filter((v) => v.subtype === 'basic')
  const compoundVowels = vowels.filter((v) => v.subtype === 'compound')

  function getById(id: string): IHangeulChar | undefined {
    return HANGEUL_CHARS.find((c) => c.id === id)
  }

  function getPrev(id: string): IHangeulChar | undefined {
    const idx = HANGEUL_CHARS.findIndex((c) => c.id === id)
    return idx > 0 ? HANGEUL_CHARS[idx - 1] : undefined
  }

  function getNext(id: string): IHangeulChar | undefined {
    const idx = HANGEUL_CHARS.findIndex((c) => c.id === id)
    return idx < HANGEUL_CHARS.length - 1 ? HANGEUL_CHARS[idx + 1] : undefined
  }

  return {
    all: HANGEUL_CHARS,
    consonants,
    vowels,
    basicConsonants,
    doubleConsonants,
    basicVowels,
    compoundVowels,
    getById,
    getPrev,
    getNext,
  }
}
