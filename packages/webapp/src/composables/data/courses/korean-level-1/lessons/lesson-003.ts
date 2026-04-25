import type { ILesson } from '../../lesson-types'
import { LESSON_CONTENT_TYPE, LESSON_EXERCISE_TYPE, PRACTICE_MODE } from '../../lesson-types'

const P = 'courses.korean.level1.l3'

export const LESSON_003: ILesson = {
  id: 3,
  level: 1,
  themeKey: 'places',

  words: [
    { id: 'gyosil', word: '교실', romanization: 'gyosil', translation: 'classroom', translationFr: 'salle de classe', image: '/vocab/kr-l3/kyoshitsu.png' },
    { id: 'sikdang', word: '식당', romanization: 'sikdang', translation: 'canteen', translationFr: 'cantine', image: '/vocab/kr-l3/shokudo.png' },
    { id: 'samuso', word: '사무소', romanization: 'samuso', translation: 'office', translationFr: 'bureau', image: '/vocab/kr-l3/jimusho.png' },
    { id: 'hoeisil', word: '회의실', romanization: 'hoeisil', translation: 'meeting room', translationFr: 'salle de r\u00e9union', image: '/vocab/kr-l3/kaigishitsu.png' },
    { id: 'annaedesk', word: '안내 데스크', romanization: 'annae desekeu', translation: 'reception', translationFr: 'accueil', image: '/vocab/kr-l3/uketsuke.png' },
    { id: 'robi', word: '로비', romanization: 'robi', translation: 'lobby', translationFr: 'hall', image: '/vocab/kr-l3/robi.png' },
    { id: 'bang', word: '방', romanization: 'bang', translation: 'room', translationFr: 'pi\u00e8ce', image: '/vocab/kr-l3/heya.png' },
    { id: 'hwajangshil', word: '화장실', romanization: 'hwajangshil', translation: 'toilet', translationFr: 'toilettes', image: '/vocab/kr-l3/toire.png' },
    { id: 'gyedan', word: '계단', romanization: 'gyedan', translation: 'staircase', translationFr: 'escalier', image: '/vocab/kr-l3/kaidan.png' },
    { id: 'elribeite', word: '엘리베이터', romanization: 'ellibeiteo', translation: 'elevator', translationFr: 'ascenseur', image: '/vocab/kr-l3/erebeta.png' },
    { id: 'eseukelleiteo', word: '에스컬레이터', romanization: 'eseukeoллeiteo', translation: 'escalator', translationFr: 'escalator', image: '/vocab/kr-l3/esukareta.png' },
    { id: 'nara', word: '나라', romanization: 'nara', translation: 'country', translationFr: 'pays', image: '/vocab/kr-l3/kuni.png' },
    { id: 'hoesa', word: '회사', romanization: 'hoesa', translation: 'company', translationFr: 'entreprise', image: '/vocab/kr-l3/kaisha.png' },
    { id: 'jip', word: '집', romanization: 'jip', translation: 'house, home', translationFr: 'maison', image: '/vocab/kr-l3/uchi.png' },
    { id: 'jeonhwa', word: '전화', romanization: 'jeonhwa', translation: 'telephone', translationFr: 't\u00e9l\u00e9phone', image: '/vocab/kr-l3/denwa.png' },
    { id: 'sinbal', word: '신발', romanization: 'sinbal', translation: 'shoes', translationFr: 'chaussures', image: '/vocab/kr-l3/kutsu.png' },
    { id: 'nektai', word: '넥타이', romanization: 'nektai', translation: 'necktie', translationFr: 'cravate', image: '/vocab/kr-l3/nekutai.png' },
    { id: 'wain', word: '와인', romanization: 'wain', translation: 'wine', translationFr: 'vin', image: '/vocab/kr-l3/wain.png' },
    { id: 'dambae', word: '담배', romanization: 'dambae', translation: 'tobacco', translationFr: 'tabac', image: '/vocab/kr-l3/tabako.png' },
  ],

  content: [
    {
      type: LESSON_CONTENT_TYPE.SECTION_HEADER,
      sectionHeader: { eyebrowKey: `${P}.c.shIntroEyebrow`, titleKey: `${P}.c.shIntroTitle`, subtitleKey: `${P}.c.intro`, highlightKey: `${P}.c.shIntroHl`, variant: 'split' },
    },

    // Part 1: 여기 / 거기 / 저기
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shPlaceEyebrow`, titleKey: `${P}.c.shPlaceTitle`, highlightKey: `${P}.c.shPlaceHl` } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardPlaceTitle`,
        structures: [
          { parts: [{ text: '여기', color: '#3b82f6', labelKey: `${P}.c.lblYeogi` }] },
          { parts: [{ text: '거기', color: '#22c55e', labelKey: `${P}.c.lblGeogi` }] },
          { parts: [{ text: '저기', color: '#f59e0b', labelKey: `${P}.c.lblJeogi` }] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.placeExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipEodi` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: '여기는 사무소입니다.', romanization: 'yeogineun samusoimnida.', translationKey: `${P}.c.exHereOffice` },
        { sentence: '화장실은 어디입니까?', romanization: 'hwajangshireun eodiimnikka?', translationKey: `${P}.c.exWhereToilet` },
        { sentence: '엘리베이터는 저기입니다.', romanization: 'ellibeitеoneun jeogimnida.', translationKey: `${P}.c.exLiftOver` },
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
          { mode: PRACTICE_MODE.WRITE, promptKey: `${P}.c.prPlaceQ2`, answerKey: `${P}.c.prPlaceA2`, acceptedAnswers: ['어디'] },
        ],
      },
    },

    // Part 2: prices (얼마입니까?)
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shPriceEyebrow`, titleKey: `${P}.c.shPriceTitle`, highlightKey: `${P}.c.shPriceHl`, variant: 'split' } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardPriceTitle`,
        structures: [
          { parts: [
            { text: '이것', color: '#3b82f6', labelKey: `${P}.c.lblItem` },
            { text: '은/는', color: '#ef4444', labelKey: `${P}.c.lblParticle` },
            { text: '얼마', color: '#f59e0b', labelKey: `${P}.c.lblHowMuch` },
            { text: '입니다', color: '#8b5cf6', labelKey: `${P}.c.lblCopula` },
            { text: '까', color: '#ec4899', labelKey: `${P}.c.lblQ` },
          ] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.priceExplain` },
    {
      type: LESSON_CONTENT_TYPE.DIALOGUE,
      dialogue: [
        { speaker: '엠마', sentence: '실례합니다. 이것은 얼마입니까?', romanization: 'sillyehamnida. igeoseun eolmaimnikka?', translationKey: `${P}.c.dlg1` },
        { speaker: '점원', sentence: '그것은 삼천 원입니다.', romanization: 'geugeoseun samcheon wonimnida.', translationKey: `${P}.c.dlg2` },
        { speaker: '엠마', sentence: '그러면, 이것 주세요.', romanization: 'geureomyeon, igeot juseyo.', translationKey: `${P}.c.dlg3` },
      ],
    },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipJuseyo` },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaMidEyebrow`, titleKey: `${P}.c.ctaMidTitle`, subtitleKey: `${P}.c.ctaMidSub`, ctaLabelKey: `${P}.c.ctaMidLabel`, ctaHref: '/korean/level-1/lessons/3/exercises?difficulty=easy' } },

    // Part 3: country / home 의 + places vocab
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shCountryEyebrow`, titleKey: `${P}.c.shCountryTitle`, highlightKey: `${P}.c.shCountryHl` } },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.countryExplain` },
    {
      type: LESSON_CONTENT_TYPE.VOCABULARY_TABLE,
      vocabTable: {
        titleKey: `${P}.c.placesTitle`,
        items: [
          { word: '사무소', romanization: 'samuso', translationKey: `${P}.c.vtOffice` },
          { word: '안내 데스크', romanization: 'annae desekeu', translationKey: `${P}.c.vtReception` },
          { word: '식당', romanization: 'sikdang', translationKey: `${P}.c.vtCanteen` },
          { word: '회의실', romanization: 'hoeisil', translationKey: `${P}.c.vtMeeting` },
          { word: '엘리베이터', romanization: 'ellibeiteo', translationKey: `${P}.c.vtLift` },
          { word: '화장실', romanization: 'hwajangshil', translationKey: `${P}.c.vtToilet` },
        ],
      },
    },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: '이것은 한국의 차입니다.', romanization: 'igeoseun hangugui chaimnida.', translationKey: `${P}.c.exKrCar` },
        { sentence: '이 와인은 프랑스의 것입니다.', romanization: 'i waineun peurangseue geosimnida.', translationKey: `${P}.c.exFrWine` },
      ],
    },
    { type: LESSON_CONTENT_TYPE.CULTURAL_NOTE, culturalTitleKey: `${P}.c.cultureTitle`, textKey: `${P}.c.cultureText` },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaFinalEyebrow`, titleKey: `${P}.c.ctaFinalTitle`, subtitleKey: `${P}.c.ctaFinalSub`, ctaLabelKey: `${P}.c.ctaFinalLabel`, ctaHref: '/korean/level-1/lessons/3/exercises?difficulty=medium' } },
  ],

  exercises: [
    { id: 'e1', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e1q`, options: [ { labelKey: `${P}.ex.e1a`, correct: true }, { labelKey: `${P}.ex.e1b`, correct: false }, { labelKey: `${P}.ex.e1c`, correct: false }, { labelKey: `${P}.ex.e1d`, correct: false } ] },
    { id: 'e2', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e2q`, options: [ { labelKey: `${P}.ex.e2a`, correct: false }, { labelKey: `${P}.ex.e2b`, correct: true }, { labelKey: `${P}.ex.e2c`, correct: false }, { labelKey: `${P}.ex.e2d`, correct: false } ] },
    { id: 'e3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '화장실은 ___ 입니까?', answer: '어디' },
    { id: 'e4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '이것은 ___입니까?', answer: '얼마' },
    { id: 'e5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e5q`, options: [ { labelKey: `${P}.ex.e5a`, correct: false }, { labelKey: `${P}.ex.e5b`, correct: false }, { labelKey: `${P}.ex.e5c`, correct: true }, { labelKey: `${P}.ex.e5d`, correct: false } ] },
    { id: 'e6', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '이것 ___.', answer: '주세요' },

    { id: 'm1', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['여기는', '사무소', '입니다'] },
    { id: 'm2', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'medium', sourceKey: `${P}.ex.m2src`, targetAnswer: '화장실은 어디입니까', acceptedAnswers: ['화장실은 어디입니까', '화장실은 어디입니까?', '화장실은 어디예요?'] },
    { id: 'm3', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m3q`, options: [ { labelKey: `${P}.ex.m3a`, correct: false }, { labelKey: `${P}.ex.m3b`, correct: true }, { labelKey: `${P}.ex.m3c`, correct: false }, { labelKey: `${P}.ex.m3d`, correct: false } ] },
    { id: 'm4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'medium', sentenceTemplate: '이것은 한국___ 차입니다.', answer: '의' },
    { id: 'm5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m5q`, options: [ { labelKey: `${P}.ex.m5a`, correct: true }, { labelKey: `${P}.ex.m5b`, correct: false }, { labelKey: `${P}.ex.m5c`, correct: false }, { labelKey: `${P}.ex.m5d`, correct: false } ] },
    { id: 'm6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['엘리베이터는', '저기', '입니다'] },

    { id: 'h1', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h1src`, targetAnswer: '이것은 얼마입니까', acceptedAnswers: ['이것은 얼마입니까', '이것은 얼마입니까?', '이거 얼마예요?'] },
    { id: 'h2', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['실례합니다', '이것', '주세요'] },
    { id: 'h3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'hard', sentenceTemplate: '이 와인___ 프랑스___ 것입니다.', answer: '은/의' },
    { id: 'h4', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h4src`, targetAnswer: '회의실은 2층입니다', acceptedAnswers: ['회의실은 2층입니다', '회의실은 이층입니다'] },
    { id: 'h5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'hard', questionKey: `${P}.ex.h5q`, options: [ { labelKey: `${P}.ex.h5a`, correct: false }, { labelKey: `${P}.ex.h5b`, correct: true }, { labelKey: `${P}.ex.h5c`, correct: false }, { labelKey: `${P}.ex.h5d`, correct: false } ] },
    { id: 'h6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['안내', '데스크는', '1층', '입니다'] },
  ],
}
