<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { LESSON_CONTENT_TYPE, PRACTICE_MODE } from '~/composables/data/courses/lesson-types'
import type { ILessonContentBlock, IPracticeInlineItem } from '~/composables/data/courses/lesson-types'
import { useCourseAudio } from '~/composables/useCourseAudio'

defineProps<{ block: ILessonContentBlock }>()
const { t } = useI18n()
const { speak } = useCourseAudio()

// ── REVEAL mode: track which prompts have been clicked open ──
const revealed = ref<Set<number>>(new Set())
function toggleReveal(idx: number) {
  if (revealed.value.has(idx)) revealed.value.delete(idx)
  else revealed.value.add(idx)
}

// ── SELECT mode: track which option is selected per item ──
const selected = ref<Record<number, number>>({}) // itemIdx -> optionIdx

// ── WRITE mode: track typed input per item + validation result ──
const inputs = ref<Record<number, string>>({})
const writeValidated = ref<Record<number, boolean | null>>({}) // null=not yet, true=correct, false=wrong

function modeOf(item: IPracticeInlineItem): PRACTICE_MODE {
  return item.mode ?? PRACTICE_MODE.REVEAL
}

function isOptionCorrect(item: IPracticeInlineItem, optionIdx: number): boolean {
  if (!item.options) return false
  const expected = t(item.answerKey).trim().toLowerCase()
  const actual = t(item.options[optionIdx].labelKey).trim().toLowerCase()
  return expected === actual
}

function checkWrite(item: IPracticeInlineItem, idx: number) {
  const raw = (inputs.value[idx] ?? '').trim()
  if (!raw) return
  const expected = t(item.answerKey).trim().toLowerCase()
  const accepted = (item.acceptedAnswers ?? []).map(a => a.trim().toLowerCase())
  const ok = raw.toLowerCase() === expected || accepted.includes(raw.toLowerCase())
  writeValidated.value[idx] = ok
}

function speakAndReveal(item: IPracticeInlineItem, idx: number) {
  const text = item.speakText ?? t(item.answerKey)
  speak(text)
  // Auto-reveal after the first click so user sees the answer below
  if (!revealed.value.has(idx)) revealed.value.add(idx)
}
</script>

<template>
  <!-- ═══ TEXT ═══ -->
  <section v-if="block.type === LESSON_CONTENT_TYPE.TEXT" class="blk blk-text">
    <div class="contain contain--text">
      <p>{{ t(block.textKey!) }}</p>
    </div>
  </section>

  <!-- ═══ EXAMPLE (single or group — unified design) ═══ -->
  <section
    v-else-if="(block.type === LESSON_CONTENT_TYPE.EXAMPLE && block.example) || (block.type === LESSON_CONTENT_TYPE.EXAMPLE_GROUP && block.examples)"
    class="blk blk-exg"
  >
    <div class="contain">
      <div class="blk-exg__list">
        <div
          v-for="(ex, i) in (block.type === LESSON_CONTENT_TYPE.EXAMPLE ? [block.example!] : block.examples!)"
          :key="i" class="blk-exg__item"
        >
          <span class="blk-exg__num">{{ i + 1 }}</span>
          <div class="blk-exg__body">
            <span class="blk-exg__kr">{{ ex.sentence }}</span>
            <span class="blk-exg__sub">{{ ex.romanization }} — <em>{{ t(ex.translationKey) }}</em></span>
          </div>
          <AudioButton :text="ex.sentence" />
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ RULE ═══ -->
  <section v-else-if="block.type === LESSON_CONTENT_TYPE.RULE && block.rule" class="blk blk-rule">
    <div class="contain">
      <div class="blk-rule__split">
        <div class="blk-rule__left">
          <span class="blk-rule__chip">{{ t('lessonPage.pattern') }}</span>
          <span class="blk-rule__pattern">{{ t(block.rule.patternKey) }}</span>
        </div>
        <div class="blk-rule__right">
          <p class="blk-rule__explain">{{ t(block.rule.explanationKey) }}</p>
          <div v-if="block.rule.examples.length" class="blk-rule__exs">
            <div v-for="(ex, i) in block.rule.examples" :key="i" class="blk-rule__ex">
              <span class="blk-rule__ex-kr">{{ ex.sentence }}</span>
              <span class="blk-rule__ex-tl">{{ ex.romanization }} — <em>{{ t(ex.translationKey) }}</em></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ DIALOGUE ═══ -->
  <section v-else-if="block.type === LESSON_CONTENT_TYPE.DIALOGUE && block.dialogue" class="blk blk-dlg">
    <div class="contain contain--narrow">
      <div class="blk-dlg__thread">
        <div v-for="(line, i) in block.dialogue" :key="i" class="msg" :class="i % 2 === 0 ? 'msg--l' : 'msg--r'">
          <span class="msg__name">{{ line.speaker }}</span>
          <div class="msg__bubble">
            <span class="msg__kr">{{ line.sentence }}</span>
            <span class="msg__rom">{{ line.romanization }}</span>
            <span class="msg__tl">{{ t(line.translationKey) }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ TIP — full-bleed left-aligned ═══ -->
  <section v-else-if="block.type === LESSON_CONTENT_TYPE.TIP" class="blk blk-tip">
    <div class="blk-tip__band">
      <div class="contain">
        <div class="blk-tip__inner">
          <div class="blk-tip__icon">💡</div>
          <div class="blk-tip__body">
            <span class="blk-tip__label">{{ t('lessonPage.tip') }}</span>
            <p>{{ t(block.textKey!) }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ GRAMMAR BOARD ═══ -->
  <section v-else-if="block.type === LESSON_CONTENT_TYPE.GRAMMAR_BOARD && block.board" class="blk blk-board">
    <div class="contain">
      <div v-for="(structure, si) in block.board.structures" :key="si" class="blk-board__row">
        <div class="blk-board__chips">
          <div v-for="(part, pi) in structure.parts" :key="pi" class="blk-board__part">
            <span class="blk-board__chip" :style="{ '--c': part.color, '--c-soft': `${part.color}15` }">{{ part.text }}</span>
            <span v-if="part.labelKey" class="blk-board__lbl" :style="{ color: part.color }">{{ t(part.labelKey) }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ CHARACTER PROFILES ═══ -->
  <section v-else-if="block.type === LESSON_CONTENT_TYPE.CHARACTER_PROFILES && block.characters" class="blk blk-chars">
    <div class="contain">
      <div class="blk-chars__row">
        <div v-for="(c, i) in block.characters" :key="i" class="ccard">
          <span class="ccard__flag">{{ c.flag }}</span>
          <span class="ccard__kr">{{ c.nameKr }}</span>
          <span class="ccard__name">{{ c.name }}</span>
          <span class="ccard__job">{{ t(c.jobKey) }}</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ VOCABULARY TABLE — full-bleed muted ═══ -->
  <section v-else-if="block.type === LESSON_CONTENT_TYPE.VOCABULARY_TABLE && block.vocabTable" class="blk blk-vt">
    <div class="blk-vt__band">
      <div class="contain">
        <h3 class="blk-vt__title">{{ t(block.vocabTable.titleKey) }}</h3>
        <div class="blk-vt__grid">
          <div v-for="(item, i) in block.vocabTable.items" :key="i" class="blk-vt__item">
            <span class="blk-vt__kr">{{ item.word }}</span>
            <span class="blk-vt__rom">{{ item.romanization }}</span>
            <span class="blk-vt__tl">{{ t(item.translationKey) }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ CULTURAL NOTE — split, offset ═══ -->
  <section v-else-if="block.type === LESSON_CONTENT_TYPE.CULTURAL_NOTE" class="blk blk-culture">
    <div class="contain">
      <div class="blk-culture__split">
        <div class="blk-culture__accent">
          <span class="blk-culture__flag">🇰🇷</span>
          <span class="blk-culture__tag">{{ t('lessonPage.culture') }}</span>
        </div>
        <div class="blk-culture__content">
          <h3>{{ t(block.culturalTitleKey!) }}</h3>
          <p>{{ t(block.textKey!) }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ SECTION HEADER — Stripe-inspired, variants ═══ -->
  <section
    v-else-if="block.type === LESSON_CONTENT_TYPE.SECTION_HEADER && block.sectionHeader"
    class="blk blk-sh"
    :class="`blk-sh--${block.sectionHeader.variant || 'left'}`"
  >
    <div class="contain">
      <div class="blk-sh__eyebrow-wrap">
        <span class="blk-sh__rule" aria-hidden="true"></span>
        <span class="blk-sh__eyebrow">{{ t(block.sectionHeader.eyebrowKey) }}</span>
        <span class="blk-sh__rule" aria-hidden="true"></span>
      </div>
      <h2 class="blk-sh__title">
        <template v-if="block.sectionHeader.highlightKey">
          {{ t(block.sectionHeader.titleKey).split(t(block.sectionHeader.highlightKey))[0] }}<span class="blk-sh__hl">{{ t(block.sectionHeader.highlightKey) }}</span>{{ t(block.sectionHeader.titleKey).split(t(block.sectionHeader.highlightKey))[1] }}
        </template>
        <template v-else>{{ t(block.sectionHeader.titleKey) }}</template>
      </h2>
      <p v-if="block.sectionHeader.subtitleKey" class="blk-sh__sub">{{ t(block.sectionHeader.subtitleKey) }}</p>
    </div>
  </section>

  <!-- ═══ SECTION CTA — full-width Attio-inspired ═══ -->
  <section v-else-if="block.type === LESSON_CONTENT_TYPE.SECTION_CTA && block.sectionCta" class="blk blk-cta">
    <div class="blk-cta__band">
      <div class="contain">
        <div class="blk-cta__inner">
          <div class="blk-cta__content">
            <span v-if="block.sectionCta.eyebrowKey" class="blk-cta__eyebrow">{{ t(block.sectionCta.eyebrowKey) }}</span>
            <h3 class="blk-cta__title">{{ t(block.sectionCta.titleKey) }}</h3>
            <p v-if="block.sectionCta.subtitleKey" class="blk-cta__sub">{{ t(block.sectionCta.subtitleKey) }}</p>
          </div>
          <NuxtLink :to="block.sectionCta.ctaHref" class="blk-cta__btn">
            <span>{{ t(block.sectionCta.ctaLabelKey) }}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ PRACTICE INLINE — 3 modes: SELECT / WRITE / SPEAK + REVEAL fallback ═══ -->
  <section v-else-if="block.type === LESSON_CONTENT_TYPE.PRACTICE_INLINE && block.practiceInline" class="blk blk-practice">
    <div class="blk-practice__band">
      <div class="contain contain--narrow">
        <div class="blk-practice__head">
          <span class="blk-practice__tag">{{ t('lessonPage.practice') }}</span>
          <span class="blk-practice__instr">{{ t(block.practiceInline.instructionKey) }}</span>
        </div>
        <div class="blk-practice__items">
          <template v-for="(item, i) in block.practiceInline.items" :key="i">
            <!-- SELECT mode: prompt + option grid -->
            <div v-if="modeOf(item) === PRACTICE_MODE.SELECT && item.options" class="pi pi--select">
              <div class="pi__head">
                <span class="pi__mode">{{ t('lessonPage.modeSelect') }}</span>
                <span class="pi__q">{{ t(item.promptKey) }}</span>
              </div>
              <div class="pi__options">
                <button
                  v-for="(opt, oi) in item.options"
                  :key="oi"
                  class="pi-opt"
                  :class="{
                    'pi-opt--correct': selected[i] !== undefined && isOptionCorrect(item, oi),
                    'pi-opt--wrong': selected[i] === oi && !isOptionCorrect(item, oi),
                    'pi-opt--selected': selected[i] === oi,
                  }"
                  :disabled="selected[i] !== undefined"
                  @click="selected[i] = oi"
                >{{ t(opt.labelKey) }}</button>
              </div>
            </div>

            <!-- WRITE mode: prompt + input -->
            <div v-else-if="modeOf(item) === PRACTICE_MODE.WRITE" class="pi pi--write">
              <div class="pi__head">
                <span class="pi__mode">{{ t('lessonPage.modeWrite') }}</span>
                <span class="pi__q">{{ t(item.promptKey) }}</span>
              </div>
              <div class="pi__input-row">
                <input
                  v-model="inputs[i]"
                  class="pi__input"
                  :class="{
                    'pi__input--correct': writeValidated[i] === true,
                    'pi__input--wrong': writeValidated[i] === false,
                  }"
                  :placeholder="t('lessonPage.typeAnswer')"
                  :disabled="writeValidated[i] === true"
                  @keydown.enter="checkWrite(item, i)"
                />
                <button
                  class="pi__check"
                  :disabled="!inputs[i]?.trim() || writeValidated[i] === true"
                  @click="checkWrite(item, i)"
                >{{ t('lessonPage.check') }}</button>
              </div>
              <div v-if="writeValidated[i] === false" class="pi__hint">
                {{ t('lessonPage.correctAnswer') }} <strong>{{ t(item.answerKey) }}</strong>
              </div>
            </div>

            <!-- SPEAK mode: click to hear, then reveal -->
            <div v-else-if="modeOf(item) === PRACTICE_MODE.SPEAK" class="pi pi--speak">
              <div class="pi__head">
                <span class="pi__mode">{{ t('lessonPage.modeSpeak') }}</span>
                <span class="pi__q">{{ t(item.promptKey) }}</span>
              </div>
              <button class="pi__speak" @click="speakAndReveal(item, i)">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                </svg>
                <span>{{ revealed.has(i) ? t(item.answerKey) : t('lessonPage.clickToHear') }}</span>
              </button>
            </div>

            <!-- REVEAL mode (default fallback): click to reveal answer -->
            <div v-else class="pi pi--reveal" @click="toggleReveal(i)">
              <span class="pi__q">{{ t(item.promptKey) }}</span>
              <span class="pi__a" :class="{ 'pi__a--hidden': !revealed.has(i) }">
                {{ revealed.has(i) ? t(item.answerKey) : t('lessonPage.clickToReveal') }}
              </span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ═══ LAYOUT ═══ */
.blk { width: 100%; }
.contain { max-width: 1080px; margin: 0 auto; padding: 0 var(--space-6); }
.contain--narrow { max-width: 720px; }
.contain--text { max-width: 680px; padding-left: var(--space-10); }

/* ═══ TEXT — left-aligned, offset ═══ */
.blk-text { padding: var(--space-6) 0; }
.blk-text p { margin: 0; font-size: var(--text-lg); line-height: 1.9; color: var(--color-text); }

/* ═══ EXAMPLE GROUP — numbered list ═══ */
.blk-exg { padding: var(--space-5) 0; }
.blk-exg__list { display: flex; flex-direction: column; gap: var(--space-2); }
.blk-exg__item {
  display: flex; align-items: center; gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  background: var(--color-bg-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
}
.blk-exg__num {
  width: 28px; height: 28px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: var(--cc-s, var(--color-primary-subtle)); color: var(--cc, var(--color-primary));
  border-radius: var(--radius-full); font-size: var(--text-xs); font-weight: 800;
}
.blk-exg__body { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.blk-exg__kr { font-size: var(--text-base); font-weight: 800; color: var(--color-text); font-family: var(--font-cjk-kr); }
.blk-exg__sub { font-size: var(--text-xs); color: var(--color-text-muted); }
.blk-exg__sub em { color: var(--color-text-secondary); }

/* ═══ RULE — split layout ═══ */
.blk-rule { padding: var(--space-6) 0; }
.blk-rule__split {
  display: grid; grid-template-columns: 280px 1fr; gap: var(--space-8);
  align-items: start;
}
.blk-rule__left {
  display: flex; flex-direction: column; gap: var(--space-3);
  position: sticky; top: var(--space-6);
}
.blk-rule__chip {
  align-self: flex-start;
  padding: var(--space-1) var(--space-3); border-radius: var(--radius-full);
  background: var(--cc, var(--color-primary)); color: #fff;
  font-size: var(--text-xs); font-weight: 700; text-transform: uppercase;
}
.blk-rule__pattern { font-size: var(--text-xl); font-weight: 900; color: var(--color-text); font-family: var(--font-cjk-kr); line-height: 1.3; }
.blk-rule__right { display: flex; flex-direction: column; gap: var(--space-4); }
.blk-rule__explain { margin: 0; font-size: var(--text-sm); line-height: 1.8; color: var(--color-text-secondary); }
.blk-rule__exs { display: flex; flex-direction: column; gap: var(--space-2); padding-top: var(--space-3); border-top: 1px solid var(--color-border); }
.blk-rule__ex { display: flex; flex-direction: column; gap: 1px; }
.blk-rule__ex-kr { font-size: var(--text-sm); font-weight: 700; color: var(--color-text); font-family: var(--font-cjk-kr); }
.blk-rule__ex-tl { font-size: var(--text-xs); color: var(--color-text-muted); }
.blk-rule__ex-tl em { color: var(--color-text-secondary); font-style: italic; }

/* ═══ DIALOGUE — muted full-bleed ═══ */
.blk-dlg { padding: var(--space-10) 0; background: var(--color-bg-muted); }
.blk-dlg__thread { display: flex; flex-direction: column; gap: var(--space-4); }
.msg { display: flex; flex-direction: column; gap: var(--space-1); max-width: 72%; }
.msg--l { align-self: flex-start; }
.msg--r { align-self: flex-end; text-align: right; }
.msg__name { font-size: 0.65rem; font-weight: 800; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.1em; }
.msg__bubble {
  display: flex; flex-direction: column; gap: 3px;
  padding: var(--space-4) var(--space-5);
  background: var(--color-bg-surface); border-radius: var(--radius-2xl); box-shadow: var(--shadow-sm);
}
.msg--r .msg__bubble { background: var(--cc-s, var(--color-primary-subtle)); }
.msg__kr { font-size: var(--text-base); font-weight: 700; color: var(--color-text); font-family: var(--font-cjk-kr); }
.msg__rom { font-size: var(--text-xs); color: var(--color-text-muted); }
.msg__tl { font-size: var(--text-xs); color: var(--color-text-secondary); font-style: italic; margin-top: 2px; }

/* ═══ TIP — full-bleed warm ═══ */
.blk-tip__band { padding: var(--space-8) 0; background: #fffbeb; }
.blk-tip__inner { display: flex; gap: var(--space-5); align-items: flex-start; }
.blk-tip__icon {
  width: 48px; height: 48px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: #fef3c7; border-radius: var(--radius-lg); font-size: 1.4rem;
}
.blk-tip__body { flex: 1; }
.blk-tip__label { display: block; font-size: 0.65rem; font-weight: 800; color: #92400e; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: var(--space-2); }
.blk-tip__body p { margin: 0; font-size: var(--text-sm); line-height: 1.8; color: #78350f; }

/* ═══ GRAMMAR BOARD — left-aligned, asymmetric ═══ */
.blk-board { padding: var(--space-6) 0; }
.blk-board__row { display: flex; justify-content: flex-start; padding: var(--space-3) 0; padding-left: var(--space-10); }
.blk-board__chips { display: flex; align-items: flex-start; gap: var(--space-3); flex-wrap: wrap; }
.blk-board__part { display: flex; flex-direction: column; align-items: center; gap: var(--space-2); }
.blk-board__chip {
  padding: var(--space-3) var(--space-6); border-radius: var(--radius-xl);
  font-size: var(--text-3xl); font-weight: 900; font-family: var(--font-cjk-kr);
  color: var(--c); background: var(--c-soft); border: 2px solid currentColor;
}
.blk-board__lbl { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.04em; opacity: 0.7; }

/* ═══ CHARACTER PROFILES ═══ */
.blk-chars { padding: var(--space-4) 0; }
.blk-chars__row { display: flex; gap: var(--space-3); overflow-x: auto; padding-bottom: var(--space-2); }
.ccard {
  display: flex; flex-direction: column; align-items: center; gap: var(--space-2);
  padding: var(--space-5) var(--space-6); min-width: 160px;
  background: var(--color-bg-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl); text-align: center; flex-shrink: 0;
}
.ccard__flag { font-size: 2rem; }
.ccard__kr { font-size: var(--text-base); font-weight: 800; color: var(--color-text); font-family: var(--font-cjk-kr); }
.ccard__name { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: -4px; }
.ccard__job {
  font-size: var(--text-xs); font-weight: 600; color: var(--cc, var(--color-primary));
  background: var(--cc-s, var(--color-primary-subtle)); padding: 2px var(--space-3); border-radius: var(--radius-full);
}

/* ═══ VOCABULARY TABLE — full-bleed muted ═══ */
.blk-vt__band { padding: var(--space-8) 0; background: var(--color-bg-muted); }
.blk-vt__title { font-size: var(--text-base); font-weight: 700; color: var(--color-text); margin: 0 0 var(--space-4); }
.blk-vt__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--space-2); }
.blk-vt__item {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg-surface); border-radius: var(--radius-lg);
}
.blk-vt__kr { font-weight: 700; color: var(--color-text); font-family: var(--font-cjk-kr); font-size: var(--text-sm); }
.blk-vt__rom { font-size: var(--text-xs); color: var(--color-text-muted); }
.blk-vt__tl { font-size: var(--text-xs); color: var(--color-text-secondary); margin-left: auto; }

/* ═══ CULTURAL NOTE — split, accent left ═══ */
.blk-culture { padding: var(--space-6) 0; }
.blk-culture__split {
  display: grid; grid-template-columns: 80px 1fr; gap: var(--space-5);
  padding: var(--space-6);
  background: #fef2f2; border-radius: var(--radius-2xl);
}
.blk-culture__accent {
  display: flex; flex-direction: column; align-items: center; gap: var(--space-2);
}
.blk-culture__flag { font-size: 2rem; }
.blk-culture__tag {
  font-size: 0.6rem; font-weight: 800; color: #991b1b; text-transform: uppercase; letter-spacing: 0.08em;
  writing-mode: vertical-rl; text-orientation: mixed;
}
.blk-culture__content h3 { font-size: var(--text-base); font-weight: 700; color: #7f1d1d; margin: 0 0 var(--space-2); }
.blk-culture__content p { margin: 0; font-size: var(--text-sm); line-height: 1.8; color: #991b1b; }

/* ═══ SECTION HEADER — Stripe-inspired ═══ */
.blk-sh { padding: var(--space-20) 0 var(--space-8); }

.blk-sh__eyebrow-wrap {
  display: flex; align-items: center; justify-content: center; gap: var(--space-4);
  margin-bottom: var(--space-8);
}
.blk-sh__rule {
  flex: 1; max-width: 80px; height: 1px;
  background: var(--color-border);
}
.blk-sh__eyebrow {
  font-size: var(--text-xs); font-weight: 700;
  color: var(--cc, var(--color-primary));
  text-transform: uppercase; letter-spacing: 0.2em;
  white-space: nowrap;
}

.blk-sh__title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 700; color: var(--color-text);
  margin: 0; letter-spacing: -0.045em; line-height: 0.98;
  max-width: 18ch;
}
.blk-sh__hl {
  background: linear-gradient(135deg, var(--cc, var(--color-primary)) 0%, color-mix(in srgb, var(--cc, var(--color-primary)) 50%, #e11d48) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.blk-sh__sub {
  margin: var(--space-6) 0 0; max-width: 44ch;
  font-size: var(--text-lg); line-height: 1.6;
  color: var(--color-text-muted); letter-spacing: -0.01em;
}

/* Variants */
.blk-sh--center { text-align: center; }
.blk-sh--center .blk-sh__title,
.blk-sh--center .blk-sh__sub { margin-left: auto; margin-right: auto; }
.blk-sh--split .contain {
  display: grid; grid-template-columns: 1.3fr 1fr; gap: var(--space-10); align-items: end;
}
.blk-sh--split .blk-sh__eyebrow-wrap { grid-column: 1 / -1; }
.blk-sh--split .blk-sh__sub { margin: 0; max-width: none; padding-bottom: var(--space-2); }

/* ═══ SECTION CTA — full-bleed Attio-inspired ═══ */
.blk-cta__band {
  padding: var(--space-10) 0;
  background: var(--color-text);
  position: relative; overflow: hidden;
}
.blk-cta__band::before {
  content: ''; position: absolute; top: -50%; right: -5%; width: 50%; height: 200%;
  background: radial-gradient(ellipse, color-mix(in srgb, var(--cc, var(--color-primary)) 35%, transparent) 0%, transparent 55%);
  pointer-events: none;
}
.blk-cta__band::after {
  content: ''; position: absolute; bottom: -50%; left: -5%; width: 40%; height: 200%;
  background: radial-gradient(ellipse, color-mix(in srgb, var(--cc, var(--color-primary)) 20%, transparent) 0%, transparent 60%);
  pointer-events: none;
}
.blk-cta__inner {
  display: flex; align-items: center; justify-content: space-between; gap: var(--space-8);
  position: relative; z-index: 1;
}
.blk-cta__content { flex: 1; position: relative; z-index: 1; }
.blk-cta__eyebrow {
  display: inline-block; font-size: var(--text-xs); font-weight: 600;
  color: var(--cc, var(--color-primary)); margin-bottom: var(--space-2);
  letter-spacing: 0.02em;
}
.blk-cta__title { font-size: var(--text-xl); font-weight: 700; color: #fff; margin: 0; letter-spacing: -0.02em; }
.blk-cta__sub { margin: var(--space-2) 0 0; font-size: var(--text-sm); color: rgba(255,255,255,0.65); max-width: 48ch; }

.blk-cta__btn {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  background: #fff; color: var(--color-text);
  border-radius: var(--radius-full);
  font-size: var(--text-sm); font-weight: 700;
  text-decoration: none; flex-shrink: 0;
  transition: transform 200ms ease;
  position: relative; z-index: 1;
}
.blk-cta__btn svg { transition: transform 200ms ease; }
.blk-cta__btn:hover { transform: translateY(-2px); }
.blk-cta__btn:hover svg { transform: translateX(3px); }

/* ═══ PRACTICE INLINE — full-bleed indigo ═══ */
.blk-practice__band { padding: var(--space-10) 0; background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%); }
.blk-practice__head { margin-bottom: var(--space-5); }
.blk-practice__tag {
  display: inline-block; font-size: 0.65rem; font-weight: 800; color: #4338ca;
  text-transform: uppercase; letter-spacing: 0.08em;
  background: #c7d2fe; padding: 2px var(--space-3); border-radius: var(--radius-full);
  margin-bottom: var(--space-2);
}
.blk-practice__instr { display: block; font-size: var(--text-lg); font-weight: 700; color: #312e81; }
.blk-practice__items { display: flex; flex-direction: column; gap: var(--space-3); }

/* Card base */
.pi {
  padding: var(--space-4) var(--space-5);
  background: #fff; border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xs);
}
.pi__head {
  display: flex; align-items: baseline; gap: var(--space-3);
  margin-bottom: var(--space-3);
}
.pi__mode {
  font-size: 0.6rem; font-weight: 800; color: #6366f1;
  text-transform: uppercase; letter-spacing: 0.1em;
  padding: 2px var(--space-2); background: #ede9fe; border-radius: var(--radius-full);
  flex-shrink: 0;
}
.pi__q { font-size: var(--text-base); color: var(--color-text); font-weight: 500; flex: 1; }

/* REVEAL (legacy) */
.pi--reveal {
  display: flex; justify-content: space-between; align-items: center; gap: var(--space-4); cursor: pointer;
}
.pi--reveal:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.pi__a {
  font-size: var(--text-sm); font-weight: 800; font-family: var(--font-cjk-kr);
  color: #4338ca; padding: var(--space-1) var(--space-4); background: #e0e7ff; border-radius: var(--radius-lg);
}
.pi__a--hidden {
  font-family: var(--font-body); font-weight: 600; font-size: var(--text-xs);
  color: #6366f1; background: #c7d2fe; cursor: pointer;
}

/* SELECT mode */
.pi__options { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2); }
.pi-opt {
  padding: var(--space-3) var(--space-4);
  background: #fff; border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-size: var(--text-base); font-weight: 600; color: var(--color-text);
  font-family: var(--font-cjk-kr); cursor: pointer;
  transition: all var(--transition-fast); text-align: center;
}
.pi-opt:not(:disabled):hover { border-color: #6366f1; }
.pi-opt--correct { border-color: #22c55e; background: #f0fdf4; color: #166534; }
.pi-opt--wrong { border-color: #ef4444; background: #fef2f2; color: #991b1b; }
.pi-opt:disabled:not(.pi-opt--correct):not(.pi-opt--wrong) { opacity: 0.4; }

/* WRITE mode */
.pi__input-row { display: flex; gap: var(--space-2); }
.pi__input {
  flex: 1; padding: var(--space-3) var(--space-4);
  border: 2px solid var(--color-border); border-radius: var(--radius-lg);
  font-size: var(--text-base); font-family: var(--font-cjk-kr);
  background: #fff; color: var(--color-text); outline: none;
  transition: border-color var(--transition-fast);
}
.pi__input:focus { border-color: #6366f1; }
.pi__input--correct { border-color: #22c55e; background: #f0fdf4; }
.pi__input--wrong { border-color: #ef4444; background: #fef2f2; }
.pi__check {
  padding: var(--space-3) var(--space-5);
  background: #6366f1; color: #fff; border: none; border-radius: var(--radius-lg);
  font-size: var(--text-sm); font-weight: 700; cursor: pointer;
  transition: background var(--transition-fast);
}
.pi__check:not(:disabled):hover { background: #4f46e5; }
.pi__check:disabled { opacity: 0.5; cursor: not-allowed; }
.pi__hint {
  margin-top: var(--space-2); font-size: var(--text-sm); color: #991b1b;
  background: #fef2f2; padding: var(--space-2) var(--space-3); border-radius: var(--radius-md);
}
.pi__hint strong { font-family: var(--font-cjk-kr); }

/* SPEAK mode */
.pi__speak {
  display: flex; align-items: center; gap: var(--space-3);
  width: 100%;
  padding: var(--space-4) var(--space-5);
  background: #ede9fe; border: 2px solid #c7d2fe;
  border-radius: var(--radius-xl);
  font-size: var(--text-lg); font-weight: 700; color: #4338ca;
  font-family: var(--font-cjk-kr); cursor: pointer;
  transition: all var(--transition-fast);
}
.pi__speak:hover { background: #ddd6fe; border-color: #a5b4fc; transform: translateY(-2px); }
.pi__speak svg { flex-shrink: 0; color: #6366f1; }

/* ═══ RESPONSIVE ═══ */
@media (max-width: 768px) {
  .contain--text { padding-left: var(--space-6); }
  .blk-rule__split { grid-template-columns: 1fr; gap: var(--space-4); }
  .blk-rule__left { position: static; }
  .blk-culture__split { grid-template-columns: 1fr; }
  .blk-culture__accent { flex-direction: row; writing-mode: horizontal-tb; }
  .blk-culture__tag { writing-mode: horizontal-tb; }
  .blk-sh { padding: var(--space-12) 0 var(--space-4); }
  .blk-sh__sub { font-size: var(--text-base); }
  .blk-sh--split .contain { grid-template-columns: 1fr; gap: var(--space-4); }
  .blk-cta__band { padding: var(--space-8) 0; }
  .blk-cta__inner { flex-direction: column; align-items: flex-start; gap: var(--space-4); }
  .blk-cta__btn { width: 100%; justify-content: center; }
  .blk-board__chip { font-size: var(--text-xl); padding: var(--space-2) var(--space-4); }
  .msg { max-width: 88%; }
  .blk-vt__grid { grid-template-columns: 1fr; }
}
</style>
