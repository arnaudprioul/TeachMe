import type { ILesson } from '../../lesson-types'
import { LESSON_CONTENT_TYPE, LESSON_EXERCISE_TYPE, PRACTICE_MODE } from '../../lesson-types'

const P = 'courses.korean.level1.l5'

export const LESSON_005: ILesson = {
  id: 5,
  level: 1,
  themeKey: 'transport',

  words: [
    { id: 'gada', word: '가다', romanization: 'gada', translation: 'go', translationFr: 'aller', image: '/vocab/kr-l5/ikimasu.png' },
    { id: 'oda', word: '오다', romanization: 'oda', translation: 'come', translationFr: 'venir', image: '/vocab/kr-l5/kimasu.png' },
    { id: 'doragada', word: '돌아가다', romanization: 'doragada', translation: 'go home', translationFr: 'rentrer', image: '/vocab/kr-l5/kaerimasu.png' },
    { id: 'hakgyo', word: '학교', romanization: 'hakgyo', translation: 'school', translationFr: '\u00e9cole', image: '/vocab/kr-l5/gakko.png' },
    { id: 'syupeo', word: '슈퍼', romanization: 'syupeo', translation: 'supermarket', translationFr: 'supermarch\u00e9', image: '/vocab/kr-l5/supa.png' },
    { id: 'yeok', word: '역', romanization: 'yeok', translation: 'station', translationFr: 'gare', image: '/vocab/kr-l5/eki.png' },
    { id: 'bihaenggi', word: '비행기', romanization: 'bihaenggi', translation: 'airplane', translationFr: 'avion', image: '/vocab/kr-l5/hikoki.png' },
    { id: 'bae', word: '배', romanization: 'bae', translation: 'ship', translationFr: 'bateau', image: '/vocab/kr-l5/fune.png' },
    { id: 'gicha', word: '기차', romanization: 'gicha', translation: 'train', translationFr: 'train', image: '/vocab/kr-l5/densha.png' },
    { id: 'jihacheol', word: '지하철', romanization: 'jihacheol', translation: 'subway', translationFr: 'm\u00e9tro', image: '/vocab/kr-l5/chikatetsu.png' },
    { id: 'ktx', word: 'KTX', romanization: 'keitiekseu', translation: 'KTX (high-speed train)', translationFr: 'KTX (train \u00e0 grande vitesse)', image: '/vocab/kr-l5/shinkansen.png' },
    { id: 'beoseu', word: '버스', romanization: 'beoseu', translation: 'bus', translationFr: 'bus', image: '/vocab/kr-l5/basu.png' },
    { id: 'taeksi', word: '택시', romanization: 'taeksi', translation: 'taxi', translationFr: 'taxi', image: '/vocab/kr-l5/takushi.png' },
    { id: 'jajeongeo', word: '자전거', romanization: 'jajeongeo', translation: 'bicycle', translationFr: 'v\u00e9lo', image: '/vocab/kr-l5/jitensha.png' },
    { id: 'chingu', word: '친구', romanization: 'chingu', translation: 'friend', translationFr: 'ami(e)', image: '/vocab/kr-l5/tomodachi.png' },
    { id: 'namjachingu', word: '남자친구', romanization: 'namjachingu', translation: 'he, boyfriend', translationFr: 'lui, copain', image: '/vocab/kr-l5/kare.png' },
    { id: 'yeojachingu', word: '여자친구', romanization: 'yeojachingu', translation: 'she, girlfriend', translationFr: 'elle, copine', image: '/vocab/kr-l5/kanojo.png' },
    { id: 'gajok', word: '가족', romanization: 'gajok', translation: 'family', translationFr: 'famille', image: '/vocab/kr-l5/kazoku.png' },
    { id: 'honja', word: '혼자', romanization: 'honja', translation: 'alone', translationFr: 'seul(e)', image: '/vocab/kr-l5/hitoride.png' },
    { id: 'saengil', word: '생일', romanization: 'saengil', translation: 'birthday', translationFr: 'anniversaire', image: '/vocab/kr-l5/tanjobi.png' },
    { id: 'mugunghwa', word: '무궁화호', romanization: 'mugunghwaho', translation: 'local (train)', translationFr: 'train local', image: '/vocab/kr-l5/futsu.png' },
    { id: 'saemaeul', word: '새마을호', romanization: 'saemaeulho', translation: 'rapid', translationFr: 'rapide', image: '/vocab/kr-l5/kyuko.png' },
    { id: 'ktxExpress', word: 'KTX', romanization: 'keitiekseu', translation: 'express', translationFr: 'express', image: '/vocab/kr-l5/tokkyu.png' },
  ],

  content: [
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shIntroEyebrow`, titleKey: `${P}.c.shIntroTitle`, subtitleKey: `${P}.c.intro`, highlightKey: `${P}.c.shIntroHl`, variant: 'split' } },

    // Part 1: 에-particle (direction)
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shGoEyebrow`, titleKey: `${P}.c.shGoTitle`, highlightKey: `${P}.c.shGoHl` } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardGoTitle`,
        structures: [
          { parts: [
            { text: '[place]', color: '#3b82f6', labelKey: `${P}.c.lblPlace` },
            { text: '에', color: '#ef4444', labelKey: `${P}.c.lblE` },
            { text: '갑니다', color: '#22c55e', labelKey: `${P}.c.lblGo` },
          ] },
          { parts: [{ text: '옵니다', color: '#f59e0b', labelKey: `${P}.c.lblCome` }] },
          { parts: [{ text: '돌아갑니다', color: '#8b5cf6', labelKey: `${P}.c.lblReturn` }] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.goExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipE` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: '오늘 백화점에 갑니다.', romanization: 'oneul baekhwajeome gamnida.', translationKey: `${P}.c.exGoDept` },
        { sentence: '엠마 씨는 한국에 왔습니다.', romanization: 'emma ssineun hanguge wasseumnida.', translationKey: `${P}.c.exCameKr` },
        { sentence: '집에 돌아갑니다.', romanization: 'jibe doragamnida.', translationKey: `${P}.c.exGoHome` },
      ],
    },

    // Part 2: (으)로-particle (means of transport)
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shMeansEyebrow`, titleKey: `${P}.c.shMeansTitle`, highlightKey: `${P}.c.shMeansHl`, variant: 'split' } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardMeansTitle`,
        structures: [
          { parts: [
            { text: '[transport]', color: '#3b82f6', labelKey: `${P}.c.lblTransport` },
            { text: '(으)로', color: '#ef4444', labelKey: `${P}.c.lblEuro` },
            { text: '[place]', color: '#22c55e', labelKey: `${P}.c.lblPlace2` },
            { text: '에', color: '#f59e0b', labelKey: `${P}.c.lblE2` },
            { text: '갑니다', color: '#8b5cf6', labelKey: `${P}.c.lblGo2` },
          ] },
          { parts: [
            { text: '걸어서', color: '#ec4899', labelKey: `${P}.c.lblWalk` },
          ] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.meansExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipGeoreoseo` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: '기차로 회사에 갑니다.', romanization: 'gicharo hoesae gamnida.', translationKey: `${P}.c.exByTrain` },
        { sentence: '택시로 호텔에 갔습니다.', romanization: 'taeksiro hotere gasseumnida.', translationKey: `${P}.c.exByTaxi` },
        { sentence: '걸어서 역에 갑니다.', romanization: 'georeoseo yeoge gamnida.', translationKey: `${P}.c.exOnFoot` },
      ],
    },
    {
      type: LESSON_CONTENT_TYPE.PRACTICE_INLINE,
      practiceInline: {
        instructionKey: `${P}.c.prInstr`,
        items: [
          { mode: PRACTICE_MODE.WRITE, promptKey: `${P}.c.prQ1`, answerKey: `${P}.c.prA1`, acceptedAnswers: ['에'] },
          { mode: PRACTICE_MODE.WRITE, promptKey: `${P}.c.prQ2`, answerKey: `${P}.c.prA2`, acceptedAnswers: ['로'] },
          { mode: PRACTICE_MODE.SELECT, promptKey: `${P}.c.prQ3`, answerKey: `${P}.c.prA3`, options: [
            { labelKey: `${P}.c.prA3` }, { labelKey: `${P}.c.prOpt2` }, { labelKey: `${P}.c.prOpt3` }, { labelKey: `${P}.c.prOpt4` },
          ] },
        ],
      },
    },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaMidEyebrow`, titleKey: `${P}.c.ctaMidTitle`, subtitleKey: `${P}.c.ctaMidSub`, ctaLabelKey: `${P}.c.ctaMidLabel`, ctaHref: '/korean/level-1/lessons/5/exercises?difficulty=easy' } },

    // Part 3: 와/과 (with) + 언제 (when)
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shWithEyebrow`, titleKey: `${P}.c.shWithTitle`, highlightKey: `${P}.c.shWithHl` } },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.withExplain` },
    {
      type: LESSON_CONTENT_TYPE.DIALOGUE,
      dialogue: [
        { speaker: '지영', sentence: '엠마 씨, 내일 어디에 갑니까?', romanization: 'emma ssi, naeil eodie gamnikka?', translationKey: `${P}.c.dlg1` },
        { speaker: '엠마', sentence: '경주에 갑니다.', romanization: 'gyeongjue gamnida.', translationKey: `${P}.c.dlg2` },
        { speaker: '지영', sentence: '누구와 갑니까?', romanization: 'nuguwa gamnikka?', translationKey: `${P}.c.dlg3` },
        { speaker: '엠마', sentence: '친구와 같이 갑니다.', romanization: 'chinguwa gachi gamnida.', translationKey: `${P}.c.dlg4` },
        { speaker: '지영', sentence: '무엇으로 갑니까?', romanization: 'mueoseuro gamnikka?', translationKey: `${P}.c.dlg5` },
        { speaker: '엠마', sentence: 'KTX로 갑니다.', romanization: 'keitiekseu-ro gamnida.', translationKey: `${P}.c.dlg6` },
      ],
    },
    { type: LESSON_CONTENT_TYPE.CULTURAL_NOTE, culturalTitleKey: `${P}.c.cultureTitle`, textKey: `${P}.c.cultureText` },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaFinalEyebrow`, titleKey: `${P}.c.ctaFinalTitle`, subtitleKey: `${P}.c.ctaFinalSub`, ctaLabelKey: `${P}.c.ctaFinalLabel`, ctaHref: '/korean/level-1/lessons/5/exercises?difficulty=medium' } },
  ],

  exercises: [
    { id: 'e1', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e1q`, options: [ { labelKey: `${P}.ex.e1a`, correct: true }, { labelKey: `${P}.ex.e1b`, correct: false }, { labelKey: `${P}.ex.e1c`, correct: false }, { labelKey: `${P}.ex.e1d`, correct: false } ] },
    { id: 'e2', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e2q`, options: [ { labelKey: `${P}.ex.e2a`, correct: false }, { labelKey: `${P}.ex.e2b`, correct: true }, { labelKey: `${P}.ex.e2c`, correct: false }, { labelKey: `${P}.ex.e2d`, correct: false } ] },
    { id: 'e3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '백화점___ 갑니다.', answer: '에' },
    { id: 'e4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '기차___ 갑니다.', answer: '로' },
    { id: 'e5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e5q`, options: [ { labelKey: `${P}.ex.e5a`, correct: false }, { labelKey: `${P}.ex.e5b`, correct: true }, { labelKey: `${P}.ex.e5c`, correct: false }, { labelKey: `${P}.ex.e5d`, correct: false } ] },
    { id: 'e6', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '집___ 돌아갑니다.', answer: '에' },

    { id: 'm1', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['기차로', '회사에', '갑니다'] },
    { id: 'm2', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'medium', sourceKey: `${P}.ex.m2src`, targetAnswer: '친구와 경주에 갑니다', acceptedAnswers: ['친구와 경주에 갑니다', '친구와 같이 경주에 갑니다'] },
    { id: 'm3', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m3q`, options: [ { labelKey: `${P}.ex.m3a`, correct: false }, { labelKey: `${P}.ex.m3b`, correct: true }, { labelKey: `${P}.ex.m3c`, correct: false }, { labelKey: `${P}.ex.m3d`, correct: false } ] },
    { id: 'm4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'medium', sentenceTemplate: '걸어___ 역에 갑니다.', answer: '서' },
    { id: 'm5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m5q`, options: [ { labelKey: `${P}.ex.m5a`, correct: true }, { labelKey: `${P}.ex.m5b`, correct: false }, { labelKey: `${P}.ex.m5c`, correct: false }, { labelKey: `${P}.ex.m5d`, correct: false } ] },
    { id: 'm6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['혼자', '집에', '돌아갑니다'] },

    { id: 'h1', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h1src`, targetAnswer: '가족과 KTX로 갔습니다', acceptedAnswers: ['가족과 KTX로 갔습니다', '가족과 같이 KTX로 갔습니다'] },
    { id: 'h2', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['언제', '한국에', '왔습니까'] },
    { id: 'h3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'hard', sentenceTemplate: '누구___ 갑니까?', answer: '와' },
    { id: 'h4', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h4src`, targetAnswer: '택시로 호텔에 갔습니다', acceptedAnswers: ['택시로 호텔에 갔습니다'] },
    { id: 'h5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'hard', questionKey: `${P}.ex.h5q`, options: [ { labelKey: `${P}.ex.h5a`, correct: false }, { labelKey: `${P}.ex.h5b`, correct: true }, { labelKey: `${P}.ex.h5c`, correct: false }, { labelKey: `${P}.ex.h5d`, correct: false } ] },
    { id: 'h6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['어제', '혼자', '미술관에', '갔습니다'] },
  ],
}
