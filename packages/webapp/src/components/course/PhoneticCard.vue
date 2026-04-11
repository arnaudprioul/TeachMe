<script setup lang="ts">
defineProps<{
  ipa: string
  soundsLike: string
  mouthDescription: string
  tip: string
}>()
</script>

<template>
  <div class="phonetic">
    <div class="phonetic__row">
      <span class="phonetic__label">IPA</span>
      <span class="phonetic__ipa">/{{ ipa }}/</span>
    </div>
    <div class="phonetic__row">
      <span class="phonetic__label"><slot name="soundsLikeLabel">Sounds like</slot></span>
      <span class="phonetic__value">{{ soundsLike }}</span>
    </div>
    <div class="phonetic__row">
      <span class="phonetic__label"><slot name="mouthLabel">Mouth position</slot></span>
      <span class="phonetic__value">{{ mouthDescription }}</span>
    </div>
    <div v-if="tip" class="phonetic__tip">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      {{ tip }}
    </div>
  </div>
</template>

<style scoped>
.phonetic {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.phonetic__row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.phonetic__label {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-text-subtle);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.phonetic__ipa {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-primary);
  font-family: var(--font-mono);
}

.phonetic__value {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.phonetic__tip {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  padding: var(--space-3);
  background: var(--color-bg-muted);
  border-radius: var(--radius-md);
  line-height: 1.5;
}

.phonetic__tip svg {
  flex-shrink: 0;
  margin-top: 1px;
}
</style>
