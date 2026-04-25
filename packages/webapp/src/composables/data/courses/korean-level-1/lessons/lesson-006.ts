import type { ILesson } from '../../lesson-types'
import { LESSON_CONTENT_TYPE, LESSON_EXERCISE_TYPE, PRACTICE_MODE } from '../../lesson-types'

const P = 'courses.korean.level1.l6'

export const LESSON_006: ILesson = {
  id: 6,
  level: 1,
  themeKey: 'food',

  words: [
    { id: 'meokda', word: '먹다', romanization: 'meokda', translation: 'eat', translationFr: 'manger', image: '/vocab/kr-l6/meokda.png' },
    { id: 'masida', word: '마시다', romanization: 'masida', translation: 'drink', translationFr: 'boire', image: '/vocab/kr-l6/masida.png' },
    { id: 'piuda', word: '피우다', romanization: 'piuda', translation: 'smoke (tobacco)', translationFr: 'fumer', image: '/vocab/kr-l6/piuda.png' },
    { id: 'boda', word: '보다', romanization: 'boda', translation: 'see, watch', translationFr: 'voir, regarder', image: '/vocab/kr-l6/boda.png' },
    { id: 'deutda', word: '듣다', romanization: 'deutda', translation: 'listen', translationFr: 'écouter', image: '/vocab/kr-l6/deutda.png' },
    { id: 'ilkda', word: '읽다', romanization: 'ikda', translation: 'read', translationFr: 'lire', image: '/vocab/kr-l6/ilkda.png' },
    { id: 'sseuda', word: '쓰다', romanization: 'sseuda', translation: 'write', translationFr: 'écrire', image: '/vocab/kr-l6/sseuda.png' },
    { id: 'sada', word: '사다', romanization: 'sada', translation: 'buy', translationFr: 'acheter', image: '/vocab/kr-l6/sada.png' },
    { id: 'jjikda', word: '찍다', romanization: 'jjikda', translation: 'take (a photo)', translationFr: 'prendre (une photo)', image: '/vocab/kr-l6/jjikda.png' },
    { id: 'mannada', word: '만나다', romanization: 'mannada', translation: 'meet', translationFr: 'rencontrer', image: '/vocab/kr-l6/mannada.png' },
    { id: 'bap', word: '밥', romanization: 'bap', translation: 'meal, rice', translationFr: 'repas, riz', image: '/vocab/kr-l6/bap.png' },
    { id: 'achim', word: '아침', romanization: 'achim', translation: 'breakfast, morning', translationFr: 'petit-déjeuner, matin', image: '/vocab/kr-l6/achim.png' },
    { id: 'jeomshim', word: '점심', romanization: 'jeomsim', translation: 'lunch', translationFr: 'déjeuner', image: '/vocab/kr-l6/jeomshim.png' },
    { id: 'jeonyeok', word: '저녁', romanization: 'jeonyeok', translation: 'dinner, evening', translationFr: 'dîner, soir', image: '/vocab/kr-l6/jeonyeok.png' },
    { id: 'ppang', word: '빵', romanization: 'ppang', translation: 'bread', translationFr: 'pain', image: '/vocab/kr-l6/ppang.png' },
    { id: 'gyeran', word: '계란', romanization: 'gyeran', translation: 'egg', translationFr: 'œuf', image: '/vocab/kr-l6/gyeran.png' },
    { id: 'gogi', word: '고기', romanization: 'gogi', translation: 'meat', translationFr: 'viande', image: '/vocab/kr-l6/gogi.png' },
    { id: 'saengseon', word: '생선', romanization: 'saengseon', translation: 'fish', translationFr: 'poisson', image: '/vocab/kr-l6/saengseon.png' },
    { id: 'yachae', word: '야채', romanization: 'yachae', translation: 'vegetables', translationFr: 'légumes', image: '/vocab/kr-l6/yachae.png' },
    { id: 'gwail', word: '과일', romanization: 'gwail', translation: 'fruit', translationFr: 'fruit', image: '/vocab/kr-l6/gwail.png' },
    { id: 'mul', word: '물', romanization: 'mul', translation: 'water', translationFr: 'eau', image: '/vocab/kr-l6/mul.png' },
    { id: 'cha', word: '차', romanization: 'cha', translation: 'tea', translationFr: 'thé', image: '/vocab/kr-l6/cha.png' },
    { id: 'nokcha', word: '녹차', romanization: 'nokcha', translation: 'green tea', translationFr: 'thé vert', image: '/vocab/kr-l6/nokcha.png' },
    { id: 'uyu', word: '우유', romanization: 'uyu', translation: 'milk', translationFr: 'lait', image: '/vocab/kr-l6/uyu.png' },
    { id: 'juseu', word: '주스', romanization: 'juseu', translation: 'juice', translationFr: 'jus', image: '/vocab/kr-l6/juseu.png' },
    { id: 'maekju', word: '맥주', romanization: 'maekju', translation: 'beer', translationFr: 'bière', image: '/vocab/kr-l6/maekju.png' },
    { id: 'sul', word: '술', romanization: 'sul', translation: 'alcohol', translationFr: 'alcool', image: '/vocab/kr-l6/sul.png' },
    { id: 'yeonghwa', word: '영화', romanization: 'yeonghwa', translation: 'movie', translationFr: 'film', image: '/vocab/kr-l6/yeonghwa.png' },
    { id: 'eumak', word: '음악', romanization: 'eumak', translation: 'music', translationFr: 'musique', image: '/vocab/kr-l6/eumak.png' },
    { id: 'pyeonji', word: '편지', romanization: 'pyeonji', translation: 'letter', translationFr: 'lettre', image: '/vocab/kr-l6/pyeonji.png' },
    { id: 'sajin', word: '사진', romanization: 'sajin', translation: 'photograph', translationFr: 'photographie', image: '/vocab/kr-l6/sajin.png' },
    { id: 'gage', word: '가게', romanization: 'gage', translation: 'shop', translationFr: 'magasin', image: '/vocab/kr-l6/gage.png' },
    { id: 'sikdang', word: '식당', romanization: 'sikdang', translation: 'restaurant', translationFr: 'restaurant', image: '/vocab/kr-l6/sikdang.png' },
  ],

  content: [
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shIntroEyebrow`, titleKey: `${P}.c.shIntroTitle`, subtitleKey: `${P}.c.intro`, highlightKey: `${P}.c.shIntroHl`, variant: 'split' } },

    // Part 1: direct object 을/를
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shObjEyebrow`, titleKey: `${P}.c.shObjTitle`, highlightKey: `${P}.c.shObjHl` } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardObjTitle`,
        structures: [
          { parts: [
            { text: '[thing]', color: '#3b82f6', labelKey: `${P}.c.lblThing` },
            { text: '을/를', color: '#ef4444', labelKey: `${P}.c.lblEulReul` },
            { text: '[verb]', color: '#22c55e', labelKey: `${P}.c.lblVerb` },
          ] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.objExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipEulReul` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: '밥을 먹어요.', romanization: 'babeul meogeoyo.', translationKey: `${P}.c.exEatRice` },
        { sentence: '물을 마셔요.', romanization: 'mureul masyeoyo.', translationKey: `${P}.c.exDrinkWater` },
        { sentence: '사진을 찍어요.', romanization: 'sajineul jjigeoyo.', translationKey: `${P}.c.exTakePhoto` },
        { sentence: '책을 읽어요.', romanization: 'chaegeul ilgeoyo.', translationKey: `${P}.c.exReadBook` },
      ],
    },
    {
      type: LESSON_CONTENT_TYPE.PRACTICE_INLINE,
      practiceInline: {
        instructionKey: `${P}.c.prObjInstr`,
        items: [
          { mode: PRACTICE_MODE.WRITE, promptKey: `${P}.c.prObjQ1`, answerKey: `${P}.c.prObjA1`, acceptedAnswers: ['을'] },
          { mode: PRACTICE_MODE.SELECT, promptKey: `${P}.c.prObjQ2`, answerKey: `${P}.c.prObjA2`, options: [
            { labelKey: `${P}.c.prObjA2` }, { labelKey: `${P}.c.prObjOpt2` }, { labelKey: `${P}.c.prObjOpt3` }, { labelKey: `${P}.c.prObjOpt4` },
          ] },
        ],
      },
    },

    // Part 2: place of action 에서
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shWhereEyebrow`, titleKey: `${P}.c.shWhereTitle`, highlightKey: `${P}.c.shWhereHl`, variant: 'split' } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardWhereTitle`,
        structures: [
          { parts: [
            { text: '[place]', color: '#3b82f6', labelKey: `${P}.c.lblPlace` },
            { text: '에서', color: '#ef4444', labelKey: `${P}.c.lblEseo` },
            { text: '[thing]', color: '#22c55e', labelKey: `${P}.c.lblThing2` },
            { text: '을/를', color: '#f59e0b', labelKey: `${P}.c.lblEulReul2` },
            { text: '[verb]', color: '#8b5cf6', labelKey: `${P}.c.lblVerb2` },
          ] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.whereExplain` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: '식당에서 점심을 먹어요.', romanization: 'sikdangeseo jeomsimeul meogeoyo.', translationKey: `${P}.c.exLunchResto` },
        { sentence: '도서관에서 책을 읽어요.', romanization: 'doseogwaneseo chaegeul ilgeoyo.', translationKey: `${P}.c.exReadLib` },
        { sentence: '슈퍼에서 야채를 사요.', romanization: 'syupeoeseo yachaereul sayo.', translationKey: `${P}.c.exBuyVeg` },
      ],
    },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaMidEyebrow`, titleKey: `${P}.c.ctaMidTitle`, subtitleKey: `${P}.c.ctaMidSub`, ctaLabelKey: `${P}.c.ctaMidLabel`, ctaHref: '/korean/level-1/lessons/6/exercises?difficulty=easy' } },

    // Part 3: invitations (-(으)ㄹ까요 / -아/어요 (suggestion))
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shInviteEyebrow`, titleKey: `${P}.c.shInviteTitle`, highlightKey: `${P}.c.shInviteHl` } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardInviteTitle`,
        structures: [
          { parts: [{ text: '[verb]-(으)ㄹ까요?', color: '#3b82f6', labelKey: `${P}.c.lblSuggest` }] },
          { parts: [{ text: '같이 [verb]-아/어요', color: '#22c55e', labelKey: `${P}.c.lblLetsGo` }] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.inviteExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipInvite` },
    {
      type: LESSON_CONTENT_TYPE.DIALOGUE,
      dialogue: [
        { speaker: '민수', sentence: '엠마 씨, 같이 점심 먹을까요?', romanization: 'emma ssi, gachi jeomsim meogeulkkayo?', translationKey: `${P}.c.dlg1` },
        { speaker: '엠마', sentence: '좋아요. 뭐 먹을까요?', romanization: 'joayo. mwo meogeulkkayo?', translationKey: `${P}.c.dlg2` },
        { speaker: '민수', sentence: '비빔밥 어때요?', romanization: 'bibimbap eottaeyo?', translationKey: `${P}.c.dlg3` },
        { speaker: '엠마', sentence: '좋아요! 가요.', romanization: 'joayo! gayo.', translationKey: `${P}.c.dlg4` },
      ],
    },
    { type: LESSON_CONTENT_TYPE.CULTURAL_NOTE, culturalTitleKey: `${P}.c.cultureTitle`, textKey: `${P}.c.cultureText` },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaFinalEyebrow`, titleKey: `${P}.c.ctaFinalTitle`, subtitleKey: `${P}.c.ctaFinalSub`, ctaLabelKey: `${P}.c.ctaFinalLabel`, ctaHref: '/korean/level-1/lessons/6/exercises?difficulty=medium' } },
  ],

  exercises: [
    { id: 'e1', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e1q`, options: [ { labelKey: `${P}.ex.e1a`, correct: true }, { labelKey: `${P}.ex.e1b`, correct: false }, { labelKey: `${P}.ex.e1c`, correct: false }, { labelKey: `${P}.ex.e1d`, correct: false } ] },
    { id: 'e2', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e2q`, options: [ { labelKey: `${P}.ex.e2a`, correct: false }, { labelKey: `${P}.ex.e2b`, correct: true }, { labelKey: `${P}.ex.e2c`, correct: false }, { labelKey: `${P}.ex.e2d`, correct: false } ] },
    { id: 'e3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '밥___ 먹어요.', answer: '을' },
    { id: 'e4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '식당___ 먹어요.', answer: '에서' },
    { id: 'e5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e5q`, options: [ { labelKey: `${P}.ex.e5a`, correct: false }, { labelKey: `${P}.ex.e5b`, correct: false }, { labelKey: `${P}.ex.e5c`, correct: true }, { labelKey: `${P}.ex.e5d`, correct: false } ] },
    { id: 'e6', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '커피를 마___요.', answer: '셔' },

    { id: 'm1', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['슈퍼에서', '야채를', '사요'] },
    { id: 'm2', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'medium', sourceKey: `${P}.ex.m2src`, targetAnswer: '책을 읽어요', acceptedAnswers: ['책을 읽어요', '책을 읽어요.'] },
    { id: 'm3', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m3q`, options: [ { labelKey: `${P}.ex.m3a`, correct: false }, { labelKey: `${P}.ex.m3b`, correct: true }, { labelKey: `${P}.ex.m3c`, correct: false }, { labelKey: `${P}.ex.m3d`, correct: false } ] },
    { id: 'm4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'medium', sentenceTemplate: '같이 먹___?', answer: '을까요' },
    { id: 'm5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m5q`, options: [ { labelKey: `${P}.ex.m5a`, correct: true }, { labelKey: `${P}.ex.m5b`, correct: false }, { labelKey: `${P}.ex.m5c`, correct: false }, { labelKey: `${P}.ex.m5d`, correct: false } ] },
    { id: 'm6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['영화를', '같이', '볼까요'] },

    { id: 'h1', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h1src`, targetAnswer: '식당에서 저녁을 먹었어요', acceptedAnswers: ['식당에서 저녁을 먹었어요', '식당에서 저녁을 먹었어요.'] },
    { id: 'h2', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['같이', '커피를', '마실까요'] },
    { id: 'h3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'hard', sentenceTemplate: '도서관___ 책___ 읽어요.', answer: '에서／을' },
    { id: 'h4', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h4src`, targetAnswer: '친구하고 영화를 봤어요', acceptedAnswers: ['친구하고 영화를 봤어요', '친구와 영화를 봤어요'] },
    { id: 'h5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'hard', questionKey: `${P}.ex.h5q`, options: [ { labelKey: `${P}.ex.h5a`, correct: false }, { labelKey: `${P}.ex.h5b`, correct: true }, { labelKey: `${P}.ex.h5c`, correct: false }, { labelKey: `${P}.ex.h5d`, correct: false } ] },
    { id: 'h6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['가게에서', '선물을', '샀어요'] },
  ],
}
