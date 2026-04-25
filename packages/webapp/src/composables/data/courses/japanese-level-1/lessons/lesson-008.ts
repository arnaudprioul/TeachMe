import type { ILesson } from '../../lesson-types'
import { LESSON_CONTENT_TYPE, LESSON_EXERCISE_TYPE, PRACTICE_MODE } from '../../lesson-types'

const P = 'courses.japanese.level1.l8'

export const LESSON_008: ILesson = {
  id: 8,
  level: 1,
  themeKey: 'adjectives',

  words: [
    // な-adjectives
    { id: 'hansamu', word: 'ハンサム[な]', romanization: 'hansamu(na)', translation: 'handsome', translationFr: 'beau, élégant', image: '/vocab/jp-l8/hansamu.png' },
    { id: 'kirei', word: 'きれい[な]', romanization: 'kirei(na)', translation: 'beautiful, clean', translationFr: 'beau, propre', image: '/vocab/jp-l8/kirei.png' },
    { id: 'shizuka', word: 'しずか[な]', romanization: 'shizuka(na)', translation: 'quiet', translationFr: 'calme', image: '/vocab/jp-l8/shizuka.png' },
    { id: 'nigiyaka', word: 'にぎやか[な]', romanization: 'nigiyaka(na)', translation: 'lively', translationFr: 'animé', image: '/vocab/jp-l8/nigiyaka.png' },
    { id: 'yumei', word: 'ゆうめい[な]', romanization: 'yūmei(na)', translation: 'famous', translationFr: 'célèbre', image: '/vocab/jp-l8/yumei.png' },
    { id: 'shinsetsu', word: 'しんせつ[な]', romanization: 'shinsetsu(na)', translation: 'kind', translationFr: 'gentil', image: '/vocab/jp-l8/shinsetsu.png' },
    { id: 'genki', word: 'げんき[な]', romanization: 'genki(na)', translation: 'healthy, energetic', translationFr: 'en forme', image: '/vocab/jp-l8/genki.png' },
    { id: 'hima', word: 'ひま[な]', romanization: 'hima(na)', translation: 'free (time)', translationFr: 'libre (temps)', image: '/vocab/jp-l8/hima.png' },
    { id: 'benri', word: 'べんり[な]', romanization: 'benri(na)', translation: 'convenient', translationFr: 'pratique', image: '/vocab/jp-l8/benri.png' },
    { id: 'suteki', word: 'すてき[な]', romanization: 'suteki(na)', translation: 'nice, wonderful', translationFr: 'magnifique', image: '/vocab/jp-l8/suteki.png' },
    // い-adjectives
    { id: 'ookii', word: 'おおきい', romanization: 'ōkii', translation: 'big', translationFr: 'grand', image: '/vocab/jp-l8/ookii.png' },
    { id: 'chiisai', word: 'ちいさい', romanization: 'chiisai', translation: 'small', translationFr: 'petit', image: '/vocab/jp-l8/chiisai.png' },
    { id: 'atarashii', word: 'あたらしい', romanization: 'atarashii', translation: 'new', translationFr: 'nouveau', image: '/vocab/jp-l8/atarashii.png' },
    { id: 'furui', word: 'ふるい', romanization: 'furui', translation: 'old (thing)', translationFr: 'vieux (chose)', image: '/vocab/jp-l8/furui.png' },
    { id: 'ii', word: 'いい', romanization: 'ii', translation: 'good', translationFr: 'bon', image: '/vocab/jp-l8/ii.png' },
    { id: 'warui', word: 'わるい', romanization: 'warui', translation: 'bad', translationFr: 'mauvais', image: '/vocab/jp-l8/warui.png' },
    { id: 'atsui', word: 'あつい', romanization: 'atsui', translation: 'hot', translationFr: 'chaud', image: '/vocab/jp-l8/atsui.png' },
    { id: 'samui', word: 'さむい', romanization: 'samui', translation: 'cold (weather)', translationFr: 'froid (temps)', image: '/vocab/jp-l8/samui.png' },
    { id: 'tsumetai', word: 'つめたい', romanization: 'tsumetai', translation: 'cold (touch)', translationFr: 'froid (toucher)', image: '/vocab/jp-l8/tsumetai.png' },
    { id: 'muzukashii', word: 'むずかしい', romanization: 'muzukashii', translation: 'difficult', translationFr: 'difficile', image: '/vocab/jp-l8/muzukashii.png' },
    { id: 'yasashii', word: 'やさしい', romanization: 'yasashii', translation: 'easy / kind', translationFr: 'facile / gentil', image: '/vocab/jp-l8/yasashii.png' },
    { id: 'takai', word: 'たかい', romanization: 'takai', translation: 'expensive / tall', translationFr: 'cher / grand', image: '/vocab/jp-l8/takai.png' },
    { id: 'yasui', word: 'やすい', romanization: 'yasui', translation: 'cheap', translationFr: 'bon marché', image: '/vocab/jp-l8/yasui.png' },
    { id: 'hikui', word: 'ひくい', romanization: 'hikui', translation: 'low', translationFr: 'bas', image: '/vocab/jp-l8/hikui.png' },
    { id: 'omoshiroi', word: 'おもしろい', romanization: 'omoshiroi', translation: 'interesting', translationFr: 'intéressant', image: '/vocab/jp-l8/omoshiroi.png' },
    { id: 'oishii', word: 'おいしい', romanization: 'oishii', translation: 'delicious', translationFr: 'délicieux', image: '/vocab/jp-l8/oishii.png' },
    { id: 'isogashii', word: 'いそがしい', romanization: 'isogashii', translation: 'busy', translationFr: 'occupé', image: '/vocab/jp-l8/isogashii.png' },
    { id: 'tanoshii', word: 'たのしい', romanization: 'tanoshii', translation: 'fun', translationFr: 'amusant', image: '/vocab/jp-l8/tanoshii.png' },
    { id: 'shiroi', word: 'しろい', romanization: 'shiroi', translation: 'white', translationFr: 'blanc', image: '/vocab/jp-l8/shiroi.png' },
    { id: 'kuroi', word: 'くろい', romanization: 'kuroi', translation: 'black', translationFr: 'noir', image: '/vocab/jp-l8/kuroi.png' },
    { id: 'akai', word: 'あかい', romanization: 'akai', translation: 'red', translationFr: 'rouge', image: '/vocab/jp-l8/akai.png' },
    { id: 'aoi', word: 'あおい', romanization: 'aoi', translation: 'blue', translationFr: 'bleu', image: '/vocab/jp-l8/aoi.png' },
    { id: 'sakura', word: 'さくら', romanization: 'sakura', translation: 'cherry blossom', translationFr: 'cerisier', image: '/vocab/jp-l8/sakura.png' },
    { id: 'yama', word: 'やま', romanization: 'yama', translation: 'mountain', translationFr: 'montagne', image: '/vocab/jp-l8/yama.png' },
    { id: 'tabemono', word: 'たべもの', romanization: 'tabemono', translation: 'food', translationFr: 'nourriture', image: '/vocab/jp-l8/tabemono.png' },
    { id: 'benkyo8', word: 'べんきょう', romanization: 'benkyō', translation: 'study', translationFr: 'étude', image: '/vocab/jp-l8/benkyo8.png' },
    { id: 'shigoto', word: '(お)しごと', romanization: '(o)shigoto', translation: 'work', translationFr: 'travail', image: '/vocab/jp-l8/shigoto.png' },
  ],

  content: [
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shIntroEyebrow`, titleKey: `${P}.c.shIntroTitle`, subtitleKey: `${P}.c.intro`, highlightKey: `${P}.c.shIntroHl`, variant: 'split' } },

    // Part 1: い-adjectives
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shIEyebrow`, titleKey: `${P}.c.shITitle`, highlightKey: `${P}.c.shIHl` } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardITitle`,
        structures: [
          { parts: [
            { text: '[subject]', color: '#3b82f6', labelKey: `${P}.c.lblSubject` },
            { text: 'は', color: '#ef4444', labelKey: `${P}.c.lblWa` },
            { text: '○○い', color: '#22c55e', labelKey: `${P}.c.lblIAdj` },
            { text: 'です', color: '#8b5cf6', labelKey: `${P}.c.lblDesu` },
          ] },
          { parts: [{ text: '○○くないです', color: '#ec4899', labelKey: `${P}.c.lblINeg` }] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.iExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipII` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: '富士山は たかいです。', romanization: 'fujisan wa takai desu.', translationKey: `${P}.c.exFuji` },
        { sentence: 'この ケーキは おいしいです。', romanization: 'kono kēki wa oishii desu.', translationKey: `${P}.c.exCake` },
        { sentence: 'きょうは あつくないです。', romanization: 'kyō wa atsukunai desu.', translationKey: `${P}.c.exNotHot` },
      ],
    },

    // Part 2: な-adjectives
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shNaEyebrow`, titleKey: `${P}.c.shNaTitle`, highlightKey: `${P}.c.shNaHl`, variant: 'split' } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardNaTitle`,
        structures: [
          { parts: [
            { text: '[subject]', color: '#3b82f6', labelKey: `${P}.c.lblSubject2` },
            { text: 'は', color: '#ef4444', labelKey: `${P}.c.lblWa2` },
            { text: '○○', color: '#22c55e', labelKey: `${P}.c.lblNaAdj` },
            { text: 'です', color: '#8b5cf6', labelKey: `${P}.c.lblDesu2` },
          ] },
          { parts: [{ text: '○○じゃありません', color: '#ec4899', labelKey: `${P}.c.lblNaNeg` }] },
          { parts: [
            { text: '○○な', color: '#22c55e', labelKey: `${P}.c.lblNaConnect` },
            { text: '[noun]', color: '#f59e0b', labelKey: `${P}.c.lblNoun` },
          ] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.naExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipKirei` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: '京都は しずかな まちです。', romanization: 'kyōto wa shizukana machi desu.', translationKey: `${P}.c.exKyoto` },
        { sentence: 'ミラーさんは しんせつです。', romanization: 'mirā-san wa shinsetsu desu.', translationKey: `${P}.c.exMikeKind` },
        { sentence: 'いまは ひまじゃありません。', romanization: 'ima wa hima ja arimasen.', translationKey: `${P}.c.exNotFree` },
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
          { mode: PRACTICE_MODE.WRITE, promptKey: `${P}.c.prQ2`, answerKey: `${P}.c.prA2`, acceptedAnswers: ['な'] },
          { mode: PRACTICE_MODE.WRITE, promptKey: `${P}.c.prQ3`, answerKey: `${P}.c.prA3`, acceptedAnswers: ['くない', 'くないです'] },
        ],
      },
    },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaMidEyebrow`, titleKey: `${P}.c.ctaMidTitle`, subtitleKey: `${P}.c.ctaMidSub`, ctaLabelKey: `${P}.c.ctaMidLabel`, ctaHref: '/japanese/level-1/lessons/8/exercises?difficulty=easy' } },

    // Part 3: describing experiences (どうですか / とても / あまり)
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shHowEyebrow`, titleKey: `${P}.c.shHowTitle`, highlightKey: `${P}.c.shHowHl` } },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.howExplain` },
    {
      type: LESSON_CONTENT_TYPE.DIALOGUE,
      dialogue: [
        { speaker: '田中', sentence: 'ミラーさん、日本の せいかつは どうですか。', romanization: 'mirā-san, nihon no seikatsu wa dō desu ka.', translationKey: `${P}.c.dlg1` },
        { speaker: 'ミラー', sentence: 'とても たのしいです。', romanization: 'totemo tanoshii desu.', translationKey: `${P}.c.dlg2` },
        { speaker: '田中', sentence: 'しごとは いそがしいですか。', romanization: 'shigoto wa isogashii desu ka.', translationKey: `${P}.c.dlg3` },
        { speaker: 'ミラー', sentence: 'あまり いそがしくないです。', romanization: 'amari isogashikunai desu.', translationKey: `${P}.c.dlg4` },
      ],
    },
    { type: LESSON_CONTENT_TYPE.CULTURAL_NOTE, culturalTitleKey: `${P}.c.cultureTitle`, textKey: `${P}.c.cultureText` },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaFinalEyebrow`, titleKey: `${P}.c.ctaFinalTitle`, subtitleKey: `${P}.c.ctaFinalSub`, ctaLabelKey: `${P}.c.ctaFinalLabel`, ctaHref: '/japanese/level-1/lessons/8/exercises?difficulty=medium' } },
  ],

  exercises: [
    { id: 'e1', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e1q`, options: [ { labelKey: `${P}.ex.e1a`, correct: true }, { labelKey: `${P}.ex.e1b`, correct: false }, { labelKey: `${P}.ex.e1c`, correct: false }, { labelKey: `${P}.ex.e1d`, correct: false } ] },
    { id: 'e2', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e2q`, options: [ { labelKey: `${P}.ex.e2a`, correct: false }, { labelKey: `${P}.ex.e2b`, correct: true }, { labelKey: `${P}.ex.e2c`, correct: false }, { labelKey: `${P}.ex.e2d`, correct: false } ] },
    { id: 'e3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: 'この ほんは おもしろい___。', answer: 'です' },
    { id: 'e4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: 'ミラーさんは しんせつ___。', answer: 'です' },
    { id: 'e5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e5q`, options: [ { labelKey: `${P}.ex.e5a`, correct: false }, { labelKey: `${P}.ex.e5b`, correct: false }, { labelKey: `${P}.ex.e5c`, correct: true }, { labelKey: `${P}.ex.e5d`, correct: false } ] },
    { id: 'e6', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: 'しずか___ まちです。', answer: 'な' },

    { id: 'm1', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['京都', 'は', 'しずか', 'な', 'まち', 'です'] },
    { id: 'm2', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'medium', sourceKey: `${P}.ex.m2src`, targetAnswer: 'この ケーキは おいしくないです', acceptedAnswers: ['このケーキはおいしくないです'] },
    { id: 'm3', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m3q`, options: [ { labelKey: `${P}.ex.m3a`, correct: false }, { labelKey: `${P}.ex.m3b`, correct: true }, { labelKey: `${P}.ex.m3c`, correct: false }, { labelKey: `${P}.ex.m3d`, correct: false } ] },
    { id: 'm4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'medium', sentenceTemplate: 'きょうは あつ___です。', answer: 'くない' },
    { id: 'm5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m5q`, options: [ { labelKey: `${P}.ex.m5a`, correct: true }, { labelKey: `${P}.ex.m5b`, correct: false }, { labelKey: `${P}.ex.m5c`, correct: false }, { labelKey: `${P}.ex.m5d`, correct: false } ] },
    { id: 'm6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['とても', 'たのしい', 'です'] },

    { id: 'h1', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h1src`, targetAnswer: '日本の しごとは どうですか', acceptedAnswers: ['日本のしごとはどうですか', '日本の しごとは どうですか。'] },
    { id: 'h2', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['あまり', 'いそがし', 'くない', 'です'] },
    { id: 'h3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'hard', sentenceTemplate: 'ひま___ ありません。', answer: 'じゃ' },
    { id: 'h4', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h4src`, targetAnswer: 'ミラーさんは ハンサムで しんせつです', acceptedAnswers: ['ミラーさんはハンサムでしんせつです'] },
    { id: 'h5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'hard', questionKey: `${P}.ex.h5q`, options: [ { labelKey: `${P}.ex.h5a`, correct: false }, { labelKey: `${P}.ex.h5b`, correct: true }, { labelKey: `${P}.ex.h5c`, correct: false }, { labelKey: `${P}.ex.h5d`, correct: false } ] },
    { id: 'h6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['ふるい', 'けど', 'きれい', 'な', 'うち', 'です'] },
  ],
}
