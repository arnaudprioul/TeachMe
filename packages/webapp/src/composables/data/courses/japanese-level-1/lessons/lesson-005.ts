import type { ILesson } from '../../lesson-types'
import { LESSON_CONTENT_TYPE, LESSON_EXERCISE_TYPE, PRACTICE_MODE } from '../../lesson-types'

const P = 'courses.japanese.level1.l5'

export const LESSON_005: ILesson = {
  id: 5,
  level: 1,
  themeKey: 'transport',

  words: [
    { id: 'ikimasu', word: 'いきます', romanization: 'ikimasu', translation: 'go', translationFr: 'aller', image: '/vocab/jp-l5/ikimasu.png' },
    { id: 'kimasu', word: 'きます', romanization: 'kimasu', translation: 'come', translationFr: 'venir', image: '/vocab/jp-l5/kimasu.png' },
    { id: 'kaerimasu', word: 'かえります', romanization: 'kaerimasu', translation: 'go home', translationFr: 'rentrer', image: '/vocab/jp-l5/kaerimasu.png' },
    { id: 'gakko', word: 'がっこう', romanization: 'gakkō', translation: 'school', translationFr: 'école', image: '/vocab/jp-l5/gakko.png' },
    { id: 'supa', word: 'スーパー', romanization: 'sūpā', translation: 'supermarket', translationFr: 'supermarché', image: '/vocab/jp-l5/supa.png' },
    { id: 'eki', word: 'えき', romanization: 'eki', translation: 'station', translationFr: 'gare', image: '/vocab/jp-l5/eki.png' },
    { id: 'hikoki', word: 'ひこうき', romanization: 'hikōki', translation: 'airplane', translationFr: 'avion', image: '/vocab/jp-l5/hikoki.png' },
    { id: 'fune', word: 'ふね', romanization: 'fune', translation: 'ship', translationFr: 'bateau', image: '/vocab/jp-l5/fune.png' },
    { id: 'densha', word: 'でんしゃ', romanization: 'densha', translation: 'train', translationFr: 'train', image: '/vocab/jp-l5/densha.png' },
    { id: 'chikatetsu', word: 'ちかてつ', romanization: 'chikatetsu', translation: 'subway', translationFr: 'métro', image: '/vocab/jp-l5/chikatetsu.png' },
    { id: 'shinkansen', word: 'しんかんせん', romanization: 'shinkansen', translation: 'bullet train', translationFr: 'shinkansen', image: '/vocab/jp-l5/shinkansen.png' },
    { id: 'basu', word: 'バス', romanization: 'basu', translation: 'bus', translationFr: 'bus', image: '/vocab/jp-l5/basu.png' },
    { id: 'takushi', word: 'タクシー', romanization: 'takushī', translation: 'taxi', translationFr: 'taxi', image: '/vocab/jp-l5/takushi.png' },
    { id: 'jitensha', word: 'じてんしゃ', romanization: 'jitensha', translation: 'bicycle', translationFr: 'vélo', image: '/vocab/jp-l5/jitensha.png' },
    { id: 'tomodachi', word: 'ともだち', romanization: 'tomodachi', translation: 'friend', translationFr: 'ami(e)', image: '/vocab/jp-l5/tomodachi.png' },
    { id: 'kare', word: 'かれ', romanization: 'kare', translation: 'he, boyfriend', translationFr: 'lui, copain', image: '/vocab/jp-l5/kare.png' },
    { id: 'kanojo', word: 'かのじょ', romanization: 'kanojo', translation: 'she, girlfriend', translationFr: 'elle, copine', image: '/vocab/jp-l5/kanojo.png' },
    { id: 'kazoku', word: 'かぞく', romanization: 'kazoku', translation: 'family', translationFr: 'famille', image: '/vocab/jp-l5/kazoku.png' },
    { id: 'hitoride', word: 'ひとりで', romanization: 'hitoride', translation: 'alone', translationFr: 'seul(e)', image: '/vocab/jp-l5/hitoride.png' },
    { id: 'tanjobi', word: 'たんじょうび', romanization: 'tanjōbi', translation: 'birthday', translationFr: 'anniversaire', image: '/vocab/jp-l5/tanjobi.png' },
    { id: 'futsu', word: 'ふつう', romanization: 'futsū', translation: 'local (train)', translationFr: 'train local', image: '/vocab/jp-l5/futsu.png' },
    { id: 'kyuko', word: 'きゅうこう', romanization: 'kyūkō', translation: 'rapid', translationFr: 'rapide', image: '/vocab/jp-l5/kyuko.png' },
    { id: 'tokkyu', word: 'とっきゅう', romanization: 'tokkyū', translation: 'express', translationFr: 'express', image: '/vocab/jp-l5/tokkyu.png' },
  ],

  content: [
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shIntroEyebrow`, titleKey: `${P}.c.shIntroTitle`, subtitleKey: `${P}.c.intro`, highlightKey: `${P}.c.shIntroHl`, variant: 'split' } },

    // Part 1: へ-particle (direction)
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shGoEyebrow`, titleKey: `${P}.c.shGoTitle`, highlightKey: `${P}.c.shGoHl` } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardGoTitle`,
        structures: [
          { parts: [
            { text: '[place]', color: '#3b82f6', labelKey: `${P}.c.lblPlace` },
            { text: 'へ', color: '#ef4444', labelKey: `${P}.c.lblHe` },
            { text: 'いきます', color: '#22c55e', labelKey: `${P}.c.lblGo` },
          ] },
          { parts: [{ text: 'きます', color: '#f59e0b', labelKey: `${P}.c.lblCome` }] },
          { parts: [{ text: 'かえります', color: '#8b5cf6', labelKey: `${P}.c.lblReturn` }] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.goExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipHe` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: 'きょう デパートへ いきます。', romanization: 'kyō depāto e ikimasu.', translationKey: `${P}.c.exGoDept` },
        { sentence: 'ミラーさんは 日本へ きました。', romanization: 'mirā-san wa nihon e kimashita.', translationKey: `${P}.c.exCameJp` },
        { sentence: 'うちへ かえります。', romanization: 'uchi e kaerimasu.', translationKey: `${P}.c.exGoHome` },
      ],
    },

    // Part 2: で-particle (means of transport)
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shMeansEyebrow`, titleKey: `${P}.c.shMeansTitle`, highlightKey: `${P}.c.shMeansHl`, variant: 'split' } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardMeansTitle`,
        structures: [
          { parts: [
            { text: '[transport]', color: '#3b82f6', labelKey: `${P}.c.lblTransport` },
            { text: 'で', color: '#ef4444', labelKey: `${P}.c.lblDe` },
            { text: '[place]', color: '#22c55e', labelKey: `${P}.c.lblPlace2` },
            { text: 'へ', color: '#f59e0b', labelKey: `${P}.c.lblHe2` },
            { text: 'いきます', color: '#8b5cf6', labelKey: `${P}.c.lblGo2` },
          ] },
          { parts: [
            { text: 'あるいて', color: '#ec4899', labelKey: `${P}.c.lblWalk` },
          ] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.meansExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipAruite` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: 'でんしゃで かいしゃへ いきます。', romanization: 'densha de kaisha e ikimasu.', translationKey: `${P}.c.exByTrain` },
        { sentence: 'タクシーで ホテルへ いきました。', romanization: 'takushī de hoteru e ikimashita.', translationKey: `${P}.c.exByTaxi` },
        { sentence: 'あるいて えきへ いきます。', romanization: 'aruite eki e ikimasu.', translationKey: `${P}.c.exOnFoot` },
      ],
    },
    {
      type: LESSON_CONTENT_TYPE.PRACTICE_INLINE,
      practiceInline: {
        instructionKey: `${P}.c.prInstr`,
        items: [
          { mode: PRACTICE_MODE.WRITE, promptKey: `${P}.c.prQ1`, answerKey: `${P}.c.prA1`, acceptedAnswers: ['へ'] },
          { mode: PRACTICE_MODE.WRITE, promptKey: `${P}.c.prQ2`, answerKey: `${P}.c.prA2`, acceptedAnswers: ['で'] },
          { mode: PRACTICE_MODE.SELECT, promptKey: `${P}.c.prQ3`, answerKey: `${P}.c.prA3`, options: [
            { labelKey: `${P}.c.prA3` }, { labelKey: `${P}.c.prOpt2` }, { labelKey: `${P}.c.prOpt3` }, { labelKey: `${P}.c.prOpt4` },
          ] },
        ],
      },
    },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaMidEyebrow`, titleKey: `${P}.c.ctaMidTitle`, subtitleKey: `${P}.c.ctaMidSub`, ctaLabelKey: `${P}.c.ctaMidLabel`, ctaHref: '/japanese/level-1/lessons/5/exercises?difficulty=easy' } },

    // Part 3: と (with) + いつ (when)
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shWithEyebrow`, titleKey: `${P}.c.shWithTitle`, highlightKey: `${P}.c.shWithHl` } },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.withExplain` },
    {
      type: LESSON_CONTENT_TYPE.DIALOGUE,
      dialogue: [
        { speaker: '田中', sentence: 'ミラーさん、あした どこへ 行きますか。', romanization: 'mirā-san, ashita doko e ikimasu ka.', translationKey: `${P}.c.dlg1` },
        { speaker: 'ミラー', sentence: '京都へ 行きます。', romanization: 'kyōto e ikimasu.', translationKey: `${P}.c.dlg2` },
        { speaker: '田中', sentence: 'だれと 行きますか。', romanization: 'dare to ikimasu ka.', translationKey: `${P}.c.dlg3` },
        { speaker: 'ミラー', sentence: 'ともだちと いっしょに 行きます。', romanization: 'tomodachi to issho ni ikimasu.', translationKey: `${P}.c.dlg4` },
        { speaker: '田中', sentence: 'なんで 行きますか。', romanization: 'nan de ikimasu ka.', translationKey: `${P}.c.dlg5` },
        { speaker: 'ミラー', sentence: 'しんかんせんで 行きます。', romanization: 'shinkansen de ikimasu.', translationKey: `${P}.c.dlg6` },
      ],
    },
    { type: LESSON_CONTENT_TYPE.CULTURAL_NOTE, culturalTitleKey: `${P}.c.cultureTitle`, textKey: `${P}.c.cultureText` },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaFinalEyebrow`, titleKey: `${P}.c.ctaFinalTitle`, subtitleKey: `${P}.c.ctaFinalSub`, ctaLabelKey: `${P}.c.ctaFinalLabel`, ctaHref: '/japanese/level-1/lessons/5/exercises?difficulty=medium' } },
  ],

  exercises: [
    { id: 'e1', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e1q`, options: [ { labelKey: `${P}.ex.e1a`, correct: true }, { labelKey: `${P}.ex.e1b`, correct: false }, { labelKey: `${P}.ex.e1c`, correct: false }, { labelKey: `${P}.ex.e1d`, correct: false } ] },
    { id: 'e2', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e2q`, options: [ { labelKey: `${P}.ex.e2a`, correct: false }, { labelKey: `${P}.ex.e2b`, correct: true }, { labelKey: `${P}.ex.e2c`, correct: false }, { labelKey: `${P}.ex.e2d`, correct: false } ] },
    { id: 'e3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: 'デパート___ 行きます。', answer: 'へ' },
    { id: 'e4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: 'でんしゃ___ 行きます。', answer: 'で' },
    { id: 'e5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e5q`, options: [ { labelKey: `${P}.ex.e5a`, correct: false }, { labelKey: `${P}.ex.e5b`, correct: true }, { labelKey: `${P}.ex.e5c`, correct: false }, { labelKey: `${P}.ex.e5d`, correct: false } ] },
    { id: 'e6', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: 'うち___ かえります。', answer: 'へ' },

    { id: 'm1', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['でんしゃ', 'で', 'かいしゃ', 'へ', 'いきます'] },
    { id: 'm2', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'medium', sourceKey: `${P}.ex.m2src`, targetAnswer: 'ともだちと 京都へ 行きます', acceptedAnswers: ['ともだちと京都へ行きます', 'ともだちと きょうとへ いきます'] },
    { id: 'm3', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m3q`, options: [ { labelKey: `${P}.ex.m3a`, correct: false }, { labelKey: `${P}.ex.m3b`, correct: true }, { labelKey: `${P}.ex.m3c`, correct: false }, { labelKey: `${P}.ex.m3d`, correct: false } ] },
    { id: 'm4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'medium', sentenceTemplate: 'あるい___ えきへ 行きます。', answer: 'て' },
    { id: 'm5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m5q`, options: [ { labelKey: `${P}.ex.m5a`, correct: true }, { labelKey: `${P}.ex.m5b`, correct: false }, { labelKey: `${P}.ex.m5c`, correct: false }, { labelKey: `${P}.ex.m5d`, correct: false } ] },
    { id: 'm6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['ひとりで', 'うち', 'へ', 'かえります'] },

    { id: 'h1', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h1src`, targetAnswer: 'かぞくと しんかんせんで 行きました', acceptedAnswers: ['かぞくとしんかんせんで行きました'] },
    { id: 'h2', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['いつ', '日本', 'へ', 'きました', 'か'] },
    { id: 'h3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'hard', sentenceTemplate: 'だれ___ 行きますか。', answer: 'と' },
    { id: 'h4', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h4src`, targetAnswer: 'タクシーで ホテルへ 行きました', acceptedAnswers: ['タクシーでホテルへ行きました'] },
    { id: 'h5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'hard', questionKey: `${P}.ex.h5q`, options: [ { labelKey: `${P}.ex.h5a`, correct: false }, { labelKey: `${P}.ex.h5b`, correct: true }, { labelKey: `${P}.ex.h5c`, correct: false }, { labelKey: `${P}.ex.h5d`, correct: false } ] },
    { id: 'h6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['きのう', 'ひとりで', 'びじゅつかん', 'へ', '行きました'] },
  ],
}
