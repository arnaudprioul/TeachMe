import type { ILesson } from '../../lesson-types'
import { LESSON_CONTENT_TYPE, LESSON_EXERCISE_TYPE, PRACTICE_MODE } from '../../lesson-types'

const P = 'courses.korean.level1.l9'

export const LESSON_009: ILesson = {
  id: 9,
  level: 1,
  themeKey: 'likes',

  words: [
    { id: 'alda', word: '알다', romanization: 'alda', translation: 'know, understand', translationFr: 'savoir, comprendre', image: '/vocab/kr-l9/alda.png' },
    { id: 'itda9', word: '있다', romanization: 'itda', translation: 'have, exist', translationFr: 'avoir, exister', image: '/vocab/kr-l9/itda9.png' },
    { id: 'joahada', word: '좋아하다', romanization: 'joahada', translation: 'like', translationFr: 'aimer', image: '/vocab/kr-l9/joahada.png' },
    { id: 'sirheohada', word: '싫어하다', romanization: 'sirheohada', translation: 'dislike', translationFr: 'ne pas aimer', image: '/vocab/kr-l9/sirheohada.png' },
    { id: 'jalhada', word: '잘하다', romanization: 'jalhada', translation: 'be good at', translationFr: 'être doué', image: '/vocab/kr-l9/jalhada.png' },
    { id: 'mothada', word: '못하다', romanization: 'mothada', translation: 'be bad at', translationFr: 'être mauvais à', image: '/vocab/kr-l9/mothada.png' },
    { id: 'yori', word: '요리', romanization: 'yori', translation: 'cooking, dish', translationFr: 'cuisine, plat', image: '/vocab/kr-l9/yori.png' },
    { id: 'eumryo', word: '음료', romanization: 'eumryo', translation: 'drink', translationFr: 'boisson', image: '/vocab/kr-l9/eumryo.png' },
    { id: 'undong', word: '운동', romanization: 'undong', translation: 'sport, exercise', translationFr: 'sport, exercice', image: '/vocab/kr-l9/undong.png' },
    { id: 'yagu', word: '야구', romanization: 'yagu', translation: 'baseball', translationFr: 'baseball', image: '/vocab/kr-l9/yagu.png' },
    { id: 'chum', word: '춤', romanization: 'chum', translation: 'dance', translationFr: 'danse', image: '/vocab/kr-l9/chum.png' },
    { id: 'eumak', word: '음악', romanization: 'eumak', translation: 'music', translationFr: 'musique', image: '/vocab/kr-l9/eumak.png' },
    { id: 'norae', word: '노래', romanization: 'norae', translation: 'song', translationFr: 'chanson', image: '/vocab/kr-l9/norae.png' },
    { id: 'noraebang', word: '노래방', romanization: 'noraebang', translation: 'karaoke room', translationFr: 'karaoké', image: '/vocab/kr-l9/noraebang.png' },
    { id: 'geurim', word: '그림', romanization: 'geurim', translation: 'picture, drawing', translationFr: 'dessin', image: '/vocab/kr-l9/geurim.png' },
    { id: 'jandon', word: '잔돈', romanization: 'jandon', translation: 'small change', translationFr: 'monnaie', image: '/vocab/kr-l9/jandon.png' },
    { id: 'pyo', word: '표', romanization: 'pyo', translation: 'ticket', translationFr: 'ticket', image: '/vocab/kr-l9/pyo.png' },
    { id: 'nampyeon', word: '남편', romanization: 'nampyeon', translation: 'husband', translationFr: 'mari', image: '/vocab/kr-l9/nampyeon.png' },
    { id: 'buin', word: '부인', romanization: 'buin', translation: 'someone\'s wife', translationFr: 'épouse (polie)', image: '/vocab/kr-l9/buin.png' },
    { id: 'anae', word: '아내', romanization: 'anae', translation: 'my wife', translationFr: 'ma femme', image: '/vocab/kr-l9/anae.png' },
    { id: 'nampyeonbun', word: '남편분', romanization: 'nampyeonbun', translation: 'someone\'s husband (polite)', translationFr: 'mari (poli)', image: '/vocab/kr-l9/nampyeonbun.png' },
  ],

  content: [
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shIntroEyebrow`, titleKey: `${P}.c.shIntroTitle`, subtitleKey: `${P}.c.intro`, highlightKey: `${P}.c.shIntroHl`, variant: 'split' } },

    // Part 1: 좋아하다/싫어하다/잘하다/못하다
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shLikeEyebrow`, titleKey: `${P}.c.shLikeTitle`, highlightKey: `${P}.c.shLikeHl` } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardLikeTitle`,
        structures: [
          { parts: [
            { text: '[person]', color: '#3b82f6', labelKey: `${P}.c.lblPerson` },
            { text: '은/는', color: '#ef4444', labelKey: `${P}.c.lblEunNeun` },
            { text: '[thing]', color: '#22c55e', labelKey: `${P}.c.lblThing` },
            { text: '을/를', color: '#f59e0b', labelKey: `${P}.c.lblEulReul` },
            { text: '좋아해요', color: '#ec4899', labelKey: `${P}.c.lblJoahaeyo` },
          ] },
          { parts: [{ text: '싫어해요 / 잘해요 / 못해요', color: '#a855f7', labelKey: `${P}.c.lblScale` }] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.likeExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipParticle` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: '저는 김치를 좋아해요.', romanization: 'jeoneun gimchireul joahaeyo.', translationKey: `${P}.c.exKimchi` },
        { sentence: '민수 씨는 춤을 잘해요.', romanization: 'minsu ssineun chumeul jalhaeyo.', translationKey: `${P}.c.exDance` },
        { sentence: '그는 토마토를 싫어해요.', romanization: 'geuneun tomatorueul sirheohaeyo.', translationKey: `${P}.c.exTomato` },
      ],
    },
    {
      type: LESSON_CONTENT_TYPE.PRACTICE_INLINE,
      practiceInline: {
        instructionKey: `${P}.c.prLikeInstr`,
        items: [
          { mode: PRACTICE_MODE.WRITE, promptKey: `${P}.c.prLikeQ1`, answerKey: `${P}.c.prLikeA1`, acceptedAnswers: ['을', '를'] },
          { mode: PRACTICE_MODE.SELECT, promptKey: `${P}.c.prLikeQ2`, answerKey: `${P}.c.prLikeA2`, options: [
            { labelKey: `${P}.c.prLikeA2` }, { labelKey: `${P}.c.prLikeOpt2` }, { labelKey: `${P}.c.prLikeOpt3` }, { labelKey: `${P}.c.prLikeOpt4` },
          ] },
        ],
      },
    },

    // Part 2: 알다 / 있다 (understand / have)
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shHaveEyebrow`, titleKey: `${P}.c.shHaveTitle`, highlightKey: `${P}.c.shHaveHl`, variant: 'split' } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardHaveTitle`,
        structures: [
          { parts: [
            { text: '[thing]', color: '#3b82f6', labelKey: `${P}.c.lblThing2` },
            { text: '을/를', color: '#ef4444', labelKey: `${P}.c.lblEulReul2` },
            { text: '알아요', color: '#22c55e', labelKey: `${P}.c.lblAlayo` },
          ] },
          { parts: [
            { text: '[thing]', color: '#3b82f6', labelKey: `${P}.c.lblThing3` },
            { text: '이/가', color: '#ef4444', labelKey: `${P}.c.lblIGa` },
            { text: '있어요', color: '#22c55e', labelKey: `${P}.c.lblIsseoyo` },
          ] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.haveExplain` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: '한국어를 조금 알아요.', romanization: 'hangugeoreul jogeum arayo.', translationKey: `${P}.c.exUnderstand` },
        { sentence: '내일 시간이 있어요?', romanization: 'naeil sigani isseoyo?', translationKey: `${P}.c.exTime` },
        { sentence: '잔돈이 없어요.', romanization: 'jandoni eopseoyo.', translationKey: `${P}.c.exNoChange` },
      ],
    },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaMidEyebrow`, titleKey: `${P}.c.ctaMidTitle`, subtitleKey: `${P}.c.ctaMidSub`, ctaLabelKey: `${P}.c.ctaMidLabel`, ctaHref: '/korean/level-1/lessons/9/exercises?difficulty=easy' } },

    // Part 3: -니까 / 왜 (reasons)
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shWhyEyebrow`, titleKey: `${P}.c.shWhyTitle`, highlightKey: `${P}.c.shWhyHl` } },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.whyExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipNikka` },
    {
      type: LESSON_CONTENT_TYPE.DIALOGUE,
      dialogue: [
        { speaker: '지영', sentence: '민수 씨, 오늘 저녁에 노래방 갈래요?', romanization: 'minsu ssi, oneul jeonyeoge noraebang gallaeyo?', translationKey: `${P}.c.dlg1` },
        { speaker: '민수', sentence: '미안해요. 오늘 저녁은 좀…', romanization: 'mianhaeyo. oneul jeonyeogeum jom…', translationKey: `${P}.c.dlg2` },
        { speaker: '지영', sentence: '왜요?', romanization: 'waeyo?', translationKey: `${P}.c.dlg3` },
        { speaker: '민수', sentence: '일이 많으니까요.', romanization: 'iri maneunikkkayo.', translationKey: `${P}.c.dlg4` },
      ],
    },
    { type: LESSON_CONTENT_TYPE.CULTURAL_NOTE, culturalTitleKey: `${P}.c.cultureTitle`, textKey: `${P}.c.cultureText` },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaFinalEyebrow`, titleKey: `${P}.c.ctaFinalTitle`, subtitleKey: `${P}.c.ctaFinalSub`, ctaLabelKey: `${P}.c.ctaFinalLabel`, ctaHref: '/korean/level-1/lessons/9/exercises?difficulty=medium' } },
  ],

  exercises: [
    { id: 'e1', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e1q`, options: [ { labelKey: `${P}.ex.e1a`, correct: true }, { labelKey: `${P}.ex.e1b`, correct: false }, { labelKey: `${P}.ex.e1c`, correct: false }, { labelKey: `${P}.ex.e1d`, correct: false } ] },
    { id: 'e2', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e2q`, options: [ { labelKey: `${P}.ex.e2a`, correct: false }, { labelKey: `${P}.ex.e2b`, correct: true }, { labelKey: `${P}.ex.e2c`, correct: false }, { labelKey: `${P}.ex.e2d`, correct: false } ] },
    { id: 'e3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '김치___ 좋아해요.', answer: '를' },
    { id: 'e4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '한국어___ 알아요.', answer: '를' },
    { id: 'e5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e5q`, options: [ { labelKey: `${P}.ex.e5a`, correct: false }, { labelKey: `${P}.ex.e5b`, correct: false }, { labelKey: `${P}.ex.e5c`, correct: true }, { labelKey: `${P}.ex.e5d`, correct: false } ] },
    { id: 'e6', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '시간이 있___요.', answer: '어' },

    { id: 'm1', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['저는', '춤을', '잘해요'] },
    { id: 'm2', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'medium', sourceKey: `${P}.ex.m2src`, targetAnswer: '민수 씨는 한국어를 잘해요', acceptedAnswers: ['민수 씨는 한국어를 잘해요', '민수씨는 한국어를 잘해요'] },
    { id: 'm3', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m3q`, options: [ { labelKey: `${P}.ex.m3a`, correct: false }, { labelKey: `${P}.ex.m3b`, correct: true }, { labelKey: `${P}.ex.m3c`, correct: false }, { labelKey: `${P}.ex.m3d`, correct: false } ] },
    { id: 'm4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'medium', sentenceTemplate: '잔돈___ 없어요.', answer: '이' },
    { id: 'm5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m5q`, options: [ { labelKey: `${P}.ex.m5a`, correct: true }, { labelKey: `${P}.ex.m5b`, correct: false }, { labelKey: `${P}.ex.m5c`, correct: false }, { labelKey: `${P}.ex.m5d`, correct: false } ] },
    { id: 'm6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['내일', '시간이', '있어요?'] },

    { id: 'h1', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h1src`, targetAnswer: '일이 많으니까요', acceptedAnswers: ['일이 많으니까요'] },
    { id: 'h2', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['왜', '노래방에', '안', '가요?'] },
    { id: 'h3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'hard', sentenceTemplate: '그___  야구___ 못해요.', answer: '는／를' },
    { id: 'h4', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h4src`, targetAnswer: '한국어를 조금 알아요', acceptedAnswers: ['한국어를 조금 알아요'] },
    { id: 'h5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'hard', questionKey: `${P}.ex.h5q`, options: [ { labelKey: `${P}.ex.h5a`, correct: false }, { labelKey: `${P}.ex.h5b`, correct: true }, { labelKey: `${P}.ex.h5c`, correct: false }, { labelKey: `${P}.ex.h5d`, correct: false } ] },
    { id: 'h6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['아내는', '요리를', '잘해요'] },
  ],
}
