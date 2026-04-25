import type { ILesson } from '../../lesson-types'
import { LESSON_CONTENT_TYPE, LESSON_EXERCISE_TYPE, PRACTICE_MODE } from '../../lesson-types'

const P = 'courses.korean.level1.l8'

export const LESSON_008: ILesson = {
  id: 8,
  level: 1,
  themeKey: 'adjectives',

  words: [
    // Descriptive verbs (adjectives)
    { id: 'jalsaenggida', word: '잘생기다', romanization: 'jalsaenggida', translation: 'handsome', translationFr: 'beau, élégant', image: '/vocab/kr-l8/jalsaenggida.png' },
    { id: 'yeppeuda', word: '예쁘다', romanization: 'yeppeuda', translation: 'pretty, beautiful', translationFr: 'beau, joli', image: '/vocab/kr-l8/yeppeuda.png' },
    { id: 'joyonghada', word: '조용하다', romanization: 'joyonghada', translation: 'quiet', translationFr: 'calme', image: '/vocab/kr-l8/joyonghada.png' },
    { id: 'siggeureopda', word: '시끄럽다', romanization: 'siggeureopda', translation: 'noisy, lively', translationFr: 'bruyant, animé', image: '/vocab/kr-l8/siggeureopda.png' },
    { id: 'yumyeonghada', word: '유명하다', romanization: 'yumyeonghada', translation: 'famous', translationFr: 'célèbre', image: '/vocab/kr-l8/yumyeonghada.png' },
    { id: 'chinjeolhada', word: '친절하다', romanization: 'chinjeolhada', translation: 'kind', translationFr: 'gentil', image: '/vocab/kr-l8/chinjeolhada.png' },
    { id: 'geonganghada', word: '건강하다', romanization: 'geonganghada', translation: 'healthy', translationFr: 'en bonne santé', image: '/vocab/kr-l8/geonganghada.png' },
    { id: 'hangahada', word: '한가하다', romanization: 'hangahada', translation: 'free (time)', translationFr: 'libre (temps)', image: '/vocab/kr-l8/hangahada.png' },
    { id: 'pyeonhada', word: '편하다', romanization: 'pyeonhada', translation: 'convenient, comfortable', translationFr: 'pratique, confortable', image: '/vocab/kr-l8/pyeonhada.png' },
    { id: 'meotjida', word: '멋지다', romanization: 'meotjida', translation: 'nice, wonderful', translationFr: 'magnifique', image: '/vocab/kr-l8/meotjida.png' },
    // Pure Korean adjectives
    { id: 'keuda', word: '크다', romanization: 'keuda', translation: 'big', translationFr: 'grand', image: '/vocab/kr-l8/keuda.png' },
    { id: 'jakda', word: '작다', romanization: 'jakda', translation: 'small', translationFr: 'petit', image: '/vocab/kr-l8/jakda.png' },
    { id: 'saeroun', word: '새롭다', romanization: 'saeropda', translation: 'new', translationFr: 'nouveau', image: '/vocab/kr-l8/saeroun.png' },
    { id: 'oraedoeda', word: '오래되다', romanization: 'oraedoeda', translation: 'old (thing)', translationFr: 'vieux (chose)', image: '/vocab/kr-l8/oraedoeda.png' },
    { id: 'jota', word: '좋다', romanization: 'jota', translation: 'good', translationFr: 'bon', image: '/vocab/kr-l8/jota.png' },
    { id: 'nappeuda', word: '나쁘다', romanization: 'nappeuda', translation: 'bad', translationFr: 'mauvais', image: '/vocab/kr-l8/nappeuda.png' },
    { id: 'deopda', word: '덥다', romanization: 'deopda', translation: 'hot (weather)', translationFr: 'chaud (temps)', image: '/vocab/kr-l8/deopda.png' },
    { id: 'chupda', word: '춥다', romanization: 'chupda', translation: 'cold (weather)', translationFr: 'froid (temps)', image: '/vocab/kr-l8/chupda.png' },
    { id: 'chagapda', word: '차갑다', romanization: 'chagapda', translation: 'cold (touch)', translationFr: 'froid (toucher)', image: '/vocab/kr-l8/chagapda.png' },
    { id: 'eoryeopda', word: '어렵다', romanization: 'eoryeopda', translation: 'difficult', translationFr: 'difficile', image: '/vocab/kr-l8/eoryeopda.png' },
    { id: 'swipda', word: '쉽다', romanization: 'swipda', translation: 'easy', translationFr: 'facile', image: '/vocab/kr-l8/swipda.png' },
    { id: 'bissada', word: '비싸다', romanization: 'bissada', translation: 'expensive', translationFr: 'cher', image: '/vocab/kr-l8/bissada.png' },
    { id: 'ssada', word: '싸다', romanization: 'ssada', translation: 'cheap', translationFr: 'bon marché', image: '/vocab/kr-l8/ssada.png' },
    { id: 'natda', word: '낮다', romanization: 'natda', translation: 'low', translationFr: 'bas', image: '/vocab/kr-l8/natda.png' },
    { id: 'jaemiitda', word: '재미있다', romanization: 'jaemiitda', translation: 'interesting, fun', translationFr: 'intéressant, amusant', image: '/vocab/kr-l8/jaemiitda.png' },
    { id: 'masitda', word: '맛있다', romanization: 'masitda', translation: 'delicious', translationFr: 'délicieux', image: '/vocab/kr-l8/masitda.png' },
    { id: 'bappeuda', word: '바쁘다', romanization: 'bappeuda', translation: 'busy', translationFr: 'occupé', image: '/vocab/kr-l8/bappeuda.png' },
    { id: 'jeulgeopda', word: '즐겁다', romanization: 'jeulgeopda', translation: 'fun, enjoyable', translationFr: 'amusant', image: '/vocab/kr-l8/jeulgeopda.png' },
    { id: 'hayan', word: '하얗다', romanization: 'hayata', translation: 'white', translationFr: 'blanc', image: '/vocab/kr-l8/hayan.png' },
    { id: 'kkaman', word: '까맣다', romanization: 'kkamata', translation: 'black', translationFr: 'noir', image: '/vocab/kr-l8/kkaman.png' },
    { id: 'ppalgan', word: '빨갛다', romanization: 'ppalgata', translation: 'red', translationFr: 'rouge', image: '/vocab/kr-l8/ppalgan.png' },
    { id: 'paran', word: '파랗다', romanization: 'parata', translation: 'blue', translationFr: 'bleu', image: '/vocab/kr-l8/paran.png' },
    { id: 'beotkkot', word: '벚꽃', romanization: 'beotkkot', translation: 'cherry blossom', translationFr: 'cerisier', image: '/vocab/kr-l8/beotkkot.png' },
    { id: 'san', word: '산', romanization: 'san', translation: 'mountain', translationFr: 'montagne', image: '/vocab/kr-l8/san.png' },
    { id: 'eumshik', word: '음식', romanization: 'eumsik', translation: 'food', translationFr: 'nourriture', image: '/vocab/kr-l8/eumshik.png' },
    { id: 'gongbu', word: '공부', romanization: 'gongbu', translation: 'study', translationFr: 'étude', image: '/vocab/kr-l8/gongbu.png' },
    { id: 'il', word: '일', romanization: 'il', translation: 'work', translationFr: 'travail', image: '/vocab/kr-l8/il.png' },
  ],

  content: [
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shIntroEyebrow`, titleKey: `${P}.c.shIntroTitle`, subtitleKey: `${P}.c.intro`, highlightKey: `${P}.c.shIntroHl`, variant: 'split' } },

    // Part 1: -하다 adjectives (descriptive verbs from Sino-Korean roots)
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shHadaEyebrow`, titleKey: `${P}.c.shHadaTitle`, highlightKey: `${P}.c.shHadaHl` } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardHadaTitle`,
        structures: [
          { parts: [
            { text: '[subject]', color: '#3b82f6', labelKey: `${P}.c.lblSubject` },
            { text: '은/는', color: '#ef4444', labelKey: `${P}.c.lblEunNeun` },
            { text: '○○하다', color: '#22c55e', labelKey: `${P}.c.lblHadaAdj` },
            { text: '→ ○○해요', color: '#8b5cf6', labelKey: `${P}.c.lblHaeyo` },
          ] },
          { parts: [{ text: '○○하지 않아요', color: '#ec4899', labelKey: `${P}.c.lblHadaNeg` }] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.hadaExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipHada` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: '서울은 유명해요.', romanization: 'seoureun yumyeonghaeyo.', translationKey: `${P}.c.exSeoul` },
        { sentence: '이 케이크는 맛있어요.', romanization: 'i keikeun masisseoyo.', translationKey: `${P}.c.exCake` },
        { sentence: '오늘은 덥지 않아요.', romanization: 'oneureun deopji anayo.', translationKey: `${P}.c.exNotHot` },
      ],
    },

    // Part 2: pure Korean adjectives
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shNativeEyebrow`, titleKey: `${P}.c.shNativeTitle`, highlightKey: `${P}.c.shNativeHl`, variant: 'split' } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardNativeTitle`,
        structures: [
          { parts: [
            { text: '[subject]', color: '#3b82f6', labelKey: `${P}.c.lblSubject2` },
            { text: '은/는', color: '#ef4444', labelKey: `${P}.c.lblEunNeun2` },
            { text: '○○다', color: '#22c55e', labelKey: `${P}.c.lblNativeAdj` },
            { text: '→ ○○아/어요', color: '#8b5cf6', labelKey: `${P}.c.lblAeoyo` },
          ] },
          { parts: [{ text: '안 ○○아/어요 / ○○지 않아요', color: '#ec4899', labelKey: `${P}.c.lblNativeNeg` }] },
          { parts: [
            { text: '○○(으)ㄴ', color: '#22c55e', labelKey: `${P}.c.lblConnect` },
            { text: '[noun]', color: '#f59e0b', labelKey: `${P}.c.lblNoun` },
          ] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.nativeExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipIrregular` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: '경주는 조용한 도시예요.', romanization: 'gyeongjuneun joyonghan dosiyeyo.', translationKey: `${P}.c.exGyeongju` },
        { sentence: '엠마 씨는 친절해요.', romanization: 'emma ssineun chinjeolhaeyo.', translationKey: `${P}.c.exEmmaKind` },
        { sentence: '지금은 한가하지 않아요.', romanization: 'jigeumeun hangahaji anayo.', translationKey: `${P}.c.exNotFree` },
      ],
    },
    {
      type: LESSON_CONTENT_TYPE.PRACTICE_INLINE,
      practiceInline: {
        instructionKey: `${P}.c.prInstr`,
        items: [
          { mode: PRACTICE_MODE.SELECT, promptKey: `${P}.c.prQ1`, answerKey: `${P}.c.prA1`, options: [
            { labelKey: `${P}.c.prA1` }, { labelKey: `${P}.c.prOpt2` }, { labelKey: `${P}.c.prOpt3` }, { labelKey: `${P}.c.prOpt4` },
          ] },
          { mode: PRACTICE_MODE.WRITE, promptKey: `${P}.c.prQ2`, answerKey: `${P}.c.prA2`, acceptedAnswers: ['한'] },
          { mode: PRACTICE_MODE.WRITE, promptKey: `${P}.c.prQ3`, answerKey: `${P}.c.prA3`, acceptedAnswers: ['지 않아요', '지않아요'] },
        ],
      },
    },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaMidEyebrow`, titleKey: `${P}.c.ctaMidTitle`, subtitleKey: `${P}.c.ctaMidSub`, ctaLabelKey: `${P}.c.ctaMidLabel`, ctaHref: '/korean/level-1/lessons/8/exercises?difficulty=easy' } },

    // Part 3: describing experiences (어때요? / 아주 / 별로)
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shHowEyebrow`, titleKey: `${P}.c.shHowTitle`, highlightKey: `${P}.c.shHowHl` } },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.howExplain` },
    {
      type: LESSON_CONTENT_TYPE.DIALOGUE,
      dialogue: [
        { speaker: '민수', sentence: '엠마 씨, 한국 생활이 어때요?', romanization: 'emma ssi, hanguk saenghwari eottaeyo?', translationKey: `${P}.c.dlg1` },
        { speaker: '엠마', sentence: '아주 즐거워요.', romanization: 'aju jeulgeowoyo.', translationKey: `${P}.c.dlg2` },
        { speaker: '민수', sentence: '일은 바빠요?', romanization: 'ireun bappayo?', translationKey: `${P}.c.dlg3` },
        { speaker: '엠마', sentence: '별로 안 바빠요.', romanization: 'byeollo an bappayo.', translationKey: `${P}.c.dlg4` },
      ],
    },
    { type: LESSON_CONTENT_TYPE.CULTURAL_NOTE, culturalTitleKey: `${P}.c.cultureTitle`, textKey: `${P}.c.cultureText` },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaFinalEyebrow`, titleKey: `${P}.c.ctaFinalTitle`, subtitleKey: `${P}.c.ctaFinalSub`, ctaLabelKey: `${P}.c.ctaFinalLabel`, ctaHref: '/korean/level-1/lessons/8/exercises?difficulty=medium' } },
  ],

  exercises: [
    { id: 'e1', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e1q`, options: [ { labelKey: `${P}.ex.e1a`, correct: true }, { labelKey: `${P}.ex.e1b`, correct: false }, { labelKey: `${P}.ex.e1c`, correct: false }, { labelKey: `${P}.ex.e1d`, correct: false } ] },
    { id: 'e2', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e2q`, options: [ { labelKey: `${P}.ex.e2a`, correct: false }, { labelKey: `${P}.ex.e2b`, correct: true }, { labelKey: `${P}.ex.e2c`, correct: false }, { labelKey: `${P}.ex.e2d`, correct: false } ] },
    { id: 'e3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '이 책은 재미있___요.', answer: '어' },
    { id: 'e4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '엠마 씨는 친절___요.', answer: '해' },
    { id: 'e5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e5q`, options: [ { labelKey: `${P}.ex.e5a`, correct: false }, { labelKey: `${P}.ex.e5b`, correct: false }, { labelKey: `${P}.ex.e5c`, correct: true }, { labelKey: `${P}.ex.e5d`, correct: false } ] },
    { id: 'e6', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '조용___ 도시예요.', answer: '한' },

    { id: 'm1', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['경주는', '조용한', '도시예요'] },
    { id: 'm2', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'medium', sourceKey: `${P}.ex.m2src`, targetAnswer: '이 케이크는 맛없어요', acceptedAnswers: ['이 케이크는 맛없어요', '이 케이크는 맛있지 않아요'] },
    { id: 'm3', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m3q`, options: [ { labelKey: `${P}.ex.m3a`, correct: false }, { labelKey: `${P}.ex.m3b`, correct: true }, { labelKey: `${P}.ex.m3c`, correct: false }, { labelKey: `${P}.ex.m3d`, correct: false } ] },
    { id: 'm4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'medium', sentenceTemplate: '오늘은 덥___ 않아요.', answer: '지' },
    { id: 'm5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m5q`, options: [ { labelKey: `${P}.ex.m5a`, correct: true }, { labelKey: `${P}.ex.m5b`, correct: false }, { labelKey: `${P}.ex.m5c`, correct: false }, { labelKey: `${P}.ex.m5d`, correct: false } ] },
    { id: 'm6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['아주', '즐거워요'] },

    { id: 'h1', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h1src`, targetAnswer: '한국에서 일이 어때요', acceptedAnswers: ['한국에서 일이 어때요', '한국에서 일이 어때요?'] },
    { id: 'h2', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['별로', '안', '바빠요'] },
    { id: 'h3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'hard', sentenceTemplate: '한가하___ 않아요.', answer: '지' },
    { id: 'h4', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h4src`, targetAnswer: '엠마 씨는 예쁘고 친절해요', acceptedAnswers: ['엠마 씨는 예쁘고 친절해요'] },
    { id: 'h5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'hard', questionKey: `${P}.ex.h5q`, options: [ { labelKey: `${P}.ex.h5a`, correct: false }, { labelKey: `${P}.ex.h5b`, correct: true }, { labelKey: `${P}.ex.h5c`, correct: false }, { labelKey: `${P}.ex.h5d`, correct: false } ] },
    { id: 'h6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['오래됐지만', '예쁜', '집이에요'] },
  ],
}
