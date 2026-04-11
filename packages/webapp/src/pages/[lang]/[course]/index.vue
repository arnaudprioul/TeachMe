<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCourseData } from '~/composables/useCourseData'
import { useCourseContext } from '~/composables/useCourseContext'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t } = useI18n()
const { lang, language, paths, tKey } = useCourseContext()
const { basicConsonants, doubleConsonants, basicVowels, compoundVowels } = useCourseData()

const course = computed(() => language.value!)
</script>

<template>
  <div class="lp" :style="{ '--cc': course.color, '--cc-s': course.colorSubtle }">

    <div class="contained bc-row">
      <Breadcrumb :items="[
        { label: t('nav.dashboard'), to: '/dashboard' },
        { label: t(`courses.${lang}.name`), to: paths.languageRoot },
        { label: t(tKey('title')) },
      ]" />
    </div>

    <!-- ════════ HERO ════════ -->
    <section class="hero">
      <div class="hero__inner">
        <div class="hero__text">
          <span class="hero__pill">{{ course.flag }} {{ t(`courses.${lang}.name`) }}</span>
          <h1>{{ t(tKey('title')) }}</h1>
          <p>{{ t(tKey('desc')) }}</p>
          <div class="hero__actions">
            <NuxtLink :to="paths.table" class="hero__ghost">{{ t(tKey('section.tableTitle')) }}</NuxtLink>
            <NuxtLink :to="paths.training" class="hero__cta">{{ t(tKey('training')) }}</NuxtLink>
          </div>
        </div>

        <div class="hero__cloud" aria-hidden="true">
          <span class="jamo" style="--x:10%;--y:8%;--s:2.8rem;--d:0s;--o:0.9">ㄱ</span>
          <span class="jamo" style="--x:55%;--y:5%;--s:2rem;--d:0.5s;--o:0.5">ㅏ</span>
          <span class="jamo" style="--x:80%;--y:15%;--s:3.2rem;--d:1.1s;--o:0.8">ㅎ</span>
          <span class="jamo" style="--x:25%;--y:30%;--s:3.5rem;--d:0.3s;--o:1">ㅗ</span>
          <span class="jamo" style="--x:65%;--y:35%;--s:2.2rem;--d:1.8s;--o:0.45">ㄴ</span>
          <span class="jamo" style="--x:5%;--y:55%;--s:2rem;--d:0.8s;--o:0.55">ㅡ</span>
          <span class="jamo" style="--x:45%;--y:55%;--s:4rem;--d:1.4s;--o:0.85">ㅣ</span>
          <span class="jamo" style="--x:85%;--y:50%;--s:2.5rem;--d:0.2s;--o:0.6">ㅂ</span>
          <span class="jamo" style="--x:30%;--y:72%;--s:2rem;--d:1s;--o:0.4">ㅈ</span>
          <span class="jamo" style="--x:70%;--y:75%;--s:3rem;--d:1.6s;--o:0.7">ㅁ</span>
          <span class="jamo" style="--x:15%;--y:85%;--s:2.5rem;--d:0.6s;--o:0.5">ㅓ</span>
          <span class="jamo" style="--x:50%;--y:88%;--s:2rem;--d:1.2s;--o:0.35">ㄹ</span>
          <span class="jamo" style="--x:90%;--y:82%;--s:2.2rem;--d:0.9s;--o:0.55">ㅅ</span>
          <span class="jamo" style="--x:40%;--y:15%;--s:1.8rem;--d:2s;--o:0.3">ㅜ</span>
        </div>
      </div>
    </section>

    <!-- ════════ STORY — editorial ════════ -->
    <section class="story" id="story">
      <div class="story__inner contained">
        <div class="story__lead">
          <span class="story__eyebrow">1443 — King Sejong the Great</span>
          <h2>{{ t(tKey('section.introP1')).split('.')[0] }}.</h2>
        </div>
        <div class="story__cols">
          <div class="story__col">
            <p>{{ t(tKey('section.introP1')).split('. ').slice(1).join('. ') }}</p>
          </div>
          <div class="story__col">
            <p>{{ t(tKey('section.introP2')) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════ QUOTE — full-width ════════ -->
    <section class="quote-section">
      <div class="quote-section__inner contained">
        <div class="quote-section__mark" aria-hidden="true">"</div>
        <blockquote>
          <p>{{ t(tKey('section.introP3')) }}</p>
        </blockquote>
        <div class="quote-section__tag">
          <span class="quote-section__hanja">훈민정음</span>
          <span>Hunminjeongeum, 1446</span>
        </div>
      </div>
    </section>

    <!-- ════════ JAMO SHAPES — full-width grey, contained content ════════ -->
    <section class="band band--muted">
      <div class="contained">
        <span class="chip chip--cool">{{ t(tKey('section.jamoTitle')) }}</span>
        <h2 class="band__title">{{ t(tKey('section.jamoConsonantTitle')) }}</h2>
        <p class="band__sub">{{ t(tKey('section.jamoP1')) }}</p>

        <div class="shape-row">
          <div class="shape-pill" v-for="item in t(tKey('section.jamoConsonantList')).split(' | ')" :key="item">
            <span class="shape-pill__char">{{ item.split(' ')[0] }}</span>
            <span class="shape-pill__text">{{ item.split(': ').slice(1).join(': ') }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════ COSMOLOGY — contained, 3 cards ════════ -->
    <section class="contained cosmo">
      <h2>{{ t(tKey('section.jamoCosmologyTitle')) }}</h2>
      <p class="cosmo__sub">{{ t(tKey('section.jamoCosmologyP1')) }}</p>

      <div class="cosmo__grid">
        <div class="cosmo__card cosmo__card--sky">
          <span class="cosmo__sym">·</span>
          <span class="cosmo__label">{{ t(tKey('section.jamoCosmologyHeaven')) }}</span>
        </div>
        <div class="cosmo__card cosmo__card--earth">
          <span class="cosmo__sym">ㅡ</span>
          <span class="cosmo__label">{{ t(tKey('section.jamoCosmologyEarth')) }}</span>
        </div>
        <div class="cosmo__card cosmo__card--human">
          <span class="cosmo__sym">ㅣ</span>
          <span class="cosmo__label">{{ t(tKey('section.jamoCosmologyHuman')) }}</span>
        </div>
      </div>

      <div class="eq-row">
        <span class="eq">ㅣ + · = <strong>ㅏ</strong> <small>(a)</small></span>
        <span class="eq">· + ㅣ = <strong>ㅓ</strong> <small>(eo)</small></span>
        <span class="eq">· + ㅡ = <strong>ㅗ</strong> <small>(o)</small></span>
        <span class="eq">ㅡ + · = <strong>ㅜ</strong> <small>(u)</small></span>
      </div>
    </section>

    <!-- ════════ CONSONANTS — full-width warm band, cards ════════ -->
    <section class="band band--warm">
      <div class="contained">
        <span class="chip chip--warm">{{ t(tKey('section.consonantsTitle')) }}</span>
        <h2 class="band__title">{{ t(tKey('basicConsonants')) }} <span class="light">({{ basicConsonants.length }})</span></h2>
        <p class="band__sub">{{ t(tKey('section.consonantsIntro')) }}</p>

        <div class="char-cards">
          <NuxtLink v-for="c in basicConsonants" :key="c.id" :to="paths.practice(c.id)" class="cc">
            <span class="cc__sym" :style="{ color: course.color }">{{ c.symbol }}</span>
            <span class="cc__rom">{{ c.romanization }}</span>
            <span class="cc__name">{{ c.name }}</span>
          </NuxtLink>
        </div>

        <h3 class="mt">{{ t(tKey('doubleConsonants')) }} <span class="light">({{ doubleConsonants.length }})</span></h3>
        <p class="band__sub">{{ t(tKey('section.doubleConsonantsIntro')) }}</p>
        <div class="char-cards char-cards--sm">
          <NuxtLink v-for="c in doubleConsonants" :key="c.id" :to="paths.practice(c.id)" class="cc">
            <span class="cc__sym" :style="{ color: course.color }">{{ c.symbol }}</span>
            <span class="cc__rom">{{ c.romanization }}</span>
            <span class="cc__name">{{ c.name }}</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ════════ VOWELS — contained, clean white ════════ -->
    <section class="contained vowels-section">
      <span class="chip chip--cool">{{ t(tKey('section.vowelsTitle')) }}</span>
      <h2>{{ t(tKey('basicVowels')) }} <span class="light">({{ basicVowels.length }})</span></h2>
      <p class="section-intro">{{ t(tKey('section.vowelsIntro')) }}</p>

      <div class="char-cards">
        <NuxtLink v-for="c in basicVowels" :key="c.id" :to="paths.practice(c.id)" class="cc">
          <span class="cc__sym" style="color: var(--color-primary)">{{ c.symbol }}</span>
          <span class="cc__rom">{{ c.romanization }}</span>
          <span class="cc__name">{{ c.name }}</span>
        </NuxtLink>
      </div>

      <h3 class="mt">{{ t(tKey('compoundVowels')) }} <span class="light">({{ compoundVowels.length }})</span></h3>
      <p class="section-intro">{{ t(tKey('section.compoundVowelsIntro')) }}</p>
      <div class="char-cards char-cards--sm">
        <NuxtLink v-for="c in compoundVowels" :key="c.id" :to="paths.practice(c.id)" class="cc">
          <span class="cc__sym" style="color: var(--color-primary)">{{ c.symbol }}</span>
          <span class="cc__rom">{{ c.romanization }}</span>
          <span class="cc__name">{{ c.name }}</span>
        </NuxtLink>
      </div>
    </section>

    <!-- ════════ SILENT ㅇ RULE — full-width indigo band ════════ -->
    <section class="band band--indigo">
      <div class="rule-demo">
        <span class="rule-demo__c">ㅇ</span>
        <span class="rule-demo__op">+</span>
        <span class="rule-demo__c">ㅏ</span>
        <span class="rule-demo__op">=</span>
        <span class="rule-demo__c rule-demo__c--bright">아</span>
      </div>
      <p class="rule-demo__text">{{ t(tKey('section.silentIeungRule')) }}</p>
    </section>

    <!-- ════════ SYLLABLES — contained, split visual/text (reversed) ════════ -->
    <section class="contained split split--rev">
      <div class="split__text">
        <span class="chip chip--green">{{ t(tKey('section.syllablesTitle')) }}</span>
        <h2>{{ t(tKey('section.syllablesIntro')).split(':')[0] }}</h2>
        <p>{{ t(tKey('section.syllablesBlockExplanation')) }}</p>
      </div>
      <div class="split__diagrams">
        <div class="dg">
          <span class="dg__label">{{ t(tKey('section.cvPattern')) }}</span>
          <SyllableBlockDiagram mode="cv" :example="{ initial: 'ㄱ', medial: 'ㅏ', result: '가', romanization: 'ga' }" />
        </div>
        <div class="dg">
          <span class="dg__label">{{ t(tKey('section.cvcPattern')) }}</span>
          <SyllableBlockDiagram mode="cvc" :example="{ initial: 'ㅎ', medial: 'ㅏ', final: 'ㄴ', result: '한', romanization: 'han' }" />
        </div>
      </div>
    </section>

    <!-- ════════ CTAs — Full table + Training ════════ -->
    <section class="cta-section">
      <div class="contained cta-grid">
        <NuxtLink :to="paths.table" class="cta">
          <div class="cta__mosaic" aria-hidden="true">
            <span v-for="c in ['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ','ㅏ','ㅓ']" :key="c">{{ c }}</span>
          </div>
          <div class="cta__body">
            <h3>{{ t(tKey('section.tableTitle')) }}</h3>
            <p>{{ t(tKey('section.tableDesc')) }}</p>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </NuxtLink>

        <NuxtLink :to="paths.training" class="cta cta--training">
          <div class="cta__icon-wrap">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
          </div>
          <div class="cta__body">
            <h3>{{ t(tKey('training')) }}</h3>
            <p>{{ t(tKey('trainingDesc')) }}</p>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.lp { display: flex; flex-direction: column; }

/* ── Utility ── */
.contained { max-width: 960px; margin: 0 auto; width: 100%; padding: 0 var(--space-6); }
.bc-row { padding-top: var(--space-4); padding-bottom: 0; }

.chip {
  display: inline-block; padding: 3px var(--space-3); border-radius: var(--radius-full);
  font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em;
}
.chip--warm { background: #fff4e0; color: #b45309; }
.chip--cool { background: #eef2ff; color: #4338ca; }
.chip--green { background: #dcfce7; color: #15803d; }
.light { font-weight: 400; color: var(--color-text-muted); }
.mt { margin-top: var(--space-8); font-size: var(--text-base); font-weight: 600; color: var(--color-text); }
.section-intro { font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.7; margin: var(--space-2) 0 var(--space-4); max-width: 540px; }

/* ══════════ HERO ══════════ */
.hero {
  padding: var(--space-16) var(--space-6) var(--space-12);
  background: linear-gradient(160deg, var(--color-bg) 40%, var(--cc-s) 100%);
  overflow: hidden;
}

.hero__inner {
  display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6);
  align-items: center; max-width: 1000px; margin: 0 auto;
}

.hero__text { display: flex; flex-direction: column; gap: var(--space-4); }

.hero__pill {
  display: inline-flex; align-items: center; gap: var(--space-2); width: fit-content;
  padding: var(--space-1-5) var(--space-3); border-radius: var(--radius-full);
  background: var(--cc-s); font-size: var(--text-xs); font-weight: 600; color: var(--cc);
}

.hero__text h1 {
  font-size: clamp(2.2rem, 4.5vw, 3.2rem); font-weight: 700; color: var(--color-text);
  letter-spacing: -0.04em; line-height: 1.1;
}

.hero__text p {
  font-size: var(--text-base); color: var(--color-text-muted);
  line-height: 1.6; max-width: 380px;
}

.hero__actions { display: flex; gap: var(--space-3); margin-top: var(--space-2); }

.hero__cta {
  padding: 0.6rem 1.5rem; border-radius: var(--radius-lg);
  background: var(--color-primary); color: #fff;
  font-size: var(--text-sm); font-weight: 500; text-decoration: none;
  transition: opacity 150ms;
}
.hero__cta:hover { opacity: 0.85; }

.hero__ghost {
  padding: 0.6rem 1.5rem; border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-strong); background: transparent;
  color: var(--color-text-secondary);
  font-size: var(--text-sm); font-weight: 500; text-decoration: none;
  transition: background 150ms;
}
.hero__ghost:hover { background: var(--color-bg-muted); }

/* Jamo cloud */
.hero__cloud {
  position: relative; width: 100%; min-height: 360px;
}

.jamo {
  position: absolute;
  left: var(--x); top: var(--y);
  font-family: var(--font-cjk-kr);
  font-size: var(--s);
  font-weight: 700;
  color: var(--cc);
  opacity: var(--o);
  animation: jamo-float 5s ease-in-out infinite;
  animation-delay: var(--d);
  pointer-events: none;
  user-select: none;
}

@keyframes jamo-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

/* ══════════ STORY ══════════ */
.story {
  padding: var(--space-16) 0;
}
.story__inner {
  display: flex; flex-direction: column; gap: var(--space-8);
}
.story__lead {
  display: flex; flex-direction: column; gap: var(--space-3);
}
.story__eyebrow {
  font-size: var(--text-xs); font-weight: 600; color: var(--cc);
  text-transform: uppercase; letter-spacing: 0.08em;
}
.story__lead h2 {
  font-size: var(--text-2xl); font-weight: 600; color: var(--color-text);
  line-height: 1.3; letter-spacing: -0.02em; max-width: 600px;
}
.story__cols {
  display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-8);
}
.story__col p {
  font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.8;
}

/* ══════════ QUOTE ══════════ */
.quote-section {
  padding: var(--space-16) 0;
  background: var(--color-primary-subtle);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}
.quote-section__inner {
  display: flex; flex-direction: column; align-items: center; text-align: center; gap: var(--space-5);
}
.quote-section__mark {
  font-size: 5rem; font-weight: 800; color: var(--color-primary); opacity: 0.15;
  line-height: 0.6; font-family: Georgia, serif;
}
.quote-section blockquote p {
  font-size: var(--text-lg); color: var(--color-text);
  font-style: italic; font-weight: 400; max-width: 580px;
  line-height: 1.7;
}
.quote-section__tag {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  margin-top: var(--space-2);
}
.quote-section__hanja {
  font-size: var(--text-base); font-family: var(--font-cjk-kr);
  color: var(--color-primary); letter-spacing: 0.15em; opacity: 0.6;
}
.quote-section__tag span:last-child {
  font-size: var(--text-xs); color: var(--color-text-subtle);
}

/* ══════════ SPLIT ══════════ */
.split {
  display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-10);
  align-items: center; padding-top: var(--space-16); padding-bottom: var(--space-16);
}
.split--rev { direction: rtl; }
.split--rev > * { direction: ltr; }
.split__text { display: flex; flex-direction: column; gap: var(--space-3); }
.split__text h2 { font-size: var(--text-xl); font-weight: 600; color: var(--color-text); line-height: 1.3; }
.split__text p { font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.7; }

.split__diagrams {
  display: flex; flex-direction: column; gap: var(--space-5);
  background: var(--color-bg-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl); padding: var(--space-6);
}
.dg { display: flex; flex-direction: column; gap: var(--space-2); }
.dg__label { font-size: var(--text-xs); font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; }

/* ══════════ BANDS (full-width) ══════════ */
.band { padding: var(--space-12) var(--space-6); }
.band--muted { background: #f8f9fb; }
.band--warm { background: linear-gradient(180deg, #fffbf5, #fff7ed); }
.band--indigo { background: linear-gradient(135deg, #4338ca, #6366f1); text-align: center; padding: var(--space-10) var(--space-6); }

.band__title { font-size: var(--text-xl); font-weight: 600; color: var(--color-text); margin-top: var(--space-2); }
.band__sub { font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.7; margin-top: var(--space-2); max-width: 540px; }

/* ══════════ SHAPES (jamo) ══════════ */
.shape-row {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-3); margin-top: var(--space-6);
}
.shape-pill {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-3) var(--space-4); background: #fff;
  border-radius: var(--radius-lg); border: 1px solid var(--color-border);
}
.shape-pill__char {
  font-size: 1.75rem; font-family: var(--font-cjk-kr); font-weight: 600;
  color: #4338ca; width: 32px; text-align: center; flex-shrink: 0;
}
.shape-pill__text { font-size: var(--text-xs); color: var(--color-text-muted); line-height: 1.5; }

/* ══════════ COSMOLOGY ══════════ */
.cosmo { padding-top: var(--space-16); padding-bottom: var(--space-12); text-align: center; }
.cosmo h2 { font-size: var(--text-xl); font-weight: 600; color: var(--color-text); }
.cosmo__sub { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: var(--space-2); max-width: 480px; margin-inline: auto; line-height: 1.6; }
.cosmo__grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4);
  max-width: 540px; margin: var(--space-8) auto 0;
}
.cosmo__card {
  padding: var(--space-6) var(--space-4); border-radius: var(--radius-xl);
  display: flex; flex-direction: column; align-items: center; gap: var(--space-2);
}
.cosmo__card--sky   { background: #dbeafe; }
.cosmo__card--earth { background: #dcfce7; }
.cosmo__card--human { background: #fef9c3; }
.cosmo__sym { font-size: 3rem; font-family: var(--font-cjk-kr); font-weight: 600; line-height: 1; }
.cosmo__card--sky   .cosmo__sym { color: #2563eb; }
.cosmo__card--earth .cosmo__sym { color: #16a34a; }
.cosmo__card--human .cosmo__sym { color: #ca8a04; }
.cosmo__label { font-size: var(--text-xs); color: var(--color-text-secondary); line-height: 1.4; }

.eq-row {
  display: flex; flex-wrap: wrap; justify-content: center; gap: var(--space-3);
  margin-top: var(--space-8);
}
.eq {
  padding: var(--space-2) var(--space-4); background: var(--color-bg-muted);
  border-radius: var(--radius-full); font-family: var(--font-cjk-kr);
  font-size: 1.1rem; color: var(--color-text-muted); white-space: nowrap;
}
.eq strong { color: var(--color-primary); font-weight: 700; }
.eq small { font-size: var(--text-xs); font-family: var(--font-body); color: var(--color-text-subtle); }

/* ══════════ CHAR CARDS ══════════ */
.char-cards {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: var(--space-3); margin-top: var(--space-4);
}
.char-cards--sm { grid-template-columns: repeat(auto-fill, minmax(88px, 1fr)); }

.cc {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: var(--space-4) var(--space-2);
  background: var(--color-bg-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-xl); text-decoration: none;
  transition: all 150ms ease; cursor: pointer;
}
.cc:hover { border-color: var(--color-border-strong); box-shadow: var(--shadow-md); transform: translateY(-2px); }
.cc__sym { font-size: 2.2rem; font-weight: 600; font-family: var(--font-cjk-kr); line-height: 1; }
.cc__rom { font-size: var(--text-xs); color: var(--color-text-muted); font-weight: 500; }
.cc__name { font-size: 0.6rem; color: var(--color-text-subtle); }

/* ══════════ VOWELS SECTION ══════════ */
.vowels-section { padding-top: var(--space-16); padding-bottom: var(--space-10); }
.vowels-section h2 { font-size: var(--text-xl); font-weight: 600; color: var(--color-text); margin-top: var(--space-2); }

/* ══════════ RULE (ㅇ) ══════════ */
.rule-demo {
  display: flex; align-items: center; justify-content: center; gap: var(--space-3);
  margin-bottom: var(--space-4);
}
.rule-demo__c {
  font-size: 3rem; font-family: var(--font-cjk-kr); font-weight: 600; color: rgba(255,255,255,0.6); line-height: 1;
}
.rule-demo__c--bright { color: #fff; font-weight: 800; }
.rule-demo__op { font-size: var(--text-xl); color: rgba(255,255,255,0.3); }
.rule-demo__text { font-size: var(--text-sm); color: rgba(255,255,255,0.85); max-width: 460px; margin: 0 auto; line-height: 1.6; }

/* ══════════ CTA ══════════ */
.cta-section { padding: var(--space-8) 0 var(--space-16); }
.cta-grid { display: flex; flex-direction: column; gap: var(--space-3); }
.cta--training { border-color: var(--color-primary); }
.cta--training:hover { border-color: var(--color-primary-dark); box-shadow: var(--shadow-lg); }
.cta__icon-wrap {
  width: 48px; height: 48px; border-radius: var(--radius-xl);
  background: var(--color-primary-subtle); color: var(--color-primary);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.cta {
  display: flex; align-items: center; gap: var(--space-5);
  padding: var(--space-6); background: var(--color-bg-surface);
  border: 1px solid var(--color-border); border-radius: var(--radius-2xl);
  text-decoration: none; transition: all 150ms ease;
}
.cta:hover { border-color: var(--cc); box-shadow: var(--shadow-lg); }
.cta__mosaic {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 3px;
  width: 72px; flex-shrink: 0;
  font-family: var(--font-cjk-kr); font-size: 0.6rem; font-weight: 500; color: var(--cc);
}
.cta__mosaic span {
  width: 16px; height: 16px; display: flex; align-items: center; justify-content: center;
  background: var(--cc-s); border-radius: 3px;
}
.cta__body { flex: 1; }
.cta__body h3 { font-size: var(--text-base); font-weight: 600; color: var(--color-text); }
.cta__body p { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: 2px; }
.cta svg { color: var(--color-text-subtle); flex-shrink: 0; }

/* ══════════ RESPONSIVE ══════════ */
@media (max-width: 640px) {
  .split { grid-template-columns: 1fr; gap: var(--space-6); padding-top: var(--space-10); padding-bottom: var(--space-10); }
  .split--rev { direction: ltr; }
  .hero__inner { grid-template-columns: 1fr; }
  .hero__cloud { min-height: 220px; }
  .story__cols { grid-template-columns: 1fr; gap: var(--space-4); }
  .cosmo__grid { grid-template-columns: 1fr; max-width: 200px; }
  .hero { padding: var(--space-16) var(--space-6) var(--space-10); }
  .hero h1 { font-size: var(--text-2xl); }
  .hero__scatter span { font-size: 2rem; }
  .eq-row { flex-direction: column; align-items: center; }
  .shape-row { grid-template-columns: 1fr; }
  .rule-demo__c { font-size: 2rem; }
}
</style>
