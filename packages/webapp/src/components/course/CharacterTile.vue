<script setup lang="ts">
defineProps<{
  symbol: string
  romanization: string
  to: string
  color?: string
}>()
</script>

<template>
  <NuxtLink :to="to" class="tile" :data-cy="`char-tile`">
    <span class="tile__char" :style="color ? { color } : {}">{{ symbol }}</span>
    <span class="tile__rom">{{ romanization }}</span>
  </NuxtLink>
</template>

<style scoped>
.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: var(--space-3) var(--space-2);
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tile:hover {
  border-color: var(--color-border-strong);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.tile__char {
  font-size: 1.5rem;
  font-weight: 600;
  font-family: var(--font-cjk-kr);
  line-height: 1;
  color: var(--color-course, var(--color-primary));
}

.tile__rom {
  font-size: 0.6875rem;
  color: var(--color-text-muted);
}
</style>
