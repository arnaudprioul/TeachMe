<template>
  <div class="auth-shell">
    <div class="auth-card"><slot /></div>
  </div>
</template>

<style scoped>
.auth-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: var(--space-4);
}

.auth-card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-10);
  width: 100%;
  max-width: 420px;
  box-shadow: var(--shadow-lg);
}
</style>
