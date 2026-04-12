import type { PhoneticsMap } from '../types'

/**
 * Phonetics for hiragana — currently a minimal placeholder map. The
 * practice page renders the phonetics card iff `phoneticsOf(id, locale)`
 * returns something, so leaving this empty just hides the card on
 * Japanese for now. We'll fill it in when the Japanese-specific
 * "sounds like / mouth position / tip" copy is written.
 */
export const PHONETICS: PhoneticsMap = {}
