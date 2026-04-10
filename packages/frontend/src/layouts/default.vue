<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const { public: { appUrl } } = useRuntimeConfig()
</script>

<template>
  <div class="shell">
    <header class="topbar">
      <div class="topbar__inner">
        <a :href="appUrl" class="logo">
          <span class="logo__mark">T</span>
          <span class="logo__name">TeachMe</span>
        </a>

        <nav class="topbar__nav">
          <a href="#download" class="topbar__dl-link">{{ t('nav.download') }}</a>
          <a :href="`${appUrl}/auth/login`"    class="btn btn--ghost btn--sm">{{ t('auth.login') }}</a>
          <a :href="`${appUrl}/auth/register`" class="btn btn--primary btn--sm">{{ t('auth.register') }}</a>
        </nav>
      </div>
    </header>

    <main class="shell__main">
      <slot />
    </main>

    <footer class="footer">
      <div class="footer__inner">
        <span class="footer__brand">TeachMe</span>
        <span class="footer__copy">© {{ new Date().getFullYear() }} · Learn languages, the smart way</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.shell { min-height: 100vh; display: flex; flex-direction: column; background: var(--color-bg); }
.shell__main { flex: 1; }

/* ── Topbar ───────────────────────────────────────────────────── */
.topbar {
  position: sticky; top: 0; z-index: 50;
  background: rgba(10,10,20,.85);
  backdrop-filter: blur(16px) saturate(1.5);
  -webkit-backdrop-filter: blur(16px) saturate(1.5);
  border-bottom: 1px solid var(--color-border);
}

.topbar__inner {
  display: flex; align-items: center; justify-content: space-between;
  max-width: 1160px; margin: 0 auto;
  padding: 0 var(--space-8);
  height: 60px;
}

@media (max-width: 480px) {
  .topbar__inner { padding: 0 var(--space-4); }
}

/* Logo */
.logo { display: flex; align-items: center; gap: var(--space-2); text-decoration: none; flex-shrink: 0; }
.logo__mark {
  width: 30px; height: 30px; border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: #fff; font-size: var(--text-xs); font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  box-shadow: var(--shadow-primary);
}
.logo__name {
  font-size: var(--text-base); font-weight: 700;
  color: var(--color-text); letter-spacing: -.02em;
}

/* Nav */
.topbar__nav { display: flex; align-items: center; gap: var(--space-3); }
.topbar__dl-link {
  font-size: var(--text-sm); font-weight: 600; color: var(--color-text-muted);
  text-decoration: none; transition: color var(--transition-fast);
}
.topbar__dl-link:hover { color: var(--color-text); }
@media (max-width: 540px) { .topbar__dl-link { display: none; } }

/* ── Footer ───────────────────────────────────────────────────── */
.footer {
  border-top: 1px solid var(--color-border);
  padding: var(--space-6) var(--space-8);
}
.footer__inner {
  max-width: 1160px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  gap: var(--space-4); flex-wrap: wrap;
}
.footer__brand { font-size: var(--text-sm); font-weight: 700; color: var(--color-text-muted); }
.footer__copy  { font-size: var(--text-xs); color: var(--color-text-subtle); }
</style>
