import type { ILesson } from '../../lesson-types'
import { LESSON_CONTENT_TYPE, LESSON_EXERCISE_TYPE, PRACTICE_MODE } from '../../lesson-types'

const P = 'courses.korean.level1.l2'

export const LESSON_002: ILesson = {
  id: 2,
  themeKey: 'numbers',

  // ═══════════════════════════════════════════════════════
  // VOCABULARY — Sino-Korean numbers 1-10
  // ═══════════════════════════════════════════════════════
  words: [
    { id: 'zero', word: '영', romanization: 'yeong', translation: 'Zero', translationFr: 'Zéro', emoji: '0️⃣' },
    { id: 'one', word: '일', romanization: 'il', translation: 'One', translationFr: 'Un', emoji: '1️⃣' },
    { id: 'two', word: '이', romanization: 'i', translation: 'Two', translationFr: 'Deux', emoji: '2️⃣' },
    { id: 'three', word: '삼', romanization: 'sam', translation: 'Three', translationFr: 'Trois', emoji: '3️⃣' },
    { id: 'four', word: '사', romanization: 'sa', translation: 'Four', translationFr: 'Quatre', emoji: '4️⃣' },
    { id: 'five', word: '오', romanization: 'o', translation: 'Five', translationFr: 'Cinq', emoji: '5️⃣' },
    { id: 'six', word: '육', romanization: 'yuk', translation: 'Six', translationFr: 'Six', emoji: '6️⃣' },
    { id: 'seven', word: '칠', romanization: 'chil', translation: 'Seven', translationFr: 'Sept', emoji: '7️⃣' },
    { id: 'eight', word: '팔', romanization: 'pal', translation: 'Eight', translationFr: 'Huit', emoji: '8️⃣' },
    { id: 'nine', word: '구', romanization: 'gu', translation: 'Nine', translationFr: 'Neuf', emoji: '9️⃣' },
    { id: 'ten', word: '십', romanization: 'sip', translation: 'Ten', translationFr: 'Dix', emoji: '🔟' },
    { id: 'hundred', word: '백', romanization: 'baek', translation: 'Hundred', translationFr: 'Cent', emoji: '💯' },
  ],

  // ═══════════════════════════════════════════════════════
  // COURSE CONTENT
  // ═══════════════════════════════════════════════════════
  content: [
    // ── Section 1: Introduction ──
    {
      type: LESSON_CONTENT_TYPE.SECTION_HEADER,
      sectionHeader: {
        eyebrowKey: `${P}.c.shIntroEyebrow`,
        titleKey: `${P}.c.shIntroTitle`,
        subtitleKey: `${P}.c.intro`,
        highlightKey: `${P}.c.shIntroHl`,
        variant: 'split',
      },
    },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipTwoSystems` },

    // ── Section 2: Numbers 1-5 ──
    {
      type: LESSON_CONTENT_TYPE.SECTION_HEADER,
      sectionHeader: {
        eyebrowKey: `${P}.c.sh1to5Eyebrow`,
        titleKey: `${P}.c.sh1to5Title`,
        highlightKey: `${P}.c.sh1to5Hl`,
      },
    },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.board1to5Title`,
        structures: [
          {
            parts: [
              { text: '일', color: '#3b82f6', labelKey: `${P}.c.lbl1` },
              { text: '이', color: '#8b5cf6', labelKey: `${P}.c.lbl2` },
              { text: '삼', color: '#ec4899', labelKey: `${P}.c.lbl3` },
              { text: '사', color: '#f59e0b', labelKey: `${P}.c.lbl4` },
              { text: '오', color: '#10b981', labelKey: `${P}.c.lbl5` },
            ],
          },
        ],
      },
    },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: '일 더하기 일은 이.', romanization: 'il deohagi ileun i.', translationKey: `${P}.c.ex1plus1` },
        { sentence: '커피 두 잔 주세요.', romanization: 'keopi du jan juseyo.', translationKey: `${P}.c.exCoffee` },
        { sentence: '오 분 후에 갑니다.', romanization: 'o bun hue gamnida.', translationKey: `${P}.c.ex5min` },
      ],
    },
    {
      type: LESSON_CONTENT_TYPE.PRACTICE_INLINE,
      practiceInline: {
        instructionKey: `${P}.c.pr1to5Instr`,
        items: [
          // SELECT — pick the right Korean character for "3"
          {
            mode: PRACTICE_MODE.SELECT,
            promptKey: `${P}.c.pr1to5Q1`,
            answerKey: `${P}.c.pr1to5A1`,
            options: [
              { labelKey: `${P}.c.pr1to5O1a` },
              { labelKey: `${P}.c.pr1to5A1` },  // correct = 삼
              { labelKey: `${P}.c.pr1to5O1c` },
              { labelKey: `${P}.c.pr1to5O1d` },
            ],
          },
          // WRITE — type the Korean character for "1"
          {
            mode: PRACTICE_MODE.WRITE,
            promptKey: `${P}.c.pr1to5Q2`,
            answerKey: `${P}.c.pr1to5A2`,
            acceptedAnswers: ['일', 'il'],
          },
          // SPEAK — click to hear "5", then reveal
          {
            mode: PRACTICE_MODE.SPEAK,
            promptKey: `${P}.c.pr1to5Q3`,
            answerKey: `${P}.c.pr1to5A3`,
            speakText: '오',
          },
        ],
      },
    },

    // ── Section 3: Numbers 6-10 ──
    {
      type: LESSON_CONTENT_TYPE.SECTION_HEADER,
      sectionHeader: {
        eyebrowKey: `${P}.c.sh6to10Eyebrow`,
        titleKey: `${P}.c.sh6to10Title`,
        highlightKey: `${P}.c.sh6to10Hl`,
        variant: 'split',
      },
    },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.board6to10Title`,
        structures: [
          {
            parts: [
              { text: '육', color: '#3b82f6', labelKey: `${P}.c.lbl6` },
              { text: '칠', color: '#8b5cf6', labelKey: `${P}.c.lbl7` },
              { text: '팔', color: '#ec4899', labelKey: `${P}.c.lbl8` },
              { text: '구', color: '#f59e0b', labelKey: `${P}.c.lbl9` },
              { text: '십', color: '#10b981', labelKey: `${P}.c.lbl10` },
            ],
          },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipYuk` },

    // CTA after halfway — practice easy
    {
      type: LESSON_CONTENT_TYPE.SECTION_CTA,
      sectionCta: {
        eyebrowKey: `${P}.c.ctaMidEyebrow`,
        titleKey: `${P}.c.ctaMidTitle`,
        subtitleKey: `${P}.c.ctaMidSub`,
        ctaLabelKey: `${P}.c.ctaMidLabel`,
        ctaHref: '/korean/level-1/lessons/2/exercises?difficulty=easy',
      },
    },

    // ── Section 4: Combining numbers ──
    {
      type: LESSON_CONTENT_TYPE.SECTION_HEADER,
      sectionHeader: {
        eyebrowKey: `${P}.c.shBigEyebrow`,
        titleKey: `${P}.c.shBigTitle`,
        highlightKey: `${P}.c.shBigHl`,
      },
    },
    {
      type: LESSON_CONTENT_TYPE.RULE,
      rule: {
        patternKey: `${P}.c.ruleBigPattern`,
        explanationKey: `${P}.c.ruleBigExplain`,
        examples: [
          { sentence: '십일', romanization: 'sibil', translationKey: `${P}.c.ex11` },
          { sentence: '이십', romanization: 'isip', translationKey: `${P}.c.ex20` },
          { sentence: '삼십오', romanization: 'samsip o', translationKey: `${P}.c.ex35` },
          { sentence: '백', romanization: 'baek', translationKey: `${P}.c.ex100` },
        ],
      },
    },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: '이십삼', romanization: 'isipsam', translationKey: `${P}.c.ex23` },
        { sentence: '사십칠', romanization: 'sasipchil', translationKey: `${P}.c.ex47` },
        { sentence: '구십구', romanization: 'gusipgu', translationKey: `${P}.c.ex99` },
      ],
    },

    // ── Section 5: Phone numbers ──
    {
      type: LESSON_CONTENT_TYPE.SECTION_HEADER,
      sectionHeader: {
        eyebrowKey: `${P}.c.shPhoneEyebrow`,
        titleKey: `${P}.c.shPhoneTitle`,
        highlightKey: `${P}.c.shPhoneHl`,
        variant: 'split',
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.phoneExplain` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE,
      example: { sentence: '공일공 - 일이삼사 - 오육칠팔', romanization: 'gong-il-gong - il-i-sam-sa - o-yuk-chil-pal', translationKey: `${P}.c.exPhone` },
    },
    {
      type: LESSON_CONTENT_TYPE.DIALOGUE,
      dialogue: [
        { speaker: '민수', sentence: '전화번호가 뭐예요?', romanization: 'jeonhwa beonhoga mwoyeyo?', translationKey: `${P}.c.dlgPhone1` },
        { speaker: 'Emma', sentence: '공일공 - 이삼사오 - 육칠팔구 입니다.', romanization: 'gong-il-gong - i-sam-sa-o - yuk-chil-pal-gu imnida.', translationKey: `${P}.c.dlgPhone2` },
        { speaker: '민수', sentence: '감사합니다!', romanization: 'gamsahamnida!', translationKey: `${P}.c.dlgPhone3` },
      ],
    },
    {
      type: LESSON_CONTENT_TYPE.CULTURAL_NOTE,
      culturalTitleKey: `${P}.c.culturePhoneTitle`,
      textKey: `${P}.c.culturePhoneText`,
    },

    // Final CTA — medium exercises
    {
      type: LESSON_CONTENT_TYPE.SECTION_CTA,
      sectionCta: {
        eyebrowKey: `${P}.c.ctaFinalEyebrow`,
        titleKey: `${P}.c.ctaFinalTitle`,
        subtitleKey: `${P}.c.ctaFinalSub`,
        ctaLabelKey: `${P}.c.ctaFinalLabel`,
        ctaHref: '/korean/level-1/lessons/2/exercises?difficulty=medium',
      },
    },

    // ── Section 6: Bonus — Native Korean numbers ──
    {
      type: LESSON_CONTENT_TYPE.SECTION_HEADER,
      sectionHeader: {
        eyebrowKey: `${P}.c.shNativeEyebrow`,
        titleKey: `${P}.c.shNativeTitle`,
        highlightKey: `${P}.c.shNativeHl`,
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.nativeIntro` },
    {
      type: LESSON_CONTENT_TYPE.VOCABULARY_TABLE,
      vocabTable: {
        titleKey: `${P}.c.nativeTableTitle`,
        items: [
          { word: '하나', romanization: 'hana', translationKey: `${P}.c.nat1` },
          { word: '둘', romanization: 'dul', translationKey: `${P}.c.nat2` },
          { word: '셋', romanization: 'set', translationKey: `${P}.c.nat3` },
          { word: '넷', romanization: 'net', translationKey: `${P}.c.nat4` },
          { word: '다섯', romanization: 'daseot', translationKey: `${P}.c.nat5` },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipWhenToUse` },
  ],

  // ═══════════════════════════════════════════════════════
  // EXERCISES
  // ═══════════════════════════════════════════════════════
  exercises: [
    // Easy (6)
    {
      id: 'e1', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy',
      questionKey: `${P}.ex.e1q`,
      options: [
        { labelKey: `${P}.ex.e1a`, correct: true },
        { labelKey: `${P}.ex.e1b`, correct: false },
        { labelKey: `${P}.ex.e1c`, correct: false },
        { labelKey: `${P}.ex.e1d`, correct: false },
      ],
    },
    {
      id: 'e2', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy',
      questionKey: `${P}.ex.e2q`,
      options: [
        { labelKey: `${P}.ex.e2a`, correct: false },
        { labelKey: `${P}.ex.e2b`, correct: true },
        { labelKey: `${P}.ex.e2c`, correct: false },
        { labelKey: `${P}.ex.e2d`, correct: false },
      ],
    },
    { id: 'e3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '1 → ___', answer: '일' },
    { id: 'e4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '5 → ___', answer: '오' },
    { id: 'e5', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '10 → ___', answer: '십' },
    {
      id: 'e6', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy',
      questionKey: `${P}.ex.e6q`,
      options: [
        { labelKey: `${P}.ex.e6a`, correct: false },
        { labelKey: `${P}.ex.e6b`, correct: false },
        { labelKey: `${P}.ex.e6c`, correct: true },
        { labelKey: `${P}.ex.e6d`, correct: false },
      ],
    },

    // Medium (6)
    { id: 'm1', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'medium', sentenceTemplate: '20 → ___', answer: '이십' },
    { id: 'm2', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'medium', sentenceTemplate: '35 → 삼___오', answer: '십' },
    {
      id: 'm3', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'medium',
      sourceKey: `${P}.ex.m3src`,
      targetAnswer: '사십',
      acceptedAnswers: ['사십'],
    },
    {
      id: 'm4', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium',
      questionKey: `${P}.ex.m4q`,
      options: [
        { labelKey: `${P}.ex.m4a`, correct: false },
        { labelKey: `${P}.ex.m4b`, correct: true },
        { labelKey: `${P}.ex.m4c`, correct: false },
        { labelKey: `${P}.ex.m4d`, correct: false },
      ],
    },
    { id: 'm5', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['전화번호가', '뭐예요', '?'] },
    { id: 'm6', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'medium', sentenceTemplate: '99 → 구___구', answer: '십' },

    // Hard (6)
    {
      id: 'h1', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard',
      sourceKey: `${P}.ex.h1src`,
      targetAnswer: '칠십사',
      acceptedAnswers: ['칠십사'],
    },
    {
      id: 'h2', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard',
      sourceKey: `${P}.ex.h2src`,
      targetAnswer: '백',
      acceptedAnswers: ['백', '일백'],
    },
    { id: 'h3', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['커피', '두', '잔', '주세요'] },
    {
      id: 'h4', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'hard',
      questionKey: `${P}.ex.h4q`,
      options: [
        { labelKey: `${P}.ex.h4a`, correct: true },
        { labelKey: `${P}.ex.h4b`, correct: false },
        { labelKey: `${P}.ex.h4c`, correct: false },
        { labelKey: `${P}.ex.h4d`, correct: false },
      ],
    },
    { id: 'h5', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'hard', sentenceTemplate: '88 → 팔___팔', answer: '십' },
    {
      id: 'h6', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard',
      sourceKey: `${P}.ex.h6src`,
      targetAnswer: '오 분 후에 갑니다',
      acceptedAnswers: ['오 분 후에 갑니다', '오분후에갑니다'],
    },
  ],
}
