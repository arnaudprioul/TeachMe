import type { ILesson } from '../../lesson-types'
import { LESSON_CONTENT_TYPE, LESSON_EXERCISE_TYPE, PRACTICE_MODE } from '../../lesson-types'

const imgHello = '/vocab/greetings/hello.svg'
const imgThankYou = '/vocab/greetings/thank-you.svg'
const imgYes = '/vocab/greetings/yes.svg'
const imgNo = '/vocab/greetings/no.svg'
const imgSorry = '/vocab/greetings/sorry.svg'
const imgGoodbyeLeaving = '/vocab/greetings/goodbye-leaving.svg'
const imgGoodbyeStaying = '/vocab/greetings/goodbye-staying.svg'
const imgPlease = '/vocab/greetings/please.svg'
const imgNiceToMeet = '/vocab/greetings/nice-to-meet.svg'
const imgExcuseMe = '/vocab/greetings/excuse-me.svg'

const P = 'courses.korean.level1.l1'

export const LESSON_001: ILesson = {
  id: 1,
  level: 1,
  themeKey: 'greetings',

  // ═══════════════════════════════════════════════════════
  // VOCABULARY
  // ═══════════════════════════════════════════════════════
  words: [
    { id: 'hello', word: '안녕하세요', romanization: 'annyeonghaseyo', translation: 'Hello', translationFr: 'Bonjour', image: imgHello },
    { id: 'thank-you', word: '감사합니다', romanization: 'gamsahamnida', translation: 'Thank you', translationFr: 'Merci', image: imgThankYou },
    { id: 'yes', word: '네', romanization: 'ne', translation: 'Yes', translationFr: 'Oui', image: imgYes },
    { id: 'no', word: '아니요', romanization: 'aniyo', translation: 'No', translationFr: 'Non', image: imgNo },
    { id: 'sorry', word: '죄송합니다', romanization: 'joesonghamnida', translation: 'Sorry', translationFr: 'Désolé', image: imgSorry },
    { id: 'goodbye-leaving', word: '안녕히 가세요', romanization: 'annyeonghi gaseyo', translation: 'Goodbye (to someone leaving)', translationFr: 'Au revoir (à celui qui part)', image: imgGoodbyeLeaving },
    { id: 'goodbye-staying', word: '안녕히 계세요', romanization: 'annyeonghi gyeseyo', translation: 'Goodbye (to someone staying)', translationFr: 'Au revoir (à celui qui reste)', image: imgGoodbyeStaying },
    { id: 'please', word: '주세요', romanization: 'juseyo', translation: 'Please (give me)', translationFr: 'S\'il vous plaît (donnez-moi)', image: imgPlease },
    { id: 'nice-to-meet', word: '만나서 반갑습니다', romanization: 'mannaseo bangapseumnida', translation: 'Nice to meet you', translationFr: 'Enchanté', image: imgNiceToMeet },
    { id: 'excuse-me', word: '실례합니다', romanization: 'sillyehamnida', translation: 'Excuse me', translationFr: 'Excusez-moi', image: imgExcuseMe },
  ],

  // ═══════════════════════════════════════════════════════
  // COURSE CONTENT (~28 blocks)
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
    {
      type: LESSON_CONTENT_TYPE.CHARACTER_PROFILES,
      characters: [
        { name: 'Minsu', nameKr: '민수', country: 'South Korea', flag: '/flags/kr.svg', jobKey: `${P}.c.jobStudent` },
        { name: 'Jiyeong', nameKr: '지영', country: 'South Korea', flag: '/flags/kr.svg', jobKey: `${P}.c.jobTeacher` },
        { name: 'Emma', nameKr: '엠마', country: 'USA', flag: '/flags/us.svg', jobKey: `${P}.c.jobEngineer` },
        { name: 'Yuki', nameKr: '유키', country: 'Japan', flag: '/flags/jp.svg', jobKey: `${P}.c.jobStudent` },
      ],
    },

    // ── Section 2: Greetings ──
    {
      type: LESSON_CONTENT_TYPE.SECTION_HEADER,
      sectionHeader: {
        eyebrowKey: `${P}.c.shGreetEyebrow`,
        titleKey: `${P}.c.shGreetTitle`,
        highlightKey: `${P}.c.shGreetHl`,
      },
    },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardGreetingTitle`,
        structures: [
          { parts: [{ text: '안녕하세요', color: '#3b82f6', labelKey: `${P}.c.labelGreeting` }] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.EXAMPLE, example: { sentence: '안녕하세요!', romanization: 'annyeonghaseyo!', translationKey: `${P}.c.ex1` } },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.greetingExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipInformalHello` },
    {
      type: LESSON_CONTENT_TYPE.PRACTICE_INLINE,
      practiceInline: {
        instructionKey: `${P}.c.practiceRepeat`,
        items: [
          // SPEAK — click to hear "안녕하세요"
          { mode: PRACTICE_MODE.SPEAK, promptKey: `${P}.c.practiceRepeatQ1`, answerKey: `${P}.c.practiceRepeatA1`, speakText: '안녕하세요' },
          // SPEAK — click to hear "안녕"
          { mode: PRACTICE_MODE.SPEAK, promptKey: `${P}.c.practiceRepeatQ2`, answerKey: `${P}.c.practiceRepeatA2`, speakText: '안녕' },
        ],
      },
    },

    // ── Section 3: Self-introduction ──
    {
      type: LESSON_CONTENT_TYPE.SECTION_HEADER,
      sectionHeader: {
        eyebrowKey: `${P}.c.shSelfEyebrow`,
        titleKey: `${P}.c.shSelfTitle`,
        highlightKey: `${P}.c.shSelfHl`,
        variant: 'split',
      },
    },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardIntroTitle`,
        structures: [
          {
            parts: [
              { text: '저', color: '#3b82f6', labelKey: `${P}.c.labelI` },
              { text: '는', color: '#ef4444', labelKey: `${P}.c.labelTopic` },
              { text: '[name]', color: '#22c55e', labelKey: `${P}.c.labelName` },
              { text: '입니다', color: '#8b5cf6', labelKey: `${P}.c.labelCopula` },
            ],
          },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.introBreakdown` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: '저는 민수입니다.', romanization: 'jeoneun minsu-imnida.', translationKey: `${P}.c.exMinsu` },
        { sentence: '저는 학생입니다.', romanization: 'jeoneun haksaeng-imnida.', translationKey: `${P}.c.exStudent` },
        { sentence: '저는 엠마입니다. 엔지니어입니다.', romanization: 'jeoneun emma-imnida. enjinieo-imnida.', translationKey: `${P}.c.exEmma` },
      ],
    },
    {
      type: LESSON_CONTENT_TYPE.PRACTICE_INLINE,
      practiceInline: {
        instructionKey: `${P}.c.practiceIntro`,
        items: [
          // WRITE — type the missing copula
          { mode: PRACTICE_MODE.WRITE, promptKey: `${P}.c.practiceIntroQ1`, answerKey: `${P}.c.practiceIntroA1`, acceptedAnswers: ['입니다'] },
          // SPEAK — click to hear a sample
          { mode: PRACTICE_MODE.SPEAK, promptKey: `${P}.c.practiceIntroQ2`, answerKey: `${P}.c.practiceIntroA2`, speakText: '저는 학생입니다' },
        ],
      },
    },

    // CTA before Part 3 — try your self-introduction
    {
      type: LESSON_CONTENT_TYPE.SECTION_CTA,
      sectionCta: {
        eyebrowKey: `${P}.c.ctaMidEyebrow`,
        titleKey: `${P}.c.ctaMidTitle`,
        subtitleKey: `${P}.c.ctaMidSub`,
        ctaLabelKey: `${P}.c.ctaMidLabel`,
        ctaHref: '/korean/level-1/lessons/1/exercises?difficulty=easy',
      },
    },

    // ── Section 4: Meeting someone ──
    {
      type: LESSON_CONTENT_TYPE.SECTION_HEADER,
      sectionHeader: {
        eyebrowKey: `${P}.c.shMeetEyebrow`,
        titleKey: `${P}.c.shMeetTitle`,
        highlightKey: `${P}.c.shMeetHl`,
      },
    },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardMeetTitle`,
        structures: [
          { parts: [{ text: '만나서 반갑습니다', color: '#f59e0b', labelKey: `${P}.c.labelNiceToMeet` }] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.meetExplain` },
    {
      type: LESSON_CONTENT_TYPE.DIALOGUE,
      dialogue: [
        { speaker: '민수', sentence: '안녕하세요!', romanization: 'annyeonghaseyo!', translationKey: `${P}.c.dlgMeet1` },
        { speaker: 'Emma', sentence: '안녕하세요!', romanization: 'annyeonghaseyo!', translationKey: `${P}.c.dlgMeet2` },
        { speaker: '민수', sentence: '저는 민수입니다. 만나서 반갑습니다.', romanization: 'jeoneun minsu-imnida. mannaseo bangapseumnida.', translationKey: `${P}.c.dlgMeet3` },
        { speaker: 'Emma', sentence: '저는 엠마입니다. 만나서 반갑습니다!', romanization: 'jeoneun emma-imnida. mannaseo bangapseumnida!', translationKey: `${P}.c.dlgMeet4` },
        { speaker: '민수', sentence: '엠마 씨는 학생입니까?', romanization: 'emma-ssineun haksaeng-imnikka?', translationKey: `${P}.c.dlgMeet5` },
        { speaker: 'Emma', sentence: '아니요, 엔지니어입니다.', romanization: 'aniyo, enjinieo-imnida.', translationKey: `${P}.c.dlgMeet6` },
      ],
    },
    { type: LESSON_CONTENT_TYPE.CULTURAL_NOTE, culturalTitleKey: `${P}.c.cultureBowTitle`, textKey: `${P}.c.cultureBowText` },

    // ── Section 5: Thank you & Sorry ──
    {
      type: LESSON_CONTENT_TYPE.SECTION_HEADER,
      sectionHeader: {
        eyebrowKey: `${P}.c.shThankEyebrow`,
        titleKey: `${P}.c.shThankTitle`,
        highlightKey: `${P}.c.shThankHl`,
        variant: 'split',
      },
    },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardThankSorryTitle`,
        structures: [
          { parts: [{ text: '감사합니다', color: '#3b82f6', labelKey: `${P}.c.labelThankYou` }] },
          { parts: [{ text: '죄송합니다', color: '#ef4444', labelKey: `${P}.c.labelSorry` }] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.thankSorryExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipFormalityLevels` },
    { type: LESSON_CONTENT_TYPE.EXAMPLE, example: { sentence: '감사합니다, 선생님!', romanization: 'gamsahamnida, seonsaengnim!', translationKey: `${P}.c.exThankTeacher` } },
    {
      type: LESSON_CONTENT_TYPE.PRACTICE_INLINE,
      practiceInline: {
        instructionKey: `${P}.c.practiceThankSorry`,
        items: [
          // SELECT — pick the right expression for each situation
          {
            mode: PRACTICE_MODE.SELECT,
            promptKey: `${P}.c.practiceTS_Q1`,
            answerKey: `${P}.c.practiceTS_A1`,
            options: [
              { labelKey: `${P}.c.practiceTS_A1` },
              { labelKey: `${P}.c.practiceTS_A2` },
              { labelKey: `${P}.c.practiceTS_OptC` },
              { labelKey: `${P}.c.practiceTS_OptD` },
            ],
          },
          {
            mode: PRACTICE_MODE.SELECT,
            promptKey: `${P}.c.practiceTS_Q2`,
            answerKey: `${P}.c.practiceTS_A2`,
            options: [
              { labelKey: `${P}.c.practiceTS_A1` },
              { labelKey: `${P}.c.practiceTS_A2` },
              { labelKey: `${P}.c.practiceTS_A3` },
              { labelKey: `${P}.c.practiceTS_OptD` },
            ],
          },
          // SPEAK — click to hear "고마워요"
          {
            mode: PRACTICE_MODE.SPEAK,
            promptKey: `${P}.c.practiceTS_Q3`,
            answerKey: `${P}.c.practiceTS_A3`,
            speakText: '고마워요',
          },
        ],
      },
    },

    // ── Section 6: Goodbye ──
    {
      type: LESSON_CONTENT_TYPE.SECTION_HEADER,
      sectionHeader: {
        eyebrowKey: `${P}.c.shByeEyebrow`,
        titleKey: `${P}.c.shByeTitle`,
        highlightKey: `${P}.c.shByeHl`,
      },
    },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardByeTitle`,
        structures: [
          {
            parts: [
              { text: '안녕히', color: '#8b5cf6' },
              { text: '가세요', color: '#3b82f6', labelKey: `${P}.c.labelGoLeaving` },
            ],
          },
          {
            parts: [
              { text: '안녕히', color: '#8b5cf6' },
              { text: '계세요', color: '#22c55e', labelKey: `${P}.c.labelStayStaying` },
            ],
          },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.byeExplain` },
    {
      type: LESSON_CONTENT_TYPE.DIALOGUE,
      dialogue: [
        { speaker: '민수', sentence: '저는 가겠습니다. 감사합니다!', romanization: 'jeoneun gagetseumnida. gamsahamnida!', translationKey: `${P}.c.dlgBye1` },
        { speaker: '지영', sentence: '안녕히 가세요!', romanization: 'annyeonghi gaseyo!', translationKey: `${P}.c.dlgBye2` },
        { speaker: '민수', sentence: '안녕히 계세요!', romanization: 'annyeonghi gyeseyo!', translationKey: `${P}.c.dlgBye3` },
      ],
    },
    { type: LESSON_CONTENT_TYPE.CULTURAL_NOTE, culturalTitleKey: `${P}.c.cultureByeTitle`, textKey: `${P}.c.cultureByeText` },

    // Final CTA before extras — take the full exercise
    {
      type: LESSON_CONTENT_TYPE.SECTION_CTA,
      sectionCta: {
        eyebrowKey: `${P}.c.ctaFinalEyebrow`,
        titleKey: `${P}.c.ctaFinalTitle`,
        subtitleKey: `${P}.c.ctaFinalSub`,
        ctaLabelKey: `${P}.c.ctaFinalLabel`,
        ctaHref: '/korean/level-1/lessons/1/exercises?difficulty=medium',
      },
    },

    // ── Section 7: Useful extras ──
    {
      type: LESSON_CONTENT_TYPE.SECTION_HEADER,
      sectionHeader: {
        eyebrowKey: `${P}.c.shExtrasEyebrow`,
        titleKey: `${P}.c.shExtrasTitle`,
      },
    },
    {
      type: LESSON_CONTENT_TYPE.VOCABULARY_TABLE,
      vocabTable: {
        titleKey: `${P}.c.vocabTableTitle`,
        items: [
          { word: '네', romanization: 'ne', translationKey: `${P}.c.vtYes` },
          { word: '아니요', romanization: 'aniyo', translationKey: `${P}.c.vtNo` },
          { word: '주세요', romanization: 'juseyo', translationKey: `${P}.c.vtPlease` },
          { word: '실례합니다', romanization: 'sillyehamnida', translationKey: `${P}.c.vtExcuseMe` },
          { word: '선생님', romanization: 'seonsaengnim', translationKey: `${P}.c.vtTeacherHonor` },
          { word: '씨', romanization: 'ssi', translationKey: `${P}.c.vtMrMs` },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipNe` },
  ],

  // ═══════════════════════════════════════════════════════
  // EXERCISES (~18)
  // ═══════════════════════════════════════════════════════
  exercises: [
    // ── Easy (6) ──
    { id: 'e1', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e1q`, options: [{ labelKey: `${P}.ex.e1a`, correct: true }, { labelKey: `${P}.ex.e1b`, correct: false }, { labelKey: `${P}.ex.e1c`, correct: false }, { labelKey: `${P}.ex.e1d`, correct: false }] },
    { id: 'e2', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e2q`, options: [{ labelKey: `${P}.ex.e2a`, correct: false }, { labelKey: `${P}.ex.e2b`, correct: true }, { labelKey: `${P}.ex.e2c`, correct: false }, { labelKey: `${P}.ex.e2d`, correct: false }] },
    { id: 'e3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '안녕하___', answer: '세요' },
    { id: 'e4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '저는 민수___.', answer: '입니다' },
    { id: 'e5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e5q`, options: [{ labelKey: `${P}.ex.e5a`, correct: false }, { labelKey: `${P}.ex.e5b`, correct: false }, { labelKey: `${P}.ex.e5c`, correct: true }, { labelKey: `${P}.ex.e5d`, correct: false }] },
    { id: 'e6', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '감사___.', answer: '합니다' },
    // ── Medium (6) ──
    { id: 'm1', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['안녕하세요', '저는', '민수입니다'] },
    { id: 'm2', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'medium', sourceKey: `${P}.ex.m2src`, targetAnswer: '감사합니다', acceptedAnswers: ['감사합니다', '고마워요'] },
    { id: 'm3', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m3q`, options: [{ labelKey: `${P}.ex.m3a`, correct: true }, { labelKey: `${P}.ex.m3b`, correct: false }, { labelKey: `${P}.ex.m3c`, correct: false }, { labelKey: `${P}.ex.m3d`, correct: false }] },
    { id: 'm4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'medium', sentenceTemplate: '만나서 ___.', answer: '반갑습니다' },
    { id: 'm5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m5q`, options: [{ labelKey: `${P}.ex.m5a`, correct: false }, { labelKey: `${P}.ex.m5b`, correct: true }, { labelKey: `${P}.ex.m5c`, correct: false }, { labelKey: `${P}.ex.m5d`, correct: false }] },
    { id: 'm6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['저는', '엠마입니다', '만나서', '반갑습니다'] },
    // ── Hard (6) ──
    { id: 'h1', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h1src`, targetAnswer: '안녕하세요, 만나서 반갑습니다', acceptedAnswers: ['안녕하세요 만나서 반갑습니다', '안녕하세요! 만나서 반갑습니다!'] },
    { id: 'h2', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['안녕하세요', '저는', '엠마입니다', '엔지니어입니다'] },
    { id: 'h3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'hard', sentenceTemplate: '안녕하세요! ___ 반갑습니다. 저는 민수입니다.', answer: '만나서' },
    { id: 'h4', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h4src`, targetAnswer: '죄송합니다', acceptedAnswers: ['죄송합니다', '미안합니다'] },
    { id: 'h5', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h5src`, targetAnswer: '안녕히 가세요', acceptedAnswers: ['안녕히 가세요', '안녕히가세요'] },
    { id: 'h6', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'hard', sentenceTemplate: '안녕히 ___! (to someone staying)', answer: '계세요' },
  ],
}
