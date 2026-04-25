import type { ILesson } from '../../lesson-types'
import { LESSON_CONTENT_TYPE, LESSON_EXERCISE_TYPE, PRACTICE_MODE } from '../../lesson-types'

const P = 'courses.japanese.level1.l6'

export const LESSON_006: ILesson = {
  id: 6,
  level: 1,
  themeKey: 'food',

  words: [
    { id: 'tabemasu', word: 'たべます', romanization: 'tabemasu', translation: 'eat', translationFr: 'manger', image: '/vocab/jp-l6/tabemasu.png' },
    { id: 'nomimasu', word: 'のみます', romanization: 'nomimasu', translation: 'drink', translationFr: 'boire', image: '/vocab/jp-l6/nomimasu.png' },
    { id: 'suimasu', word: 'すいます', romanization: 'suimasu', translation: 'smoke (tobacco)', translationFr: 'fumer', image: '/vocab/jp-l6/suimasu.png' },
    { id: 'mimasu', word: 'みます', romanization: 'mimasu', translation: 'see, watch', translationFr: 'voir, regarder', image: '/vocab/jp-l6/mimasu.png' },
    { id: 'kikimasu', word: 'ききます', romanization: 'kikimasu', translation: 'listen', translationFr: 'écouter', image: '/vocab/jp-l6/kikimasu.png' },
    { id: 'yomimasu', word: 'よみます', romanization: 'yomimasu', translation: 'read', translationFr: 'lire', image: '/vocab/jp-l6/yomimasu.png' },
    { id: 'kakimasu', word: 'かきます', romanization: 'kakimasu', translation: 'write', translationFr: 'écrire', image: '/vocab/jp-l6/kakimasu.png' },
    { id: 'kaimasu', word: 'かいます', romanization: 'kaimasu', translation: 'buy', translationFr: 'acheter', image: '/vocab/jp-l6/kaimasu.png' },
    { id: 'torimasu', word: 'とります', romanization: 'torimasu', translation: 'take (a photo)', translationFr: 'prendre (une photo)', image: '/vocab/jp-l6/torimasu.png' },
    { id: 'aimasu', word: 'あいます', romanization: 'aimasu', translation: 'meet', translationFr: 'rencontrer', image: '/vocab/jp-l6/aimasu.png' },
    { id: 'gohan', word: 'ごはん', romanization: 'gohan', translation: 'meal, rice', translationFr: 'repas, riz', image: '/vocab/jp-l6/gohan.png' },
    { id: 'asagohan', word: 'あさごはん', romanization: 'asagohan', translation: 'breakfast', translationFr: 'petit-déjeuner', image: '/vocab/jp-l6/asagohan.png' },
    { id: 'hirugohan', word: 'ひるごはん', romanization: 'hirugohan', translation: 'lunch', translationFr: 'déjeuner', image: '/vocab/jp-l6/hirugohan.png' },
    { id: 'bangohan', word: 'ばんごはん', romanization: 'bangohan', translation: 'dinner', translationFr: 'dîner', image: '/vocab/jp-l6/bangohan.png' },
    { id: 'pan', word: 'パン', romanization: 'pan', translation: 'bread', translationFr: 'pain', image: '/vocab/jp-l6/pan.png' },
    { id: 'tamago', word: 'たまご', romanization: 'tamago', translation: 'egg', translationFr: 'œuf', image: '/vocab/jp-l6/tamago.png' },
    { id: 'niku', word: 'にく', romanization: 'niku', translation: 'meat', translationFr: 'viande', image: '/vocab/jp-l6/niku.png' },
    { id: 'sakana', word: 'さかな', romanization: 'sakana', translation: 'fish', translationFr: 'poisson', image: '/vocab/jp-l6/sakana.png' },
    { id: 'yasai', word: 'やさい', romanization: 'yasai', translation: 'vegetables', translationFr: 'légumes', image: '/vocab/jp-l6/yasai.png' },
    { id: 'kudamono', word: 'くだもの', romanization: 'kudamono', translation: 'fruit', translationFr: 'fruit', image: '/vocab/jp-l6/kudamono.png' },
    { id: 'mizu', word: 'みず', romanization: 'mizu', translation: 'water', translationFr: 'eau', image: '/vocab/jp-l6/mizu.png' },
    { id: 'ocha', word: 'おちゃ', romanization: 'ocha', translation: 'green tea', translationFr: 'thé vert', image: '/vocab/jp-l6/ocha.png' },
    { id: 'kocha', word: 'こうちゃ', romanization: 'kōcha', translation: 'black tea', translationFr: 'thé noir', image: '/vocab/jp-l6/kocha.png' },
    { id: 'gyunyu', word: 'ぎゅうにゅう', romanization: 'gyūnyū', translation: 'milk', translationFr: 'lait', image: '/vocab/jp-l6/gyunyu.png' },
    { id: 'jusu', word: 'ジュース', romanization: 'jūsu', translation: 'juice', translationFr: 'jus', image: '/vocab/jp-l6/jusu.png' },
    { id: 'biru', word: 'ビール', romanization: 'bīru', translation: 'beer', translationFr: 'bière', image: '/vocab/jp-l6/biru.png' },
    { id: 'sake', word: '(お)さけ', romanization: '(o)sake', translation: 'alcohol, sake', translationFr: 'alcool, saké', image: '/vocab/jp-l6/sake.png' },
    { id: 'eiga', word: 'えいが', romanization: 'eiga', translation: 'movie', translationFr: 'film', image: '/vocab/jp-l6/eiga.png' },
    { id: 'cd', word: 'シーディー', romanization: 'shīdī', translation: 'CD', translationFr: 'CD', image: '/vocab/jp-l6/cd.png' },
    { id: 'tegami', word: 'てがみ', romanization: 'tegami', translation: 'letter', translationFr: 'lettre', image: '/vocab/jp-l6/tegami.png' },
    { id: 'shashin', word: 'しゃしん', romanization: 'shashin', translation: 'photograph', translationFr: 'photographie', image: '/vocab/jp-l6/shashin.png' },
    { id: 'mise', word: 'みせ', romanization: 'mise', translation: 'shop', translationFr: 'magasin', image: '/vocab/jp-l6/mise.png' },
    { id: 'resutoran', word: 'レストラン', romanization: 'resutoran', translation: 'restaurant', translationFr: 'restaurant', image: '/vocab/jp-l6/resutoran.png' },
  ],

  content: [
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shIntroEyebrow`, titleKey: `${P}.c.shIntroTitle`, subtitleKey: `${P}.c.intro`, highlightKey: `${P}.c.shIntroHl`, variant: 'split' } },

    // Part 1: direct object を
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shObjEyebrow`, titleKey: `${P}.c.shObjTitle`, highlightKey: `${P}.c.shObjHl` } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardObjTitle`,
        structures: [
          { parts: [
            { text: '[thing]', color: '#3b82f6', labelKey: `${P}.c.lblThing` },
            { text: 'を', color: '#ef4444', labelKey: `${P}.c.lblWo` },
            { text: '[verb]ます', color: '#22c55e', labelKey: `${P}.c.lblVerb` },
          ] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.objExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipWo` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: 'ごはんを たべます。', romanization: 'gohan o tabemasu.', translationKey: `${P}.c.exEatRice` },
        { sentence: 'みずを のみます。', romanization: 'mizu o nomimasu.', translationKey: `${P}.c.exDrinkWater` },
        { sentence: 'しゃしんを とります。', romanization: 'shashin o torimasu.', translationKey: `${P}.c.exTakePhoto` },
        { sentence: 'ほんを よみます。', romanization: 'hon o yomimasu.', translationKey: `${P}.c.exReadBook` },
      ],
    },
    {
      type: LESSON_CONTENT_TYPE.PRACTICE_INLINE,
      practiceInline: {
        instructionKey: `${P}.c.prObjInstr`,
        items: [
          { mode: PRACTICE_MODE.WRITE, promptKey: `${P}.c.prObjQ1`, answerKey: `${P}.c.prObjA1`, acceptedAnswers: ['を'] },
          { mode: PRACTICE_MODE.SELECT, promptKey: `${P}.c.prObjQ2`, answerKey: `${P}.c.prObjA2`, options: [
            { labelKey: `${P}.c.prObjA2` }, { labelKey: `${P}.c.prObjOpt2` }, { labelKey: `${P}.c.prObjOpt3` }, { labelKey: `${P}.c.prObjOpt4` },
          ] },
        ],
      },
    },

    // Part 2: place of action で
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shWhereEyebrow`, titleKey: `${P}.c.shWhereTitle`, highlightKey: `${P}.c.shWhereHl`, variant: 'split' } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardWhereTitle`,
        structures: [
          { parts: [
            { text: '[place]', color: '#3b82f6', labelKey: `${P}.c.lblPlace` },
            { text: 'で', color: '#ef4444', labelKey: `${P}.c.lblDeAction` },
            { text: '[thing]', color: '#22c55e', labelKey: `${P}.c.lblThing2` },
            { text: 'を', color: '#f59e0b', labelKey: `${P}.c.lblWo2` },
            { text: '[verb]ます', color: '#8b5cf6', labelKey: `${P}.c.lblVerb2` },
          ] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.whereExplain` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: 'レストランで ひるごはんを たべます。', romanization: 'resutoran de hirugohan o tabemasu.', translationKey: `${P}.c.exLunchResto` },
        { sentence: 'としょかんで ほんを よみます。', romanization: 'toshokan de hon o yomimasu.', translationKey: `${P}.c.exReadLib` },
        { sentence: 'スーパーで やさいを かいます。', romanization: 'sūpā de yasai o kaimasu.', translationKey: `${P}.c.exBuyVeg` },
      ],
    },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaMidEyebrow`, titleKey: `${P}.c.ctaMidTitle`, subtitleKey: `${P}.c.ctaMidSub`, ctaLabelKey: `${P}.c.ctaMidLabel`, ctaHref: '/japanese/level-1/lessons/6/exercises?difficulty=easy' } },

    // Part 3: invitations (ませんか / ましょう)
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shInviteEyebrow`, titleKey: `${P}.c.shInviteTitle`, highlightKey: `${P}.c.shInviteHl` } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardInviteTitle`,
        structures: [
          { parts: [{ text: '[verb]ませんか', color: '#3b82f6', labelKey: `${P}.c.lblSuggest` }] },
          { parts: [{ text: '[verb]ましょう', color: '#22c55e', labelKey: `${P}.c.lblLetsGo` }] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.inviteExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipInvite` },
    {
      type: LESSON_CONTENT_TYPE.DIALOGUE,
      dialogue: [
        { speaker: '田中', sentence: 'ミラーさん、いっしょに ひるごはんを たべませんか。', romanization: 'mirā-san, issho ni hirugohan o tabemasen ka.', translationKey: `${P}.c.dlg1` },
        { speaker: 'ミラー', sentence: 'いいですね。何を たべましょうか。', romanization: 'ī desu ne. nani o tabemashō ka.', translationKey: `${P}.c.dlg2` },
        { speaker: '田中', sentence: 'ラーメンは どうですか。', romanization: 'rāmen wa dō desu ka.', translationKey: `${P}.c.dlg3` },
        { speaker: 'ミラー', sentence: 'いいですね。行きましょう。', romanization: 'ī desu ne. ikimashō.', translationKey: `${P}.c.dlg4` },
      ],
    },
    { type: LESSON_CONTENT_TYPE.CULTURAL_NOTE, culturalTitleKey: `${P}.c.cultureTitle`, textKey: `${P}.c.cultureText` },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaFinalEyebrow`, titleKey: `${P}.c.ctaFinalTitle`, subtitleKey: `${P}.c.ctaFinalSub`, ctaLabelKey: `${P}.c.ctaFinalLabel`, ctaHref: '/japanese/level-1/lessons/6/exercises?difficulty=medium' } },
  ],

  exercises: [
    { id: 'e1', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e1q`, options: [ { labelKey: `${P}.ex.e1a`, correct: true }, { labelKey: `${P}.ex.e1b`, correct: false }, { labelKey: `${P}.ex.e1c`, correct: false }, { labelKey: `${P}.ex.e1d`, correct: false } ] },
    { id: 'e2', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e2q`, options: [ { labelKey: `${P}.ex.e2a`, correct: false }, { labelKey: `${P}.ex.e2b`, correct: true }, { labelKey: `${P}.ex.e2c`, correct: false }, { labelKey: `${P}.ex.e2d`, correct: false } ] },
    { id: 'e3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: 'ごはん___ たべます。', answer: 'を' },
    { id: 'e4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: 'レストラン___ たべます。', answer: 'で' },
    { id: 'e5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e5q`, options: [ { labelKey: `${P}.ex.e5a`, correct: false }, { labelKey: `${P}.ex.e5b`, correct: false }, { labelKey: `${P}.ex.e5c`, correct: true }, { labelKey: `${P}.ex.e5d`, correct: false } ] },
    { id: 'e6', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: 'コーヒーを のみ___。', answer: 'ます' },

    { id: 'm1', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['スーパー', 'で', 'やさい', 'を', 'かいます'] },
    { id: 'm2', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'medium', sourceKey: `${P}.ex.m2src`, targetAnswer: 'ほんを よみます', acceptedAnswers: ['ほんをよみます', 'ほんを よみます。'] },
    { id: 'm3', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m3q`, options: [ { labelKey: `${P}.ex.m3a`, correct: false }, { labelKey: `${P}.ex.m3b`, correct: true }, { labelKey: `${P}.ex.m3c`, correct: false }, { labelKey: `${P}.ex.m3d`, correct: false } ] },
    { id: 'm4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'medium', sentenceTemplate: 'いっしょに たべ___か。', answer: 'ません' },
    { id: 'm5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m5q`, options: [ { labelKey: `${P}.ex.m5a`, correct: true }, { labelKey: `${P}.ex.m5b`, correct: false }, { labelKey: `${P}.ex.m5c`, correct: false }, { labelKey: `${P}.ex.m5d`, correct: false } ] },
    { id: 'm6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['えいが', 'を', 'み', 'ましょう'] },

    { id: 'h1', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h1src`, targetAnswer: 'レストランで ばんごはんを たべました', acceptedAnswers: ['レストランでばんごはんをたべました'] },
    { id: 'h2', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['いっしょ', 'に', 'コーヒー', 'を', 'のみ', 'ませんか'] },
    { id: 'h3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'hard', sentenceTemplate: 'としょかん___ ほん___ よみます。', answer: 'で／を' },
    { id: 'h4', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h4src`, targetAnswer: 'ともだちと えいがを 見ました', acceptedAnswers: ['ともだちとえいがを見ました', 'ともだちと えいがを みました'] },
    { id: 'h5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'hard', questionKey: `${P}.ex.h5q`, options: [ { labelKey: `${P}.ex.h5a`, correct: false }, { labelKey: `${P}.ex.h5b`, correct: true }, { labelKey: `${P}.ex.h5c`, correct: false }, { labelKey: `${P}.ex.h5d`, correct: false } ] },
    { id: 'h6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['みせ', 'で', 'プレゼント', 'を', 'かい', 'ました'] },
  ],
}
