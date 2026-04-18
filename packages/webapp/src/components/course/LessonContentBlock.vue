<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { LESSON_CONTENT_TYPE, PRACTICE_MODE } from '~/composables/data/courses/lesson-types'
import type { ILessonContentBlock, IPracticeInlineItem } from '~/composables/data/courses/lesson-types'
import { useCourseAudio } from '~/composables/useCourseAudio'
import { useCourseContext } from '~/composables/useCourseContext'

defineProps<{ block: ILessonContentBlock }>()
const { t } = useI18n()
const { speak } = useCourseAudio()
const { language } = useCourseContext()

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
  if (!revealed.value.has(idx)) revealed.value.add(idx)
}
</script>

<template>
  <!-- ═══ TEXT ═══ -->
  <section v-if="block.type === LESSON_CONTENT_TYPE.TEXT" class="blk blk-text" v-scroll-reveal>
    <div class="contain contain--text">
      <div class="blk-text__deco" aria-hidden="true"></div>
      <p>{{ t(block.textKey!) }}</p>
    </div>
  </section>

  <!-- ═══ EXAMPLE GROUP ═══ -->
  <section
    v-else-if="(block.type === LESSON_CONTENT_TYPE.EXAMPLE && block.example) || (block.type === LESSON_CONTENT_TYPE.EXAMPLE_GROUP && block.examples)"
    class="blk blk-exg"
    v-scroll-reveal.stagger
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
  <section v-else-if="block.type === LESSON_CONTENT_TYPE.RULE && block.rule" class="blk blk-rule" v-scroll-reveal>
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

  <!-- ═══ DIALOGUE — Timeline style ═══ -->
  <section v-else-if="block.type === LESSON_CONTENT_TYPE.DIALOGUE && block.dialogue" class="blk blk-dlg">
    <div class="wave-section blk-dlg__fill">
      <span class="blk-dlg__deco-char" aria-hidden="true">{{ block.dialogue[0]?.sentence.charAt(0) }}</span>

      <div class="contain contain--narrow" v-scroll-reveal.stagger>
        <div class="blk-dlg__timeline">
          <div class="blk-dlg__line" aria-hidden="true"></div>
          <div v-for="(line, i) in block.dialogue" :key="i" class="dlg-msg" :class="i % 2 === 0 ? 'dlg-msg--l' : 'dlg-msg--r'">
            <div class="dlg-msg__dot" aria-hidden="true"></div>
            <div class="dlg-msg__card">
              <span class="dlg-msg__name">{{ line.speaker }}</span>
              <span class="dlg-msg__kr">{{ line.sentence }}</span>
              <span class="dlg-msg__rom">{{ line.romanization }}</span>
              <span class="dlg-msg__tl">{{ t(line.translationKey) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ TIP — Sticker style ═══ -->
  <section v-else-if="block.type === LESSON_CONTENT_TYPE.TIP" class="blk blk-tip" v-scroll-reveal.scale>
    <div class="contain">
      <div class="blk-tip__sticker">
        <div class="blk-tip__glow" aria-hidden="true"></div>
        <div class="blk-tip__icon-wrap">
          <svg class="blk-tip__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#92400e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg>
        </div>
        <div class="blk-tip__body">
          <span class="blk-tip__label">{{ t('lessonPage.tip') }}</span>
          <p>{{ t(block.textKey!) }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ GRAMMAR BOARD — Dark cinematic ═══ -->
  <section v-else-if="block.type === LESSON_CONTENT_TYPE.GRAMMAR_BOARD && block.board" class="blk blk-board">
    <div class="blk-board__scene">
      <div class="blk-board__dark">
        <div class="blk-board__aurora" aria-hidden="true">
          <div class="blk-board__blob blk-board__blob--1"></div>
          <div class="blk-board__blob blk-board__blob--2"></div>
        </div>

        <div class="contain" v-scroll-reveal.stagger>
          <div v-for="(structure, si) in block.board.structures" :key="si" class="blk-board__row">
            <div class="blk-board__chips">
              <div v-for="(part, pi) in structure.parts" :key="pi" class="blk-board__part">
                <span
                  class="blk-board__chip"
                  :style="{
                    '--chip-c': part.color,
                    '--chip-bg': `${part.color}18`,
                    '--chip-border': `${part.color}40`,
                    '--chip-glow': `${part.color}25`,
                  }"
                >{{ part.text }}</span>
                <span v-if="part.labelKey" class="blk-board__lbl" :style="{ color: `${part.color}cc` }">{{ t(part.labelKey) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SVGs on top: paint page-bg triangles to mask the dark section edges -->
      <svg class="blk-board__cut blk-board__cut--top" viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path d="M0,0 L0,60 L1440,0 Z" />
      </svg>
      <svg class="blk-board__cut blk-board__cut--bottom" viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path d="M1440,60 L1440,0 L0,60 Z" />
      </svg>
    </div>
  </section>

  <!-- ═══ CHARACTER PROFILES ═══ -->
  <!-- ═══ VOCABULARY TABLE — full-bleed muted ═══ -->
  <section v-else-if="block.type === LESSON_CONTENT_TYPE.VOCABULARY_TABLE && block.vocabTable" class="blk blk-vt">
    <div class="blk-vt__scene">
      <svg class="blk-vt__wave blk-vt__wave--top" viewBox="0 0 1440 50" preserveAspectRatio="none">
        <path d="M0,25 C400,50 1040,0 1440,25 L1440,50 L0,50 Z" />
      </svg>
      <div class="blk-vt__fill">
        <div class="contain" v-scroll-reveal.stagger>
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
      <svg class="blk-vt__wave blk-vt__wave--bottom" viewBox="0 0 1440 50" preserveAspectRatio="none">
        <path d="M0,25 C400,0 1040,50 1440,25 L1440,0 L0,0 Z" />
      </svg>
    </div>
  </section>

  <!-- ═══ CULTURAL NOTE — Split Reveal full-width ═══ -->
  <section v-else-if="block.type === LESSON_CONTENT_TYPE.CULTURAL_NOTE" class="blk blk-culture" v-scroll-reveal>
    <div class="blk-culture__section">
      <div class="blk-culture__strip" aria-hidden="true"></div>
      <span class="blk-culture__watermark" aria-hidden="true">{{ t(block.culturalTitleKey!) }}</span>

      <div class="contain blk-culture__content">
        <span class="blk-culture__eyebrow">
          <img v-if="language?.flag" :src="language.flag" alt="" class="blk-culture__eyebrow-flag" />
          {{ t('lessonPage.culture') }}
        </span>
        <h3 class="blk-culture__title">{{ t(block.culturalTitleKey!) }}</h3>
        <p class="blk-culture__text">{{ t(block.textKey!) }}</p>
      </div>
    </div>
  </section>

  <!-- ═══ SECTION HEADER — Lecon (intro with subtitle+split) vs Partie ═══ -->
  <template v-else-if="block.type === LESSON_CONTENT_TYPE.SECTION_HEADER && block.sectionHeader">

    <!-- LECON header: color band + oversized number + mixed weight -->
    <section
      v-if="block.sectionHeader.variant === 'split' && block.sectionHeader.subtitleKey"
      class="blk blk-sh-lecon"
      v-scroll-reveal
    >
      <div class="blk-sh-lecon__band">
        <div class="contain">
          <div class="blk-sh-lecon__layout">
            <span class="blk-sh-lecon__big" aria-hidden="true">{{ t(block.sectionHeader.eyebrowKey).replace(/\D/g, '') || '#' }}</span>
            <div class="blk-sh-lecon__content">
              <span class="blk-sh-lecon__eyebrow">{{ t(block.sectionHeader.eyebrowKey) }}</span>
              <h2 class="blk-sh-lecon__title">
                <template v-if="block.sectionHeader.highlightKey">
                  {{ t(block.sectionHeader.titleKey).split(t(block.sectionHeader.highlightKey))[0] }}<strong class="blk-sh-lecon__bold">{{ t(block.sectionHeader.highlightKey) }}</strong>{{ t(block.sectionHeader.titleKey).split(t(block.sectionHeader.highlightKey))[1] }}
                </template>
                <template v-else>{{ t(block.sectionHeader.titleKey) }}</template>
              </h2>
              <p class="blk-sh-lecon__sub">{{ t(block.sectionHeader.subtitleKey) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PARTIE header: original centered lines + gradient highlight -->
    <section
      v-else
      class="blk blk-sh"
      :class="`blk-sh--${block.sectionHeader.variant || 'left'}`"
      v-scroll-reveal
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

  </template>

  <!-- ═══ SECTION CTA — Split layout, rocket button ═══ -->
  <section v-else-if="block.type === LESSON_CONTENT_TYPE.SECTION_CTA && block.sectionCta" class="blk blk-cta" v-scroll-reveal>
    <div class="blk-cta__band">
      <div class="contain">
        <div class="blk-cta__grid">
          <div class="blk-cta__left">
            <span v-if="block.sectionCta.eyebrowKey" class="blk-cta__eyebrow">{{ t(block.sectionCta.eyebrowKey) }}</span>
            <h3 class="blk-cta__title">{{ t(block.sectionCta.titleKey) }}</h3>
            <p v-if="block.sectionCta.subtitleKey" class="blk-cta__sub">{{ t(block.sectionCta.subtitleKey) }}</p>
          </div>
          <div class="blk-cta__right">
            <NuxtLink :to="block.sectionCta.ctaHref" class="blk-cta__btn">
              <span>{{ t(block.sectionCta.ctaLabelKey) }}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ PRACTICE INLINE — 3 modes: SELECT / WRITE / SPEAK + REVEAL fallback ═══ -->
  <section v-else-if="block.type === LESSON_CONTENT_TYPE.PRACTICE_INLINE && block.practiceInline" class="blk blk-practice">
    <div class="blk-practice__scene">
      <div class="wave-section blk-practice__fill">
        <div class="contain contain--narrow" v-scroll-reveal.stagger>
          <div class="blk-practice__head">
            <span class="blk-practice__tag">{{ t('lessonPage.practice') }}</span>
            <span class="blk-practice__instr">{{ t(block.practiceInline.instructionKey) }}</span>
          </div>
          <div class="blk-practice__items">
            <template v-for="(item, i) in block.practiceInline.items" :key="i">
              <!-- SELECT mode -->
              <div v-if="modeOf(item) === PRACTICE_MODE.SELECT && item.options" class="pi pi--select">
                <div class="pi__head">
                  <span class="pi__mode">{{ t('lessonPage.modeSelect') }}</span>
                  <span class="pi__q">{{ t(item.promptKey) }}</span>
                </div>
                <div class="pi__options">
                  <button
                    v-for="(opt, oi) in item.options" :key="oi"
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

              <!-- WRITE mode -->
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

              <!-- SPEAK mode -->
              <div v-else-if="modeOf(item) === PRACTICE_MODE.SPEAK" class="pi pi--speak">
                <div class="pi__head">
                  <span class="pi__mode">{{ t('lessonPage.modeSpeak') }}</span>
                  <span class="pi__q">{{ t(item.promptKey) }}</span>
                </div>
                <button class="pi__speak-btn" @click="speakAndReveal(item, i)">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                  </svg>
                  <span>{{ revealed.has(i) ? t(item.answerKey) : t('lessonPage.clickToHear') }}</span>
                </button>
              </div>

              <!-- REVEAL mode (default fallback) -->
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

    </div>
  </section>
</template>

<style scoped>
/* ═══ LAYOUT ═══ */
.blk { width: 100%; }
.contain { max-width: 1080px; margin: 0 auto; padding: 0 var(--space-6); }
.contain--narrow { max-width: 720px; }
.contain--text { max-width: 680px; position: relative; }

/* ═══ TEXT — editorial with accent bar ═══ */
.blk-text { padding: var(--space-8) 0; }
.blk-text__deco {
  position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
  background: linear-gradient(180deg, var(--cc, var(--color-primary)) 0%, transparent 100%);
  border-radius: 3px; opacity: 0.4;
}
.blk-text p {
  margin: 0; padding-left: var(--space-6);
  font-size: var(--text-lg); line-height: 1.9; color: var(--color-text);
}

/* ═══ EXAMPLE GROUP — lifted cards ═══ */
.blk-exg { padding: var(--space-5) 0; }
.blk-exg__list { display: flex; flex-direction: column; gap: var(--space-3); }
.blk-exg__item {
  display: flex; align-items: center; gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  background: var(--color-bg-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
.blk-exg__item:hover {
  transform: translateY(-3px) rotate(-0.3deg);
  box-shadow: var(--shadow-lg);
  border-color: color-mix(in srgb, var(--cc) 30%, var(--color-border));
}
.blk-exg__num {
  width: 32px; height: 32px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--cc, var(--color-primary)), color-mix(in srgb, var(--cc, var(--color-primary)) 60%, #e11d48));
  color: #fff; border-radius: var(--radius-full);
  font-size: var(--text-xs); font-weight: 800;
}
.blk-exg__body { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.blk-exg__kr { font-size: var(--text-base); font-weight: 800; color: var(--color-text); font-family: var(--font-cjk-jp); }
.blk-exg__sub { font-size: var(--text-xs); color: var(--color-text-muted); }
.blk-exg__sub em { color: var(--color-text-secondary); }

/* ═══ RULE — split layout ═══ */
.blk-rule { padding: var(--space-6) 0; }
.blk-rule__split { display: grid; grid-template-columns: 280px 1fr; gap: var(--space-8); align-items: start; }
.blk-rule__left { display: flex; flex-direction: column; gap: var(--space-3); position: sticky; top: var(--space-6); }
.blk-rule__chip {
  align-self: flex-start; padding: var(--space-1) var(--space-3); border-radius: var(--radius-full);
  background: var(--cc, var(--color-primary)); color: #fff;
  font-size: var(--text-xs); font-weight: 700; text-transform: uppercase;
}
.blk-rule__pattern { font-size: var(--text-xl); font-weight: 900; color: var(--color-text); font-family: var(--font-cjk-jp); line-height: 1.3; }
.blk-rule__right { display: flex; flex-direction: column; gap: var(--space-4); }
.blk-rule__explain { margin: 0; font-size: var(--text-sm); line-height: 1.8; color: var(--color-text-secondary); }
.blk-rule__exs { display: flex; flex-direction: column; gap: var(--space-2); padding-top: var(--space-3); border-top: 1px solid var(--color-border); }
.blk-rule__ex { display: flex; flex-direction: column; gap: 1px; }
.blk-rule__ex-kr { font-size: var(--text-sm); font-weight: 700; color: var(--color-text); font-family: var(--font-cjk-jp); }
.blk-rule__ex-tl { font-size: var(--text-xs); color: var(--color-text-muted); }

/* ═══ DIALOGUE — Timeline ═══ */
.blk-dlg {
  z-index: 2;
}

.blk-dlg__fill {
  --wave-bg: var(--color-bg-muted);
  overflow: hidden;
}
.blk-dlg__deco-char {
  position: absolute; right: 8%; top: 50%; transform: translateY(-50%);
  font-size: 12rem; font-family: var(--font-cjk-jp); font-weight: 900;
  opacity: 0.03; pointer-events: none; line-height: 1;
}

.blk-dlg__timeline { position: relative; display: flex; flex-direction: column; gap: var(--space-5); padding: 0 var(--space-6); }
.blk-dlg__line {
  position: absolute; left: 50%; top: 0; bottom: 0; width: 2px;
  background: linear-gradient(180deg, transparent, var(--cc, var(--color-primary)) 15%, var(--cc, var(--color-primary)) 85%, transparent);
  opacity: 0.2; transform: translateX(-50%);
}

.dlg-msg { display: flex; align-items: flex-start; gap: var(--space-3); max-width: 72%; position: relative; }
.dlg-msg--l { align-self: flex-start; }
.dlg-msg--r { align-self: flex-end; flex-direction: row-reverse; }

.dlg-msg__dot {
  position: absolute; top: var(--space-4);
  width: 10px; height: 10px; border-radius: var(--radius-full);
  background: var(--cc, var(--color-primary));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--cc, var(--color-primary)) 20%, transparent);
}
.dlg-msg--l .dlg-msg__dot { right: -28px; }
.dlg-msg--r .dlg-msg__dot { left: -28px; }

.dlg-msg__card {
  display: flex; flex-direction: column; gap: 4px;
  padding: var(--space-4) var(--space-5);
  background: var(--color-bg-surface);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border);
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
.dlg-msg__card:hover { transform: translateY(-2px); }
.dlg-msg--r .dlg-msg__card {
  background: color-mix(in srgb, var(--cc) 8%, var(--color-bg-surface));
  border-color: color-mix(in srgb, var(--cc) 20%, var(--color-border));
}
.dlg-msg__name { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--cc, var(--color-primary)); }
.dlg-msg__kr { font-size: var(--text-base); font-weight: 700; color: var(--color-text); font-family: var(--font-cjk-jp); }
.dlg-msg__rom { font-size: var(--text-xs); color: var(--color-text-muted); }
.dlg-msg__tl { font-size: var(--text-xs); color: var(--color-text-secondary); font-style: italic; margin-top: 2px; }

/* ═══ TIP — Floating sticker ═══ */
.blk-tip { padding: var(--space-8) 0; }
.blk-tip__sticker {
  position: relative;
  display: flex; gap: var(--space-5); align-items: flex-start;
  padding: var(--space-6) var(--space-7);
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border: 2px solid #fde68a;
  border-radius: var(--radius-2xl);
  transform: rotate(-0.5deg);
  transition: transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}
.blk-tip__sticker:hover { transform: rotate(0deg) scale(1.01); }
.blk-tip__glow {
  position: absolute; top: -30%; right: -10%; width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, transparent 70%);
  pointer-events: none;
}
.blk-tip__icon-wrap {
  width: 52px; height: 52px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: #fef3c7; border: 2px solid #fde68a;
  border-radius: var(--radius-xl);
  animation: tip-pulse 3s ease-in-out infinite;
}
@keyframes tip-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
.blk-tip__body { flex: 1; }
.blk-tip__label { display: block; font-size: 0.65rem; font-weight: 800; color: #92400e; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: var(--space-2); }
.blk-tip__body p { margin: 0; font-size: var(--text-sm); line-height: 1.8; color: #78350f; }

/* ═══ GRAMMAR BOARD — Dark cinematic ═══ */
.blk-board__scene { position: relative; }

.blk-board__dark {
  background: #0f0f1a;
  padding: calc(var(--space-10) + 60px) 0;
  position: relative; overflow: hidden;
}

/* SVGs sit on top of the dark section and paint page-bg triangles
   to create the diagonal edge. Transparent area reveals dark+aurora. */
.blk-board__cut {
  display: block; width: 100%; height: 60px;
  position: absolute; left: 0; z-index: 2;
  pointer-events: none;
}
.blk-board__cut--top { top: 0; }
.blk-board__cut--bottom { bottom: 0; }
.blk-board__cut path { fill: var(--color-bg); }
.blk-board__aurora { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.blk-board__blob {
  position: absolute; border-radius: 50%;
  filter: blur(80px); opacity: 0.35;
  animation: aurora-drift 12s ease-in-out infinite alternate;
}
.blk-board__blob--1 { width: 300px; height: 300px; top: -20%; right: -5%; background: var(--cc, #6366f1); }
.blk-board__blob--2 { width: 250px; height: 250px; bottom: -20%; left: 10%; background: color-mix(in srgb, var(--cc, #6366f1) 50%, #e11d48); animation-delay: -6s; }
@keyframes aurora-drift { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(30px, -20px) scale(1.15); } }

.blk-board__row { display: flex; justify-content: center; padding: var(--space-4) 0; }
.blk-board__chips { display: flex; align-items: flex-start; gap: var(--space-4); flex-wrap: wrap; justify-content: center; }
.blk-board__part { display: flex; flex-direction: column; align-items: center; gap: var(--space-2); }
.blk-board__chip {
  padding: var(--space-3) var(--space-6); border-radius: var(--radius-xl);
  font-size: var(--text-3xl); font-weight: 900; font-family: var(--font-cjk-jp);
  color: var(--chip-c); background: var(--chip-bg);
  border: 1.5px solid var(--chip-border);
  box-shadow: 0 0 20px var(--chip-glow), inset 0 1px 0 rgba(255,255,255,0.05);
  transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
.blk-board__chip:hover { transform: translateY(-4px) scale(1.05); box-shadow: 0 0 35px var(--chip-glow), 0 8px 25px rgba(0,0,0,0.3); }
.blk-board__lbl { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }


/* ═══ VOCABULARY TABLE — full-bleed muted ═══ */
.blk-vt__scene { position: relative; }
.blk-vt__wave { display: block; width: 100%; }
.blk-vt__wave--top { margin-bottom: -1px; }
.blk-vt__wave--top path { fill: var(--color-bg-muted); }
.blk-vt__wave--bottom { margin-top: -1px; }
.blk-vt__wave--bottom path { fill: var(--color-bg-muted); }

.blk-vt__fill { background: var(--color-bg-muted); padding: var(--space-6) 0; }
.blk-vt__title { font-size: var(--text-base); font-weight: 700; color: var(--color-text); margin: 0 0 var(--space-4); }
.blk-vt__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--space-2); }
.blk-vt__item {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg-surface); border-radius: var(--radius-lg);
  border: 1px solid transparent; transition: all 250ms ease;
}
.blk-vt__item:hover { border-color: color-mix(in srgb, var(--cc) 25%, var(--color-border)); transform: translateX(4px); }
.blk-vt__kr { font-weight: 700; color: var(--color-text); font-family: var(--font-cjk-jp); font-size: var(--text-sm); }
.blk-vt__rom { font-size: var(--text-xs); color: var(--color-text-muted); }
.blk-vt__tl { font-size: var(--text-xs); color: var(--color-text-secondary); margin-left: auto; }

/* ═══ CULTURAL NOTE — Split Reveal full-width section ═══ */
.blk-culture__section {
  position: relative;
  background: #f9f8f6;
  padding: var(--space-16) 0;
  padding-left: 70px;
  overflow: hidden;
}

/* Diagonal gradient strip on the left */
.blk-culture__strip {
  position: absolute; left: 0; top: 0; bottom: 0; width: 60px;
  background: linear-gradient(180deg, var(--cc, var(--color-primary)), color-mix(in srgb, var(--cc) 50%, #e11d48));
  clip-path: polygon(0 0, 100% 0, 65% 100%, 0 100%);
}

/* Flag inline with eyebrow */
.blk-culture__eyebrow-flag {
  width: 22px; height: 16px; object-fit: cover;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
}

/* Giant watermark title behind content */
.blk-culture__watermark {
  position: absolute; top: 50%; left: 70px; transform: translateY(-50%);
  font-size: clamp(4rem, 10vw, 8rem); font-weight: 900; color: var(--color-text);
  opacity: 0.03; line-height: 1; pointer-events: none; white-space: nowrap;
}

.blk-culture__content { position: relative; z-index: 1; }
.blk-culture__eyebrow {
  display: inline-flex; align-items: center; gap: var(--space-2);
  font-size: var(--text-xs); font-weight: 700;
  color: var(--cc, var(--color-primary)); text-transform: uppercase; letter-spacing: 0.12em;
  margin-bottom: var(--space-4);
}
.blk-culture__title {
  margin: 0 0 var(--space-4);
  font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.03em;
  color: var(--color-text);
}
.blk-culture__text { margin: 0; font-size: var(--text-sm); line-height: 1.85; color: var(--color-text-secondary); max-width: 62ch; }


/* ═══ SECTION HEADER — Lecon (color band + number + mixed weight) ═══ */
.blk-sh-lecon__band {
  background: color-mix(in srgb, var(--cc, var(--color-primary)) 6%, var(--color-bg-muted));
  padding: var(--space-12) 0;
}
.blk-sh-lecon__layout { position: relative; }
.blk-sh-lecon__big {
  position: absolute; top: 50%; right: 0; transform: translateY(-50%);
  font-size: clamp(7rem, 18vw, 14rem); font-weight: 900;
  color: var(--cc, var(--color-primary)); opacity: 0.06;
  line-height: 1; pointer-events: none; font-variant-numeric: tabular-nums;
}
.blk-sh-lecon__content { position: relative; z-index: 1; }
.blk-sh-lecon__eyebrow {
  display: block; font-size: var(--text-xs); font-weight: 800;
  color: var(--cc, var(--color-primary));
  text-transform: uppercase; letter-spacing: 0.15em;
  margin-bottom: var(--space-3);
}
.blk-sh-lecon__title {
  font-size: clamp(1.8rem, 4.5vw, 3.2rem); font-weight: 300;
  color: var(--color-text); margin: 0;
  letter-spacing: -0.02em; line-height: 1.1; max-width: 22ch;
}
.blk-sh-lecon__bold { font-weight: 900; }
.blk-sh-lecon__sub {
  margin: var(--space-4) 0 0; font-size: var(--text-base);
  line-height: 1.6; color: var(--color-text-muted); max-width: 50ch;
}

/* ═══ SECTION HEADER — Partie (Stripe-inspired) ═══ */
.blk-sh { padding: var(--space-20) 0 var(--space-8); position: relative; overflow: hidden; }

.blk-sh__eyebrow-wrap { display: flex; align-items: center; justify-content: center; gap: var(--space-4); margin-bottom: var(--space-8); }
.blk-sh__rule { flex: 1; max-width: 80px; height: 1.5px; background: linear-gradient(90deg, transparent, var(--cc, var(--color-primary)), transparent); opacity: 0.3; }
.blk-sh__eyebrow { font-size: var(--text-xs); font-weight: 700; color: var(--cc, var(--color-primary)); text-transform: uppercase; letter-spacing: 0.2em; white-space: nowrap; }

.blk-sh__title { font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 700; color: var(--color-text); margin: 0; letter-spacing: -0.045em; line-height: 0.98; max-width: 18ch; }
.blk-sh__hl {
  background: linear-gradient(135deg, var(--cc, var(--color-primary)) 0%, color-mix(in srgb, var(--cc, var(--color-primary)) 50%, #e11d48) 100%);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent;
  position: relative;
}
.blk-sh__hl::after { content: ''; position: absolute; left: -4px; right: -4px; bottom: 0; height: 30%; background: color-mix(in srgb, var(--cc, var(--color-primary)) 12%, transparent); border-radius: 3px; z-index: -1; }
.blk-sh__sub { margin: var(--space-6) 0 0; max-width: 44ch; font-size: var(--text-lg); line-height: 1.6; color: var(--color-text-muted); letter-spacing: -0.01em; }

.blk-sh--center { text-align: center; }
.blk-sh--center .blk-sh__title, .blk-sh--center .blk-sh__sub { margin-left: auto; margin-right: auto; }
.blk-sh--split .contain { display: grid; grid-template-columns: 1.3fr 1fr; gap: var(--space-10); align-items: end; }
.blk-sh--split .blk-sh__eyebrow-wrap { grid-column: 1 / -1; }
.blk-sh--split .blk-sh__sub { margin: 0; max-width: none; padding-bottom: var(--space-2); }

/* ═══ SECTION CTA — Split layout, rocket button ═══ */
.blk-cta__band {
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  padding: var(--space-16) 0;
}
.blk-cta__grid {
  display: grid; grid-template-columns: 1fr auto; gap: var(--space-8); align-items: center;
}
.blk-cta__eyebrow {
  display: inline-block; font-size: 0.65rem; font-weight: 800;
  color: #ea580c; letter-spacing: 0.12em; text-transform: uppercase;
  margin-bottom: var(--space-2);
}
.blk-cta__title {
  font-size: clamp(1.6rem, 3.5vw, var(--text-3xl)); font-weight: 800;
  color: #9a3412; margin: 0; letter-spacing: -0.02em; line-height: 1.15;
}
.blk-cta__sub { margin: var(--space-2) 0 0; font-size: var(--text-sm); color: #b45309; max-width: 42ch; line-height: 1.6; }
.blk-cta__right { display: flex; align-items: center; }
.blk-cta__btn {
  display: inline-flex; align-items: center; gap: var(--space-3);
  padding: var(--space-4) var(--space-7);
  background: linear-gradient(135deg, #ea580c, #dc2626);
  color: #fff; border-radius: var(--radius-full);
  font-size: var(--text-base); font-weight: 800;
  text-decoration: none; white-space: nowrap;
  transition: all 350ms cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 6px 20px rgba(234, 88, 12, 0.3);
}
.blk-cta__btn:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 35px rgba(234, 88, 12, 0.4);
}

/* ═══ PRACTICE INLINE ═══ */
.blk-practice__scene { position: relative; }
.blk-practice__fill {
  --wave-bg: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
}

.blk-practice__head { margin-bottom: var(--space-5); }
.blk-practice__tag { display: inline-block; font-size: 0.65rem; font-weight: 800; color: #4338ca; text-transform: uppercase; letter-spacing: 0.08em; background: #c7d2fe; padding: 2px var(--space-3); border-radius: var(--radius-full); margin-bottom: var(--space-2); }
.blk-practice__instr { display: block; font-size: var(--text-lg); font-weight: 700; color: #312e81; }
.blk-practice__items { display: flex; flex-direction: column; gap: var(--space-3); }

.pi { padding: var(--space-4) var(--space-5); background: #fff; border-radius: var(--radius-xl); box-shadow: var(--shadow-xs); }
.pi__head { display: flex; align-items: baseline; gap: var(--space-3); margin-bottom: var(--space-3); }
.pi__mode { font-size: 0.6rem; font-weight: 800; color: #6366f1; text-transform: uppercase; letter-spacing: 0.1em; padding: 2px var(--space-2); background: #ede9fe; border-radius: var(--radius-full); flex-shrink: 0; }
.pi__q { font-size: var(--text-base); color: var(--color-text); font-weight: 500; flex: 1; }

.pi--reveal { display: flex; justify-content: space-between; align-items: center; gap: var(--space-4); cursor: pointer; }
.pi--reveal:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.pi__a { font-size: var(--text-sm); font-weight: 800; font-family: var(--font-cjk-jp); color: #4338ca; padding: var(--space-1) var(--space-4); background: #e0e7ff; border-radius: var(--radius-lg); }
.pi__a--hidden { font-family: var(--font-body); font-weight: 600; font-size: var(--text-xs); color: #6366f1; background: #c7d2fe; cursor: pointer; }

.pi__options { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2); }
.pi-opt { padding: var(--space-3) var(--space-4); background: #fff; border: 2px solid var(--color-border); border-radius: var(--radius-lg); font-size: var(--text-base); font-weight: 600; color: var(--color-text); font-family: var(--font-cjk-jp); cursor: pointer; transition: all var(--transition-fast); text-align: center; }
.pi-opt:not(:disabled):hover { border-color: #6366f1; }
.pi-opt--correct { border-color: #22c55e; background: #f0fdf4; color: #166534; }
.pi-opt--wrong { border-color: #ef4444; background: #fef2f2; color: #991b1b; }
.pi-opt:disabled:not(.pi-opt--correct):not(.pi-opt--wrong) { opacity: 0.4; }

.pi__input-row { display: flex; gap: var(--space-2); }
.pi__input { flex: 1; padding: var(--space-3) var(--space-4); border: 2px solid var(--color-border); border-radius: var(--radius-lg); font-size: var(--text-base); font-family: var(--font-cjk-jp); background: #fff; color: var(--color-text); outline: none; transition: border-color var(--transition-fast); }
.pi__input:focus { border-color: #6366f1; }
.pi__input--correct { border-color: #22c55e; background: #f0fdf4; }
.pi__input--wrong { border-color: #ef4444; background: #fef2f2; }
.pi__check { padding: var(--space-3) var(--space-5); background: #6366f1; color: #fff; border: none; border-radius: var(--radius-lg); font-size: var(--text-sm); font-weight: 700; cursor: pointer; transition: background var(--transition-fast); }
.pi__check:not(:disabled):hover { background: #4f46e5; }
.pi__check:disabled { opacity: 0.5; cursor: not-allowed; }
.pi__hint { margin-top: var(--space-2); font-size: var(--text-sm); color: #991b1b; background: #fef2f2; padding: var(--space-2) var(--space-3); border-radius: var(--radius-md); }
.pi__hint strong { font-family: var(--font-cjk-jp); }

.pi__speak-btn { display: flex; align-items: center; gap: var(--space-3); width: 100%; padding: var(--space-4) var(--space-5); background: #ede9fe; border: 2px solid #c7d2fe; border-radius: var(--radius-xl); font-size: var(--text-lg); font-weight: 700; color: #4338ca; font-family: var(--font-cjk-jp); cursor: pointer; transition: all var(--transition-fast); }
.pi__speak-btn:hover { background: #ddd6fe; border-color: #a5b4fc; transform: translateY(-2px); }
.pi__speak-btn svg { flex-shrink: 0; color: #6366f1; }

/* ═══ RESPONSIVE ═══ */
@media (max-width: 768px) {
  .contain--text { padding-left: var(--space-6); }
  .blk-text__deco { display: none; }
  .blk-rule__split { grid-template-columns: 1fr; gap: var(--space-4); }
  .blk-rule__left { position: static; }
  .blk-sh-lecon__big { font-size: 5rem; right: -10px; }
  .blk-sh-lecon__band { padding: var(--space-8) 0; }
  .blk-sh { padding: var(--space-12) 0 var(--space-4); }
  .blk-sh__title { font-size: clamp(2rem, 8vw, 3rem); }
  .blk-sh__sub { font-size: var(--text-base); }
  .blk-sh--split .contain { grid-template-columns: 1fr; gap: var(--space-4); }
  .blk-cta__grid { grid-template-columns: 1fr; gap: var(--space-5); text-align: center; }
  .blk-cta__right { justify-content: center; }
  .blk-board__chip { font-size: var(--text-xl); padding: var(--space-2) var(--space-4); }
  .blk-board__chips { gap: var(--space-2); }
  .dlg-msg { max-width: 88%; }
  .blk-dlg__line { display: none; }
  .dlg-msg__dot { display: none; }
  .blk-dlg__deco-char { display: none; }
  .blk-vt__grid { grid-template-columns: 1fr; }
  .pi__options { grid-template-columns: 1fr; }
  .blk-culture__section { padding-left: 50px; }
  .blk-culture__strip { width: 42px; }
  .blk-culture__watermark { display: none; }
}
</style>
