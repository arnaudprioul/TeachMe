<script setup lang="ts">
import type { ILessonWord } from '~/composables/data/courses/lesson-types'

defineProps<{
  word: ILessonWord
  locale: 'en' | 'fr'
}>()
</script>

<template>
  <div class="vc" data-cy="vocab-card">
    <div class="vc__visual">
      <img v-if="word.image" :src="word.image" :alt="word.translation" class="vc__img" />
      <span v-else-if="word.emoji" class="vc__emoji">{{ word.emoji }}</span>
    </div>
    <div class="vc__content">
      <span class="vc__word">{{ word.word }}</span>
      <span class="vc__rom">{{ word.romanization }}</span>
      <span class="vc__translation">{{ locale === 'fr' ? word.translationFr : word.translation }}</span>
    </div>
    <AudioButton :text="word.audioText || word.word" />
  </div>
</template>

<style scoped>
.vc {
  display: flex; align-items: center; gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  background: var(--color-bg-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  transition: all var(--transition-fast);
}
.vc:hover { border-color: var(--color-primary-light); box-shadow: var(--shadow-sm); }

.vc__visual { width: 56px; height: 56px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.vc__img { width: 56px; height: 56px; object-fit: contain; }
.vc__emoji { font-size: 2rem; }

.vc__content { flex: 1; display: flex; flex-direction: column; gap: var(--space-1); min-width: 0; }
.vc__word { font-size: var(--text-base); font-weight: 600; color: var(--color-text); font-family: var(--font-cjk-kr); }
.vc__rom { font-size: var(--text-xs); color: var(--color-text-muted); }
.vc__translation { font-size: var(--text-xs); color: var(--color-text-secondary); }
</style>
