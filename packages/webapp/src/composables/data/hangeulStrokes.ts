export interface IStrokePath {
  d: string       // SVG filled shape path
  center: string  // SVG center-line path for drawing animation
  startX: number
  startY: number
}

export interface ICharStrokes {
  viewBox: string
  strokes: IStrokePath[]
}

// Paths are designed as filled shapes to simulate brush/calligraphic strokes
// with variable thickness. viewBox is 0 0 100 100 for easier proportions.
export const HANGEUL_STROKES: Record<string, ICharStrokes> = {

  // ═══ BASIC CONSONANTS ═══

  // ㄱ — horizontal bar at top, vertical bar going down from right end
  'giyeok': {
    viewBox: '0 0 100 100',
    strokes: [
      // horizontal top bar: thick left, tapering right
      { d: 'M 18 22 Q 50 18 78 22 Q 80 26 78 30 Q 50 26 18 30 Z', center: 'M 18 26 Q 50 22 78 26', startX: 18, startY: 26 },
      // vertical right bar: starts from end of horizontal, goes down
      { d: 'M 72 22 Q 76 22 78 24 L 78 82 Q 76 86 72 86 L 72 24 Z', center: 'M 75 24 L 75 84', startX: 75, startY: 24 },
    ],
  },

  // ㄴ — vertical bar going down, horizontal bar at bottom going right
  'nieun': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 22 18 Q 26 18 28 20 L 28 76 Q 26 78 22 78 L 22 20 Z', center: 'M 25 18 L 25 78', startX: 25, startY: 18 },
      { d: 'M 22 72 Q 50 68 82 72 Q 84 76 82 80 Q 50 76 22 80 Z', center: 'M 22 76 Q 50 72 82 76', startX: 22, startY: 76 },
    ],
  },

  // ㄷ — top horizontal, left vertical down, bottom horizontal
  'digeut': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 20 18 Q 50 14 80 18 Q 82 22 80 26 Q 50 22 20 26 Z', center: 'M 20 22 Q 50 18 80 22', startX: 20, startY: 22 },
      { d: 'M 18 18 Q 22 18 24 20 L 24 80 Q 22 82 18 82 L 18 20 Z', center: 'M 21 18 L 21 82', startX: 21, startY: 18 },
      { d: 'M 18 76 Q 50 72 80 76 Q 82 80 80 84 Q 50 80 18 84 Z', center: 'M 18 80 Q 50 76 80 80', startX: 18, startY: 80 },
    ],
  },

  // ㄹ — zigzag: right, down, left, down, right
  'rieul': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 16 14 Q 45 10 76 14 Q 78 18 76 22 Q 45 18 16 22 Z', center: 'M 16 18 Q 45 14 76 18', startX: 16, startY: 18 },
      { d: 'M 72 14 Q 76 14 78 16 L 78 38 Q 76 40 72 40 L 72 16 Z', center: 'M 75 14 L 75 40', startX: 75, startY: 14 },
      { d: 'M 78 36 Q 50 32 22 36 Q 20 40 22 44 Q 50 40 78 44 Z', center: 'M 78 40 Q 50 36 22 40', startX: 78, startY: 40 },
      { d: 'M 20 36 Q 24 36 26 38 L 26 62 Q 24 64 20 64 L 20 38 Z', center: 'M 23 36 L 23 64', startX: 23, startY: 36 },
      { d: 'M 20 58 Q 50 54 82 58 Q 84 62 82 66 Q 50 62 20 66 Z', center: 'M 20 62 Q 50 58 82 62', startX: 20, startY: 62 },
    ],
  },

  // ㅁ — box shape
  'mieum': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 18 18 Q 22 18 24 20 L 24 82 Q 22 84 18 84 L 18 20 Z', center: 'M 21 18 L 21 84', startX: 21, startY: 18 },
      { d: 'M 18 18 Q 50 14 82 18 Q 84 22 82 26 Q 50 22 18 26 Z', center: 'M 18 22 Q 50 18 82 22', startX: 50, startY: 18 },
      { d: 'M 78 18 Q 82 18 84 20 L 84 82 Q 82 84 78 84 L 78 20 Z', center: 'M 81 18 L 81 84', startX: 81, startY: 18 },
      { d: 'M 18 78 Q 50 74 82 78 Q 84 82 82 86 Q 50 82 18 86 Z', center: 'M 18 82 Q 50 78 82 82', startX: 18, startY: 82 },
    ],
  },

  // ㅂ — two verticals, middle horizontal, bottom horizontal
  'bieup': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 22 18 Q 26 18 28 20 L 28 82 Q 26 84 22 84 L 22 20 Z', center: 'M 25 18 L 25 84', startX: 25, startY: 18 },
      { d: 'M 74 18 Q 78 18 80 20 L 80 82 Q 78 84 74 84 L 74 20 Z', center: 'M 77 18 L 77 84', startX: 77, startY: 18 },
      { d: 'M 22 46 Q 50 42 78 46 Q 80 50 78 54 Q 50 50 22 54 Z', center: 'M 22 50 Q 50 46 78 50', startX: 22, startY: 50 },
      { d: 'M 14 78 Q 50 74 86 78 Q 88 82 86 86 Q 50 82 14 86 Z', center: 'M 14 82 Q 50 78 86 82', startX: 14, startY: 82 },
    ],
  },

  // ㅅ — two diagonals meeting at top (tent/roof shape)
  'siot': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 50 16 Q 38 45 18 82 L 24 84 Q 42 48 54 18 Z', center: 'M 50 16 Q 40 46 21 83', startX: 50, startY: 16 },
      { d: 'M 50 16 Q 62 45 82 82 L 76 84 Q 58 48 46 18 Z', center: 'M 52 20 Q 60 46 79 83', startX: 52, startY: 20 },
    ],
  },

  // ㅇ — circle
  'ieung': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 50 16 C 70 16 84 30 84 50 C 84 70 70 84 50 84 C 30 84 16 70 16 50 C 16 30 30 16 50 16 Z M 50 24 C 34 24 24 34 24 50 C 24 66 34 76 50 76 C 66 76 76 66 76 50 C 76 34 66 24 50 24 Z', center: 'M 50 20 C 67 20 80 33 80 50 C 80 67 67 80 50 80 C 33 80 20 67 20 50 C 20 33 33 20 50 20', startX: 50, startY: 16 },
    ],
  },

  // ㅈ — horizontal on top, two diagonals below
  'jieut': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 22 18 Q 50 14 78 18 Q 80 22 78 26 Q 50 22 22 26 Z', center: 'M 22 22 Q 50 18 78 22', startX: 22, startY: 22 },
      { d: 'M 50 30 Q 38 52 18 82 L 24 84 Q 42 56 54 32 Z', center: 'M 50 30 Q 40 54 21 83', startX: 50, startY: 30 },
      { d: 'M 50 30 Q 62 52 82 82 L 76 84 Q 58 56 46 32 Z', center: 'M 52 34 Q 60 54 79 83', startX: 52, startY: 34 },
    ],
  },

  // ㅊ — short tick on top, horizontal, two diagonals
  'chieut': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 48 8 L 52 8 L 52 18 L 48 18 Z', center: 'M 50 8 L 50 18', startX: 50, startY: 8 },
      { d: 'M 22 22 Q 50 18 78 22 Q 80 26 78 30 Q 50 26 22 30 Z', center: 'M 22 26 Q 50 22 78 26', startX: 22, startY: 26 },
      { d: 'M 50 34 Q 38 54 18 84 L 24 86 Q 42 58 54 36 Z', center: 'M 50 34 Q 40 56 21 85', startX: 50, startY: 34 },
      { d: 'M 50 34 Q 62 54 82 84 L 76 86 Q 58 58 46 36 Z', center: 'M 52 38 Q 60 56 79 85', startX: 52, startY: 38 },
    ],
  },

  // ㅋ — ㄱ with extra horizontal through middle
  'kieuk': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 18 20 Q 50 16 78 20 Q 80 24 78 28 Q 50 24 18 28 Z', center: 'M 18 24 Q 50 20 78 24', startX: 18, startY: 24 },
      { d: 'M 72 20 Q 76 20 78 22 L 78 84 Q 76 86 72 86 L 72 22 Z', center: 'M 75 20 L 75 86', startX: 75, startY: 20 },
      { d: 'M 18 50 Q 45 46 72 50 Q 74 54 72 58 Q 45 54 18 58 Z', center: 'M 18 54 Q 45 50 72 54', startX: 18, startY: 54 },
    ],
  },

  // ㅌ — ㄷ with extra horizontal through middle
  'tieut': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 20 16 Q 50 12 80 16 Q 82 20 80 24 Q 50 20 20 24 Z', center: 'M 20 20 Q 50 16 80 20', startX: 20, startY: 20 },
      { d: 'M 18 16 Q 22 16 24 18 L 24 84 Q 22 86 18 86 L 18 18 Z', center: 'M 21 16 L 21 86', startX: 21, startY: 16 },
      { d: 'M 18 48 Q 50 44 80 48 Q 82 52 80 56 Q 50 52 18 56 Z', center: 'M 18 52 Q 50 48 80 52', startX: 18, startY: 52 },
      { d: 'M 18 78 Q 50 74 80 78 Q 82 82 80 86 Q 50 82 18 86 Z', center: 'M 18 82 Q 50 78 80 82', startX: 18, startY: 82 },
    ],
  },

  // ㅍ — two verticals with two horizontals
  'pieup': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 24 18 Q 28 18 30 20 L 30 82 Q 28 84 24 84 L 24 20 Z', center: 'M 27 18 L 27 84', startX: 27, startY: 18 },
      { d: 'M 72 18 Q 76 18 78 20 L 78 82 Q 76 84 72 84 L 72 20 Z', center: 'M 75 18 L 75 84', startX: 75, startY: 18 },
      { d: 'M 14 18 Q 50 14 86 18 Q 88 22 86 26 Q 50 22 14 26 Z', center: 'M 14 22 Q 50 18 86 22', startX: 14, startY: 22 },
      { d: 'M 14 78 Q 50 74 86 78 Q 88 82 86 86 Q 50 82 14 86 Z', center: 'M 14 82 Q 50 78 86 82', startX: 14, startY: 82 },
    ],
  },

  // ㅎ — horizontal on top, circle in middle, short horizontal below
  'hieut': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 30 14 Q 50 10 70 14 Q 72 18 70 22 Q 50 18 30 22 Z', center: 'M 30 18 Q 50 14 70 18', startX: 30, startY: 18 },
      { d: 'M 50 30 C 66 30 76 40 76 54 C 76 68 66 76 50 76 C 34 76 24 68 24 54 C 24 40 34 30 50 30 Z M 50 38 C 38 38 32 44 32 54 C 32 64 38 68 50 68 C 62 68 68 64 68 54 C 68 44 62 38 50 38 Z', center: 'M 50 34 C 63 34 72 43 72 54 C 72 65 63 72 50 72 C 37 72 28 65 28 54 C 28 43 37 34 50 34', startX: 50, startY: 30 },
      { d: 'M 34 82 Q 50 78 66 82 Q 68 86 66 90 Q 50 86 34 90 Z', center: 'M 34 86 Q 50 82 66 86', startX: 34, startY: 86 },
    ],
  },

  // ═══ DOUBLE CONSONANTS ═══

  'ssang-giyeok': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 8 22 Q 28 18 46 22 Q 48 26 46 30 Q 28 26 8 30 Z', center: 'M 8 26 Q 28 22 46 26', startX: 8, startY: 26 },
      { d: 'M 42 22 Q 46 22 48 24 L 48 82 Q 46 84 42 84 L 42 24 Z', center: 'M 45 22 L 45 84', startX: 45, startY: 22 },
      { d: 'M 54 22 Q 72 18 92 22 Q 94 26 92 30 Q 72 26 54 30 Z', center: 'M 54 26 Q 72 22 92 26', startX: 54, startY: 26 },
      { d: 'M 88 22 Q 92 22 94 24 L 94 82 Q 92 84 88 84 L 88 24 Z', center: 'M 91 22 L 91 84', startX: 91, startY: 22 },
    ],
  },

  'ssang-digeut': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 6 18 Q 24 14 46 18 Q 48 22 46 26 Q 24 22 6 26 Z', center: 'M 6 22 Q 24 18 46 22', startX: 6, startY: 22 },
      { d: 'M 6 18 Q 10 18 12 20 L 12 82 Q 10 84 6 84 L 6 20 Z', center: 'M 9 18 L 9 84', startX: 9, startY: 18 },
      { d: 'M 6 78 Q 24 74 46 78 Q 48 82 46 86 Q 24 82 6 86 Z', center: 'M 6 82 Q 24 78 46 82', startX: 6, startY: 82 },
      { d: 'M 54 18 Q 72 14 94 18 Q 96 22 94 26 Q 72 22 54 26 Z', center: 'M 54 22 Q 72 18 94 22', startX: 54, startY: 22 },
      { d: 'M 54 18 Q 58 18 60 20 L 60 82 Q 58 84 54 84 L 54 20 Z', center: 'M 57 18 L 57 84', startX: 57, startY: 18 },
      { d: 'M 54 78 Q 72 74 94 78 Q 96 82 94 86 Q 72 82 54 86 Z', center: 'M 54 82 Q 72 78 94 82', startX: 54, startY: 82 },
    ],
  },

  'ssang-bieup': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 8 18 Q 12 18 14 20 L 14 82 Q 12 84 8 84 L 8 20 Z', center: 'M 11 18 L 11 84', startX: 11, startY: 18 },
      { d: 'M 38 18 Q 42 18 44 20 L 44 82 Q 42 84 38 84 L 38 20 Z', center: 'M 41 18 L 41 84', startX: 41, startY: 18 },
      { d: 'M 8 48 Q 25 44 42 48 Q 44 52 42 56 Q 25 52 8 56 Z', center: 'M 8 52 Q 25 48 42 52', startX: 8, startY: 52 },
      { d: 'M 4 78 Q 25 74 48 78 Q 50 82 48 86 Q 25 82 4 86 Z', center: 'M 4 82 Q 25 78 48 82', startX: 4, startY: 82 },
      { d: 'M 56 18 Q 60 18 62 20 L 62 82 Q 60 84 56 84 L 56 20 Z', center: 'M 59 18 L 59 84', startX: 59, startY: 18 },
      { d: 'M 88 18 Q 92 18 94 20 L 94 82 Q 92 84 88 84 L 88 20 Z', center: 'M 91 18 L 91 84', startX: 91, startY: 18 },
      { d: 'M 56 48 Q 74 44 92 48 Q 94 52 92 56 Q 74 52 56 56 Z', center: 'M 56 52 Q 74 48 92 52', startX: 56, startY: 52 },
      { d: 'M 52 78 Q 74 74 96 78 Q 98 82 96 86 Q 74 82 52 86 Z', center: 'M 52 82 Q 74 78 96 82', startX: 52, startY: 82 },
    ],
  },

  'ssang-siot': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 30 16 Q 22 42 10 80 L 16 82 Q 26 46 34 18 Z', center: 'M 30 16 Q 24 44 13 81', startX: 30, startY: 16 },
      { d: 'M 30 16 Q 38 42 50 80 L 44 82 Q 34 46 26 18 Z', center: 'M 32 20 Q 36 44 47 81', startX: 32, startY: 20 },
      { d: 'M 70 16 Q 62 42 50 80 L 56 82 Q 66 46 74 18 Z', center: 'M 70 16 Q 64 44 53 81', startX: 70, startY: 16 },
      { d: 'M 70 16 Q 78 42 90 80 L 84 82 Q 74 46 66 18 Z', center: 'M 72 20 Q 76 44 87 81', startX: 72, startY: 20 },
    ],
  },

  'ssang-jieut': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 6 16 Q 25 12 46 16 Q 48 20 46 24 Q 25 20 6 24 Z', center: 'M 6 20 Q 25 16 46 20', startX: 6, startY: 20 },
      { d: 'M 26 28 Q 18 48 8 76 L 14 78 Q 22 52 30 30 Z', center: 'M 26 28 Q 20 50 11 77', startX: 26, startY: 28 },
      { d: 'M 26 28 Q 34 48 44 76 L 38 78 Q 30 52 22 30 Z', center: 'M 28 32 Q 32 50 41 77', startX: 28, startY: 32 },
      { d: 'M 54 16 Q 74 12 94 16 Q 96 20 94 24 Q 74 20 54 24 Z', center: 'M 54 20 Q 74 16 94 20', startX: 54, startY: 20 },
      { d: 'M 74 28 Q 66 48 56 76 L 62 78 Q 70 52 78 30 Z', center: 'M 74 28 Q 68 50 59 77', startX: 74, startY: 28 },
      { d: 'M 74 28 Q 82 48 92 76 L 86 78 Q 78 52 70 30 Z', center: 'M 76 32 Q 80 50 89 77', startX: 76, startY: 32 },
    ],
  },

  // ═══ BASIC VOWELS ═══

  // ㅏ — long vertical line on left, short horizontal tick to the right from middle
  'a': {
    viewBox: '0 0 100 100',
    strokes: [
      // Long vertical — the main stroke, full height
      { d: 'M 32 8 Q 36 8 38 10 L 38 92 Q 36 94 32 94 L 32 10 Z', center: 'M 35 8 L 35 94', startX: 35, startY: 8 },
      // Short horizontal tick — about 40% of width, from middle of vertical going right
      { d: 'M 36 48 Q 54 44 72 48 Q 74 52 72 56 Q 54 52 36 56 Z', center: 'M 36 52 Q 54 48 72 52', startX: 36, startY: 52 },
    ],
  },

  // ㅑ — long vertical, two short horizontals to the right
  'ya': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 28 8 Q 32 8 34 10 L 34 92 Q 32 94 28 94 L 28 10 Z', center: 'M 31 8 L 31 94', startX: 31, startY: 8 },
      { d: 'M 32 36 Q 52 32 72 36 Q 74 40 72 44 Q 52 40 32 44 Z', center: 'M 32 40 Q 52 36 72 40', startX: 32, startY: 40 },
      { d: 'M 32 60 Q 52 56 72 60 Q 74 64 72 68 Q 52 64 32 68 Z', center: 'M 32 64 Q 52 60 72 64', startX: 32, startY: 64 },
    ],
  },

  // ㅓ — short horizontal tick to the left, long vertical on right
  'eo': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 64 48 Q 46 44 28 48 Q 26 52 28 56 Q 46 52 64 56 Z', center: 'M 64 52 Q 46 48 28 52', startX: 64, startY: 52 },
      { d: 'M 64 8 Q 68 8 70 10 L 70 92 Q 68 94 64 94 L 64 10 Z', center: 'M 67 8 L 67 94', startX: 67, startY: 8 },
    ],
  },

  // ㅕ — two short horizontals to the left, long vertical on right
  'yeo': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 68 36 Q 48 32 28 36 Q 26 40 28 44 Q 48 40 68 44 Z', center: 'M 68 40 Q 48 36 28 40', startX: 68, startY: 40 },
      { d: 'M 68 60 Q 48 56 28 60 Q 26 64 28 68 Q 48 64 68 68 Z', center: 'M 68 64 Q 48 60 28 64', startX: 68, startY: 64 },
      { d: 'M 68 8 Q 72 8 74 10 L 74 92 Q 72 94 68 94 L 68 10 Z', center: 'M 71 8 L 71 94', startX: 71, startY: 8 },
    ],
  },

  // ㅗ — short vertical up from center, long horizontal at bottom
  'o': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 48 22 Q 48 18 50 16 Q 52 18 54 22 L 54 58 Q 52 60 48 60 L 48 22 Z', center: 'M 51 16 L 51 60', startX: 51, startY: 16 },
      { d: 'M 10 58 Q 50 54 90 58 Q 92 62 90 66 Q 50 62 10 66 Z', center: 'M 10 62 Q 50 58 90 62', startX: 10, startY: 62 },
    ],
  },

  // ㅛ — two short verticals up, long horizontal
  'yo': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 36 22 Q 36 18 38 16 Q 40 18 42 22 L 42 58 Q 40 60 36 60 L 36 22 Z', center: 'M 39 16 L 39 60', startX: 39, startY: 16 },
      { d: 'M 58 22 Q 58 18 60 16 Q 62 18 64 22 L 64 58 Q 62 60 58 60 L 58 22 Z', center: 'M 61 16 L 61 60', startX: 61, startY: 16 },
      { d: 'M 10 58 Q 50 54 90 58 Q 92 62 90 66 Q 50 62 10 66 Z', center: 'M 10 62 Q 50 58 90 62', startX: 10, startY: 62 },
    ],
  },

  // ㅜ — long horizontal at top, short vertical down from center
  'u': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 10 36 Q 50 32 90 36 Q 92 40 90 44 Q 50 40 10 44 Z', center: 'M 10 40 Q 50 36 90 40', startX: 10, startY: 40 },
      { d: 'M 48 42 Q 48 44 48 46 L 48 82 Q 50 86 52 82 L 54 46 Q 54 44 54 42 Z', center: 'M 51 42 L 51 84', startX: 51, startY: 42 },
    ],
  },

  // ㅠ — long horizontal, two short verticals down
  'yu': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 10 36 Q 50 32 90 36 Q 92 40 90 44 Q 50 40 10 44 Z', center: 'M 10 40 Q 50 36 90 40', startX: 10, startY: 40 },
      { d: 'M 36 42 L 42 42 L 42 82 Q 40 84 36 82 L 36 42 Z', center: 'M 39 42 L 39 83', startX: 39, startY: 42 },
      { d: 'M 58 42 L 64 42 L 64 82 Q 62 84 58 82 L 58 42 Z', center: 'M 61 42 L 61 83', startX: 61, startY: 42 },
    ],
  },

  // ㅡ — single long horizontal
  'eu': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 10 48 Q 50 44 90 48 Q 92 52 90 56 Q 50 52 10 56 Z', center: 'M 10 52 Q 50 48 90 52', startX: 10, startY: 52 },
    ],
  },

  // ㅣ — single long vertical
  'i': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 48 8 Q 52 8 54 10 L 54 92 Q 52 94 48 94 L 48 10 Z', center: 'M 51 8 L 51 94', startX: 51, startY: 8 },
    ],
  },

  // ═══ COMPOUND VOWELS ═══

  // ㅐ — ㅏ + ㅣ
  'ae': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 20 8 Q 24 8 26 10 L 26 92 Q 24 94 20 94 L 20 10 Z', center: 'M 23 8 L 23 94', startX: 23, startY: 8 },
      { d: 'M 24 48 Q 40 44 56 48 Q 58 52 56 56 Q 40 52 24 56 Z', center: 'M 24 52 Q 40 48 56 52', startX: 24, startY: 52 },
      { d: 'M 68 8 Q 72 8 74 10 L 74 92 Q 72 94 68 94 L 68 10 Z', center: 'M 71 8 L 71 94', startX: 71, startY: 8 },
    ],
  },

  // ㅒ — ㅑ + ㅣ
  'yae': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 16 8 Q 20 8 22 10 L 22 92 Q 20 94 16 94 L 16 10 Z', center: 'M 19 8 L 19 94', startX: 19, startY: 8 },
      { d: 'M 20 36 Q 38 32 56 36 Q 58 40 56 44 Q 38 40 20 44 Z', center: 'M 20 40 Q 38 36 56 40', startX: 20, startY: 40 },
      { d: 'M 20 60 Q 38 56 56 60 Q 58 64 56 68 Q 38 64 20 68 Z', center: 'M 20 64 Q 38 60 56 64', startX: 20, startY: 64 },
      { d: 'M 68 8 Q 72 8 74 10 L 74 92 Q 72 94 68 94 L 68 10 Z', center: 'M 71 8 L 71 94', startX: 71, startY: 8 },
    ],
  },

  // ㅔ — ㅓ + ㅣ
  'e': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 56 48 Q 38 44 20 48 Q 18 52 20 56 Q 38 52 56 56 Z', center: 'M 56 52 Q 38 48 20 52', startX: 56, startY: 52 },
      { d: 'M 56 8 Q 60 8 62 10 L 62 92 Q 60 94 56 94 L 56 10 Z', center: 'M 59 8 L 59 94', startX: 59, startY: 8 },
      { d: 'M 74 8 Q 78 8 80 10 L 80 92 Q 78 94 74 94 L 74 10 Z', center: 'M 77 8 L 77 94', startX: 77, startY: 8 },
    ],
  },

  // ㅖ — ㅕ + ㅣ
  'ye': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 54 36 Q 36 32 18 36 Q 16 40 18 44 Q 36 40 54 44 Z', center: 'M 54 40 Q 36 36 18 40', startX: 54, startY: 40 },
      { d: 'M 54 60 Q 36 56 18 60 Q 16 64 18 68 Q 36 64 54 68 Z', center: 'M 54 64 Q 36 60 18 64', startX: 54, startY: 64 },
      { d: 'M 54 8 Q 58 8 60 10 L 60 92 Q 58 94 54 94 L 54 10 Z', center: 'M 57 8 L 57 94', startX: 57, startY: 8 },
      { d: 'M 74 8 Q 78 8 80 10 L 80 92 Q 78 94 74 94 L 74 10 Z', center: 'M 77 8 L 77 94', startX: 77, startY: 8 },
    ],
  },

  // ㅘ — ㅗ + ㅏ
  'wa': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 22 20 Q 22 16 24 14 Q 26 16 28 20 L 28 48 Q 26 50 22 50 Z', center: 'M 25 14 L 25 50', startX: 25, startY: 14 },
      { d: 'M 8 48 Q 30 44 52 48 Q 54 52 52 56 Q 30 52 8 56 Z', center: 'M 8 52 Q 30 48 52 52', startX: 8, startY: 52 },
      { d: 'M 64 8 Q 68 8 70 10 L 70 92 Q 68 94 64 94 L 64 10 Z', center: 'M 67 8 L 67 94', startX: 67, startY: 8 },
      { d: 'M 68 48 Q 80 44 92 48 Q 94 52 92 56 Q 80 52 68 56 Z', center: 'M 68 52 Q 80 48 92 52', startX: 68, startY: 52 },
    ],
  },

  // ㅙ — ㅗ + ㅐ
  'wae': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 18 20 Q 18 16 20 14 Q 22 16 24 20 L 24 44 Q 22 46 18 46 Z', center: 'M 21 14 L 21 46', startX: 21, startY: 14 },
      { d: 'M 6 44 Q 24 40 44 44 Q 46 48 44 52 Q 24 48 6 52 Z', center: 'M 6 48 Q 24 44 44 48', startX: 6, startY: 48 },
      { d: 'M 56 8 Q 60 8 62 10 L 62 92 Q 60 94 56 94 L 56 10 Z', center: 'M 59 8 L 59 94', startX: 59, startY: 8 },
      { d: 'M 60 48 Q 70 44 80 48 Q 82 52 80 56 Q 70 52 60 56 Z', center: 'M 60 52 Q 70 48 80 52', startX: 60, startY: 52 },
      { d: 'M 86 8 Q 90 8 92 10 L 92 92 Q 90 94 86 94 L 86 10 Z', center: 'M 89 8 L 89 94', startX: 89, startY: 8 },
    ],
  },

  // ㅚ — ㅗ + ㅣ
  'oe': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 36 20 Q 36 16 38 14 Q 40 16 42 20 L 42 48 Q 40 50 36 50 Z', center: 'M 39 14 L 39 50', startX: 39, startY: 14 },
      { d: 'M 10 48 Q 40 44 70 48 Q 72 52 70 56 Q 40 52 10 56 Z', center: 'M 10 52 Q 40 48 70 52', startX: 10, startY: 52 },
      { d: 'M 78 8 Q 82 8 84 10 L 84 92 Q 82 94 78 94 L 78 10 Z', center: 'M 81 8 L 81 94', startX: 81, startY: 8 },
    ],
  },

  // ㅝ — ㅜ + ㅓ
  'wo': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 8 36 Q 30 32 52 36 Q 54 40 52 44 Q 30 40 8 44 Z', center: 'M 8 40 Q 30 36 52 40', startX: 8, startY: 40 },
      { d: 'M 28 42 L 34 42 L 34 82 Q 32 84 28 82 Z', center: 'M 31 42 L 31 83', startX: 31, startY: 42 },
      { d: 'M 66 48 Q 54 44 42 48 Q 40 52 42 56 Q 54 52 66 56 Z', center: 'M 66 52 Q 54 48 42 52', startX: 66, startY: 52 },
      { d: 'M 66 8 Q 70 8 72 10 L 72 92 Q 70 94 66 94 L 66 10 Z', center: 'M 69 8 L 69 94', startX: 69, startY: 8 },
    ],
  },

  // ㅞ — ㅜ + ㅔ
  'we': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 6 36 Q 24 32 44 36 Q 46 40 44 44 Q 24 40 6 44 Z', center: 'M 6 40 Q 24 36 44 40', startX: 6, startY: 40 },
      { d: 'M 24 42 L 30 42 L 30 82 Q 28 84 24 82 Z', center: 'M 27 42 L 27 83', startX: 27, startY: 42 },
      { d: 'M 58 48 Q 46 44 34 48 Q 32 52 34 56 Q 46 52 58 56 Z', center: 'M 58 52 Q 46 48 34 52', startX: 58, startY: 52 },
      { d: 'M 58 8 Q 62 8 64 10 L 64 92 Q 62 94 58 94 L 58 10 Z', center: 'M 61 8 L 61 94', startX: 61, startY: 8 },
      { d: 'M 78 8 Q 82 8 84 10 L 84 92 Q 82 94 78 94 L 78 10 Z', center: 'M 81 8 L 81 94', startX: 81, startY: 8 },
    ],
  },

  // ㅟ — ㅜ + ㅣ
  'wi': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 10 36 Q 40 32 70 36 Q 72 40 70 44 Q 40 40 10 44 Z', center: 'M 10 40 Q 40 36 70 40', startX: 10, startY: 40 },
      { d: 'M 38 42 L 44 42 L 44 82 Q 42 84 38 82 Z', center: 'M 41 42 L 41 83', startX: 41, startY: 42 },
      { d: 'M 78 8 Q 82 8 84 10 L 84 92 Q 82 94 78 94 L 78 10 Z', center: 'M 81 8 L 81 94', startX: 81, startY: 8 },
    ],
  },

  // ㅢ — ㅡ + ㅣ
  'ui': {
    viewBox: '0 0 100 100',
    strokes: [
      { d: 'M 10 48 Q 40 44 70 48 Q 72 52 70 56 Q 40 52 10 56 Z', center: 'M 10 52 Q 40 48 70 52', startX: 10, startY: 52 },
      { d: 'M 78 8 Q 82 8 84 10 L 84 92 Q 82 94 78 94 L 78 10 Z', center: 'M 81 8 L 81 94', startX: 81, startY: 8 },
    ],
  },
}
