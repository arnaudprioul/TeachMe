<script setup lang="ts">
import { useToast } from '~/composables/useToast'

const { toasts } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="toast-container" aria-live="polite">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="`toast--${toast.type}`"
        >
          <svg v-if="toast.type === 'success'" class="toast__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <svg v-else-if="toast.type === 'error'" class="toast__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          <svg v-else class="toast__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          <span class="toast__text">{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 72px;
  right: var(--space-6);
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-xl);
  font-size: var(--text-sm);
  font-weight: 600;
  backdrop-filter: blur(12px);
  box-shadow: var(--shadow-lg);
  pointer-events: auto;
  max-width: 360px;
}

.toast--success {
  background: rgba(240, 253, 244, 0.95);
  color: #166534;
  border: 1px solid #86efac;
}
.toast--error {
  background: rgba(254, 242, 242, 0.95);
  color: #991b1b;
  border: 1px solid #fca5a5;
}
.toast--info {
  background: rgba(255, 255, 255, 0.95);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.toast__icon { flex-shrink: 0; }
.toast__text { flex: 1; }

/* Transitions */
.toast-enter-active { transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1); }
.toast-leave-active { transition: all 200ms ease; }
.toast-enter-from { transform: translateX(100%); opacity: 0; }
.toast-leave-to { transform: translateX(100%); opacity: 0; }
.toast-move { transition: transform 300ms ease; }

@media (max-width: 640px) {
  .toast-container { left: var(--space-4); right: var(--space-4); }
  .toast { max-width: none; }
}
</style>
