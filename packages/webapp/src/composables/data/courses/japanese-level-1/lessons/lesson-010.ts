import type { ILesson } from '../../lesson-types'
import { LESSON_CONTENT_TYPE, LESSON_EXERCISE_TYPE, PRACTICE_MODE } from '../../lesson-types'

const P = 'courses.japanese.level1.l10'

export const LESSON_010: ILesson = {
  id: 10,
  themeKey: 'location',

  words: [
    { id: 'imasu', word: 'います', romanization: 'imasu', translation: 'be (animate)', translationFr: 'être (animé)', image: '/vocab/jp-l10/imasu.png' },
    { id: 'arimasu10', word: 'あります', romanization: 'arimasu', translation: 'be (inanimate)', translationFr: 'être (inanimé)', image: '/vocab/jp-l10/arimasu10.png' },
    { id: 'iroiro', word: 'いろいろ[な]', romanization: 'iroiro(na)', translation: 'various', translationFr: 'divers', image: '/vocab/jp-l10/iroiro.png' },
    { id: 'otokonohito', word: 'おとこのひと', romanization: 'otokonohito', translation: 'man', translationFr: 'homme', image: '/vocab/jp-l10/otokonohito.png' },
    { id: 'onnanohito', word: 'おんなのひと', romanization: 'onnanohito', translation: 'woman', translationFr: 'femme', image: '/vocab/jp-l10/onnanohito.png' },
    { id: 'otokonoko', word: 'おとこのこ', romanization: 'otokonoko', translation: 'boy', translationFr: 'garçon', image: '/vocab/jp-l10/otokonoko.png' },
    { id: 'onnanoko', word: 'おんなのこ', romanization: 'onnanoko', translation: 'girl', translationFr: 'fille', image: '/vocab/jp-l10/onnanoko.png' },
    { id: 'inu', word: 'いぬ', romanization: 'inu', translation: 'dog', translationFr: 'chien', image: '/vocab/jp-l10/inu.png' },
    { id: 'neko', word: 'ねこ', romanization: 'neko', translation: 'cat', translationFr: 'chat', image: '/vocab/jp-l10/neko.png' },
    { id: 'ki', word: 'き', romanization: 'ki', translation: 'tree', translationFr: 'arbre', image: '/vocab/jp-l10/ki.png' },
    { id: 'denchi', word: 'でんち', romanization: 'denchi', translation: 'battery', translationFr: 'pile', image: '/vocab/jp-l10/denchi.png' },
    { id: 'hako', word: 'はこ', romanization: 'hako', translation: 'box', translationFr: 'boîte', image: '/vocab/jp-l10/hako.png' },
    { id: 'suicchi', word: 'スイッチ', romanization: 'suicchi', translation: 'switch', translationFr: 'interrupteur', image: '/vocab/jp-l10/suicchi.png' },
    { id: 'reizoko', word: 'れいぞうこ', romanization: 'reizōko', translation: 'refrigerator', translationFr: 'réfrigérateur', image: '/vocab/jp-l10/reizoko.png' },
    { id: 'teburu', word: 'テーブル', romanization: 'tēburu', translation: 'table', translationFr: 'table', image: '/vocab/jp-l10/teburu.png' },
    { id: 'beddo', word: 'ベッド', romanization: 'beddo', translation: 'bed', translationFr: 'lit', image: '/vocab/jp-l10/beddo.png' },
    { id: 'tana', word: 'たな', romanization: 'tana', translation: 'shelf', translationFr: 'étagère', image: '/vocab/jp-l10/tana.png' },
    { id: 'doa', word: 'ドア', romanization: 'doa', translation: 'door', translationFr: 'porte', image: '/vocab/jp-l10/doa.png' },
    { id: 'mado', word: 'まど', romanization: 'mado', translation: 'window', translationFr: 'fenêtre', image: '/vocab/jp-l10/mado.png' },
    { id: 'posuto', word: 'ポスト', romanization: 'posuto', translation: 'mailbox', translationFr: 'boîte aux lettres', image: '/vocab/jp-l10/posuto.png' },
    { id: 'biru', word: 'ビル', romanization: 'biru', translation: 'building', translationFr: 'immeuble', image: '/vocab/jp-l10/biru.png' },
    { id: 'koen', word: 'こうえん', romanization: 'kōen', translation: 'park', translationFr: 'parc', image: '/vocab/jp-l10/koen.png' },
    { id: 'kissaten', word: 'きっさてん', romanization: 'kissaten', translation: 'coffee shop', translationFr: 'café', image: '/vocab/jp-l10/kissaten.png' },
    { id: 'honya', word: 'ほんや', romanization: 'honya', translation: 'bookstore', translationFr: 'librairie', image: '/vocab/jp-l10/honya.png' },
    { id: 'noriba', word: 'のりば', romanization: 'noriba', translation: 'terminal, stop', translationFr: 'arrêt', image: '/vocab/jp-l10/noriba.png' },
    { id: 'ue', word: 'うえ', romanization: 'ue', translation: 'above', translationFr: 'au-dessus', image: '/vocab/jp-l10/ue.png' },
    { id: 'shita', word: 'した', romanization: 'shita', translation: 'below', translationFr: 'en-dessous', image: '/vocab/jp-l10/shita.png' },
    { id: 'mae', word: 'まえ', romanization: 'mae', translation: 'in front', translationFr: 'devant', image: '/vocab/jp-l10/mae.png' },
    { id: 'ushiro', word: 'うしろ', romanization: 'ushiro', translation: 'behind', translationFr: 'derrière', image: '/vocab/jp-l10/ushiro.png' },
    { id: 'migi', word: 'みぎ', romanization: 'migi', translation: 'right', translationFr: 'droite', image: '/vocab/jp-l10/migi.png' },
    { id: 'hidari', word: 'ひだり', romanization: 'hidari', translation: 'left', translationFr: 'gauche', image: '/vocab/jp-l10/hidari.png' },
    { id: 'naka', word: 'なか', romanization: 'naka', translation: 'inside', translationFr: 'dedans', image: '/vocab/jp-l10/naka.png' },
    { id: 'soto', word: 'そと', romanization: 'soto', translation: 'outside', translationFr: 'dehors', image: '/vocab/jp-l10/soto.png' },
    { id: 'tonari', word: 'となり', romanization: 'tonari', translation: 'next to', translationFr: 'à côté', image: '/vocab/jp-l10/tonari.png' },
    { id: 'chikaku', word: 'ちかく', romanization: 'chikaku', translation: 'near', translationFr: 'près', image: '/vocab/jp-l10/chikaku.png' },
    { id: 'aida', word: 'あいだ', romanization: 'aida', translation: 'between', translationFr: 'entre', image: '/vocab/jp-l10/aida.png' },
  ],

  content: [
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shIntroEyebrow`, titleKey: `${P}.c.shIntroTitle`, subtitleKey: `${P}.c.intro`, highlightKey: `${P}.c.shIntroHl`, variant: 'split' } },

    // Part 1: imasu vs arimasu
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shExistsEyebrow`, titleKey: `${P}.c.shExistsTitle`, highlightKey: `${P}.c.shExistsHl` } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardExistsTitle`,
        structures: [
          { parts: [
            { text: '[place]', color: '#3b82f6', labelKey: `${P}.c.lblPlace` },
            { text: 'に', color: '#ef4444', labelKey: `${P}.c.lblNi` },
            { text: '[living]', color: '#22c55e', labelKey: `${P}.c.lblLiving` },
            { text: 'が', color: '#f59e0b', labelKey: `${P}.c.lblGa` },
            { text: 'います', color: '#8b5cf6', labelKey: `${P}.c.lblImasu` },
          ] },
          { parts: [
            { text: '[place]', color: '#3b82f6', labelKey: `${P}.c.lblPlace2` },
            { text: 'に', color: '#ef4444', labelKey: `${P}.c.lblNi2` },
            { text: '[object]', color: '#22c55e', labelKey: `${P}.c.lblObject` },
            { text: 'が', color: '#f59e0b', labelKey: `${P}.c.lblGa2` },
            { text: 'あります', color: '#8b5cf6', labelKey: `${P}.c.lblArimasu` },
          ] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.existsExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipPlant` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: 'こうえんに いぬが います。', romanization: 'kōen ni inu ga imasu.', translationKey: `${P}.c.exDogPark` },
        { sentence: 'れいぞうこに たまごが あります。', romanization: 'reizōko ni tamago ga arimasu.', translationKey: `${P}.c.exEggFridge` },
        { sentence: 'へやに ミラーさんが います。', romanization: 'heya ni mirā-san ga imasu.', translationKey: `${P}.c.exMikeRoom` },
      ],
    },
    {
      type: LESSON_CONTENT_TYPE.PRACTICE_INLINE,
      practiceInline: {
        instructionKey: `${P}.c.prExistsInstr`,
        items: [
          { mode: PRACTICE_MODE.SELECT, promptKey: `${P}.c.prExistsQ1`, answerKey: `${P}.c.prExistsA1`, options: [
            { labelKey: `${P}.c.prExistsA1` }, { labelKey: `${P}.c.prExistsOpt2` }, { labelKey: `${P}.c.prExistsOpt3` }, { labelKey: `${P}.c.prExistsOpt4` },
          ] },
          { mode: PRACTICE_MODE.WRITE, promptKey: `${P}.c.prExistsQ2`, answerKey: `${P}.c.prExistsA2`, acceptedAnswers: ['います'] },
        ],
      },
    },

    // Part 2: position words (ue/shita/mae/ushiro/...)
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shWhereEyebrow`, titleKey: `${P}.c.shWhereTitle`, highlightKey: `${P}.c.shWhereHl`, variant: 'split' } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardWhereTitle`,
        structures: [
          { parts: [
            { text: '[thing]', color: '#3b82f6', labelKey: `${P}.c.lblThingA` },
            { text: 'の', color: '#ef4444', labelKey: `${P}.c.lblNo` },
            { text: '[position]', color: '#22c55e', labelKey: `${P}.c.lblPosition` },
            { text: 'に', color: '#f59e0b', labelKey: `${P}.c.lblNi3` },
          ] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.whereExplain` },
    {
      type: LESSON_CONTENT_TYPE.VOCABULARY_TABLE,
      vocabTable: {
        titleKey: `${P}.c.positionsTitle`,
        items: [
          { word: 'うえ', romanization: 'ue', translationKey: `${P}.c.vtUe` },
          { word: 'した', romanization: 'shita', translationKey: `${P}.c.vtShita` },
          { word: 'まえ', romanization: 'mae', translationKey: `${P}.c.vtMae` },
          { word: 'うしろ', romanization: 'ushiro', translationKey: `${P}.c.vtUshiro` },
          { word: 'みぎ', romanization: 'migi', translationKey: `${P}.c.vtMigi` },
          { word: 'ひだり', romanization: 'hidari', translationKey: `${P}.c.vtHidari` },
          { word: 'なか', romanization: 'naka', translationKey: `${P}.c.vtNaka` },
          { word: 'そと', romanization: 'soto', translationKey: `${P}.c.vtSoto` },
          { word: 'となり', romanization: 'tonari', translationKey: `${P}.c.vtTonari` },
          { word: 'あいだ', romanization: 'aida', translationKey: `${P}.c.vtAida` },
        ],
      },
    },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: 'ねこは テーブルの したに います。', romanization: 'neko wa tēburu no shita ni imasu.', translationKey: `${P}.c.exCatTable` },
        { sentence: 'ポストは ビルの まえに あります。', romanization: 'posuto wa biru no mae ni arimasu.', translationKey: `${P}.c.exMailbox` },
        { sentence: 'きっさてんは 本屋と ビルの あいだに あります。', romanization: 'kissaten wa honya to biru no aida ni arimasu.', translationKey: `${P}.c.exBetween` },
      ],
    },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaMidEyebrow`, titleKey: `${P}.c.ctaMidTitle`, subtitleKey: `${P}.c.ctaMidSub`, ctaLabelKey: `${P}.c.ctaMidLabel`, ctaHref: '/japanese/level-1/lessons/10/exercises?difficulty=easy' } },

    // Part 3: asking where
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shAskEyebrow`, titleKey: `${P}.c.shAskTitle`, highlightKey: `${P}.c.shAskHl` } },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.askExplain` },
    {
      type: LESSON_CONTENT_TYPE.DIALOGUE,
      dialogue: [
        { speaker: 'ミラー', sentence: 'すみません、ゆうびんきょくは どこに ありますか。', romanization: 'sumimasen, yūbinkyoku wa doko ni arimasu ka.', translationKey: `${P}.c.dlg1` },
        { speaker: 'とおりのひと', sentence: 'えきの まえに あります。', romanization: 'eki no mae ni arimasu.', translationKey: `${P}.c.dlg2` },
        { speaker: 'ミラー', sentence: 'ちかくに ATMが ありますか。', romanization: 'chikaku ni ATM ga arimasu ka.', translationKey: `${P}.c.dlg3` },
        { speaker: 'とおりのひと', sentence: 'はい、ゆうびんきょくの となりに あります。', romanization: 'hai, yūbinkyoku no tonari ni arimasu.', translationKey: `${P}.c.dlg4` },
      ],
    },
    { type: LESSON_CONTENT_TYPE.CULTURAL_NOTE, culturalTitleKey: `${P}.c.cultureTitle`, textKey: `${P}.c.cultureText` },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaFinalEyebrow`, titleKey: `${P}.c.ctaFinalTitle`, subtitleKey: `${P}.c.ctaFinalSub`, ctaLabelKey: `${P}.c.ctaFinalLabel`, ctaHref: '/japanese/level-1/lessons/10/exercises?difficulty=medium' } },
  ],

  exercises: [
    { id: 'e1', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e1q`, options: [ { labelKey: `${P}.ex.e1a`, correct: true }, { labelKey: `${P}.ex.e1b`, correct: false }, { labelKey: `${P}.ex.e1c`, correct: false }, { labelKey: `${P}.ex.e1d`, correct: false } ] },
    { id: 'e2', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e2q`, options: [ { labelKey: `${P}.ex.e2a`, correct: false }, { labelKey: `${P}.ex.e2b`, correct: true }, { labelKey: `${P}.ex.e2c`, correct: false }, { labelKey: `${P}.ex.e2d`, correct: false } ] },
    { id: 'e3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: 'こうえんに いぬが ___。', answer: 'います' },
    { id: 'e4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: 'テーブルの ___に ねこが います。', answer: 'した' },
    { id: 'e5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e5q`, options: [ { labelKey: `${P}.ex.e5a`, correct: false }, { labelKey: `${P}.ex.e5b`, correct: true }, { labelKey: `${P}.ex.e5c`, correct: false }, { labelKey: `${P}.ex.e5d`, correct: false } ] },
    { id: 'e6', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: 'はこ___ なかに でんちが あります。', answer: 'の' },

    { id: 'm1', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['こうえん', 'に', 'いぬ', 'が', 'います'] },
    { id: 'm2', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'medium', sourceKey: `${P}.ex.m2src`, targetAnswer: 'ポストは ビルの まえに あります', acceptedAnswers: ['ポストはビルのまえにあります'] },
    { id: 'm3', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m3q`, options: [ { labelKey: `${P}.ex.m3a`, correct: false }, { labelKey: `${P}.ex.m3b`, correct: true }, { labelKey: `${P}.ex.m3c`, correct: false }, { labelKey: `${P}.ex.m3d`, correct: false } ] },
    { id: 'm4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'medium', sentenceTemplate: 'ゆうびんきょくは どこ___ ありますか。', answer: 'に' },
    { id: 'm5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m5q`, options: [ { labelKey: `${P}.ex.m5a`, correct: true }, { labelKey: `${P}.ex.m5b`, correct: false }, { labelKey: `${P}.ex.m5c`, correct: false }, { labelKey: `${P}.ex.m5d`, correct: false } ] },
    { id: 'm6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['ねこ', 'は', 'テーブル', 'の', 'した', 'に', 'います'] },

    { id: 'h1', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h1src`, targetAnswer: 'きっさてんは 本屋と ビルの あいだに あります', acceptedAnswers: ['きっさてんは本屋とビルのあいだにあります'] },
    { id: 'h2', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['えき', 'の', 'ちかく', 'に', 'ATM', 'が', 'あります'] },
    { id: 'h3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'hard', sentenceTemplate: 'いぬ___ ねこ___ いますか。', answer: 'と／が' },
    { id: 'h4', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h4src`, targetAnswer: 'へやに だれも いません', acceptedAnswers: ['へやにだれもいません', '部屋にだれもいません'] },
    { id: 'h5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'hard', questionKey: `${P}.ex.h5q`, options: [ { labelKey: `${P}.ex.h5a`, correct: false }, { labelKey: `${P}.ex.h5b`, correct: true }, { labelKey: `${P}.ex.h5c`, correct: false }, { labelKey: `${P}.ex.h5d`, correct: false } ] },
    { id: 'h6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['ほんや', 'は', 'ゆうびんきょく', 'の', 'となり', 'に', 'あります'] },
  ],
}
