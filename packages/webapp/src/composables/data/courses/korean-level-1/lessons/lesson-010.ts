import type { ILesson } from '../../lesson-types'
import { LESSON_CONTENT_TYPE, LESSON_EXERCISE_TYPE, PRACTICE_MODE } from '../../lesson-types'

const P = 'courses.korean.level1.l10'

export const LESSON_010: ILesson = {
  id: 10,
  level: 1,
  themeKey: 'location',

  words: [
    { id: 'itda10', word: '있다', romanization: 'itda', translation: 'be, exist (animate/inanimate)', translationFr: 'être, exister', image: '/vocab/kr-l10/itda10.png' },
    { id: 'eopda', word: '없다', romanization: 'eopda', translation: 'not exist, not have', translationFr: 'ne pas exister', image: '/vocab/kr-l10/eopda.png' },
    { id: 'yeoreo', word: '여러', romanization: 'yeoreo', translation: 'various, several', translationFr: 'divers, plusieurs', image: '/vocab/kr-l10/yeoreo.png' },
    { id: 'namja', word: '남자', romanization: 'namja', translation: 'man', translationFr: 'homme', image: '/vocab/kr-l10/namja.png' },
    { id: 'yeoja', word: '여자', romanization: 'yeoja', translation: 'woman', translationFr: 'femme', image: '/vocab/kr-l10/yeoja.png' },
    { id: 'namjaaI', word: '남자아이', romanization: 'namjaai', translation: 'boy', translationFr: 'garçon', image: '/vocab/kr-l10/namjaai.png' },
    { id: 'yeojaaI', word: '여자아이', romanization: 'yeojaai', translation: 'girl', translationFr: 'fille', image: '/vocab/kr-l10/yeojaai.png' },
    { id: 'gae', word: '개', romanization: 'gae', translation: 'dog', translationFr: 'chien', image: '/vocab/kr-l10/gae.png' },
    { id: 'goyangi', word: '고양이', romanization: 'goyangi', translation: 'cat', translationFr: 'chat', image: '/vocab/kr-l10/goyangi.png' },
    { id: 'namu', word: '나무', romanization: 'namu', translation: 'tree', translationFr: 'arbre', image: '/vocab/kr-l10/namu.png' },
    { id: 'beteori', word: '배터리', romanization: 'beteori', translation: 'battery', translationFr: 'pile', image: '/vocab/kr-l10/beteori.png' },
    { id: 'sangja', word: '상자', romanization: 'sangja', translation: 'box', translationFr: 'boîte', image: '/vocab/kr-l10/sangja.png' },
    { id: 'seuwitchi', word: '스위치', romanization: 'seuwichi', translation: 'switch', translationFr: 'interrupteur', image: '/vocab/kr-l10/seuwitchi.png' },
    { id: 'naengjanggo', word: '냉장고', romanization: 'naengjanggo', translation: 'refrigerator', translationFr: 'réfrigérateur', image: '/vocab/kr-l10/naengjanggo.png' },
    { id: 'teibeul', word: '테이블', romanization: 'teibeul', translation: 'table', translationFr: 'table', image: '/vocab/kr-l10/teibeul.png' },
    { id: 'chimdae', word: '침대', romanization: 'chimdae', translation: 'bed', translationFr: 'lit', image: '/vocab/kr-l10/chimdae.png' },
    { id: 'seonban', word: '선반', romanization: 'seonban', translation: 'shelf', translationFr: 'étagère', image: '/vocab/kr-l10/seonban.png' },
    { id: 'mun', word: '문', romanization: 'mun', translation: 'door', translationFr: 'porte', image: '/vocab/kr-l10/mun.png' },
    { id: 'changmun', word: '창문', romanization: 'changmun', translation: 'window', translationFr: 'fenêtre', image: '/vocab/kr-l10/changmun.png' },
    { id: 'upyeonham', word: '우편함', romanization: 'upyeonham', translation: 'mailbox', translationFr: 'boîte aux lettres', image: '/vocab/kr-l10/upyeonham.png' },
    { id: 'geonmul', word: '건물', romanization: 'geonmul', translation: 'building', translationFr: 'immeuble', image: '/vocab/kr-l10/geonmul.png' },
    { id: 'gongwon', word: '공원', romanization: 'gongwon', translation: 'park', translationFr: 'parc', image: '/vocab/kr-l10/gongwon.png' },
    { id: 'kape', word: '카페', romanization: 'kape', translation: 'cafe, coffee shop', translationFr: 'café', image: '/vocab/kr-l10/kape.png' },
    { id: 'seojom', word: '서점', romanization: 'seojom', translation: 'bookstore', translationFr: 'librairie', image: '/vocab/kr-l10/seojom.png' },
    { id: 'jeongnyujang', word: '정류장', romanization: 'jeongnyujang', translation: 'bus stop', translationFr: 'arrêt de bus', image: '/vocab/kr-l10/jeongnyujang.png' },
    { id: 'wi', word: '위', romanization: 'wi', translation: 'above', translationFr: 'au-dessus', image: '/vocab/kr-l10/wi.png' },
    { id: 'arae', word: '아래', romanization: 'arae', translation: 'below', translationFr: 'en-dessous', image: '/vocab/kr-l10/arae.png' },
    { id: 'ap', word: '앞', romanization: 'ap', translation: 'in front', translationFr: 'devant', image: '/vocab/kr-l10/ap.png' },
    { id: 'dwi', word: '뒤', romanization: 'dwi', translation: 'behind', translationFr: 'derrière', image: '/vocab/kr-l10/dwi.png' },
    { id: 'oreunjjok', word: '오른쪽', romanization: 'oreunjjok', translation: 'right', translationFr: 'droite', image: '/vocab/kr-l10/oreunjjok.png' },
    { id: 'oenjjok', word: '왼쪽', romanization: 'oenjjok', translation: 'left', translationFr: 'gauche', image: '/vocab/kr-l10/oenjjok.png' },
    { id: 'an', word: '안', romanization: 'an', translation: 'inside', translationFr: 'dedans', image: '/vocab/kr-l10/an.png' },
    { id: 'bak', word: '밖', romanization: 'bak', translation: 'outside', translationFr: 'dehors', image: '/vocab/kr-l10/bak.png' },
    { id: 'yeop', word: '옆', romanization: 'yeop', translation: 'next to', translationFr: 'à côté', image: '/vocab/kr-l10/yeop.png' },
    { id: 'gakkai', word: '가까이', romanization: 'gakkai', translation: 'near', translationFr: 'près', image: '/vocab/kr-l10/gakkai.png' },
    { id: 'sai', word: '사이', romanization: 'sai', translation: 'between', translationFr: 'entre', image: '/vocab/kr-l10/sai.png' },
  ],

  content: [
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shIntroEyebrow`, titleKey: `${P}.c.shIntroTitle`, subtitleKey: `${P}.c.intro`, highlightKey: `${P}.c.shIntroHl`, variant: 'split' } },

    // Part 1: 있다 vs 없다
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shExistsEyebrow`, titleKey: `${P}.c.shExistsTitle`, highlightKey: `${P}.c.shExistsHl` } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardExistsTitle`,
        structures: [
          { parts: [
            { text: '[place]', color: '#3b82f6', labelKey: `${P}.c.lblPlace` },
            { text: '에', color: '#ef4444', labelKey: `${P}.c.lblE` },
            { text: '[thing/person]', color: '#22c55e', labelKey: `${P}.c.lblSubject` },
            { text: '이/가', color: '#f59e0b', labelKey: `${P}.c.lblIGa` },
            { text: '있어요', color: '#8b5cf6', labelKey: `${P}.c.lblIsseoyo` },
          ] },
          { parts: [
            { text: '[place]', color: '#3b82f6', labelKey: `${P}.c.lblPlace2` },
            { text: '에', color: '#ef4444', labelKey: `${P}.c.lblE2` },
            { text: '[thing/person]', color: '#22c55e', labelKey: `${P}.c.lblSubject2` },
            { text: '이/가', color: '#f59e0b', labelKey: `${P}.c.lblIGa2` },
            { text: '없어요', color: '#8b5cf6', labelKey: `${P}.c.lblEopseoyo` },
          ] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.existsExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipOneVerb` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: '공원에 개가 있어요.', romanization: 'gongwone gaega isseoyo.', translationKey: `${P}.c.exDogPark` },
        { sentence: '냉장고에 달걀이 있어요.', romanization: 'naengjanggoe dalgvari isseoyo.', translationKey: `${P}.c.exEggFridge` },
        { sentence: '방에 민수 씨가 있어요.', romanization: 'bange minsu ssiga isseoyo.', translationKey: `${P}.c.exMinsuRoom` },
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
          { mode: PRACTICE_MODE.WRITE, promptKey: `${P}.c.prExistsQ2`, answerKey: `${P}.c.prExistsA2`, acceptedAnswers: ['있어요'] },
        ],
      },
    },

    // Part 2: position words (위/아래/앞/뒤/...)
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shWhereEyebrow`, titleKey: `${P}.c.shWhereTitle`, highlightKey: `${P}.c.shWhereHl`, variant: 'split' } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardWhereTitle`,
        structures: [
          { parts: [
            { text: '[thing]', color: '#3b82f6', labelKey: `${P}.c.lblThingA` },
            { text: '(의)', color: '#ef4444', labelKey: `${P}.c.lblUi` },
            { text: '[position]', color: '#22c55e', labelKey: `${P}.c.lblPosition` },
            { text: '에', color: '#f59e0b', labelKey: `${P}.c.lblE3` },
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
          { word: '위', romanization: 'wi', translationKey: `${P}.c.vtWi` },
          { word: '아래', romanization: 'arae', translationKey: `${P}.c.vtArae` },
          { word: '앞', romanization: 'ap', translationKey: `${P}.c.vtAp` },
          { word: '뒤', romanization: 'dwi', translationKey: `${P}.c.vtDwi` },
          { word: '오른쪽', romanization: 'oreunjjok', translationKey: `${P}.c.vtOreunjjok` },
          { word: '왼쪽', romanization: 'oenjjok', translationKey: `${P}.c.vtOenjjok` },
          { word: '안', romanization: 'an', translationKey: `${P}.c.vtAn` },
          { word: '밖', romanization: 'bak', translationKey: `${P}.c.vtBak` },
          { word: '옆', romanization: 'yeop', translationKey: `${P}.c.vtYeop` },
          { word: '사이', romanization: 'sai', translationKey: `${P}.c.vtSai` },
        ],
      },
    },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: '고양이는 테이블 아래에 있어요.', romanization: 'goyangineun teibeul araee isseoyo.', translationKey: `${P}.c.exCatTable` },
        { sentence: '우편함은 건물 앞에 있어요.', romanization: 'upyeonhameun geonmul ape isseoyo.', translationKey: `${P}.c.exMailbox` },
        { sentence: '카페는 서점과 건물 사이에 있어요.', romanization: 'kapeneun seojomgwa geonmul saie isseoyo.', translationKey: `${P}.c.exBetween` },
      ],
    },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaMidEyebrow`, titleKey: `${P}.c.ctaMidTitle`, subtitleKey: `${P}.c.ctaMidSub`, ctaLabelKey: `${P}.c.ctaMidLabel`, ctaHref: '/korean/level-1/lessons/10/exercises?difficulty=easy' } },

    // Part 3: asking where
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shAskEyebrow`, titleKey: `${P}.c.shAskTitle`, highlightKey: `${P}.c.shAskHl` } },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.askExplain` },
    {
      type: LESSON_CONTENT_TYPE.DIALOGUE,
      dialogue: [
        { speaker: '엠마', sentence: '저기요, 우체국이 어디에 있어요?', romanization: 'jeogiyo, uchegugi eodie isseoyo?', translationKey: `${P}.c.dlg1` },
        { speaker: '행인', sentence: '역 앞에 있어요.', romanization: 'yeok ape isseoyo.', translationKey: `${P}.c.dlg2` },
        { speaker: '엠마', sentence: '근처에 ATM이 있어요?', romanization: 'geuncheoe ATMi isseoyo?', translationKey: `${P}.c.dlg3` },
        { speaker: '행인', sentence: '네, 우체국 옆에 있어요.', romanization: 'ne, ucheguk yeope isseoyo.', translationKey: `${P}.c.dlg4` },
      ],
    },
    { type: LESSON_CONTENT_TYPE.CULTURAL_NOTE, culturalTitleKey: `${P}.c.cultureTitle`, textKey: `${P}.c.cultureText` },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaFinalEyebrow`, titleKey: `${P}.c.ctaFinalTitle`, subtitleKey: `${P}.c.ctaFinalSub`, ctaLabelKey: `${P}.c.ctaFinalLabel`, ctaHref: '/korean/level-1/lessons/10/exercises?difficulty=medium' } },
  ],

  exercises: [
    { id: 'e1', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e1q`, options: [ { labelKey: `${P}.ex.e1a`, correct: true }, { labelKey: `${P}.ex.e1b`, correct: false }, { labelKey: `${P}.ex.e1c`, correct: false }, { labelKey: `${P}.ex.e1d`, correct: false } ] },
    { id: 'e2', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e2q`, options: [ { labelKey: `${P}.ex.e2a`, correct: false }, { labelKey: `${P}.ex.e2b`, correct: true }, { labelKey: `${P}.ex.e2c`, correct: false }, { labelKey: `${P}.ex.e2d`, correct: false } ] },
    { id: 'e3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '공원에 개가 ___요.', answer: '있어' },
    { id: 'e4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '테이블 ___에 고양이가 있어요.', answer: '아래' },
    { id: 'e5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e5q`, options: [ { labelKey: `${P}.ex.e5a`, correct: false }, { labelKey: `${P}.ex.e5b`, correct: true }, { labelKey: `${P}.ex.e5c`, correct: false }, { labelKey: `${P}.ex.e5d`, correct: false } ] },
    { id: 'e6', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '상자 안___ 배터리가 있어요.', answer: '에' },

    { id: 'm1', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['공원에', '개가', '있어요'] },
    { id: 'm2', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'medium', sourceKey: `${P}.ex.m2src`, targetAnswer: '우편함은 건물 앞에 있어요', acceptedAnswers: ['우편함은 건물 앞에 있어요'] },
    { id: 'm3', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m3q`, options: [ { labelKey: `${P}.ex.m3a`, correct: false }, { labelKey: `${P}.ex.m3b`, correct: true }, { labelKey: `${P}.ex.m3c`, correct: false }, { labelKey: `${P}.ex.m3d`, correct: false } ] },
    { id: 'm4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'medium', sentenceTemplate: '우체국이 어디___ 있어요?', answer: '에' },
    { id: 'm5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m5q`, options: [ { labelKey: `${P}.ex.m5a`, correct: true }, { labelKey: `${P}.ex.m5b`, correct: false }, { labelKey: `${P}.ex.m5c`, correct: false }, { labelKey: `${P}.ex.m5d`, correct: false } ] },
    { id: 'm6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['고양이는', '테이블', '아래에', '있어요'] },

    { id: 'h1', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h1src`, targetAnswer: '카페는 서점과 건물 사이에 있어요', acceptedAnswers: ['카페는 서점과 건물 사이에 있어요'] },
    { id: 'h2', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['역', '근처에', 'ATM이', '있어요'] },
    { id: 'h3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'hard', sentenceTemplate: '개___ 고양이___ 있어요?', answer: '와／가' },
    { id: 'h4', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h4src`, targetAnswer: '방에 아무도 없어요', acceptedAnswers: ['방에 아무도 없어요'] },
    { id: 'h5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'hard', questionKey: `${P}.ex.h5q`, options: [ { labelKey: `${P}.ex.h5a`, correct: false }, { labelKey: `${P}.ex.h5b`, correct: true }, { labelKey: `${P}.ex.h5c`, correct: false }, { labelKey: `${P}.ex.h5d`, correct: false } ] },
    { id: 'h6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['서점은', '우체국', '옆에', '있어요'] },
  ],
}
