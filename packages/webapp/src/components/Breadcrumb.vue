<script setup lang="ts">
export interface IBreadcrumbItem {
  label: string
  to?: string
}

defineProps<{ items: IBreadcrumbItem[] }>()
</script>

<template>
  <nav class="bc" aria-label="Breadcrumb">
    <ol>
      <li v-for="(item, i) in items" :key="i">
        <NuxtLink v-if="item.to" :to="item.to" class="bc__link">{{ item.label }}</NuxtLink>
        <span v-else class="bc__current" aria-current="page">{{ item.label }}</span>
        <svg v-if="i < items.length - 1" class="bc__sep" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.bc {
  margin-bottom: var(--space-5);
}

.bc ol {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-1);
  list-style: none;
  padding: 0;
  margin: 0;
}

.bc li {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.bc__link {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.bc__link:hover {
  color: var(--color-primary);
}

.bc__current {
  font-size: var(--text-sm);
  color: var(--color-text);
  font-weight: 500;
}

.bc__sep {
  color: var(--color-text-subtle);
  flex-shrink: 0;
}
</style>
