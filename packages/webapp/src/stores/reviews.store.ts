import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth.store'

export interface ISrsState {
  easeFactor: number
  intervalDays: number
  repetitions: number
}

export interface IReviewCard {
  id: string
  userId: string
  lang: string
  wordId: string
  courseId: string
  lessonId: number
  srs: ISrsState
  nextReviewAt: string | null
  lastReviewedAt: string | null
  createdAt: string
}

function authHeaders(): Record<string, string> {
  const auth = useAuthStore()
  return auth.token ? { Authorization: `Bearer ${auth.token}` } : {}
}

export const useReviewsStore = defineStore('reviews', () => {
  const cards = ref<IReviewCard[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  /** Fetch all user's review cards (optionally filtered by lang). */
  async function load(lang?: string) {
    loading.value = true
    try {
      const query = lang ? `?lang=${encodeURIComponent(lang)}` : ''
      const res = await $fetch<{ data: IReviewCard[] }>(`/api/v1/reviews${query}`, {
        headers: authHeaders(),
      })
      cards.value = res.data
      loaded.value = true
    } catch (err) {
      console.warn('[reviews.store] load failed', err)
    } finally {
      loading.value = false
    }
  }

  const byLang = computed(() => {
    const map = new Map<string, IReviewCard[]>()
    for (const c of cards.value) {
      const arr = map.get(c.lang) ?? []
      arr.push(c)
      map.set(c.lang, arr)
    }
    return map
  })

  function forLang(lang: string): IReviewCard[] {
    return cards.value.filter(c => c.lang === lang)
  }

  function isInDeck(lang: string, wordId: string, courseId: string, lessonId: number): boolean {
    return cards.value.some(c =>
      c.lang === lang && c.wordId === wordId && c.courseId === courseId && c.lessonId === lessonId
    )
  }

  function findCard(lang: string, wordId: string, courseId: string, lessonId: number): IReviewCard | undefined {
    return cards.value.find(c =>
      c.lang === lang && c.wordId === wordId && c.courseId === courseId && c.lessonId === lessonId
    )
  }

  async function add(input: { lang: string; wordId: string; courseId: string; lessonId: number }) {
    const res = await $fetch<{ data: IReviewCard }>('/api/v1/reviews', {
      method: 'POST', headers: authHeaders(), body: input,
    })
    // Replace if exists, else append
    const idx = cards.value.findIndex(c => c.id === res.data.id)
    if (idx >= 0) cards.value[idx] = res.data
    else cards.value.push(res.data)
    return res.data
  }

  async function remove(id: string) {
    await $fetch(`/api/v1/reviews/${id}`, {
      method: 'DELETE', headers: authHeaders(),
    })
    cards.value = cards.value.filter(c => c.id !== id)
  }

  /** Add multiple cards in a single API call */
  async function addBatch(items: Array<{ lang: string; wordId: string; courseId: string; lessonId: number }>) {
    const res = await $fetch<{ data: IReviewCard[] }>('/api/v1/reviews/batch', {
      method: 'POST', headers: authHeaders(), body: { items },
    })
    for (const card of res.data) {
      const idx = cards.value.findIndex(c => c.id === card.id)
      if (idx >= 0) cards.value[idx] = card
      else cards.value.push(card)
    }
    return res.data
  }

  /** Remove multiple cards in a single API call */
  async function removeBatch(ids: string[]) {
    await $fetch('/api/v1/reviews/batch-delete', {
      method: 'POST', headers: authHeaders(), body: { ids },
    })
    cards.value = cards.value.filter(c => !ids.includes(c.id))
  }

  async function rate(id: string, quality: number) {
    const res = await $fetch<{ data: IReviewCard }>(`/api/v1/reviews/${id}/rate`, {
      method: 'POST', headers: authHeaders(), body: { quality },
    })
    const idx = cards.value.findIndex(c => c.id === id)
    if (idx >= 0) cards.value[idx] = res.data
    return res.data
  }

  function dueCards(lang: string, now = new Date()): IReviewCard[] {
    return forLang(lang).filter(c => {
      if (!c.nextReviewAt) return true
      return new Date(c.nextReviewAt) <= now
    })
  }

  return {
    cards, loading, loaded,
    byLang, forLang, isInDeck, findCard, dueCards,
    load, add, addBatch, remove, removeBatch, rate,
  }
})
