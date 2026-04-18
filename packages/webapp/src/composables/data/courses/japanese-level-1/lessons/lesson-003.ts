import type { ILesson } from '../../lesson-types'
import { LESSON_CONTENT_TYPE, LESSON_EXERCISE_TYPE, PRACTICE_MODE } from '../../lesson-types'

const P = 'courses.japanese.level1.l3'

export const LESSON_003: ILesson = {
  id: 3,
  themeKey: 'places',

  words: [
    { id: 'kyoshitsu', word: 'きょうしつ', romanization: 'kyōshitsu', translation: 'classroom', translationFr: 'salle de classe', image: '/vocab/jp-l3/kyoshitsu.png' },
    { id: 'shokudo', word: 'しょくどう', romanization: 'shokudō', translation: 'canteen', translationFr: 'cantine', image: '/vocab/jp-l3/shokudo.png' },
    { id: 'jimusho', word: 'じむしょ', romanization: 'jimusho', translation: 'office', translationFr: 'bureau', image: '/vocab/jp-l3/jimusho.png' },
    { id: 'kaigishitsu', word: 'かいぎしつ', romanization: 'kaigishitsu', translation: 'meeting room', translationFr: 'salle de réunion', image: '/vocab/jp-l3/kaigishitsu.png' },
    { id: 'uketsuke', word: 'うけつけ', romanization: 'uketsuke', translation: 'reception', translationFr: 'accueil', image: '/vocab/jp-l3/uketsuke.png' },
    { id: 'robi', word: 'ロビー', romanization: 'robī', translation: 'lobby', translationFr: 'hall', image: '/vocab/jp-l3/robi.png' },
    { id: 'heya', word: 'へや', romanization: 'heya', translation: 'room', translationFr: 'pièce', image: '/vocab/jp-l3/heya.png' },
    { id: 'toire', word: 'トイレ', romanization: 'toire', translation: 'toilet', translationFr: 'toilettes', image: '/vocab/jp-l3/toire.png' },
    { id: 'kaidan', word: 'かいだん', romanization: 'kaidan', translation: 'staircase', translationFr: 'escalier', image: '/vocab/jp-l3/kaidan.png' },
    { id: 'erebeta', word: 'エレベーター', romanization: 'erebētā', translation: 'elevator', translationFr: 'ascenseur', image: '/vocab/jp-l3/erebeta.png' },
    { id: 'esukareta', word: 'エスカレーター', romanization: 'esukarētā', translation: 'escalator', translationFr: 'escalator', image: '/vocab/jp-l3/esukareta.png' },
    { id: 'kuni', word: 'くに', romanization: 'kuni', translation: 'country', translationFr: 'pays', image: '/vocab/jp-l3/kuni.png' },
    { id: 'kaisha', word: 'かいしゃ', romanization: 'kaisha', translation: 'company', translationFr: 'entreprise', image: '/vocab/jp-l3/kaisha.png' },
    { id: 'uchi', word: 'うち', romanization: 'uchi', translation: 'house, home', translationFr: 'maison', image: '/vocab/jp-l3/uchi.png' },
    { id: 'denwa', word: 'でんわ', romanization: 'denwa', translation: 'telephone', translationFr: 'téléphone', image: '/vocab/jp-l3/denwa.png' },
    { id: 'kutsu', word: 'くつ', romanization: 'kutsu', translation: 'shoes', translationFr: 'chaussures', image: '/vocab/jp-l3/kutsu.png' },
    { id: 'nekutai', word: 'ネクタイ', romanization: 'nekutai', translation: 'necktie', translationFr: 'cravate', image: '/vocab/jp-l3/nekutai.png' },
    { id: 'wain', word: 'ワイン', romanization: 'wain', translation: 'wine', translationFr: 'vin', image: '/vocab/jp-l3/wain.png' },
    { id: 'tabako', word: 'たばこ', romanization: 'tabako', translation: 'tobacco', translationFr: 'tabac', image: '/vocab/jp-l3/tabako.png' },
  ],

  content: [
    {
      type: LESSON_CONTENT_TYPE.SECTION_HEADER,
      sectionHeader: { eyebrowKey: `${P}.c.shIntroEyebrow`, titleKey: `${P}.c.shIntroTitle`, subtitleKey: `${P}.c.intro`, highlightKey: `${P}.c.shIntroHl`, variant: 'split' },
    },

    // Part 1: ここ / そこ / あそこ
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shPlaceEyebrow`, titleKey: `${P}.c.shPlaceTitle`, highlightKey: `${P}.c.shPlaceHl` } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardPlaceTitle`,
        structures: [
          { parts: [{ text: 'ここ', color: '#3b82f6', labelKey: `${P}.c.lblKoko` }] },
          { parts: [{ text: 'そこ', color: '#22c55e', labelKey: `${P}.c.lblSoko` }] },
          { parts: [{ text: 'あそこ', color: '#f59e0b', labelKey: `${P}.c.lblAsoko` }] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.placeExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipDoko` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: 'ここは じむしょです。', romanization: 'koko wa jimusho desu.', translationKey: `${P}.c.exHereOffice` },
        { sentence: 'トイレは どこですか。', romanization: 'toire wa doko desu ka.', translationKey: `${P}.c.exWhereToilet` },
        { sentence: 'エレベーターは あそこです。', romanization: 'erebētā wa asoko desu.', translationKey: `${P}.c.exLiftOver` },
      ],
    },
    {
      type: LESSON_CONTENT_TYPE.PRACTICE_INLINE,
      practiceInline: {
        instructionKey: `${P}.c.prPlaceInstr`,
        items: [
          {
            mode: PRACTICE_MODE.SELECT,
            promptKey: `${P}.c.prPlaceQ1`,
            answerKey: `${P}.c.prPlaceA1`,
            options: [
              { labelKey: `${P}.c.prPlaceA1` },
              { labelKey: `${P}.c.prPlaceOpt2` },
              { labelKey: `${P}.c.prPlaceOpt3` },
              { labelKey: `${P}.c.prPlaceOpt4` },
            ],
          },
          { mode: PRACTICE_MODE.WRITE, promptKey: `${P}.c.prPlaceQ2`, answerKey: `${P}.c.prPlaceA2`, acceptedAnswers: ['どこ'] },
        ],
      },
    },

    // Part 2: prices (いくらですか)
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shPriceEyebrow`, titleKey: `${P}.c.shPriceTitle`, highlightKey: `${P}.c.shPriceHl`, variant: 'split' } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardPriceTitle`,
        structures: [
          { parts: [
            { text: 'これ', color: '#3b82f6', labelKey: `${P}.c.lblItem` },
            { text: 'は', color: '#ef4444', labelKey: `${P}.c.lblParticle` },
            { text: 'いくら', color: '#f59e0b', labelKey: `${P}.c.lblHowMuch` },
            { text: 'です', color: '#8b5cf6', labelKey: `${P}.c.lblCopula` },
            { text: 'か', color: '#ec4899', labelKey: `${P}.c.lblQ` },
          ] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.priceExplain` },
    {
      type: LESSON_CONTENT_TYPE.DIALOGUE,
      dialogue: [
        { speaker: 'ミラー', sentence: 'すみません。これは いくらですか。', romanization: 'sumimasen. kore wa ikura desu ka.', translationKey: `${P}.c.dlg1` },
        { speaker: 'みせのひと', sentence: 'それは 3,000えんです。', romanization: 'sore wa sanzen en desu.', translationKey: `${P}.c.dlg2` },
        { speaker: 'ミラー', sentence: 'じゃあ、これを ください。', romanization: 'jā, kore o kudasai.', translationKey: `${P}.c.dlg3` },
      ],
    },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipKudasai` },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaMidEyebrow`, titleKey: `${P}.c.ctaMidTitle`, subtitleKey: `${P}.c.ctaMidSub`, ctaLabelKey: `${P}.c.ctaMidLabel`, ctaHref: '/japanese/level-1/lessons/3/exercises?difficulty=easy' } },

    // Part 3: country / home の + places vocab
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shCountryEyebrow`, titleKey: `${P}.c.shCountryTitle`, highlightKey: `${P}.c.shCountryHl` } },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.countryExplain` },
    {
      type: LESSON_CONTENT_TYPE.VOCABULARY_TABLE,
      vocabTable: {
        titleKey: `${P}.c.placesTitle`,
        items: [
          { word: 'じむしょ', romanization: 'jimusho', translationKey: `${P}.c.vtOffice` },
          { word: 'うけつけ', romanization: 'uketsuke', translationKey: `${P}.c.vtReception` },
          { word: 'しょくどう', romanization: 'shokudō', translationKey: `${P}.c.vtCanteen` },
          { word: 'かいぎしつ', romanization: 'kaigishitsu', translationKey: `${P}.c.vtMeeting` },
          { word: 'エレベーター', romanization: 'erebētā', translationKey: `${P}.c.vtLift` },
          { word: 'トイレ', romanization: 'toire', translationKey: `${P}.c.vtToilet` },
        ],
      },
    },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: 'これは 日本の くるまです。', romanization: 'kore wa nihon no kuruma desu.', translationKey: `${P}.c.exJpCar` },
        { sentence: 'この ワインは フランスの です。', romanization: 'kono wain wa furansu no desu.', translationKey: `${P}.c.exFrWine` },
      ],
    },
    { type: LESSON_CONTENT_TYPE.CULTURAL_NOTE, culturalTitleKey: `${P}.c.cultureTitle`, textKey: `${P}.c.cultureText` },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaFinalEyebrow`, titleKey: `${P}.c.ctaFinalTitle`, subtitleKey: `${P}.c.ctaFinalSub`, ctaLabelKey: `${P}.c.ctaFinalLabel`, ctaHref: '/japanese/level-1/lessons/3/exercises?difficulty=medium' } },
  ],

  exercises: [
    { id: 'e1', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e1q`, options: [ { labelKey: `${P}.ex.e1a`, correct: true }, { labelKey: `${P}.ex.e1b`, correct: false }, { labelKey: `${P}.ex.e1c`, correct: false }, { labelKey: `${P}.ex.e1d`, correct: false } ] },
    { id: 'e2', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e2q`, options: [ { labelKey: `${P}.ex.e2a`, correct: false }, { labelKey: `${P}.ex.e2b`, correct: true }, { labelKey: `${P}.ex.e2c`, correct: false }, { labelKey: `${P}.ex.e2d`, correct: false } ] },
    { id: 'e3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: 'トイレは ___ ですか。', answer: 'どこ' },
    { id: 'e4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: 'これは ___ですか。', answer: 'いくら' },
    { id: 'e5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e5q`, options: [ { labelKey: `${P}.ex.e5a`, correct: false }, { labelKey: `${P}.ex.e5b`, correct: false }, { labelKey: `${P}.ex.e5c`, correct: true }, { labelKey: `${P}.ex.e5d`, correct: false } ] },
    { id: 'e6', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: 'これを ___。', answer: 'ください' },

    { id: 'm1', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['ここ', 'は', 'じむしょ', 'です'] },
    { id: 'm2', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'medium', sourceKey: `${P}.ex.m2src`, targetAnswer: 'トイレは どこですか', acceptedAnswers: ['トイレはどこですか', 'トイレは どこですか。'] },
    { id: 'm3', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m3q`, options: [ { labelKey: `${P}.ex.m3a`, correct: false }, { labelKey: `${P}.ex.m3b`, correct: true }, { labelKey: `${P}.ex.m3c`, correct: false }, { labelKey: `${P}.ex.m3d`, correct: false } ] },
    { id: 'm4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'medium', sentenceTemplate: 'これは 日本___ くるまです。', answer: 'の' },
    { id: 'm5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m5q`, options: [ { labelKey: `${P}.ex.m5a`, correct: true }, { labelKey: `${P}.ex.m5b`, correct: false }, { labelKey: `${P}.ex.m5c`, correct: false }, { labelKey: `${P}.ex.m5d`, correct: false } ] },
    { id: 'm6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['エレベーター', 'は', 'あそこ', 'です'] },

    { id: 'h1', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h1src`, targetAnswer: 'これは いくらですか', acceptedAnswers: ['これはいくらですか', 'これは いくらですか。'] },
    { id: 'h2', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['すみません', 'これ', 'を', 'ください'] },
    { id: 'h3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'hard', sentenceTemplate: 'この ワイン___ フランス___ です。', answer: 'は／の' },
    { id: 'h4', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h4src`, targetAnswer: 'かいぎしつは 2かいです', acceptedAnswers: ['かいぎしつは２かいです', 'かいぎしつは 2かいです。'] },
    { id: 'h5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'hard', questionKey: `${P}.ex.h5q`, options: [ { labelKey: `${P}.ex.h5a`, correct: false }, { labelKey: `${P}.ex.h5b`, correct: true }, { labelKey: `${P}.ex.h5c`, correct: false }, { labelKey: `${P}.ex.h5d`, correct: false } ] },
    { id: 'h6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['うけつけ', 'は', '1', 'かい', 'です'] },
  ],
}
