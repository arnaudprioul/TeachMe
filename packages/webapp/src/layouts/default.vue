<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth.store'
import { useTheme, type ThemeMode } from '~/composables/useTheme'
const { t } = useI18n()
const auth = useAuthStore()
const { mode, setTheme } = useTheme()

const menuOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

function cycleTheme() {
  const order: ThemeMode[] = ['system', 'light', 'dark']
  const i = order.indexOf(mode.value)
  setTheme(order[(i + 1) % order.length])
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function onClickOutside(e: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    menuOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))

async function logout() {
  closeMenu()
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
          <!-- Theme toggle -->
          <button class="theme-toggle" :aria-label="mode" @click="cycleTheme" data-cy="theme-toggle">
            <svg v-if="mode === 'light'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            <svg v-else-if="mode === 'dark'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          </button>

          <!-- User menu -->
          <div class="user-menu" ref="menuRef">
            <button
              class="avatar"
              :aria-label="auth.user?.username"
              :aria-expanded="menuOpen"
              data-cy="btn-avatar"
              @click="toggleMenu"
            >
              {{ auth.user?.username?.[0]?.toUpperCase() }}
            </button>

            <div v-if="menuOpen" class="dropdown">
              <div class="dropdown__header">
                <div class="dropdown__name">{{ auth.user?.username }}</div>
                <div v-if="auth.user?.email" class="dropdown__email">{{ auth.user.email }}</div>
              </div>
              <div class="dropdown__divider" />
              <NuxtLink to="/profile" class="dropdown__item" data-cy="menu-profile" @click="closeMenu">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                {{ t('profile.title') }}
              </NuxtLink>
              <NuxtLink to="/vocabulary" class="dropdown__item" data-cy="menu-vocabulary" @click="closeMenu">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                {{ t('vocabulary.title') }}
              </NuxtLink>
              <div class="dropdown__divider" />
              <button class="dropdown__item dropdown__item--danger" data-cy="menu-logout" @click="logout">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                {{ t('auth.logout') }}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <main class="app-main">
      <slot />
    </main>

    <ToastContainer />
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
  background: color-mix(in srgb, var(--color-bg-surface) 80%, transparent);
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

.theme-toggle {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: var(--color-bg-surface);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.theme-toggle:hover {
  color: var(--color-text);
  border-color: var(--color-border-strong);
}

/* User menu */
.user-menu {
  position: relative;
}

.avatar {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: var(--color-primary-subtle);
  font-weight: 600;
  font-size: var(--text-xs);
  color: var(--color-primary);
  border: none;
  cursor: pointer;
  transition: filter var(--transition-fast);
}
.avatar:hover { filter: brightness(0.92); }

/* Dropdown */
.dropdown {
  position: absolute;
  top: calc(100% + var(--space-2));
  right: 0;
  min-width: 220px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--space-2);
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 100;
  animation: dropdown-in 150ms ease-out;
}

@keyframes dropdown-in {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.dropdown__header {
  padding: var(--space-3) var(--space-3) var(--space-2);
}

.dropdown__name {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text);
}

.dropdown__email {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-top: 2px;
}

.dropdown__divider {
  height: 1px;
  background: var(--color-border);
  margin: var(--space-1) 0;
}

.dropdown__item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  border: none;
  background: transparent;
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: all var(--transition-fast);
}

.dropdown__item:hover {
  background: var(--color-bg-muted);
  color: var(--color-text);
}

.dropdown__item svg {
  flex-shrink: 0;
  color: var(--color-text-muted);
}

.dropdown__item--danger { color: var(--color-error); }
.dropdown__item--danger svg { color: var(--color-error); }
.dropdown__item--danger:hover { background: var(--color-error-subtle); color: var(--color-error); }

.app-main {
  flex: 1;
  width: 100%;
}

/* Pages that want centered content use this class.
   `width: 100%` is the important bit: without it the container would
   shrink to the width of its widest child (max-content sizing on a flex
   column parent), so a page like /practice/[id] would visually jump
   between, say, 595px and 856px depending on which character is
   displayed. With `width: 100%` the container always claims the full
   available column width, capped at 960px. */
.app-main :deep(.page-container) {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
  box-sizing: border-box;
}
</style>
