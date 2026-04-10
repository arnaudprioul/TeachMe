<script setup lang="ts">
import type { IHangeulChar } from '~/composables/useHangeul'

defineProps<{
  characters: IHangeulChar[]
  basePath: string
  color?: string
}>()
</script>

<template>
  <div class="char-grid">
    <CharacterTile
      v-for="c in characters"
      :key="c.id"
      :symbol="c.symbol"
      :romanization="c.romanization"
      :to="`${basePath}/${c.id}`"
      :color="color"
      :data-cy="`char-${c.id}`"
    />
  </div>
</template>

<style scoped>
.char-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(68px, 1fr));
  gap: var(--space-2);
}
</style>
