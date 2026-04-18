import type { ILesson } from '../../lesson-types'
import { LESSON_CONTENT_TYPE, LESSON_EXERCISE_TYPE, PRACTICE_MODE } from '../../lesson-types'

const P = 'courses.japanese.level1.l2'

export const LESSON_002: ILesson = {
  id: 2,
  themeKey: 'objects',

  // ═══════════════════════════════════════════════════════
  // VOCABULARY — Everyday objects & demonstratives
  // ═══════════════════════════════════════════════════════
  words: [
    { id: 'hon', word: 'ほん', romanization: 'hon', translation: 'book', translationFr: 'livre', image: '/vocab/jp-l2/hon.png' },
    { id: 'jisho', word: 'じしょ', romanization: 'jisho', translation: 'dictionary', translationFr: 'dictionnaire', image: '/vocab/jp-l2/jisho.png' },
    { id: 'zasshi', word: 'ざっし', romanization: 'zasshi', translation: 'magazine', translationFr: 'magazine', image: '/vocab/jp-l2/zasshi.png' },
    { id: 'shinbun', word: 'しんぶん', romanization: 'shinbun', translation: 'newspaper', translationFr: 'journal', image: '/vocab/jp-l2/shinbun.png' },
    { id: 'noto', word: 'ノート', romanization: 'nōto', translation: 'notebook', translationFr: 'cahier', image: '/vocab/jp-l2/noto.png' },
    { id: 'techo', word: 'てちょう', romanization: 'techō', translation: 'pocket notebook', translationFr: 'carnet de poche', image: '/vocab/jp-l2/techo.png' },
    { id: 'meishi', word: 'めいし', romanization: 'meishi', translation: 'business card', translationFr: 'carte de visite', image: '/vocab/jp-l2/meishi.png' },
    { id: 'kado', word: 'カード', romanization: 'kādo', translation: 'card', translationFr: 'carte', image: '/vocab/jp-l2/kado.png' },
    { id: 'enpitsu', word: 'えんぴつ', romanization: 'enpitsu', translation: 'pencil', translationFr: 'crayon', image: '/vocab/jp-l2/enpitsu.png' },
    { id: 'borupen', word: 'ボールペン', romanization: 'bōrupen', translation: 'ballpoint pen', translationFr: 'stylo bille', image: '/vocab/jp-l2/borupen.png' },
    { id: 'shapu', word: 'シャープペンシル', romanization: 'shāpupenshiru', translation: 'mechanical pencil', translationFr: 'porte-mine', image: '/vocab/jp-l2/shapu.png' },
    { id: 'kagi', word: 'かぎ', romanization: 'kagi', translation: 'key', translationFr: 'clé', image: '/vocab/jp-l2/kagi.png' },
    { id: 'tokei', word: 'とけい', romanization: 'tokei', translation: 'watch, clock', translationFr: 'montre, horloge', image: '/vocab/jp-l2/tokei.png' },
    { id: 'kasa', word: 'かさ', romanization: 'kasa', translation: 'umbrella', translationFr: 'parapluie', image: '/vocab/jp-l2/kasa.png' },
    { id: 'kaban', word: 'かばん', romanization: 'kaban', translation: 'bag, briefcase', translationFr: 'sac, mallette', image: '/vocab/jp-l2/kaban.png' },
    { id: 'terebi', word: 'テレビ', romanization: 'terebi', translation: 'television', translationFr: 'télévision', image: '/vocab/jp-l2/terebi.png' },
    { id: 'rajio', word: 'ラジオ', romanization: 'rajio', translation: 'radio', translationFr: 'radio', image: '/vocab/jp-l2/rajio.png' },
    { id: 'kamera', word: 'カメラ', romanization: 'kamera', translation: 'camera', translationFr: 'appareil photo', image: '/vocab/jp-l2/kamera.png' },
    { id: 'konpyuta', word: 'コンピューター', romanization: 'konpyūtā', translation: 'computer', translationFr: 'ordinateur', image: '/vocab/jp-l2/konpyuta.png' },
    { id: 'kuruma', word: 'くるま', romanization: 'kuruma', translation: 'car', translationFr: 'voiture', image: '/vocab/jp-l2/kuruma.png' },
    { id: 'tsukue', word: 'つくえ', romanization: 'tsukue', translation: 'desk', translationFr: 'bureau (meuble)', image: '/vocab/jp-l2/tsukue.png' },
    { id: 'isu', word: 'いす', romanization: 'isu', translation: 'chair', translationFr: 'chaise', image: '/vocab/jp-l2/isu.png' },
    { id: 'chokoreto', word: 'チョコレート', romanization: 'chokorēto', translation: 'chocolate', translationFr: 'chocolat', image: '/vocab/jp-l2/chokoreto.png' },
    { id: 'kohi', word: 'コーヒー', romanization: 'kōhī', translation: 'coffee', translationFr: 'café', image: '/vocab/jp-l2/kohi.png' },
  ],

  // ═══════════════════════════════════════════════════════
  // COURSE CONTENT
  // ═══════════════════════════════════════════════════════
  content: [
    // ── Intro ──
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

    // ── Part 1: kore / sore / are ──
    {
      type: LESSON_CONTENT_TYPE.SECTION_HEADER,
      sectionHeader: {
        eyebrowKey: `${P}.c.shDemoEyebrow`,
        titleKey: `${P}.c.shDemoTitle`,
        highlightKey: `${P}.c.shDemoHl`,
      },
    },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardDemoTitle`,
        structures: [
          { parts: [{ text: 'これ', color: '#3b82f6', labelKey: `${P}.c.lblKore` }] },
          { parts: [{ text: 'それ', color: '#22c55e', labelKey: `${P}.c.lblSore` }] },
          { parts: [{ text: 'あれ', color: '#f59e0b', labelKey: `${P}.c.lblAre` }] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.demoExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipKoSoA` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: 'これは ほんです。', romanization: 'kore wa hon desu.', translationKey: `${P}.c.exKore` },
        { sentence: 'それは じしょですか。', romanization: 'sore wa jisho desu ka.', translationKey: `${P}.c.exSore` },
        { sentence: 'あれは かばんです。', romanization: 'are wa kaban desu.', translationKey: `${P}.c.exAre` },
      ],
    },
    {
      type: LESSON_CONTENT_TYPE.PRACTICE_INLINE,
      practiceInline: {
        instructionKey: `${P}.c.prDemoInstr`,
        items: [
          {
            mode: PRACTICE_MODE.SELECT,
            promptKey: `${P}.c.prDemoQ1`,
            answerKey: `${P}.c.prDemoA1`,
            options: [
              { labelKey: `${P}.c.prDemoA1` },
              { labelKey: `${P}.c.prDemoOpt2` },
              { labelKey: `${P}.c.prDemoOpt3` },
              { labelKey: `${P}.c.prDemoOpt4` },
            ],
          },
          { mode: PRACTICE_MODE.WRITE, promptKey: `${P}.c.prDemoQ2`, answerKey: `${P}.c.prDemoA2`, acceptedAnswers: ['それ'] },
        ],
      },
    },

    // ── Part 2: 何ですか / questions ──
    {
      type: LESSON_CONTENT_TYPE.SECTION_HEADER,
      sectionHeader: {
        eyebrowKey: `${P}.c.shQEyebrow`,
        titleKey: `${P}.c.shQTitle`,
        highlightKey: `${P}.c.shQHl`,
        variant: 'split',
      },
    },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardQTitle`,
        structures: [
          {
            parts: [
              { text: 'これ', color: '#3b82f6', labelKey: `${P}.c.lblSubject` },
              { text: 'は', color: '#ef4444', labelKey: `${P}.c.lblParticle` },
              { text: 'なん', color: '#f59e0b', labelKey: `${P}.c.lblWhat` },
              { text: 'です', color: '#8b5cf6', labelKey: `${P}.c.lblCopula` },
              { text: 'か', color: '#ec4899', labelKey: `${P}.c.lblQ` },
            ],
          },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.qExplain` },
    {
      type: LESSON_CONTENT_TYPE.DIALOGUE,
      dialogue: [
        { speaker: 'マイク', sentence: 'これは 何ですか。', romanization: 'kore wa nan desu ka.', translationKey: `${P}.c.dlg1` },
        { speaker: '田中', sentence: 'それは めいしです。', romanization: 'sore wa meishi desu.', translationKey: `${P}.c.dlg2` },
        { speaker: 'マイク', sentence: 'あれも めいしですか。', romanization: 'are mo meishi desu ka.', translationKey: `${P}.c.dlg3` },
        { speaker: '田中', sentence: 'いいえ、あれは カードです。', romanization: 'iie, are wa kādo desu.', translationKey: `${P}.c.dlg4` },
      ],
    },

    // Mid CTA
    {
      type: LESSON_CONTENT_TYPE.SECTION_CTA,
      sectionCta: {
        eyebrowKey: `${P}.c.ctaMidEyebrow`,
        titleKey: `${P}.c.ctaMidTitle`,
        subtitleKey: `${P}.c.ctaMidSub`,
        ctaLabelKey: `${P}.c.ctaMidLabel`,
        ctaHref: '/japanese/level-1/lessons/2/exercises?difficulty=easy',
      },
    },

    // ── Part 3: possessive の ──
    {
      type: LESSON_CONTENT_TYPE.SECTION_HEADER,
      sectionHeader: {
        eyebrowKey: `${P}.c.shNoEyebrow`,
        titleKey: `${P}.c.shNoTitle`,
        highlightKey: `${P}.c.shNoHl`,
      },
    },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardNoTitle`,
        structures: [
          {
            parts: [
              { text: '[A]', color: '#3b82f6', labelKey: `${P}.c.lblOwner` },
              { text: 'の', color: '#ef4444', labelKey: `${P}.c.lblNo` },
              { text: '[B]', color: '#22c55e', labelKey: `${P}.c.lblThing` },
            ],
          },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.noExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipNo` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: 'わたしの かばんです。', romanization: 'watashi no kaban desu.', translationKey: `${P}.c.exMyBag` },
        { sentence: 'これは ミラーさんの ほんです。', romanization: 'kore wa mirā-san no hon desu.', translationKey: `${P}.c.exMikeBook` },
        { sentence: '日本語の じしょです。', romanization: 'nihongo no jisho desu.', translationKey: `${P}.c.exJpDict` },
      ],
    },
    {
      type: LESSON_CONTENT_TYPE.VOCABULARY_TABLE,
      vocabTable: {
        titleKey: `${P}.c.objectsTitle`,
        items: [
          { word: 'ほん', romanization: 'hon', translationKey: `${P}.c.vtBook` },
          { word: 'じしょ', romanization: 'jisho', translationKey: `${P}.c.vtDict` },
          { word: 'かばん', romanization: 'kaban', translationKey: `${P}.c.vtBag` },
          { word: 'とけい', romanization: 'tokei', translationKey: `${P}.c.vtWatch` },
          { word: 'かぎ', romanization: 'kagi', translationKey: `${P}.c.vtKey` },
          { word: 'コンピューター', romanization: 'konpyūtā', translationKey: `${P}.c.vtComputer` },
        ],
      },
    },
    {
      type: LESSON_CONTENT_TYPE.PRACTICE_INLINE,
      practiceInline: {
        instructionKey: `${P}.c.prNoInstr`,
        items: [
          { mode: PRACTICE_MODE.WRITE, promptKey: `${P}.c.prNoQ1`, answerKey: `${P}.c.prNoA1`, acceptedAnswers: ['の'] },
          { mode: PRACTICE_MODE.SPEAK, promptKey: `${P}.c.prNoQ2`, answerKey: `${P}.c.prNoA2`, speakText: 'わたしの ほんです' },
        ],
      },
    },

    { type: LESSON_CONTENT_TYPE.CULTURAL_NOTE, culturalTitleKey: `${P}.c.cultureTitle`, textKey: `${P}.c.cultureText` },

    // Final CTA
    {
      type: LESSON_CONTENT_TYPE.SECTION_CTA,
      sectionCta: {
        eyebrowKey: `${P}.c.ctaFinalEyebrow`,
        titleKey: `${P}.c.ctaFinalTitle`,
        subtitleKey: `${P}.c.ctaFinalSub`,
        ctaLabelKey: `${P}.c.ctaFinalLabel`,
        ctaHref: '/japanese/level-1/lessons/2/exercises?difficulty=medium',
      },
    },
  ],

  // ═══════════════════════════════════════════════════════
  // EXERCISES
  // ═══════════════════════════════════════════════════════
  exercises: [
    // Easy
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
    { id: 'e3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: 'これは ほん___。', answer: 'です' },
    { id: 'e4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: 'わたし___ かばんです。', answer: 'の' },
    {
      id: 'e5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy',
      questionKey: `${P}.ex.e5q`,
      options: [
        { labelKey: `${P}.ex.e5a`, correct: false },
        { labelKey: `${P}.ex.e5b`, correct: true },
        { labelKey: `${P}.ex.e5c`, correct: false },
        { labelKey: `${P}.ex.e5d`, correct: false },
      ],
    },
    { id: 'e6', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: 'これは 何___。', answer: 'ですか' },

    // Medium
    { id: 'm1', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['これ', 'は', 'わたし', 'の', 'ほん', 'です'] },
    {
      id: 'm2', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'medium',
      sourceKey: `${P}.ex.m2src`,
      targetAnswer: 'それは じしょです',
      acceptedAnswers: ['それは じしょです。', 'それはじしょです', 'それはじしょです。'],
    },
    {
      id: 'm3', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium',
      questionKey: `${P}.ex.m3q`,
      options: [
        { labelKey: `${P}.ex.m3a`, correct: false },
        { labelKey: `${P}.ex.m3b`, correct: true },
        { labelKey: `${P}.ex.m3c`, correct: false },
        { labelKey: `${P}.ex.m3d`, correct: false },
      ],
    },
    { id: 'm4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'medium', sentenceTemplate: 'あれは ___ですか。', answer: '何' },
    {
      id: 'm5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium',
      questionKey: `${P}.ex.m5q`,
      options: [
        { labelKey: `${P}.ex.m5a`, correct: true },
        { labelKey: `${P}.ex.m5b`, correct: false },
        { labelKey: `${P}.ex.m5c`, correct: false },
        { labelKey: `${P}.ex.m5d`, correct: false },
      ],
    },
    { id: 'm6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['それ', 'は', '日本語', 'の', 'ざっし', 'です'] },

    // Hard
    {
      id: 'h1', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard',
      sourceKey: `${P}.ex.h1src`,
      targetAnswer: 'これは ミラーさんの かばんです',
      acceptedAnswers: ['これはミラーさんのかばんです', 'これは ミラーさんの かばんです。'],
    },
    { id: 'h2', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['あれ', 'も', 'わたし', 'の', 'ほん', 'です'] },
    { id: 'h3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'hard', sentenceTemplate: 'これは わたし___ カメラ___。', answer: 'の／です' },
    {
      id: 'h4', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard',
      sourceKey: `${P}.ex.h4src`,
      targetAnswer: 'それは 何ですか',
      acceptedAnswers: ['それはなんですか', 'それは何ですか', 'それは 何ですか。'],
    },
    {
      id: 'h5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'hard',
      questionKey: `${P}.ex.h5q`,
      options: [
        { labelKey: `${P}.ex.h5a`, correct: false },
        { labelKey: `${P}.ex.h5b`, correct: true },
        { labelKey: `${P}.ex.h5c`, correct: false },
        { labelKey: `${P}.ex.h5d`, correct: false },
      ],
    },
    { id: 'h6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['これ', 'は', '何', 'の', 'ほん', 'です', 'か'] },
  ],
}
