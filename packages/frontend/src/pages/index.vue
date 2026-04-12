<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const { public: { appUrl } } = useRuntimeConfig()

const features = [
  { icon: '◈', color: 'purple', titleKey: 'landing.f1Title', descKey: 'landing.f1Desc' },
  { icon: '↻', color: 'orange', titleKey: 'landing.f2Title', descKey: 'landing.f2Desc' },
  { icon: '▲', color: 'teal',   titleKey: 'landing.f3Title', descKey: 'landing.f3Desc' },
]

const platforms = [
  { key: 'macos-arm',   icon: 'apple',   label: 'macOS',   sub: 'Apple Silicon',   url: null },
  { key: 'macos-intel', icon: 'apple',   label: 'macOS',   sub: 'Intel',           url: null },
  { key: 'windows',     icon: 'windows', label: 'Windows', sub: '.exe installer',  url: null },
  { key: 'linux',       icon: 'linux',   label: 'Linux',   sub: '.AppImage / .deb', url: null },
]
</script>

<template>
  <div class="lp">

    <!-- ── Hero ────────────────────────────────────────────────── -->
    <section class="hero">
      <div class="wrap hero__layout">

        <!-- Left: copy -->
        <div class="hero__copy">
          <div class="hero__badge">
            <span class="hero__dot"></span>
            {{ t('landing.badge') }}
          </div>

          <h1 class="hero__h1">
            {{ t('landing.headline') }}<br>
            <span class="hero__accent">{{ t('landing.headlineAccent') }}</span>
          </h1>

          <p class="hero__desc">{{ t('landing.description') }}</p>

          <div class="hero__actions">
            <a :href="`${appUrl}/auth/register`" class="btn btn--primary btn--xl" data-cy="hero-register">
              {{ t('auth.register') }} →
            </a>
            <a :href="`${appUrl}/auth/login`" class="btn btn--ghost btn--lg">
              {{ t('auth.login') }}
            </a>
          </div>

          <p class="hero__note">{{ t('landing.freeNote') }}</p>
        </div>

        <!-- Right: phone mockup -->
        <div class="hero__visual" aria-hidden="true">
          <div class="phone">
            <!-- Status bar -->
            <div class="phone__bar">
              <span class="phone__time">9:41</span>
              <span class="phone__icons">●●●</span>
            </div>

            <div class="phone__screen">
              <!-- App nav -->
              <div class="ms-appbar">
                <span class="ms-logo">T</span>
                <span class="ms-brand">TeachMe</span>
                <div class="ms-avatar">A</div>
              </div>

              <!-- Greeting -->
              <div class="ms-hero">
                <div class="ms-greeting">{{ t('landing.mockGreeting') }} 👋</div>
                <div class="ms-sub">{{ t('landing.mockSub') }}</div>
              </div>

              <!-- Streak / stats strip -->
              <div class="ms-strip">
                <div class="ms-strip__item">
                  <span class="ms-strip__val">🔥 7</span>
                  <span class="ms-strip__lbl">{{ t('landing.mockDays') }}</span>
                </div>
                <div class="ms-strip__sep"></div>
                <div class="ms-strip__item">
                  <span class="ms-strip__val">14</span>
                  <span class="ms-strip__lbl">{{ t('landing.mockChars') }}</span>
                </div>
                <div class="ms-strip__sep"></div>
                <div class="ms-strip__item">
                  <span class="ms-strip__val">92%</span>
                  <span class="ms-strip__lbl">{{ t('landing.mockScore') }}</span>
                </div>
              </div>

              <!-- Section label -->
              <div class="ms-section-label">{{ t('dashboard.languages') }}</div>

              <!-- Korean card -->
              <div class="ms-card ms-card--kr">
                <div class="ms-card__left">
                  <span class="ms-card__char">한</span>
                  <div>
                    <div class="ms-card__name">{{ t('languages.korean') }}</div>
                    <div class="ms-card__meta">Hangeul · Quiz · Prononciation</div>
                  </div>
                </div>
                <span class="ms-arrow">›</span>
              </div>

              <!-- Korean progress bar -->
              <div class="ms-progress">
                <div class="ms-progress__bar">
                  <div class="ms-progress__fill" style="width:35%"></div>
                </div>
                <span class="ms-progress__lbl">14 / 40 caractères</span>
              </div>

              <!-- Japanese card -->
              <div class="ms-card ms-card--jp ms-card--dim">
                <div class="ms-card__left">
                  <span class="ms-card__char ms-card__char--jp">日</span>
                  <div>
                    <div class="ms-card__name">{{ t('languages.japanese') }}</div>
                    <div class="ms-card__meta">Hiragana · Katakana · Kanji</div>
                  </div>
                </div>
                <span class="ms-badge-soon">Soon</span>
              </div>

              <!-- Continue CTA -->
              <div class="ms-cta">
                <div class="ms-cta__btn">▶ Continuer le coréen</div>
              </div>
            </div>

            <!-- Home indicator -->
            <div class="phone__home"></div>
          </div>
          <div class="phone-glow"></div>
        </div>

      </div>
    </section>

    <!-- ── Features ─────────────────────────────────────────────── -->
    <section class="feats">
      <div class="wrap">
        <p class="eyebrow">{{ t('landing.featuresEyebrow') }}</p>
        <h2 class="section-h2">{{ t('landing.featuresTitle') }}</h2>
        <div class="feats__grid">
          <div v-for="f in features" :key="f.icon" class="feat">
            <div class="feat__icon" :class="`feat__icon--${f.color}`">{{ f.icon }}</div>
            <h3 class="feat__title">{{ t(f.titleKey) }}</h3>
            <p class="feat__desc">{{ t(f.descKey) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Languages ─────────────────────────────────────────────── -->
    <section class="langs">
      <div class="wrap">
        <p class="eyebrow">{{ t('landing.langsEyebrow') }}</p>
        <h2 class="section-h2">{{ t('landing.langsTitle') }}</h2>
        <div class="langs__grid">

          <div class="lang-card lang-card--kr">
            <div class="lang-card__head">
              <span class="lang-card__script">한글</span>
              <span class="badge badge--green">{{ t('common.available') }}</span>
            </div>
            <h3 class="lang-card__name">{{ t('languages.korean') }}</h3>
            <p class="lang-card__desc">{{ t('landing.koreanDesc') }}</p>
            <ul class="lang-card__list">
              <li>{{ t('landing.koreanItem1') }}</li>
              <li>{{ t('landing.koreanItem2') }}</li>
              <li>{{ t('landing.koreanItem3') }}</li>
            </ul>
            <a :href="`${appUrl}/auth/register`" class="btn btn--primary">
              {{ t('landing.startKorean') }} →
            </a>
          </div>

          <div class="lang-card lang-card--jp lang-card--soon">
            <div class="lang-card__head">
              <span class="lang-card__script">日本語</span>
              <span class="badge badge--muted">{{ t('common.soon') }}</span>
            </div>
            <h3 class="lang-card__name">{{ t('languages.japanese') }}</h3>
            <p class="lang-card__desc">{{ t('landing.japaneseDesc') }}</p>
            <ul class="lang-card__list">
              <li>{{ t('landing.japaneseItem1') }}</li>
              <li>{{ t('landing.japaneseItem2') }}</li>
              <li>{{ t('landing.japaneseItem3') }}</li>
            </ul>
          </div>

        </div>
      </div>
    </section>

    <!-- ── Download ──────────────────────────────────────────────── -->
    <section id="download" class="dl">
      <div class="wrap">
        <p class="eyebrow">{{ t('landing.dlEyebrow') }}</p>
        <h2 class="section-h2">{{ t('landing.dlTitle') }}</h2>
        <p class="dl__sub">{{ t('landing.dlDesc') }}</p>

        <div class="dl__platforms">
          <a
            v-for="p in platforms"
            :key="p.key"
            :href="p.url ?? undefined"
            :aria-disabled="!p.url"
            class="dl__btn"
            :class="{ 'dl__btn--disabled': !p.url }"
            :tabindex="p.url ? 0 : -1"
          >
            <!-- Apple -->
            <svg v-if="p.icon === 'apple'" class="dl__icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <!-- Windows -->
            <svg v-else-if="p.icon === 'windows'" class="dl__icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 12V6.75l6-1.32v6.57H3zm17 0V5.25L11 3.44V12h9zM3 13h6v6.57l-6-1.32V13zm17 0h-9v8.56L20 19.75V13z"/>
            </svg>
            <!-- Linux -->
            <svg v-else-if="p.icon === 'linux'" class="dl__icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H9v-2h2v2zm4 0h-2v-2h2v2zm1-4H8c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1h8c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1z"/>
            </svg>

            <div class="dl__info">
              <span class="dl__platform">{{ p.label }}</span>
              <span class="dl__arch">{{ p.sub }}</span>
            </div>

            <span v-if="!p.url" class="dl__soon">{{ t('common.soon') }}</span>
            <svg v-else class="dl__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 16l-4-4h3V8h2v4h3l-4 4z"/>
            </svg>
          </a>
        </div>

        <p class="dl__note">{{ t('landing.dlNote') }}</p>
      </div>
    </section>

    <!-- ── CTA ──────────────────────────────────────────────────── -->
    <section class="cta">
      <div class="wrap cta__inner">
        <h2 class="cta__title">{{ t('landing.ctaTitle') }}</h2>
        <p class="cta__desc">{{ t('landing.ctaDesc') }}</p>
        <a :href="`${appUrl}/auth/register`" class="btn btn--primary btn--xl">
          {{ t('auth.register') }} →
        </a>
        <p class="hero__note">{{ t('landing.freeNote') }}</p>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* ── Layout helpers ───────────────────────────────────────────── */
.wrap { max-width: 1160px; margin: 0 auto; padding: 0 var(--space-8); }
.eyebrow {
  font-size: var(--text-xs); font-weight: 700; text-transform: uppercase;
  letter-spacing: .1em; color: var(--color-primary); margin-bottom: var(--space-3);
}
.section-h2 {
  font-size: clamp(1.75rem, 3vw, 2.25rem); font-weight: 800;
  letter-spacing: -.03em; color: var(--color-text); margin-bottom: var(--space-10);
}

/* ── Hero ─────────────────────────────────────────────────────── */
.hero { padding: var(--space-20) 0 var(--space-24); }

.hero__layout {
  display: grid; grid-template-columns: 1fr 460px;
  align-items: center; gap: var(--space-16);
}
@media (max-width: 900px) {
  .hero__layout { grid-template-columns: 1fr; }
  .hero__visual  { display: none; }
}

.hero__copy { display: flex; flex-direction: column; gap: var(--space-5); }

.hero__badge {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-1-5) var(--space-3);
  background: var(--color-primary-subtle);
  color: var(--color-primary-light);
  border: 1px solid rgba(99,102,241,.3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; letter-spacing: .06em;
  width: fit-content;
}
.hero__dot {
  width: 6px; height: 6px; border-radius: 50%; background: var(--color-primary);
  animation: blink 2s infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

.hero__h1 {
  font-size: clamp(2.5rem, 5vw, 3.75rem);
  font-weight: 900; letter-spacing: -.04em; line-height: 1.05; color: var(--color-text);
}
.hero__accent {
  background: linear-gradient(120deg, var(--color-primary-light) 0%, var(--color-kr) 100%);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
}
.hero__desc { font-size: var(--text-lg); color: var(--color-text-muted); line-height: 1.75; max-width: 46ch; }
.hero__actions { display: flex; gap: var(--space-3); flex-wrap: wrap; }
.hero__note { font-size: var(--text-sm); color: var(--color-text-subtle); }

/* ── Phone mockup ─────────────────────────────────────────────── */
.hero__visual {
  position: relative;
  display: flex; justify-content: center; align-items: flex-start;
}

.phone {
  position: relative; z-index: 1;
  width: 260px; min-height: 560px;
  display: flex; flex-direction: column;
  background: #0b0b18;
  border: 2px solid rgba(255,255,255,.14);
  border-radius: 38px;
  box-shadow: 0 50px 100px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.05) inset, 0 0 0 6px rgba(255,255,255,.03) inset;
  overflow: hidden;
}

.phone__bar {
  flex-shrink: 0;
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 20px 6px;
  font-size: 10px; font-weight: 700; color: rgba(255,255,255,.6);
}
.phone__icons { font-size: 7px; letter-spacing: 1px; }

.phone__screen {
  flex: 1; padding: 0 14px;
  display: flex; flex-direction: column; gap: 10px;
  overflow: hidden;
}

.phone__home {
  flex-shrink: 0;
  width: 90px; height: 4px; background: rgba(255,255,255,.25);
  border-radius: 99px; margin: 10px auto 14px;
}

/* ── Mini app UI ──────────────────────────────────────────────── */
.ms-appbar { display: flex; align-items: center; gap: 6px; padding: 4px 0; }
.ms-logo {
  width: 22px; height: 22px; border-radius: 7px; flex-shrink: 0;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: #fff; font-size: 9px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
}
.ms-brand { font-size: 12px; font-weight: 700; color: rgba(255,255,255,.9); flex: 1; }
.ms-avatar {
  width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
  background: var(--color-primary-subtle); border: 1px solid rgba(99,102,241,.4);
  color: var(--color-primary-light); font-size: 10px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}

.ms-hero { padding: 4px 0 2px; }
.ms-greeting { font-size: 15px; font-weight: 800; color: #fff; }
.ms-sub { font-size: 10px; color: rgba(255,255,255,.4); margin-top: 2px; }

.ms-strip {
  display: flex; align-items: center;
  background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.07);
  border-radius: 12px; padding: 8px 10px;
}
.ms-strip__item { flex: 1; text-align: center; }
.ms-strip__val { display: block; font-size: 13px; font-weight: 800; color: #fff; }
.ms-strip__lbl { display: block; font-size: 8px; color: rgba(255,255,255,.35); text-transform: uppercase; letter-spacing: .04em; margin-top: 1px; }
.ms-strip__sep { width: 1px; height: 24px; background: rgba(255,255,255,.1); flex-shrink: 0; }

.ms-section-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: rgba(255,255,255,.3); }

.ms-card {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 12px; border-radius: 12px;
  background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.08);
}
.ms-card--kr { border-color: rgba(249,115,22,.35); background: rgba(249,115,22,.06); }
.ms-card--jp { border-color: rgba(244,63,94,.2); }
.ms-card--dim { opacity: .45; }
.ms-card__left { display: flex; align-items: center; gap: 10px; }
.ms-card__char { font-size: 24px; font-weight: 800; font-family: 'Noto Sans KR', sans-serif; line-height: 1; }
.ms-card--kr .ms-card__char { color: var(--color-kr); }
.ms-card__char--jp { color: var(--color-jp); font-family: 'Noto Sans JP', sans-serif; }
.ms-card__name { font-size: 11px; font-weight: 700; color: #fff; }
.ms-card__meta { font-size: 9px; color: rgba(255,255,255,.35); margin-top: 1px; }
.ms-arrow { font-size: 16px; color: rgba(255,255,255,.3); font-weight: 300; }
.ms-badge-soon {
  font-size: 8px; font-weight: 700; text-transform: uppercase;
  color: rgba(255,255,255,.3); background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.1); border-radius: 4px; padding: 2px 5px;
}

.ms-progress { display: flex; flex-direction: column; gap: 4px; }
.ms-progress__bar { height: 4px; background: rgba(255,255,255,.08); border-radius: 99px; overflow: hidden; }
.ms-progress__fill { height: 100%; background: var(--color-kr); border-radius: 99px; }
.ms-progress__lbl { font-size: 9px; color: rgba(249,115,22,.7); }

.ms-cta { margin-top: auto; padding: 4px 0 2px; }
.ms-cta__btn {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: #fff; font-size: 11px; font-weight: 700;
  padding: 10px; border-radius: 12px; text-align: center;
  box-shadow: 0 4px 12px rgba(99,102,241,.35);
}

.phone-glow {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 380px; height: 560px;
  background: radial-gradient(ellipse at center, rgba(99,102,241,.15) 0%, transparent 65%);
  pointer-events: none; z-index: 0;
}

/* ── Features ─────────────────────────────────────────────────── */
.feats { background: var(--color-bg-muted); border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); padding: var(--space-20) 0; }

.feats__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-5); }
@media (max-width: 700px) { .feats__grid { grid-template-columns: 1fr; } }

.feat {
  padding: var(--space-7); background: var(--color-bg-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl); display: flex; flex-direction: column; gap: var(--space-3);
  transition: transform var(--transition-base);
}
.feat:hover { transform: translateY(-3px); }
.feat__icon { width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-xl); font-size: 1.1rem; }
.feat__icon--purple { background: var(--color-primary-subtle); color: var(--color-primary-light); }
.feat__icon--orange { background: var(--color-kr-subtle); color: var(--color-kr); }
.feat__icon--teal   { background: rgba(16,185,129,.1); color: var(--color-success); }
.feat__title { font-size: var(--text-base); font-weight: 700; color: var(--color-text); }
.feat__desc  { font-size: var(--text-sm); color: var(--color-text-muted); line-height: 1.7; }

/* ── Languages ─────────────────────────────────────────────────── */
.langs { padding: var(--space-20) 0; }

.langs__grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-5); }
@media (max-width: 700px) { .langs__grid { grid-template-columns: 1fr; } }

.lang-card {
  padding: var(--space-8); background: var(--color-bg-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl); display: flex; flex-direction: column; gap: var(--space-4);
}
.lang-card--kr { border-color: rgba(249,115,22,.2); }
.lang-card--jp { border-color: rgba(244,63,94,.2); }
.lang-card--soon { opacity: .55; }

.lang-card__head { display: flex; align-items: center; justify-content: space-between; }
.lang-card__script { font-size: 2rem; font-weight: 700; }
.lang-card--kr .lang-card__script { color: var(--color-kr); }
.lang-card--jp .lang-card__script { color: var(--color-jp); }

.lang-card__name { font-size: var(--text-xl); font-weight: 800; color: var(--color-text); }
.lang-card__desc { font-size: var(--text-sm); color: var(--color-text-muted); line-height: 1.6; }

.lang-card__list { list-style: none; display: flex; flex-direction: column; gap: var(--space-2); }
.lang-card__list li {
  font-size: var(--text-sm); color: var(--color-text-secondary);
  padding-left: var(--space-4); position: relative;
}
.lang-card__list li::before { content: '→'; position: absolute; left: 0; color: var(--color-primary); }

/* ── Download ─────────────────────────────────────────────────── */
.dl { padding: var(--space-20) 0; background: var(--color-bg-surface); border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); }

.dl__sub { font-size: var(--text-base); color: var(--color-text-muted); line-height: 1.7; max-width: 52ch; margin-bottom: var(--space-10); margin-top: calc(-1 * var(--space-6)); }

.dl__platforms {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-4);
}
@media (max-width: 900px) { .dl__platforms { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .dl__platforms { grid-template-columns: 1fr; } }

.dl__btn {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  background: var(--color-bg); border: 1px solid var(--color-border);
  border-radius: var(--radius-xl); text-decoration: none;
  transition: border-color var(--transition-base), transform var(--transition-base), box-shadow var(--transition-base);
}
.dl__btn:not(.dl__btn--disabled):hover {
  border-color: var(--color-primary); transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(99,102,241,.2);
}
.dl__btn--disabled { cursor: default; opacity: .5; }

.dl__icon { width: 24px; height: 24px; flex-shrink: 0; color: var(--color-text-muted); }

.dl__info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.dl__platform { font-size: var(--text-sm); font-weight: 700; color: var(--color-text); }
.dl__arch { font-size: var(--text-xs); color: var(--color-text-subtle); }

.dl__soon {
  font-size: var(--text-xs); font-weight: 700; text-transform: uppercase;
  color: var(--color-text-subtle); background: var(--color-bg-muted);
  border: 1px solid var(--color-border); border-radius: var(--radius-sm);
  padding: 2px 6px; flex-shrink: 0;
}
.dl__arrow { width: 18px; height: 18px; flex-shrink: 0; color: var(--color-primary); }
.dl__note { margin-top: var(--space-8); font-size: var(--text-sm); color: var(--color-text-subtle); }

/* ── CTA ──────────────────────────────────────────────────────── */
.cta {
  background: linear-gradient(135deg, var(--color-primary-subtle), var(--color-bg-muted));
  border-top: 1px solid var(--color-border);
  padding: var(--space-24) 0;
}
.cta__inner {
  display: flex; flex-direction: column; align-items: center;
  gap: var(--space-5); text-align: center; max-width: 640px;
}
.cta__title { font-size: clamp(1.75rem, 3vw, 2.25rem); font-weight: 900; letter-spacing: -.03em; color: var(--color-text); }
.cta__desc  { font-size: var(--text-lg); color: var(--color-text-muted); line-height: 1.7; }
</style>
