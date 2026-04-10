<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth.store'
const { t } = useI18n()
const auth = useAuthStore()

async function logout() {
  auth.logout()
  await navigateTo('/')
}
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <nav class="topbar__inner">
        <NuxtLink to="/dashboard" class="logo">
          <span class="logo__mark">T</span>
          <span class="logo__text">TeachMe</span>
        </NuxtLink>

        <div class="topbar__nav">
          <NuxtLink to="/dashboard" class="nav-link" data-cy="nav-dashboard">
            {{ t('nav.dashboard') }}
          </NuxtLink>
        </div>

        <div class="topbar__user">
          <div class="avatar" :aria-label="auth.user?.username">
            {{ auth.user?.username?.[0]?.toUpperCase() }}
          </div>
          <button class="btn btn--ghost btn--sm" data-cy="btn-logout" @click="logout">
            {{ t('auth.logout') }}
          </button>
        </div>
      </nav>
    </header>

    <main class="app-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
}

.topbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  max-width: 960px;
  margin: 0 auto;
  padding: 0 var(--space-6);
  height: 56px;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  text-decoration: none;
}

.logo__mark {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  color: #fff;
  font-weight: 600;
  font-size: var(--text-xs);
  border-radius: var(--radius-md);
}

.logo__text {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: -0.02em;
}

.topbar__nav {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  flex: 1;
}

.nav-link {
  padding: var(--space-1-5) var(--space-3);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  font-weight: 500;
  font-size: var(--text-sm);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.nav-link:hover {
  color: var(--color-text);
  background: var(--color-bg-muted);
}

.nav-link.router-link-active {
  color: var(--color-primary);
  background: var(--color-primary-subtle);
}

.topbar__user {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;
}

.avatar {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: var(--color-primary-subtle);
  font-weight: 600;
  font-size: var(--text-xs);
  color: var(--color-primary);
}

.app-main {
  flex: 1;
  width: 100%;
}

/* Pages that want centered content use this class */
.app-main :deep(.page-container) {
  max-width: 960px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
}
</style>
