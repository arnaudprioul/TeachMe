import type { ILesson } from '../../lesson-types'
import { LESSON_CONTENT_TYPE, LESSON_EXERCISE_TYPE, PRACTICE_MODE } from '../../lesson-types'

const P = 'courses.korean.level1.l7'

export const LESSON_007: ILesson = {
  id: 7,
  level: 1,
  themeKey: 'giving',

  words: [
    { id: 'jareuda', word: '자르다', romanization: 'jareuda', translation: 'cut, slice', translationFr: 'couper', image: '/vocab/kr-l7/jareuda.png' },
    { id: 'bonaeda', word: '보내다', romanization: 'bonaeda', translation: 'send', translationFr: 'envoyer', image: '/vocab/kr-l7/bonaeda.png' },
    { id: 'juda', word: '주다', romanization: 'juda', translation: 'give', translationFr: 'donner', image: '/vocab/kr-l7/juda.png' },
    { id: 'batda', word: '받다', romanization: 'batda', translation: 'receive', translationFr: 'recevoir', image: '/vocab/kr-l7/batda.png' },
    { id: 'billyeojuda', word: '빌려주다', romanization: 'billyeojuda', translation: 'lend', translationFr: 'prêter', image: '/vocab/kr-l7/billyeojuda.png' },
    { id: 'billida', word: '빌리다', romanization: 'billida', translation: 'borrow', translationFr: 'emprunter', image: '/vocab/kr-l7/billida.png' },
    { id: 'gareuchida', word: '가르치다', romanization: 'gareuchida', translation: 'teach', translationFr: 'enseigner', image: '/vocab/kr-l7/gareuchida.png' },
    { id: 'baeuda', word: '배우다', romanization: 'baeuda', translation: 'learn', translationFr: 'apprendre', image: '/vocab/kr-l7/baeuda.png' },
    { id: 'jeonhwahada', word: '전화하다', romanization: 'jeonhwahada', translation: 'make (a call)', translationFr: 'passer (un appel)', image: '/vocab/kr-l7/jeonhwahada.png' },
    { id: 'son', word: '손', romanization: 'son', translation: 'hand', translationFr: 'main', image: '/vocab/kr-l7/son.png' },
    { id: 'jeotgarak', word: '젓가락', romanization: 'jeotgarak', translation: 'chopsticks', translationFr: 'baguettes', image: '/vocab/kr-l7/jeotgarak.png' },
    { id: 'sutgarak', word: '숟가락', romanization: 'sutgarak', translation: 'spoon', translationFr: 'cuillère', image: '/vocab/kr-l7/sutgarak.png' },
    { id: 'kal', word: '칼', romanization: 'kal', translation: 'knife', translationFr: 'couteau', image: '/vocab/kr-l7/kal.png' },
    { id: 'pokeu', word: '포크', romanization: 'pokeu', translation: 'fork', translationFr: 'fourchette', image: '/vocab/kr-l7/pokeu.png' },
    { id: 'gawi', word: '가위', romanization: 'gawi', translation: 'scissors', translationFr: 'ciseaux', image: '/vocab/kr-l7/gawi.png' },
    { id: 'keompyuteo', word: '컴퓨터', romanization: 'keompyuteo', translation: 'computer', translationFr: 'ordinateur', image: '/vocab/kr-l7/keompyuteo.png' },
    { id: 'jongi', word: '종이', romanization: 'jongi', translation: 'paper', translationFr: 'papier', image: '/vocab/kr-l7/jongi.png' },
    { id: 'kkot', word: '꽃', romanization: 'kkot', translation: 'flower', translationFr: 'fleur', image: '/vocab/kr-l7/kkot.png' },
    { id: 'syeocheu', word: '셔츠', romanization: 'syeocheu', translation: 'shirt', translationFr: 'chemise', image: '/vocab/kr-l7/syeocheu.png' },
    { id: 'seonmul', word: '선물', romanization: 'seonmul', translation: 'present', translationFr: 'cadeau', image: '/vocab/kr-l7/seonmul.png' },
    { id: 'jim', word: '짐', romanization: 'jim', translation: 'luggage', translationFr: 'bagages', image: '/vocab/kr-l7/jim.png' },
    { id: 'don', word: '돈', romanization: 'don', translation: 'money', translationFr: 'argent', image: '/vocab/kr-l7/don.png' },
    { id: 'pyo', word: '표', romanization: 'pyo', translation: 'ticket', translationFr: 'billet', image: '/vocab/kr-l7/pyo.png' },
    { id: 'abeoji', word: '아버지', romanization: 'abeoji', translation: 'father (polite)', translationFr: 'père (poli)', image: '/vocab/kr-l7/abeoji.png' },
    { id: 'eomeoni', word: '어머니', romanization: 'eomeoni', translation: 'mother (polite)', translationFr: 'mère (polie)', image: '/vocab/kr-l7/eomeoni.png' },
    { id: 'yeohaeng', word: '여행', romanization: 'yeohaeng', translation: 'trip', translationFr: 'voyage', image: '/vocab/kr-l7/yeohaeng.png' },
    { id: 'ginyeompum', word: '기념품', romanization: 'ginyeompum', translation: 'souvenir', translationFr: 'souvenir', image: '/vocab/kr-l7/ginyeompum.png' },
  ],

  content: [
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shIntroEyebrow`, titleKey: `${P}.c.shIntroTitle`, subtitleKey: `${P}.c.intro`, highlightKey: `${P}.c.shIntroHl`, variant: 'split' } },

    // Part 1: tool (으)로
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shToolEyebrow`, titleKey: `${P}.c.shToolTitle`, highlightKey: `${P}.c.shToolHl` } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardToolTitle`,
        structures: [
          { parts: [
            { text: '[tool]', color: '#3b82f6', labelKey: `${P}.c.lblTool` },
            { text: '(으)로', color: '#ef4444', labelKey: `${P}.c.lblEuro` },
            { text: '[thing]', color: '#22c55e', labelKey: `${P}.c.lblThing` },
            { text: '을/를', color: '#f59e0b', labelKey: `${P}.c.lblEulReul` },
            { text: '[verb]', color: '#8b5cf6', labelKey: `${P}.c.lblVerb` },
          ] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.toolExplain` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: '젓가락으로 밥을 먹어요.', romanization: 'jeotgarageuro babeul meogeoyo.', translationKey: `${P}.c.exChopsticks` },
        { sentence: '컴퓨터로 편지를 써요.', romanization: 'keompyuteoro pyeonjireul sseoyo.', translationKey: `${P}.c.exPc` },
        { sentence: '가위로 종이를 잘라요.', romanization: 'gawiro jongireul jallayo.', translationKey: `${P}.c.exScissors` },
      ],
    },
    {
      type: LESSON_CONTENT_TYPE.PRACTICE_INLINE,
      practiceInline: {
        instructionKey: `${P}.c.prToolInstr`,
        items: [
          { mode: PRACTICE_MODE.WRITE, promptKey: `${P}.c.prToolQ1`, answerKey: `${P}.c.prToolA1`, acceptedAnswers: ['으로'] },
          { mode: PRACTICE_MODE.SELECT, promptKey: `${P}.c.prToolQ2`, answerKey: `${P}.c.prToolA2`, options: [
            { labelKey: `${P}.c.prToolA2` }, { labelKey: `${P}.c.prToolOpt2` }, { labelKey: `${P}.c.prToolOpt3` }, { labelKey: `${P}.c.prToolOpt4` },
          ] },
        ],
      },
    },

    // Part 2: 에게/한테 (recipient) + giving / receiving
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shGiveEyebrow`, titleKey: `${P}.c.shGiveTitle`, highlightKey: `${P}.c.shGiveHl`, variant: 'split' } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardGiveTitle`,
        structures: [
          { parts: [
            { text: '[person]', color: '#3b82f6', labelKey: `${P}.c.lblPerson` },
            { text: '에게/한테', color: '#ef4444', labelKey: `${P}.c.lblEgeHante` },
            { text: '[thing]', color: '#22c55e', labelKey: `${P}.c.lblThing2` },
            { text: '을/를', color: '#f59e0b', labelKey: `${P}.c.lblEulReul2` },
            { text: '주다', color: '#8b5cf6', labelKey: `${P}.c.lblGive` },
          ] },
          { parts: [
            { text: '[person]', color: '#3b82f6', labelKey: `${P}.c.lblFrom` },
            { text: '에게서/한테서', color: '#ef4444', labelKey: `${P}.c.lblEgeseoHanteseo` },
            { text: '[thing]', color: '#22c55e', labelKey: `${P}.c.lblThing3` },
            { text: '을/를', color: '#f59e0b', labelKey: `${P}.c.lblEulReul3` },
            { text: '받다', color: '#ec4899', labelKey: `${P}.c.lblReceive` },
          ] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.giveExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipGive` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: '친구에게 꽃을 줬어요.', romanization: 'chinguege kkocheul jwosseoyo.', translationKey: `${P}.c.exGaveFlower` },
        { sentence: '민수 씨한테서 선물을 받았어요.', romanization: 'minsu ssihanteseo seonmureul badasseoyo.', translationKey: `${P}.c.exGotPresent` },
        { sentence: '선생님한테 한국어를 배워요.', romanization: 'seonsaengnimhante hangugeoreul baeuoyo.', translationKey: `${P}.c.exLearnKr` },
      ],
    },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaMidEyebrow`, titleKey: `${P}.c.ctaMidTitle`, subtitleKey: `${P}.c.ctaMidSub`, ctaLabelKey: `${P}.c.ctaMidLabel`, ctaHref: '/korean/level-1/lessons/7/exercises?difficulty=easy' } },

    // Part 3: dialogue + 벌써 / 아직
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shAlreadyEyebrow`, titleKey: `${P}.c.shAlreadyTitle`, highlightKey: `${P}.c.shAlreadyHl` } },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.alreadyExplain` },
    {
      type: LESSON_CONTENT_TYPE.DIALOGUE,
      dialogue: [
        { speaker: '민수', sentence: '엠마 씨, 벌써 점심 먹었어요?', romanization: 'emma ssi, beolsseo jeomsim meogeosseoyo?', translationKey: `${P}.c.dlg1` },
        { speaker: '엠마', sentence: '네, 벌써 먹었어요.', romanization: 'ne, beolsseo meogeosseoyo.', translationKey: `${P}.c.dlg2` },
        { speaker: '민수', sentence: '그러면, 커피라도 마실까요?', romanization: 'geureomyeon, keopirado masilkkayo?', translationKey: `${P}.c.dlg3` },
        { speaker: '엠마', sentence: '좋아요!', romanization: 'joayo!', translationKey: `${P}.c.dlg4` },
      ],
    },
    { type: LESSON_CONTENT_TYPE.CULTURAL_NOTE, culturalTitleKey: `${P}.c.cultureTitle`, textKey: `${P}.c.cultureText` },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaFinalEyebrow`, titleKey: `${P}.c.ctaFinalTitle`, subtitleKey: `${P}.c.ctaFinalSub`, ctaLabelKey: `${P}.c.ctaFinalLabel`, ctaHref: '/korean/level-1/lessons/7/exercises?difficulty=medium' } },
  ],

  exercises: [
    { id: 'e1', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e1q`, options: [ { labelKey: `${P}.ex.e1a`, correct: true }, { labelKey: `${P}.ex.e1b`, correct: false }, { labelKey: `${P}.ex.e1c`, correct: false }, { labelKey: `${P}.ex.e1d`, correct: false } ] },
    { id: 'e2', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e2q`, options: [ { labelKey: `${P}.ex.e2a`, correct: false }, { labelKey: `${P}.ex.e2b`, correct: true }, { labelKey: `${P}.ex.e2c`, correct: false }, { labelKey: `${P}.ex.e2d`, correct: false } ] },
    { id: 'e3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '젓가락___ 먹어요.', answer: '으로' },
    { id: 'e4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '친구___ 줬어요.', answer: '에게' },
    { id: 'e5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e5q`, options: [ { labelKey: `${P}.ex.e5a`, correct: false }, { labelKey: `${P}.ex.e5b`, correct: false }, { labelKey: `${P}.ex.e5c`, correct: true }, { labelKey: `${P}.ex.e5d`, correct: false } ] },
    { id: 'e6', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '선생님___ 배워요.', answer: '한테' },

    { id: 'm1', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['가위로', '종이를', '잘라요'] },
    { id: 'm2', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'medium', sourceKey: `${P}.ex.m2src`, targetAnswer: '친구에게 책을 줬어요', acceptedAnswers: ['친구에게 책을 줬어요', '친구한테 책을 줬어요'] },
    { id: 'm3', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m3q`, options: [ { labelKey: `${P}.ex.m3a`, correct: false }, { labelKey: `${P}.ex.m3b`, correct: true }, { labelKey: `${P}.ex.m3c`, correct: false }, { labelKey: `${P}.ex.m3d`, correct: false } ] },
    { id: 'm4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'medium', sentenceTemplate: '벌써 먹___?', answer: '었어요' },
    { id: 'm5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m5q`, options: [ { labelKey: `${P}.ex.m5a`, correct: true }, { labelKey: `${P}.ex.m5b`, correct: false }, { labelKey: `${P}.ex.m5c`, correct: false }, { labelKey: `${P}.ex.m5d`, correct: false } ] },
    { id: 'm6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['민수 씨한테서', '선물을', '받았어요'] },

    { id: 'h1', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h1src`, targetAnswer: '선생님한테 한국어를 배워요', acceptedAnswers: ['선생님한테 한국어를 배워요', '선생님에게 한국어를 배워요'] },
    { id: 'h2', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['전화로', '어머니하고', '이야기해요'] },
    { id: 'h3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'hard', sentenceTemplate: '그 사람___ 돈___ 빌려요.', answer: '한테／을' },
    { id: 'h4', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h4src`, targetAnswer: '컴퓨터로 편지를 썼어요', acceptedAnswers: ['컴퓨터로 편지를 썼어요'] },
    { id: 'h5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'hard', questionKey: `${P}.ex.h5q`, options: [ { labelKey: `${P}.ex.h5a`, correct: false }, { labelKey: `${P}.ex.h5b`, correct: true }, { labelKey: `${P}.ex.h5c`, correct: false }, { labelKey: `${P}.ex.h5d`, correct: false } ] },
    { id: 'h6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['엠마 씨에게', '기념품을', '줬어요'] },
  ],
}
