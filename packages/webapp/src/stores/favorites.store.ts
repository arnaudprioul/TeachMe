import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'teachme_favorites'

export const useFavoritesStore = defineStore('favorites', () => {
  const items = ref<Set<string>>(new Set())

  function load() {
    if (typeof localStorage === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) items.value = new Set(JSON.parse(raw))
    } catch {}
  }

  function persist() {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...items.value]))
  }

  function toggle(charId: string) {
    if (items.value.has(charId)) items.value.delete(charId)
    else items.value.add(charId)
    items.value = new Set(items.value) // trigger reactivity
    persist()
  }

  function isFavorite(charId: string): boolean {
    return items.value.has(charId)
  }

  const list = computed(() => [...items.value])
  const count = computed(() => items.value.size)

  load()

  return { items, list, count, toggle, isFavorite }
})
