import type { ILesson } from '../../lesson-types'
import { LESSON_CONTENT_TYPE, LESSON_EXERCISE_TYPE, PRACTICE_MODE } from '../../lesson-types'

const imgHello = '/vocab/jp-greetings/hello.svg'
const imgThankYou = '/vocab/jp-greetings/thank-you.svg'
const imgYes = '/vocab/jp-greetings/yes.svg'
const imgNo = '/vocab/jp-greetings/no.svg'
const imgSorry = '/vocab/jp-greetings/sorry.svg'
const imgGoodbye = '/vocab/jp-greetings/goodbye.svg'
const imgPlease = '/vocab/jp-greetings/please.svg'
const imgNiceToMeet = '/vocab/jp-greetings/nice-to-meet.svg'
const imgExcuseMe = '/vocab/jp-greetings/excuse-me.svg'

const P = 'courses.japanese.level1.l1'

export const LESSON_001: ILesson = {
  id: 1,
  themeKey: 'greetings',

  // ═══════════════════════════════════════════════════════
  // VOCABULARY — Basic greetings & self-introduction
  // ═══════════════════════════════════════════════════════
  words: [
    { id: 'hello', word: 'こんにちは', romanization: 'konnichiwa', translation: 'Hello / Good afternoon', translationFr: 'Bonjour', image: imgHello },
    { id: 'good-morning', word: 'おはようございます', romanization: 'ohayou gozaimasu', translation: 'Good morning', translationFr: 'Bonjour (matin)', image: imgHello },
    { id: 'good-evening', word: 'こんばんは', romanization: 'konbanwa', translation: 'Good evening', translationFr: 'Bonsoir', image: imgHello },
    { id: 'thank-you', word: 'ありがとうございます', romanization: 'arigatou gozaimasu', translation: 'Thank you', translationFr: 'Merci', image: imgThankYou },
    { id: 'sorry', word: 'すみません', romanization: 'sumimasen', translation: 'Sorry / Excuse me', translationFr: 'Désolé / Excusez-moi', image: imgSorry },
    { id: 'yes', word: 'はい', romanization: 'hai', translation: 'Yes', translationFr: 'Oui', image: imgYes },
    { id: 'no', word: 'いいえ', romanization: 'iie', translation: 'No', translationFr: 'Non', image: imgNo },
    { id: 'goodbye', word: 'さようなら', romanization: 'sayounara', translation: 'Goodbye', translationFr: 'Au revoir', image: imgGoodbye },
    { id: 'nice-to-meet', word: 'はじめまして', romanization: 'hajimemashite', translation: 'Nice to meet you', translationFr: 'Enchanté', image: imgNiceToMeet },
    { id: 'please', word: 'おねがいします', romanization: 'onegaishimasu', translation: 'Please / Thank you in advance', translationFr: 'S\'il vous plaît', image: imgPlease },
    { id: 'excuse-me-formal', word: 'しつれいします', romanization: 'shitsurei shimasu', translation: 'Excuse me (formal)', translationFr: 'Veuillez m\'excuser', image: imgExcuseMe },
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
    {
      type: LESSON_CONTENT_TYPE.CHARACTER_PROFILES,
      characters: [
        { name: 'Mike Miller', nameKr: 'マイク・ミラー', country: 'USA', flag: '🇺🇸', jobKey: `${P}.c.jobEngineer` },
        { name: 'Tanaka', nameKr: '田中', country: 'Japan', flag: '🇯🇵', jobKey: `${P}.c.jobTeacher` },
        { name: 'Kim', nameKr: 'キム', country: 'South Korea', flag: '🇰🇷', jobKey: `${P}.c.jobStudent` },
        { name: 'Watt', nameKr: 'ワット', country: 'UK', flag: '🇬🇧', jobKey: `${P}.c.jobEngineer` },
      ],
    },

    // ── Section 2: Time-based greetings ──
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
        titleKey: `${P}.c.boardGreetTitle`,
        structures: [
          { parts: [{ text: 'おはようございます', color: '#f59e0b', labelKey: `${P}.c.lblMorning` }] },
          { parts: [{ text: 'こんにちは', color: '#3b82f6', labelKey: `${P}.c.lblAfternoon` }] },
          { parts: [{ text: 'こんばんは', color: '#8b5cf6', labelKey: `${P}.c.lblEvening` }] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.greetExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipOhayou` },
    {
      type: LESSON_CONTENT_TYPE.PRACTICE_INLINE,
      practiceInline: {
        instructionKey: `${P}.c.prGreetInstr`,
        items: [
          // SELECT — pick the right greeting for 8 AM
          {
            mode: PRACTICE_MODE.SELECT,
            promptKey: `${P}.c.prGreetQ1`,
            answerKey: `${P}.c.prGreetA1`,
            options: [
              { labelKey: `${P}.c.prGreetA1` },
              { labelKey: `${P}.c.prGreetA2` },
              { labelKey: `${P}.c.prGreetA3` },
              { labelKey: `${P}.c.prGreetOptD` },
            ],
          },
          // SELECT — pick the right greeting for 2 PM
          {
            mode: PRACTICE_MODE.SELECT,
            promptKey: `${P}.c.prGreetQ2`,
            answerKey: `${P}.c.prGreetA2`,
            options: [
              { labelKey: `${P}.c.prGreetA2` },
              { labelKey: `${P}.c.prGreetA1` },
              { labelKey: `${P}.c.prGreetA3` },
              { labelKey: `${P}.c.prGreetOptD` },
            ],
          },
          // SPEAK — click to hear "konbanwa"
          {
            mode: PRACTICE_MODE.SPEAK,
            promptKey: `${P}.c.prGreetQ3`,
            answerKey: `${P}.c.prGreetA3`,
            speakText: 'こんばんは',
          },
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
        titleKey: `${P}.c.boardSelfTitle`,
        structures: [
          {
            parts: [
              { text: 'わたし', color: '#3b82f6', labelKey: `${P}.c.lblI` },
              { text: 'は', color: '#ef4444', labelKey: `${P}.c.lblParticle` },
              { text: '[name]', color: '#22c55e', labelKey: `${P}.c.lblName` },
              { text: 'です', color: '#8b5cf6', labelKey: `${P}.c.lblCopula` },
            ],
          },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.selfExplain` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: 'わたしはマイクです。', romanization: 'watashi wa maiku desu.', translationKey: `${P}.c.exMike` },
        { sentence: 'わたしは学生です。', romanization: 'watashi wa gakusei desu.', translationKey: `${P}.c.exStudent` },
        { sentence: 'わたしはアメリカ人です。', romanization: 'watashi wa amerika-jin desu.', translationKey: `${P}.c.exAmerican` },
      ],
    },
    {
      type: LESSON_CONTENT_TYPE.PRACTICE_INLINE,
      practiceInline: {
        instructionKey: `${P}.c.prSelfInstr`,
        items: [
          // WRITE — type the missing copula
          { mode: PRACTICE_MODE.WRITE, promptKey: `${P}.c.prSelfQ1`, answerKey: `${P}.c.prSelfA1`, acceptedAnswers: ['です'] },
          // SPEAK — click to hear a model self-introduction
          { mode: PRACTICE_MODE.SPEAK, promptKey: `${P}.c.prSelfQ2`, answerKey: `${P}.c.prSelfA2`, speakText: 'わたしはマイクです' },
        ],
      },
    },

    // CTA after Part 2 — practice easy
    {
      type: LESSON_CONTENT_TYPE.SECTION_CTA,
      sectionCta: {
        eyebrowKey: `${P}.c.ctaMidEyebrow`,
        titleKey: `${P}.c.ctaMidTitle`,
        subtitleKey: `${P}.c.ctaMidSub`,
        ctaLabelKey: `${P}.c.ctaMidLabel`,
        ctaHref: '/japanese/level-1/lessons/1/exercises?difficulty=easy',
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
          { parts: [{ text: 'はじめまして', color: '#ec4899', labelKey: `${P}.c.lblFirst` }] },
          { parts: [{ text: 'どうぞよろしく', color: '#f59e0b', labelKey: `${P}.c.lblPleased` }] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.meetExplain` },
    {
      type: LESSON_CONTENT_TYPE.DIALOGUE,
      dialogue: [
        { speaker: 'マイク', sentence: 'はじめまして。', romanization: 'hajimemashite.', translationKey: `${P}.c.dlgMeet1` },
        { speaker: '田中', sentence: 'はじめまして。田中です。', romanization: 'hajimemashite. tanaka desu.', translationKey: `${P}.c.dlgMeet2` },
        { speaker: 'マイク', sentence: 'わたしはマイクです。アメリカ人です。', romanization: 'watashi wa maiku desu. amerika-jin desu.', translationKey: `${P}.c.dlgMeet3` },
        { speaker: '田中', sentence: 'どうぞよろしく おねがいします。', romanization: 'douzo yoroshiku onegaishimasu.', translationKey: `${P}.c.dlgMeet4` },
        { speaker: 'マイク', sentence: 'こちらこそ よろしく おねがいします。', romanization: 'kochirakoso yoroshiku onegaishimasu.', translationKey: `${P}.c.dlgMeet5` },
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
        titleKey: `${P}.c.boardThankTitle`,
        structures: [
          { parts: [{ text: 'ありがとうございます', color: '#3b82f6', labelKey: `${P}.c.lblThank` }] },
          { parts: [{ text: 'すみません', color: '#ef4444', labelKey: `${P}.c.lblSorry` }] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.thankExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipSumimasen` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: 'ありがとうございます、先生！', romanization: 'arigatou gozaimasu, sensei!', translationKey: `${P}.c.exThankTeacher` },
        { sentence: 'すみません、もう一度おねがいします。', romanization: 'sumimasen, mou ichido onegaishimasu.', translationKey: `${P}.c.exRepeat` },
      ],
    },

    // ── Section 6: Saying goodbye ──
    {
      type: LESSON_CONTENT_TYPE.SECTION_HEADER,
      sectionHeader: {
        eyebrowKey: `${P}.c.shByeEyebrow`,
        titleKey: `${P}.c.shByeTitle`,
        highlightKey: `${P}.c.shByeHl`,
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.byeExplain` },
    {
      type: LESSON_CONTENT_TYPE.VOCABULARY_TABLE,
      vocabTable: {
        titleKey: `${P}.c.byeTableTitle`,
        items: [
          { word: 'さようなら', romanization: 'sayounara', translationKey: `${P}.c.byeSayounara` },
          { word: 'じゃあまた', romanization: 'jaa mata', translationKey: `${P}.c.byeJaaMata` },
          { word: 'また明日', romanization: 'mata ashita', translationKey: `${P}.c.byeMataAshita` },
          { word: 'おやすみなさい', romanization: 'oyasumi nasai', translationKey: `${P}.c.byeOyasumi` },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.CULTURAL_NOTE, culturalTitleKey: `${P}.c.cultureByeTitle`, textKey: `${P}.c.cultureByeText` },

    // Final CTA — medium exercises
    {
      type: LESSON_CONTENT_TYPE.SECTION_CTA,
      sectionCta: {
        eyebrowKey: `${P}.c.ctaFinalEyebrow`,
        titleKey: `${P}.c.ctaFinalTitle`,
        subtitleKey: `${P}.c.ctaFinalSub`,
        ctaLabelKey: `${P}.c.ctaFinalLabel`,
        ctaHref: '/japanese/level-1/lessons/1/exercises?difficulty=medium',
      },
    },
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
    { id: 'e3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: 'おはよう___', answer: 'ございます' },
    { id: 'e4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: 'わたしはマイク___', answer: 'です' },
    {
      id: 'e5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy',
      questionKey: `${P}.ex.e5q`,
      options: [
        { labelKey: `${P}.ex.e5a`, correct: false },
        { labelKey: `${P}.ex.e5b`, correct: false },
        { labelKey: `${P}.ex.e5c`, correct: true },
        { labelKey: `${P}.ex.e5d`, correct: false },
      ],
    },
    { id: 'e6', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: 'ありがとう___', answer: 'ございます' },

    // Medium (6)
    { id: 'm1', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['わたし', 'は', 'マイク', 'です'] },
    {
      id: 'm2', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'medium',
      sourceKey: `${P}.ex.m2src`,
      targetAnswer: 'ありがとうございます',
      acceptedAnswers: ['ありがとうございます', 'ありがとう'],
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
    { id: 'm4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'medium', sentenceTemplate: 'はじめ___', answer: 'まして' },
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
    { id: 'm6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['はじめまして', 'わたし', 'は', 'マイク', 'です'] },

    // Hard (6)
    {
      id: 'h1', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard',
      sourceKey: `${P}.ex.h1src`,
      targetAnswer: 'はじめまして、わたしはマイクです',
      acceptedAnswers: ['はじめまして わたしはマイクです', 'はじめまして、わたしはマイクです。', 'はじめまして。わたしはマイクです。'],
    },
    { id: 'h2', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['どうぞ', 'よろしく', 'おねがいします'] },
    { id: 'h3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'hard', sentenceTemplate: 'わたしはアメリカ___です', answer: '人' },
    {
      id: 'h4', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard',
      sourceKey: `${P}.ex.h4src`,
      targetAnswer: 'すみません',
      acceptedAnswers: ['すみません'],
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
    {
      id: 'h6', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard',
      sourceKey: `${P}.ex.h6src`,
      targetAnswer: 'さようなら',
      acceptedAnswers: ['さようなら', 'じゃあまた'],
    },
  ],
}
