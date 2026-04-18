import type { ILesson } from '../../lesson-types'
import { LESSON_CONTENT_TYPE, LESSON_EXERCISE_TYPE, PRACTICE_MODE } from '../../lesson-types'

const P = 'courses.japanese.level1.l4'

export const LESSON_004: ILesson = {
  id: 4,
  themeKey: 'dailyLife',

  words: [
    { id: 'okimasu', word: 'おきます', romanization: 'okimasu', translation: 'wake up', translationFr: 'se réveiller', image: '/vocab/jp-l4/okimasu.png' },
    { id: 'nemasu', word: 'ねます', romanization: 'nemasu', translation: 'sleep', translationFr: 'dormir', image: '/vocab/jp-l4/nemasu.png' },
    { id: 'hatarakimasu', word: 'はたらきます', romanization: 'hatarakimasu', translation: 'work', translationFr: 'travailler', image: '/vocab/jp-l4/hatarakimasu.png' },
    { id: 'yasumimasu', word: 'やすみます', romanization: 'yasumimasu', translation: 'rest, take a day off', translationFr: 'se reposer, prendre un congé', image: '/vocab/jp-l4/yasumimasu.png' },
    { id: 'benkyo', word: 'べんきょうします', romanization: 'benkyō shimasu', translation: 'study', translationFr: 'étudier', image: '/vocab/jp-l4/benkyo.png' },
    { id: 'owarimasu', word: 'おわります', romanization: 'owarimasu', translation: 'finish', translationFr: 'finir', image: '/vocab/jp-l4/owarimasu.png' },
    { id: 'depato', word: 'デパート', romanization: 'depāto', translation: 'department store', translationFr: 'grand magasin', image: '/vocab/jp-l4/depato.png' },
    { id: 'ginko', word: 'ぎんこう', romanization: 'ginkō', translation: 'bank', translationFr: 'banque', image: '/vocab/jp-l4/ginko.png' },
    { id: 'yubinkyoku', word: 'ゆうびんきょく', romanization: 'yūbinkyoku', translation: 'post office', translationFr: 'bureau de poste', image: '/vocab/jp-l4/yubinkyoku.png' },
    { id: 'toshokan', word: 'としょかん', romanization: 'toshokan', translation: 'library', translationFr: 'bibliothèque', image: '/vocab/jp-l4/toshokan.png' },
    { id: 'bijutsukan', word: 'びじゅつかん', romanization: 'bijutsukan', translation: 'art museum', translationFr: 'musée', image: '/vocab/jp-l4/bijutsukan.png' },
    { id: 'asa', word: 'あさ', romanization: 'asa', translation: 'morning', translationFr: 'matin', image: '/vocab/jp-l4/asa.png' },
    { id: 'hiru', word: 'ひる', romanization: 'hiru', translation: 'daytime, noon', translationFr: 'journée, midi', image: '/vocab/jp-l4/hiru.png' },
    { id: 'ban', word: 'ばん', romanization: 'ban', translation: 'night', translationFr: 'soir', image: '/vocab/jp-l4/ban.png' },
  ],

  content: [
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shIntroEyebrow`, titleKey: `${P}.c.shIntroTitle`, subtitleKey: `${P}.c.intro`, highlightKey: `${P}.c.shIntroHl`, variant: 'split' } },

    // Part 1: telling time (何時ですか)
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shTimeEyebrow`, titleKey: `${P}.c.shTimeTitle`, highlightKey: `${P}.c.shTimeHl` } },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.timeExplain` },
    {
      type: LESSON_CONTENT_TYPE.VOCABULARY_TABLE,
      vocabTable: {
        titleKey: `${P}.c.timeTitle`,
        items: [
          { word: '1じ', romanization: 'ichi-ji', translationKey: `${P}.c.vtOne` },
          { word: '4じ', romanization: 'yo-ji', translationKey: `${P}.c.vtFour` },
          { word: '7じ', romanization: 'shichi-ji', translationKey: `${P}.c.vtSeven` },
          { word: '9じ', romanization: 'ku-ji', translationKey: `${P}.c.vtNine` },
          { word: '30ぷん / はん', romanization: 'sanjuppun / han', translationKey: `${P}.c.vtHalf` },
          { word: 'ごぜん / ごご', romanization: 'gozen / gogo', translationKey: `${P}.c.vtAmPm` },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipReadings` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: 'いま、何時ですか。', romanization: 'ima, nanji desu ka.', translationKey: `${P}.c.exWhatTime` },
        { sentence: '9時半です。', romanization: 'ku-ji han desu.', translationKey: `${P}.c.exHalf` },
        { sentence: 'ごご 3時です。', romanization: 'gogo san-ji desu.', translationKey: `${P}.c.exPm3` },
      ],
    },

    // Part 2: ます-form verbs + に (time particle)
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shVerbEyebrow`, titleKey: `${P}.c.shVerbTitle`, highlightKey: `${P}.c.shVerbHl`, variant: 'split' } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardVerbTitle`,
        structures: [
          { parts: [
            { text: '[time]', color: '#3b82f6', labelKey: `${P}.c.lblTime` },
            { text: 'に', color: '#ef4444', labelKey: `${P}.c.lblNi` },
            { text: '[verb]ます', color: '#22c55e', labelKey: `${P}.c.lblMasu` },
          ] },
          { parts: [{ text: '[verb]ません', color: '#f59e0b', labelKey: `${P}.c.lblMasen` }] },
          { parts: [{ text: '[verb]ました', color: '#8b5cf6', labelKey: `${P}.c.lblMashita` }] },
          { parts: [{ text: '[verb]ませんでした', color: '#ec4899', labelKey: `${P}.c.lblMasenDeshita` }] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.verbExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipNi` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: '毎朝 6時に おきます。', romanization: 'maiasa roku-ji ni okimasu.', translationKey: `${P}.c.exMorning` },
        { sentence: '9時から 5時まで はたらきます。', romanization: 'ku-ji kara go-ji made hatarakimasu.', translationKey: `${P}.c.exWork` },
        { sentence: 'きのう べんきょうしませんでした。', romanization: 'kinō benkyō shimasen deshita.', translationKey: `${P}.c.exPastNeg` },
      ],
    },
    {
      type: LESSON_CONTENT_TYPE.PRACTICE_INLINE,
      practiceInline: {
        instructionKey: `${P}.c.prVerbInstr`,
        items: [
          { mode: PRACTICE_MODE.WRITE, promptKey: `${P}.c.prVerbQ1`, answerKey: `${P}.c.prVerbA1`, acceptedAnswers: ['に'] },
          { mode: PRACTICE_MODE.SELECT, promptKey: `${P}.c.prVerbQ2`, answerKey: `${P}.c.prVerbA2`, options: [
            { labelKey: `${P}.c.prVerbA2` }, { labelKey: `${P}.c.prVerbOpt2` }, { labelKey: `${P}.c.prVerbOpt3` }, { labelKey: `${P}.c.prVerbOpt4` },
          ] },
        ],
      },
    },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaMidEyebrow`, titleKey: `${P}.c.ctaMidTitle`, subtitleKey: `${P}.c.ctaMidSub`, ctaLabelKey: `${P}.c.ctaMidLabel`, ctaHref: '/japanese/level-1/lessons/4/exercises?difficulty=easy' } },

    // Part 3: days of the week / typical schedule dialogue
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shDayEyebrow`, titleKey: `${P}.c.shDayTitle`, highlightKey: `${P}.c.shDayHl` } },
    {
      type: LESSON_CONTENT_TYPE.VOCABULARY_TABLE,
      vocabTable: {
        titleKey: `${P}.c.daysTitle`,
        items: [
          { word: 'げつようび', romanization: 'getsuyōbi', translationKey: `${P}.c.vtMon` },
          { word: 'かようび', romanization: 'kayōbi', translationKey: `${P}.c.vtTue` },
          { word: 'すいようび', romanization: 'suiyōbi', translationKey: `${P}.c.vtWed` },
          { word: 'もくようび', romanization: 'mokuyōbi', translationKey: `${P}.c.vtThu` },
          { word: 'きんようび', romanization: 'kinyōbi', translationKey: `${P}.c.vtFri` },
          { word: 'どようび', romanization: 'doyōbi', translationKey: `${P}.c.vtSat` },
          { word: 'にちようび', romanization: 'nichiyōbi', translationKey: `${P}.c.vtSun` },
        ],
      },
    },
    {
      type: LESSON_CONTENT_TYPE.DIALOGUE,
      dialogue: [
        { speaker: '田中', sentence: 'ミラーさん、毎日 何時から 何時まで はたらきますか。', romanization: 'mirā-san, mainichi nanji kara nanji made hatarakimasu ka.', translationKey: `${P}.c.dlg1` },
        { speaker: 'ミラー', sentence: '9時から 6時までです。', romanization: 'ku-ji kara roku-ji made desu.', translationKey: `${P}.c.dlg2` },
        { speaker: '田中', sentence: '土曜日と 日曜日は 休みですか。', romanization: 'doyōbi to nichiyōbi wa yasumi desu ka.', translationKey: `${P}.c.dlg3` },
        { speaker: 'ミラー', sentence: 'はい、そうです。', romanization: 'hai, sō desu.', translationKey: `${P}.c.dlg4` },
      ],
    },
    { type: LESSON_CONTENT_TYPE.CULTURAL_NOTE, culturalTitleKey: `${P}.c.cultureTitle`, textKey: `${P}.c.cultureText` },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaFinalEyebrow`, titleKey: `${P}.c.ctaFinalTitle`, subtitleKey: `${P}.c.ctaFinalSub`, ctaLabelKey: `${P}.c.ctaFinalLabel`, ctaHref: '/japanese/level-1/lessons/4/exercises?difficulty=medium' } },
  ],

  exercises: [
    { id: 'e1', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e1q`, options: [ { labelKey: `${P}.ex.e1a`, correct: true }, { labelKey: `${P}.ex.e1b`, correct: false }, { labelKey: `${P}.ex.e1c`, correct: false }, { labelKey: `${P}.ex.e1d`, correct: false } ] },
    { id: 'e2', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e2q`, options: [ { labelKey: `${P}.ex.e2a`, correct: false }, { labelKey: `${P}.ex.e2b`, correct: true }, { labelKey: `${P}.ex.e2c`, correct: false }, { labelKey: `${P}.ex.e2d`, correct: false } ] },
    { id: 'e3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '6時___ おきます。', answer: 'に' },
    { id: 'e4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: 'きょうは やすみ___。', answer: 'です' },
    { id: 'e5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e5q`, options: [ { labelKey: `${P}.ex.e5a`, correct: false }, { labelKey: `${P}.ex.e5b`, correct: false }, { labelKey: `${P}.ex.e5c`, correct: true }, { labelKey: `${P}.ex.e5d`, correct: false } ] },
    { id: 'e6', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '9時___ 5時___ はたらきます。', answer: 'から／まで' },

    { id: 'm1', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['毎朝', '6時', 'に', 'おきます'] },
    { id: 'm2', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'medium', sourceKey: `${P}.ex.m2src`, targetAnswer: 'いま 何時ですか', acceptedAnswers: ['いま何時ですか', 'いま なんじですか', 'いま 何時ですか。'] },
    { id: 'm3', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m3q`, options: [ { labelKey: `${P}.ex.m3a`, correct: false }, { labelKey: `${P}.ex.m3b`, correct: true }, { labelKey: `${P}.ex.m3c`, correct: false }, { labelKey: `${P}.ex.m3d`, correct: false } ] },
    { id: 'm4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'medium', sentenceTemplate: 'きのう べんきょう___。', answer: 'しました' },
    { id: 'm5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m5q`, options: [ { labelKey: `${P}.ex.m5a`, correct: true }, { labelKey: `${P}.ex.m5b`, correct: false }, { labelKey: `${P}.ex.m5c`, correct: false }, { labelKey: `${P}.ex.m5d`, correct: false } ] },
    { id: 'm6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['どようび', 'は', 'やすみ', 'です'] },

    { id: 'h1', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h1src`, targetAnswer: 'きのう 10時に ねました', acceptedAnswers: ['きのう10時にねました', 'きのう 10時に ねました。'] },
    { id: 'h2', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['9時', 'から', '5時', 'まで', 'はたらきます'] },
    { id: 'h3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'hard', sentenceTemplate: 'にちようび___ はたらき___。', answer: 'は／ません' },
    { id: 'h4', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h4src`, targetAnswer: 'ひるやすみは 12時から 1時までです', acceptedAnswers: ['ひるやすみは12時から1時までです'] },
    { id: 'h5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'hard', questionKey: `${P}.ex.h5q`, options: [ { labelKey: `${P}.ex.h5a`, correct: false }, { labelKey: `${P}.ex.h5b`, correct: true }, { labelKey: `${P}.ex.h5c`, correct: false }, { labelKey: `${P}.ex.h5d`, correct: false } ] },
    { id: 'h6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['きょう', 'は', 'おわり', 'ました'] },
  ],
}
