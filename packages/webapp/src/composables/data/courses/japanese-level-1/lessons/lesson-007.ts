import type { ILesson } from '../../lesson-types'
import { LESSON_CONTENT_TYPE, LESSON_EXERCISE_TYPE, PRACTICE_MODE } from '../../lesson-types'

const P = 'courses.japanese.level1.l7'

export const LESSON_007: ILesson = {
  id: 7,
  level: 1,
  themeKey: 'giving',

  words: [
    { id: 'kirimasu', word: 'きります', romanization: 'kirimasu', translation: 'cut, slice', translationFr: 'couper', image: '/vocab/jp-l7/kirimasu.png' },
    { id: 'okurimasu', word: 'おくります', romanization: 'okurimasu', translation: 'send', translationFr: 'envoyer', image: '/vocab/jp-l7/okurimasu.png' },
    { id: 'agemasu', word: 'あげます', romanization: 'agemasu', translation: 'give', translationFr: 'donner', image: '/vocab/jp-l7/agemasu.png' },
    { id: 'moraimasu', word: 'もらいます', romanization: 'moraimasu', translation: 'receive', translationFr: 'recevoir', image: '/vocab/jp-l7/moraimasu.png' },
    { id: 'kashimasu', word: 'かします', romanization: 'kashimasu', translation: 'lend', translationFr: 'prêter', image: '/vocab/jp-l7/kashimasu.png' },
    { id: 'karimasu', word: 'かります', romanization: 'karimasu', translation: 'borrow', translationFr: 'emprunter', image: '/vocab/jp-l7/karimasu.png' },
    { id: 'oshiemasu', word: 'おしえます', romanization: 'oshiemasu', translation: 'teach', translationFr: 'enseigner', image: '/vocab/jp-l7/oshiemasu.png' },
    { id: 'naraimasu', word: 'ならいます', romanization: 'naraimasu', translation: 'learn', translationFr: 'apprendre', image: '/vocab/jp-l7/naraimasu.png' },
    { id: 'kakemasu', word: 'かけます', romanization: 'kakemasu', translation: 'make (a call)', translationFr: 'passer (un appel)', image: '/vocab/jp-l7/kakemasu.png' },
    { id: 'te', word: 'て', romanization: 'te', translation: 'hand', translationFr: 'main', image: '/vocab/jp-l7/te.png' },
    { id: 'hashi', word: 'はし', romanization: 'hashi', translation: 'chopsticks', translationFr: 'baguettes', image: '/vocab/jp-l7/hashi.png' },
    { id: 'supun', word: 'スプーン', romanization: 'supūn', translation: 'spoon', translationFr: 'cuillère', image: '/vocab/jp-l7/supun.png' },
    { id: 'naifu', word: 'ナイフ', romanization: 'naifu', translation: 'knife', translationFr: 'couteau', image: '/vocab/jp-l7/naifu.png' },
    { id: 'foku', word: 'フォーク', romanization: 'fōku', translation: 'fork', translationFr: 'fourchette', image: '/vocab/jp-l7/foku.png' },
    { id: 'hasami', word: 'はさみ', romanization: 'hasami', translation: 'scissors', translationFr: 'ciseaux', image: '/vocab/jp-l7/hasami.png' },
    { id: 'pasokon', word: 'パソコン', romanization: 'pasokon', translation: 'computer', translationFr: 'ordinateur', image: '/vocab/jp-l7/pasokon.png' },
    { id: 'kami', word: 'かみ', romanization: 'kami', translation: 'paper', translationFr: 'papier', image: '/vocab/jp-l7/kami.png' },
    { id: 'hana', word: 'はな', romanization: 'hana', translation: 'flower', translationFr: 'fleur', image: '/vocab/jp-l7/hana.png' },
    { id: 'shatsu', word: 'シャツ', romanization: 'shatsu', translation: 'shirt', translationFr: 'chemise', image: '/vocab/jp-l7/shatsu.png' },
    { id: 'purezento', word: 'プレゼント', romanization: 'purezento', translation: 'present', translationFr: 'cadeau', image: '/vocab/jp-l7/purezento.png' },
    { id: 'nimotsu', word: 'にもつ', romanization: 'nimotsu', translation: 'luggage', translationFr: 'bagages', image: '/vocab/jp-l7/nimotsu.png' },
    { id: 'okane', word: 'おかね', romanization: 'okane', translation: 'money', translationFr: 'argent', image: '/vocab/jp-l7/okane.png' },
    { id: 'kippu', word: 'きっぷ', romanization: 'kippu', translation: 'ticket', translationFr: 'billet', image: '/vocab/jp-l7/kippu.png' },
    { id: 'otosan', word: 'おとうさん', romanization: 'otōsan', translation: 'father (polite)', translationFr: 'père (poli)', image: '/vocab/jp-l7/otosan.png' },
    { id: 'okasan', word: 'おかあさん', romanization: 'okāsan', translation: 'mother (polite)', translationFr: 'mère (polie)', image: '/vocab/jp-l7/okasan.png' },
    { id: 'ryoko', word: 'りょこう', romanization: 'ryokō', translation: 'trip', translationFr: 'voyage', image: '/vocab/jp-l7/ryoko.png' },
    { id: 'omiyage', word: '(お)みやげ', romanization: '(o)miyage', translation: 'souvenir', translationFr: 'souvenir', image: '/vocab/jp-l7/omiyage.png' },
  ],

  content: [
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shIntroEyebrow`, titleKey: `${P}.c.shIntroTitle`, subtitleKey: `${P}.c.intro`, highlightKey: `${P}.c.shIntroHl`, variant: 'split' } },

    // Part 1: tool で
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shToolEyebrow`, titleKey: `${P}.c.shToolTitle`, highlightKey: `${P}.c.shToolHl` } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardToolTitle`,
        structures: [
          { parts: [
            { text: '[tool]', color: '#3b82f6', labelKey: `${P}.c.lblTool` },
            { text: 'で', color: '#ef4444', labelKey: `${P}.c.lblDe` },
            { text: '[thing]', color: '#22c55e', labelKey: `${P}.c.lblThing` },
            { text: 'を', color: '#f59e0b', labelKey: `${P}.c.lblWo` },
            { text: '[verb]ます', color: '#8b5cf6', labelKey: `${P}.c.lblVerb` },
          ] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.toolExplain` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: 'はしで ごはんを たべます。', romanization: 'hashi de gohan o tabemasu.', translationKey: `${P}.c.exChopsticks` },
        { sentence: 'パソコンで てがみを かきます。', romanization: 'pasokon de tegami o kakimasu.', translationKey: `${P}.c.exPc` },
        { sentence: 'はさみで かみを きります。', romanization: 'hasami de kami o kirimasu.', translationKey: `${P}.c.exScissors` },
      ],
    },
    {
      type: LESSON_CONTENT_TYPE.PRACTICE_INLINE,
      practiceInline: {
        instructionKey: `${P}.c.prToolInstr`,
        items: [
          { mode: PRACTICE_MODE.WRITE, promptKey: `${P}.c.prToolQ1`, answerKey: `${P}.c.prToolA1`, acceptedAnswers: ['で'] },
          { mode: PRACTICE_MODE.SELECT, promptKey: `${P}.c.prToolQ2`, answerKey: `${P}.c.prToolA2`, options: [
            { labelKey: `${P}.c.prToolA2` }, { labelKey: `${P}.c.prToolOpt2` }, { labelKey: `${P}.c.prToolOpt3` }, { labelKey: `${P}.c.prToolOpt4` },
          ] },
        ],
      },
    },

    // Part 2: に (recipient) + giving / receiving
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shGiveEyebrow`, titleKey: `${P}.c.shGiveTitle`, highlightKey: `${P}.c.shGiveHl`, variant: 'split' } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardGiveTitle`,
        structures: [
          { parts: [
            { text: '[person]', color: '#3b82f6', labelKey: `${P}.c.lblPerson` },
            { text: 'に', color: '#ef4444', labelKey: `${P}.c.lblNi` },
            { text: '[thing]', color: '#22c55e', labelKey: `${P}.c.lblThing2` },
            { text: 'を', color: '#f59e0b', labelKey: `${P}.c.lblWo2` },
            { text: 'あげます', color: '#8b5cf6', labelKey: `${P}.c.lblGive` },
          ] },
          { parts: [
            { text: '[person]', color: '#3b82f6', labelKey: `${P}.c.lblFrom` },
            { text: 'に / から', color: '#ef4444', labelKey: `${P}.c.lblNiKara` },
            { text: '[thing]', color: '#22c55e', labelKey: `${P}.c.lblThing3` },
            { text: 'を', color: '#f59e0b', labelKey: `${P}.c.lblWo3` },
            { text: 'もらいます', color: '#ec4899', labelKey: `${P}.c.lblReceive` },
          ] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.giveExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipGive` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: 'ともだちに はなを あげました。', romanization: 'tomodachi ni hana o agemashita.', translationKey: `${P}.c.exGaveFlower` },
        { sentence: '田中さんから プレゼントを もらいました。', romanization: 'tanaka-san kara purezento o moraimashita.', translationKey: `${P}.c.exGotPresent` },
        { sentence: '先生に 日本語を ならいます。', romanization: 'sensei ni nihongo o naraimasu.', translationKey: `${P}.c.exLearnJp` },
      ],
    },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaMidEyebrow`, titleKey: `${P}.c.ctaMidTitle`, subtitleKey: `${P}.c.ctaMidSub`, ctaLabelKey: `${P}.c.ctaMidLabel`, ctaHref: '/japanese/level-1/lessons/7/exercises?difficulty=easy' } },

    // Part 3: dialogue + もう / まだ
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shAlreadyEyebrow`, titleKey: `${P}.c.shAlreadyTitle`, highlightKey: `${P}.c.shAlreadyHl` } },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.alreadyExplain` },
    {
      type: LESSON_CONTENT_TYPE.DIALOGUE,
      dialogue: [
        { speaker: '田中', sentence: 'ミラーさん、もう ひるごはんを たべましたか。', romanization: 'mirā-san, mō hirugohan o tabemashita ka.', translationKey: `${P}.c.dlg1` },
        { speaker: 'ミラー', sentence: 'はい、もう たべました。', romanization: 'hai, mō tabemashita.', translationKey: `${P}.c.dlg2` },
        { speaker: '田中', sentence: 'じゃあ、コーヒーでも 飲みませんか。', romanization: 'jā, kōhī demo nomimasen ka.', translationKey: `${P}.c.dlg3` },
        { speaker: 'ミラー', sentence: 'いいですね。', romanization: 'ī desu ne.', translationKey: `${P}.c.dlg4` },
      ],
    },
    { type: LESSON_CONTENT_TYPE.CULTURAL_NOTE, culturalTitleKey: `${P}.c.cultureTitle`, textKey: `${P}.c.cultureText` },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaFinalEyebrow`, titleKey: `${P}.c.ctaFinalTitle`, subtitleKey: `${P}.c.ctaFinalSub`, ctaLabelKey: `${P}.c.ctaFinalLabel`, ctaHref: '/japanese/level-1/lessons/7/exercises?difficulty=medium' } },
  ],

  exercises: [
    { id: 'e1', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e1q`, options: [ { labelKey: `${P}.ex.e1a`, correct: true }, { labelKey: `${P}.ex.e1b`, correct: false }, { labelKey: `${P}.ex.e1c`, correct: false }, { labelKey: `${P}.ex.e1d`, correct: false } ] },
    { id: 'e2', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e2q`, options: [ { labelKey: `${P}.ex.e2a`, correct: false }, { labelKey: `${P}.ex.e2b`, correct: true }, { labelKey: `${P}.ex.e2c`, correct: false }, { labelKey: `${P}.ex.e2d`, correct: false } ] },
    { id: 'e3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: 'はし___ たべます。', answer: 'で' },
    { id: 'e4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: 'ともだち___ あげました。', answer: 'に' },
    { id: 'e5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e5q`, options: [ { labelKey: `${P}.ex.e5a`, correct: false }, { labelKey: `${P}.ex.e5b`, correct: false }, { labelKey: `${P}.ex.e5c`, correct: true }, { labelKey: `${P}.ex.e5d`, correct: false } ] },
    { id: 'e6', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '先生___ ならいます。', answer: 'に' },

    { id: 'm1', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['はさみ', 'で', 'かみ', 'を', 'きります'] },
    { id: 'm2', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'medium', sourceKey: `${P}.ex.m2src`, targetAnswer: 'ともだちに 本を あげました', acceptedAnswers: ['ともだちに本をあげました', 'ともだちに ほんを あげました'] },
    { id: 'm3', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m3q`, options: [ { labelKey: `${P}.ex.m3a`, correct: false }, { labelKey: `${P}.ex.m3b`, correct: true }, { labelKey: `${P}.ex.m3c`, correct: false }, { labelKey: `${P}.ex.m3d`, correct: false } ] },
    { id: 'm4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'medium', sentenceTemplate: 'もう たべ___か。', answer: 'ました' },
    { id: 'm5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m5q`, options: [ { labelKey: `${P}.ex.m5a`, correct: true }, { labelKey: `${P}.ex.m5b`, correct: false }, { labelKey: `${P}.ex.m5c`, correct: false }, { labelKey: `${P}.ex.m5d`, correct: false } ] },
    { id: 'm6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['田中さん', 'から', 'プレゼント', 'を', 'もらい', 'ました'] },

    { id: 'h1', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h1src`, targetAnswer: '先生に 日本語を ならいます', acceptedAnswers: ['先生に日本語をならいます', 'せんせいに にほんごを ならいます'] },
    { id: 'h2', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['でんわ', 'で', 'おかあさん', 'と', 'はなします'] },
    { id: 'h3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'hard', sentenceTemplate: 'かれ___ おかね___ かります。', answer: 'に／を' },
    { id: 'h4', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h4src`, targetAnswer: 'パソコンで てがみを かきました', acceptedAnswers: ['パソコンでてがみをかきました'] },
    { id: 'h5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'hard', questionKey: `${P}.ex.h5q`, options: [ { labelKey: `${P}.ex.h5a`, correct: false }, { labelKey: `${P}.ex.h5b`, correct: true }, { labelKey: `${P}.ex.h5c`, correct: false }, { labelKey: `${P}.ex.h5d`, correct: false } ] },
    { id: 'h6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['ミラーさん', 'に', 'おみやげ', 'を', 'あげ', 'ました'] },
  ],
}
