// Patches Pinia 2.3.x — replaces obj.hasOwnProperty(key) with
// Object.prototype.hasOwnProperty.call(obj, key) to avoid crashes on
// null-prototype objects from Vue/devalue internals.
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const files = ['pinia.mjs', 'pinia.cjs'].map(
  f => resolve(__dirname, '..', 'node_modules', 'pinia', 'dist', f)
)
const OLD = /obj\.hasOwnProperty\(key\)/g
const NEW = 'Object.prototype.hasOwnProperty.call(obj, key)'

for (const file of files) {
  try {
    const src = readFileSync(file, 'utf8')
    if (!src.includes('obj.hasOwnProperty(key)')) {
      console.log(`[patch-pinia] Already patched: ${file}`)
      continue
    }
    writeFileSync(file, src.replace(OLD, NEW))
    console.log(`[patch-pinia] Patched: ${file}`)
  } catch {
    console.warn(`[patch-pinia] Skipped (not found): ${file}`)
  }
}
