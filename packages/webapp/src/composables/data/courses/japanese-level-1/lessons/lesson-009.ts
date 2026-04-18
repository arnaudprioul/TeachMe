import type { ILesson } from '../../lesson-types'
import { LESSON_CONTENT_TYPE, LESSON_EXERCISE_TYPE, PRACTICE_MODE } from '../../lesson-types'

const P = 'courses.japanese.level1.l9'

export const LESSON_009: ILesson = {
  id: 9,
  themeKey: 'likes',

  words: [
    { id: 'wakarimasu', word: 'わかります', romanization: 'wakarimasu', translation: 'understand', translationFr: 'comprendre', image: '/vocab/jp-l9/wakarimasu.png' },
    { id: 'arimasu9', word: 'あります', romanization: 'arimasu', translation: 'have', translationFr: 'avoir', image: '/vocab/jp-l9/arimasu9.png' },
    { id: 'suki', word: 'すき[な]', romanization: 'suki(na)', translation: 'like', translationFr: 'aimer', image: '/vocab/jp-l9/suki.png' },
    { id: 'kirai', word: 'きらい[な]', romanization: 'kirai(na)', translation: 'dislike', translationFr: 'ne pas aimer', image: '/vocab/jp-l9/kirai.png' },
    { id: 'jozu', word: 'じょうず[な]', romanization: 'jōzu(na)', translation: 'good at', translationFr: 'doué', image: '/vocab/jp-l9/jozu.png' },
    { id: 'heta', word: 'へた[な]', romanization: 'heta(na)', translation: 'bad at', translationFr: 'mauvais à', image: '/vocab/jp-l9/heta.png' },
    { id: 'ryori', word: 'りょうり', romanization: 'ryōri', translation: 'cooking, dish', translationFr: 'cuisine, plat', image: '/vocab/jp-l9/ryori.png' },
    { id: 'nomimono', word: 'のみもの', romanization: 'nomimono', translation: 'drink', translationFr: 'boisson', image: '/vocab/jp-l9/nomimono.png' },
    { id: 'supotsu', word: 'スポーツ', romanization: 'supōtsu', translation: 'sport', translationFr: 'sport', image: '/vocab/jp-l9/supotsu.png' },
    { id: 'yakyu', word: 'やきゅう', romanization: 'yakyū', translation: 'baseball', translationFr: 'baseball', image: '/vocab/jp-l9/yakyu.png' },
    { id: 'dansu', word: 'ダンス', romanization: 'dansu', translation: 'dance', translationFr: 'danse', image: '/vocab/jp-l9/dansu.png' },
    { id: 'ongaku', word: 'おんがく', romanization: 'ongaku', translation: 'music', translationFr: 'musique', image: '/vocab/jp-l9/ongaku.png' },
    { id: 'uta', word: 'うた', romanization: 'uta', translation: 'song', translationFr: 'chanson', image: '/vocab/jp-l9/uta.png' },
    { id: 'karaoke', word: 'カラオケ', romanization: 'karaoke', translation: 'karaoke', translationFr: 'karaoké', image: '/vocab/jp-l9/karaoke.png' },
    { id: 'e9', word: 'え', romanization: 'e', translation: 'picture, drawing', translationFr: 'dessin', image: '/vocab/jp-l9/e9.png' },
    { id: 'komakai', word: 'こまかい おかね', romanization: 'komakai okane', translation: 'small change', translationFr: 'monnaie', image: '/vocab/jp-l9/komakai.png' },
    { id: 'chiketto', word: 'チケット', romanization: 'chiketto', translation: 'ticket', translationFr: 'ticket', image: '/vocab/jp-l9/chiketto.png' },
    { id: 'goshujin', word: 'ごしゅじん', romanization: 'goshujin', translation: 'someone\'s husband', translationFr: 'mari (poli)', image: '/vocab/jp-l9/goshujin.png' },
    { id: 'shujin', word: 'しゅじん', romanization: 'shujin', translation: 'my husband', translationFr: 'mon mari', image: '/vocab/jp-l9/shujin.png' },
    { id: 'okusan', word: 'おくさん', romanization: 'okusan', translation: 'someone\'s wife', translationFr: 'épouse (polie)', image: '/vocab/jp-l9/okusan.png' },
    { id: 'tsuma', word: 'つま', romanization: 'tsuma', translation: 'my wife', translationFr: 'ma femme', image: '/vocab/jp-l9/tsuma.png' },
  ],

  content: [
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shIntroEyebrow`, titleKey: `${P}.c.shIntroTitle`, subtitleKey: `${P}.c.intro`, highlightKey: `${P}.c.shIntroHl`, variant: 'split' } },

    // Part 1: が-object with suki/kirai/jouzu/heta
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shSukiEyebrow`, titleKey: `${P}.c.shSukiTitle`, highlightKey: `${P}.c.shSukiHl` } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardSukiTitle`,
        structures: [
          { parts: [
            { text: '[person]', color: '#3b82f6', labelKey: `${P}.c.lblPerson` },
            { text: 'は', color: '#ef4444', labelKey: `${P}.c.lblWa` },
            { text: '[thing]', color: '#22c55e', labelKey: `${P}.c.lblThing` },
            { text: 'が', color: '#f59e0b', labelKey: `${P}.c.lblGa` },
            { text: 'すき', color: '#ec4899', labelKey: `${P}.c.lblSuki` },
            { text: 'です', color: '#8b5cf6', labelKey: `${P}.c.lblDesu` },
          ] },
          { parts: [{ text: 'だいすき / きらい / だいきらい', color: '#a855f7', labelKey: `${P}.c.lblScale` }] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.sukiExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipGa` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: 'わたしは すしが すきです。', romanization: 'watashi wa sushi ga suki desu.', translationKey: `${P}.c.exSushi` },
        { sentence: 'ミラーさんは ダンスが じょうずです。', romanization: 'mirā-san wa dansu ga jōzu desu.', translationKey: `${P}.c.exDance` },
        { sentence: 'かれは トマトが きらいです。', romanization: 'kare wa tomato ga kirai desu.', translationKey: `${P}.c.exTomato` },
      ],
    },
    {
      type: LESSON_CONTENT_TYPE.PRACTICE_INLINE,
      practiceInline: {
        instructionKey: `${P}.c.prSukiInstr`,
        items: [
          { mode: PRACTICE_MODE.WRITE, promptKey: `${P}.c.prSukiQ1`, answerKey: `${P}.c.prSukiA1`, acceptedAnswers: ['が'] },
          { mode: PRACTICE_MODE.SELECT, promptKey: `${P}.c.prSukiQ2`, answerKey: `${P}.c.prSukiA2`, options: [
            { labelKey: `${P}.c.prSukiA2` }, { labelKey: `${P}.c.prSukiOpt2` }, { labelKey: `${P}.c.prSukiOpt3` }, { labelKey: `${P}.c.prSukiOpt4` },
          ] },
        ],
      },
    },

    // Part 2: wakarimasu / arimasu (with が)
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shHaveEyebrow`, titleKey: `${P}.c.shHaveTitle`, highlightKey: `${P}.c.shHaveHl`, variant: 'split' } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardHaveTitle`,
        structures: [
          { parts: [
            { text: '[thing]', color: '#3b82f6', labelKey: `${P}.c.lblThing2` },
            { text: 'が', color: '#ef4444', labelKey: `${P}.c.lblGa2` },
            { text: 'わかります', color: '#22c55e', labelKey: `${P}.c.lblWakaru` },
          ] },
          { parts: [
            { text: '[thing]', color: '#3b82f6', labelKey: `${P}.c.lblThing3` },
            { text: 'が', color: '#ef4444', labelKey: `${P}.c.lblGa3` },
            { text: 'あります', color: '#22c55e', labelKey: `${P}.c.lblAru` },
          ] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.haveExplain` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: '日本語が 少し わかります。', romanization: 'nihongo ga sukoshi wakarimasu.', translationKey: `${P}.c.exUnderstand` },
        { sentence: 'あした じかんが ありますか。', romanization: 'ashita jikan ga arimasu ka.', translationKey: `${P}.c.exTime` },
        { sentence: 'こまかい おかねが ありません。', romanization: 'komakai okane ga arimasen.', translationKey: `${P}.c.exNoChange` },
      ],
    },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaMidEyebrow`, titleKey: `${P}.c.ctaMidTitle`, subtitleKey: `${P}.c.ctaMidSub`, ctaLabelKey: `${P}.c.ctaMidLabel`, ctaHref: '/japanese/level-1/lessons/9/exercises?difficulty=easy' } },

    // Part 3: から / どうして (reasons)
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shWhyEyebrow`, titleKey: `${P}.c.shWhyTitle`, highlightKey: `${P}.c.shWhyHl` } },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.whyExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipKara` },
    {
      type: LESSON_CONTENT_TYPE.DIALOGUE,
      dialogue: [
        { speaker: '田中', sentence: 'ミラーさん、こんばん カラオケに いきませんか。', romanization: 'mirā-san, konban karaoke ni ikimasen ka.', translationKey: `${P}.c.dlg1` },
        { speaker: 'ミラー', sentence: 'すみません。こんばんは ちょっと…', romanization: 'sumimasen. konban wa chotto…', translationKey: `${P}.c.dlg2` },
        { speaker: '田中', sentence: 'どうしてですか。', romanization: 'dōshite desu ka.', translationKey: `${P}.c.dlg3` },
        { speaker: 'ミラー', sentence: 'しごとが たくさん ありますから。', romanization: 'shigoto ga takusan arimasu kara.', translationKey: `${P}.c.dlg4` },
      ],
    },
    { type: LESSON_CONTENT_TYPE.CULTURAL_NOTE, culturalTitleKey: `${P}.c.cultureTitle`, textKey: `${P}.c.cultureText` },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaFinalEyebrow`, titleKey: `${P}.c.ctaFinalTitle`, subtitleKey: `${P}.c.ctaFinalSub`, ctaLabelKey: `${P}.c.ctaFinalLabel`, ctaHref: '/japanese/level-1/lessons/9/exercises?difficulty=medium' } },
  ],

  exercises: [
    { id: 'e1', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e1q`, options: [ { labelKey: `${P}.ex.e1a`, correct: true }, { labelKey: `${P}.ex.e1b`, correct: false }, { labelKey: `${P}.ex.e1c`, correct: false }, { labelKey: `${P}.ex.e1d`, correct: false } ] },
    { id: 'e2', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e2q`, options: [ { labelKey: `${P}.ex.e2a`, correct: false }, { labelKey: `${P}.ex.e2b`, correct: true }, { labelKey: `${P}.ex.e2c`, correct: false }, { labelKey: `${P}.ex.e2d`, correct: false } ] },
    { id: 'e3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: 'すし___ すきです。', answer: 'が' },
    { id: 'e4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '日本語___ わかります。', answer: 'が' },
    { id: 'e5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e5q`, options: [ { labelKey: `${P}.ex.e5a`, correct: false }, { labelKey: `${P}.ex.e5b`, correct: false }, { labelKey: `${P}.ex.e5c`, correct: true }, { labelKey: `${P}.ex.e5d`, correct: false } ] },
    { id: 'e6', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: 'じかんが あり___。', answer: 'ます' },

    { id: 'm1', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['わたし', 'は', 'ダンス', 'が', 'すき', 'です'] },
    { id: 'm2', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'medium', sourceKey: `${P}.ex.m2src`, targetAnswer: 'ミラーさんは 日本語が じょうずです', acceptedAnswers: ['ミラーさんは日本語がじょうずです'] },
    { id: 'm3', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m3q`, options: [ { labelKey: `${P}.ex.m3a`, correct: false }, { labelKey: `${P}.ex.m3b`, correct: true }, { labelKey: `${P}.ex.m3c`, correct: false }, { labelKey: `${P}.ex.m3d`, correct: false } ] },
    { id: 'm4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'medium', sentenceTemplate: 'こまかい おかね___ ありません。', answer: 'が' },
    { id: 'm5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m5q`, options: [ { labelKey: `${P}.ex.m5a`, correct: true }, { labelKey: `${P}.ex.m5b`, correct: false }, { labelKey: `${P}.ex.m5c`, correct: false }, { labelKey: `${P}.ex.m5d`, correct: false } ] },
    { id: 'm6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['あした', 'じかん', 'が', 'あります', 'か'] },

    { id: 'h1', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h1src`, targetAnswer: 'しごとが たくさん ありますから', acceptedAnswers: ['しごとがたくさんありますから'] },
    { id: 'h2', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['どうして', 'カラオケ', 'に', 'いき', 'ません', 'か'] },
    { id: 'h3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'hard', sentenceTemplate: 'かれ___ やきゅう___ へたです。', answer: 'は／が' },
    { id: 'h4', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h4src`, targetAnswer: '日本語が 少し わかります', acceptedAnswers: ['日本語が少しわかります'] },
    { id: 'h5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'hard', questionKey: `${P}.ex.h5q`, options: [ { labelKey: `${P}.ex.h5a`, correct: false }, { labelKey: `${P}.ex.h5b`, correct: true }, { labelKey: `${P}.ex.h5c`, correct: false }, { labelKey: `${P}.ex.h5d`, correct: false } ] },
    { id: 'h6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['つま', 'は', 'りょうり', 'が', 'じょうず', 'です'] },
  ],
}
