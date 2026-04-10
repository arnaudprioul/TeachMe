<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useHangeulAudio } from '~/composables/useHangeulAudio'
import type { IHangeulChar } from '~/composables/useHangeul'

const props = defineProps<{
  char: IHangeulChar
  visible: boolean
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

const { t, locale } = useI18n()
const { speak, isSupported } = useHangeulAudio()

const localizedName = computed(() =>
  locale.value === 'fr' ? props.char.nameFr : props.char.name,
)
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click.self="emit('close')">
      <div class="modal">
        <button class="modal__close" @click="emit('close')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <!-- Character display -->
        <div class="modal__char">{{ char.symbol }}</div>
        <div class="modal__type">{{ t(`korean.charType_${char.type}`) }}</div>
        <div class="modal__rom">{{ char.romanization.toUpperCase() }}</div>

        <!-- Actions -->
        <div class="modal__actions">
          <button v-if="isSupported" class="modal__btn" @click="speak(char.symbol)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          </button>
          <NuxtLink :to="`/korean/hangeul/practice/${char.id}`" class="modal__btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </NuxtLink>
        </div>

        <!-- Info -->
        <div class="modal__info">
          <div class="modal__row">
            <span class="modal__label">Name</span>
            <span>{{ localizedName }}</span>
          </div>
          <div class="modal__row">
            <span class="modal__label">IPA</span>
            <span class="modal__ipa">/{{ char.ipa }}/</span>
          </div>
          <div class="modal__row">
            <span class="modal__label">{{ t('korean.strokeCount', { n: char.strokeCount }) }}</span>
            <span>{{ char.strokeCount }}</span>
          </div>
        </div>

        <!-- Stroke order SVG -->
        <div class="modal__stroke">
          <StrokeAnimation :char-id="char.id" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: var(--color-bg-overlay);
  display: flex; align-items: center; justify-content: center;
  padding: var(--space-4);
}

.modal {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  padding: var(--space-6);
  width: 100%; max-width: 400px;
  max-height: 90vh; overflow-y: auto;
  display: flex; flex-direction: column; align-items: center;
  gap: var(--space-4); position: relative;
}

.modal__close {
  position: absolute; top: var(--space-4); left: var(--space-4);
  width: 32px; height: 32px; border-radius: var(--radius-full);
  border: none; background: var(--color-bg-muted);
  color: var(--color-text-muted); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}

.modal__char {
  font-family: var(--font-cjk-kr); font-size: 5rem;
  font-weight: 600; color: var(--color-text); line-height: 1;
  margin-top: var(--space-4);
}

.modal__type { font-size: var(--text-sm); color: var(--color-text-muted); }
.modal__rom { font-size: var(--text-2xl); font-weight: 600; color: var(--color-text-secondary); }

.modal__actions { display: flex; gap: var(--space-2); }
.modal__btn {
  width: 40px; height: 40px; border-radius: var(--radius-full);
  border: 1px solid var(--color-border); background: var(--color-bg-surface);
  color: var(--color-primary); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  text-decoration: none;
}
.modal__btn:hover { background: var(--color-primary-subtle); }

.modal__info {
  width: 100%; display: flex; flex-direction: column; gap: var(--space-2);
  padding: var(--space-4); background: var(--color-bg-muted);
  border-radius: var(--radius-lg);
}

.modal__row {
  display: flex; justify-content: space-between; align-items: center;
  font-size: var(--text-sm);
}
.modal__label { color: var(--color-text-muted); }
.modal__ipa { font-family: var(--font-mono); color: var(--color-primary); font-weight: 600; }

.modal__stroke { width: 120px; height: 120px; }
</style>
