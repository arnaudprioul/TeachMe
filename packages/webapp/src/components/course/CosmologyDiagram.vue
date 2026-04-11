<script setup lang="ts">
defineProps<{ highlight?: 'heaven' | 'earth' | 'human' }>()
</script>

<template>
  <div class="cosmo">
    <div class="cosmo__element" :class="{ 'cosmo__element--active': highlight === 'heaven' }">
      <svg width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="6" fill="currentColor" />
      </svg>
      <span class="cosmo__symbol">·</span>
      <span class="cosmo__label"><slot name="heaven">Heaven</slot></span>
    </div>

    <div class="cosmo__element" :class="{ 'cosmo__element--active': highlight === 'earth' }">
      <svg width="48" height="48" viewBox="0 0 48 48">
        <line x1="8" y1="24" x2="40" y2="24" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      </svg>
      <span class="cosmo__symbol">ㅡ</span>
      <span class="cosmo__label"><slot name="earth">Earth</slot></span>
    </div>

    <div class="cosmo__element" :class="{ 'cosmo__element--active': highlight === 'human' }">
      <svg width="48" height="48" viewBox="0 0 48 48">
        <line x1="24" y1="8" x2="24" y2="40" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      </svg>
      <span class="cosmo__symbol">ㅣ</span>
      <span class="cosmo__label"><slot name="human">Human</slot></span>
    </div>
  </div>
</template>

<style scoped>
.cosmo {
  display: flex;
  justify-content: center;
  gap: var(--space-8);
  padding: var(--space-6);
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
}

.cosmo__element {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-muted);
  transition: color var(--transition-fast);
}

.cosmo__element--active {
  color: var(--color-primary);
}

.cosmo__symbol {
  font-size: var(--text-2xl);
  font-weight: 600;
  font-family: var(--font-cjk-kr);
  line-height: 1;
}

.cosmo__label {
  font-size: var(--text-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
