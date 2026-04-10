<script setup lang="ts">
defineProps<{
  prevTo?: string
  prevLabel?: string
  nextTo?: string
  nextLabel?: string
}>()
</script>

<template>
  <nav class="section-nav">
    <NuxtLink v-if="prevTo" :to="prevTo" class="section-nav__link">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      {{ prevLabel }}
    </NuxtLink>
    <span v-else />

    <NuxtLink v-if="nextTo" :to="nextTo" class="section-nav__link section-nav__link--next">
      {{ nextLabel }}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
    </NuxtLink>
    <span v-else />
  </nav>
</template>

<style scoped>
.section-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-border);
}

.section-nav__link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-primary);
  text-decoration: none;
  transition: opacity var(--transition-fast);
}

.section-nav__link:hover { opacity: 0.8; }
</style>
