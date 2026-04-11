import type { ISyllableComposer } from '../types'

// Choseong (initial consonants) — Unicode order
const CHOSEONG: Array<{ id: string; rom: string }> = [
  { id: 'giyeok', rom: 'g' },        { id: 'ssang-giyeok', rom: 'kk' },
  { id: 'nieun', rom: 'n' },         { id: 'digeut', rom: 'd' },
  { id: 'ssang-digeut', rom: 'tt' }, { id: 'rieul', rom: 'r' },
  { id: 'mieum', rom: 'm' },         { id: 'bieup', rom: 'b' },
  { id: 'ssang-bieup', rom: 'pp' },  { id: 'siot', rom: 's' },
  { id: 'ssang-siot', rom: 'ss' },   { id: 'ieung', rom: '' },
  { id: 'jieut', rom: 'j' },         { id: 'ssang-jieut', rom: 'jj' },
  { id: 'chieut', rom: 'ch' },       { id: 'kieuk', rom: 'k' },
  { id: 'tieut', rom: 't' },         { id: 'pieup', rom: 'p' },
  { id: 'hieut', rom: 'h' },
]

// Jungseong (medial vowels) — Unicode order
const JUNGSEONG: Array<{ id: string; rom: string }> = [
  { id: 'a', rom: 'a' },     { id: 'ae', rom: 'ae' },
  { id: 'ya', rom: 'ya' },   { id: 'yae', rom: 'yae' },
  { id: 'eo', rom: 'eo' },   { id: 'e', rom: 'e' },
  { id: 'yeo', rom: 'yeo' }, { id: 'ye', rom: 'ye' },
  { id: 'o', rom: 'o' },     { id: 'wa', rom: 'wa' },
  { id: 'wae', rom: 'wae' }, { id: 'oe', rom: 'oe' },
  { id: 'yo', rom: 'yo' },   { id: 'u', rom: 'u' },
  { id: 'wo', rom: 'wo' },   { id: 'we', rom: 'we' },
  { id: 'wi', rom: 'wi' },   { id: 'yu', rom: 'yu' },
  { id: 'eu', rom: 'eu' },   { id: 'ui', rom: 'ui' },
  { id: 'i', rom: 'i' },
]

export const SYLLABLES: ISyllableComposer = {
  initials: CHOSEONG,
  medials: JUNGSEONG,
  build(ci, vi) {
    const c = CHOSEONG[ci]
    const v = JUNGSEONG[vi]
    if (!c || !v) return { id: '', symbol: '', romanization: '' }
    const code = 0xAC00 + ci * 588 + vi * 28
    return {
      id: `${c.id}-${v.id}`,
      symbol: String.fromCharCode(code),
      romanization: c.rom + v.rom,
    }
  },
  parse(slug) {
    for (const c of CHOSEONG) {
      if (slug.startsWith(c.id + '-')) {
        const vId = slug.slice(c.id.length + 1)
        if (JUNGSEONG.some(v => v.id === vId)) {
          return { initialId: c.id, medialId: vId }
        }
      }
    }
    return null
  },
}
