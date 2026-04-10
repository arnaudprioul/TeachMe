<script setup lang="ts">
defineProps<{
  mode: 'cv' | 'cvc'
  example?: { initial: string; medial: string; final?: string; result: string; romanization: string }
}>()
</script>

<template>
  <div class="sbd">
    <div class="sbd__block">
      <div class="sbd__row" v-if="mode === 'cv'">
        <div class="sbd__cell sbd__cell--initial">
          <span class="sbd__role">Initial</span>
          <span class="sbd__char">{{ example?.initial ?? 'ㄱ' }}</span>
        </div>
        <div class="sbd__cell sbd__cell--medial">
          <span class="sbd__role">Medial</span>
          <span class="sbd__char">{{ example?.medial ?? 'ㅏ' }}</span>
        </div>
      </div>

      <template v-if="mode === 'cvc'">
        <div class="sbd__row">
          <div class="sbd__cell sbd__cell--initial">
            <span class="sbd__role">Initial</span>
            <span class="sbd__char">{{ example?.initial ?? 'ㅎ' }}</span>
          </div>
          <div class="sbd__cell sbd__cell--medial">
            <span class="sbd__role">Medial</span>
            <span class="sbd__char">{{ example?.medial ?? 'ㅏ' }}</span>
          </div>
        </div>
        <div class="sbd__row">
          <div class="sbd__cell sbd__cell--final sbd__cell--wide">
            <span class="sbd__role">Final</span>
            <span class="sbd__char">{{ example?.final ?? 'ㄴ' }}</span>
          </div>
        </div>
      </template>
    </div>

    <div class="sbd__arrow">→</div>

    <div class="sbd__result">
      <span class="sbd__result-char">{{ example?.result ?? (mode === 'cv' ? '가' : '한') }}</span>
      <span class="sbd__result-rom">{{ example?.romanization ?? (mode === 'cv' ? 'ga' : 'han') }}</span>
    </div>
  </div>
</template>

<style scoped>
.sbd {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-5);
  padding: var(--space-6);
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
}

.sbd__block {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sbd__row {
  display: flex;
  gap: 2px;
}

.sbd__cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: var(--space-2) var(--space-3);
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-md);
  min-width: 52px;
}

.sbd__cell--initial { background: var(--color-primary-subtle); }
.sbd__cell--medial { background: rgba(255, 150, 0, 0.08); }
.sbd__cell--final { background: rgba(34, 197, 94, 0.08); }
.sbd__cell--wide { width: 100%; }

.sbd__role {
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-subtle);
}

.sbd__char {
  font-size: var(--text-xl);
  font-weight: 600;
  font-family: var(--font-cjk-kr);
  color: var(--color-text);
}

.sbd__arrow {
  font-size: var(--text-xl);
  color: var(--color-text-subtle);
}

.sbd__result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.sbd__result-char {
  font-size: 2.5rem;
  font-weight: 700;
  font-family: var(--font-cjk-kr);
  color: var(--color-text);
  line-height: 1;
}

.sbd__result-rom {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}
</style>
