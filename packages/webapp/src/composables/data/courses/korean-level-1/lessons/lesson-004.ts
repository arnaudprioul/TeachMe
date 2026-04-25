import type { ILesson } from '../../lesson-types'
import { LESSON_CONTENT_TYPE, LESSON_EXERCISE_TYPE, PRACTICE_MODE } from '../../lesson-types'

const P = 'courses.korean.level1.l4'

export const LESSON_004: ILesson = {
  id: 4,
  level: 1,
  themeKey: 'dailyLife',

  words: [
    { id: 'ireonada', word: '일어나다', romanization: 'ireonada', translation: 'wake up', translationFr: 'se r\u00e9veiller', image: '/vocab/kr-l4/okimasu.png' },
    { id: 'jada', word: '자다', romanization: 'jada', translation: 'sleep', translationFr: 'dormir', image: '/vocab/kr-l4/nemasu.png' },
    { id: 'ilhada', word: '일하다', romanization: 'ilhada', translation: 'work', translationFr: 'travailler', image: '/vocab/kr-l4/hatarakimasu.png' },
    { id: 'swida', word: '쉬다', romanization: 'swida', translation: 'rest, take a day off', translationFr: 'se reposer, prendre un cong\u00e9', image: '/vocab/kr-l4/yasumimasu.png' },
    { id: 'gongbuhada', word: '공부하다', romanization: 'gongbuhada', translation: 'study', translationFr: '\u00e9tudier', image: '/vocab/kr-l4/benkyo.png' },
    { id: 'kkeutnada', word: '끝나다', romanization: 'kkeutnada', translation: 'finish', translationFr: 'finir', image: '/vocab/kr-l4/owarimasu.png' },
    { id: 'baekhwajeom', word: '백화점', romanization: 'baekhwajeom', translation: 'department store', translationFr: 'grand magasin', image: '/vocab/kr-l4/depato.png' },
    { id: 'eunhaeng', word: '은행', romanization: 'eunhaeng', translation: 'bank', translationFr: 'banque', image: '/vocab/kr-l4/ginko.png' },
    { id: 'ucheguk', word: '우체국', romanization: 'ucheguk', translation: 'post office', translationFr: 'bureau de poste', image: '/vocab/kr-l4/yubinkyoku.png' },
    { id: 'doseogwan', word: '도서관', romanization: 'doseogwan', translation: 'library', translationFr: 'biblioth\u00e8que', image: '/vocab/kr-l4/toshokan.png' },
    { id: 'misulgwan', word: '미술관', romanization: 'misulgwan', translation: 'art museum', translationFr: 'mus\u00e9e', image: '/vocab/kr-l4/bijutsukan.png' },
    { id: 'achim', word: '아침', romanization: 'achim', translation: 'morning', translationFr: 'matin', image: '/vocab/kr-l4/asa.png' },
    { id: 'nat', word: '낮', romanization: 'nat', translation: 'daytime, noon', translationFr: 'journ\u00e9e, midi', image: '/vocab/kr-l4/hiru.png' },
    { id: 'bam', word: '밤', romanization: 'bam', translation: 'night', translationFr: 'soir', image: '/vocab/kr-l4/ban.png' },
  ],

  content: [
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shIntroEyebrow`, titleKey: `${P}.c.shIntroTitle`, subtitleKey: `${P}.c.intro`, highlightKey: `${P}.c.shIntroHl`, variant: 'split' } },

    // Part 1: telling time (몇 시입니까?)
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shTimeEyebrow`, titleKey: `${P}.c.shTimeTitle`, highlightKey: `${P}.c.shTimeHl` } },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.timeExplain` },
    {
      type: LESSON_CONTENT_TYPE.VOCABULARY_TABLE,
      vocabTable: {
        titleKey: `${P}.c.timeTitle`,
        items: [
          { word: '한 시', romanization: 'han si', translationKey: `${P}.c.vtOne` },
          { word: '네 시', romanization: 'ne si', translationKey: `${P}.c.vtFour` },
          { word: '일곱 시', romanization: 'ilgop si', translationKey: `${P}.c.vtSeven` },
          { word: '아홉 시', romanization: 'ahop si', translationKey: `${P}.c.vtNine` },
          { word: '삼십 분 / 반', romanization: 'samsip bun / ban', translationKey: `${P}.c.vtHalf` },
          { word: '오전 / 오후', romanization: 'ojeon / ohu', translationKey: `${P}.c.vtAmPm` },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipReadings` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: '지금 몇 시입니까?', romanization: 'jigeum myeot siimnikka?', translationKey: `${P}.c.exWhatTime` },
        { sentence: '아홉 시 반입니다.', romanization: 'ahop si banimnida.', translationKey: `${P}.c.exHalf` },
        { sentence: '오후 세 시입니다.', romanization: 'ohu se simnida.', translationKey: `${P}.c.exPm3` },
      ],
    },

    // Part 2: formal verb conjugation + 에 (time particle)
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shVerbEyebrow`, titleKey: `${P}.c.shVerbTitle`, highlightKey: `${P}.c.shVerbHl`, variant: 'split' } },
    {
      type: LESSON_CONTENT_TYPE.GRAMMAR_BOARD,
      board: {
        titleKey: `${P}.c.boardVerbTitle`,
        structures: [
          { parts: [
            { text: '[time]', color: '#3b82f6', labelKey: `${P}.c.lblTime` },
            { text: '에', color: '#ef4444', labelKey: `${P}.c.lblE` },
            { text: '[verb]ㅂ니다/습니다', color: '#22c55e', labelKey: `${P}.c.lblFormal` },
          ] },
          { parts: [{ text: '[verb]지 않습니다', color: '#f59e0b', labelKey: `${P}.c.lblNeg` }] },
          { parts: [{ text: '[verb]았/었습니다', color: '#8b5cf6', labelKey: `${P}.c.lblPast` }] },
          { parts: [{ text: '[verb]지 않았습니다', color: '#ec4899', labelKey: `${P}.c.lblPastNeg` }] },
        ],
      },
    },
    { type: LESSON_CONTENT_TYPE.TEXT, textKey: `${P}.c.verbExplain` },
    { type: LESSON_CONTENT_TYPE.TIP, textKey: `${P}.c.tipE` },
    {
      type: LESSON_CONTENT_TYPE.EXAMPLE_GROUP,
      examples: [
        { sentence: '매일 아침 여섯 시에 일어납니다.', romanization: 'maeil achim yeoseot sie ireonanmnida.', translationKey: `${P}.c.exMorning` },
        { sentence: '아홉 시부터 다섯 시까지 일합니다.', romanization: 'ahop sibuteo daseot sikkaji ilhamnida.', translationKey: `${P}.c.exWork` },
        { sentence: '어제 공부하지 않았습니다.', romanization: 'eoje gongbuhaji anasseumnida.', translationKey: `${P}.c.exPastNeg` },
      ],
    },
    {
      type: LESSON_CONTENT_TYPE.PRACTICE_INLINE,
      practiceInline: {
        instructionKey: `${P}.c.prVerbInstr`,
        items: [
          { mode: PRACTICE_MODE.WRITE, promptKey: `${P}.c.prVerbQ1`, answerKey: `${P}.c.prVerbA1`, acceptedAnswers: ['에'] },
          { mode: PRACTICE_MODE.SELECT, promptKey: `${P}.c.prVerbQ2`, answerKey: `${P}.c.prVerbA2`, options: [
            { labelKey: `${P}.c.prVerbA2` }, { labelKey: `${P}.c.prVerbOpt2` }, { labelKey: `${P}.c.prVerbOpt3` }, { labelKey: `${P}.c.prVerbOpt4` },
          ] },
        ],
      },
    },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaMidEyebrow`, titleKey: `${P}.c.ctaMidTitle`, subtitleKey: `${P}.c.ctaMidSub`, ctaLabelKey: `${P}.c.ctaMidLabel`, ctaHref: '/korean/level-1/lessons/4/exercises?difficulty=easy' } },

    // Part 3: days of the week / typical schedule dialogue
    { type: LESSON_CONTENT_TYPE.SECTION_HEADER, sectionHeader: { eyebrowKey: `${P}.c.shDayEyebrow`, titleKey: `${P}.c.shDayTitle`, highlightKey: `${P}.c.shDayHl` } },
    {
      type: LESSON_CONTENT_TYPE.VOCABULARY_TABLE,
      vocabTable: {
        titleKey: `${P}.c.daysTitle`,
        items: [
          { word: '월요일', romanization: 'woryoil', translationKey: `${P}.c.vtMon` },
          { word: '화요일', romanization: 'hwayoil', translationKey: `${P}.c.vtTue` },
          { word: '수요일', romanization: 'suyoil', translationKey: `${P}.c.vtWed` },
          { word: '목요일', romanization: 'mogyoil', translationKey: `${P}.c.vtThu` },
          { word: '금요일', romanization: 'geumyoil', translationKey: `${P}.c.vtFri` },
          { word: '토요일', romanization: 'toyoil', translationKey: `${P}.c.vtSat` },
          { word: '일요일', romanization: 'iryoil', translationKey: `${P}.c.vtSun` },
        ],
      },
    },
    {
      type: LESSON_CONTENT_TYPE.DIALOGUE,
      dialogue: [
        { speaker: '지영', sentence: '엠마 씨, 매일 몇 시부터 몇 시까지 일합니까?', romanization: 'emma ssi, maeil myeot sibuteo myeot sikkaji ilhamnikka?', translationKey: `${P}.c.dlg1` },
        { speaker: '엠마', sentence: '아홉 시부터 여섯 시까지입니다.', romanization: 'ahop sibuteo yeoseot sikkajiimnida.', translationKey: `${P}.c.dlg2` },
        { speaker: '지영', sentence: '토요일과 일요일은 쉽니까?', romanization: 'toyoilgwa iryoireun swimnikka?', translationKey: `${P}.c.dlg3` },
        { speaker: '엠마', sentence: '네, 그렇습니다.', romanization: 'ne, geureoseumnida.', translationKey: `${P}.c.dlg4` },
      ],
    },
    { type: LESSON_CONTENT_TYPE.CULTURAL_NOTE, culturalTitleKey: `${P}.c.cultureTitle`, textKey: `${P}.c.cultureText` },

    { type: LESSON_CONTENT_TYPE.SECTION_CTA, sectionCta: { eyebrowKey: `${P}.c.ctaFinalEyebrow`, titleKey: `${P}.c.ctaFinalTitle`, subtitleKey: `${P}.c.ctaFinalSub`, ctaLabelKey: `${P}.c.ctaFinalLabel`, ctaHref: '/korean/level-1/lessons/4/exercises?difficulty=medium' } },
  ],

  exercises: [
    { id: 'e1', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e1q`, options: [ { labelKey: `${P}.ex.e1a`, correct: true }, { labelKey: `${P}.ex.e1b`, correct: false }, { labelKey: `${P}.ex.e1c`, correct: false }, { labelKey: `${P}.ex.e1d`, correct: false } ] },
    { id: 'e2', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e2q`, options: [ { labelKey: `${P}.ex.e2a`, correct: false }, { labelKey: `${P}.ex.e2b`, correct: true }, { labelKey: `${P}.ex.e2c`, correct: false }, { labelKey: `${P}.ex.e2d`, correct: false } ] },
    { id: 'e3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '여섯 시___ 일어납니다.', answer: '에' },
    { id: 'e4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '오늘은 휴일___.', answer: '입니다' },
    { id: 'e5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'easy', questionKey: `${P}.ex.e5q`, options: [ { labelKey: `${P}.ex.e5a`, correct: false }, { labelKey: `${P}.ex.e5b`, correct: false }, { labelKey: `${P}.ex.e5c`, correct: true }, { labelKey: `${P}.ex.e5d`, correct: false } ] },
    { id: 'e6', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'easy', sentenceTemplate: '아홉 시___ 다섯 시___ 일합니다.', answer: '부터/까지' },

    { id: 'm1', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['매일', '아침', '여섯 시에', '일어납니다'] },
    { id: 'm2', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'medium', sourceKey: `${P}.ex.m2src`, targetAnswer: '지금 몇 시입니까', acceptedAnswers: ['지금 몇 시입니까', '지금 몇 시입니까?', '지금 몇 시예요?'] },
    { id: 'm3', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m3q`, options: [ { labelKey: `${P}.ex.m3a`, correct: false }, { labelKey: `${P}.ex.m3b`, correct: true }, { labelKey: `${P}.ex.m3c`, correct: false }, { labelKey: `${P}.ex.m3d`, correct: false } ] },
    { id: 'm4', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'medium', sentenceTemplate: '어제 공부___.', answer: '했습니다' },
    { id: 'm5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'medium', questionKey: `${P}.ex.m5q`, options: [ { labelKey: `${P}.ex.m5a`, correct: true }, { labelKey: `${P}.ex.m5b`, correct: false }, { labelKey: `${P}.ex.m5c`, correct: false }, { labelKey: `${P}.ex.m5d`, correct: false } ] },
    { id: 'm6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'medium', correctOrder: ['토요일은', '쉽니다'] },

    { id: 'h1', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h1src`, targetAnswer: '어제 열 시에 잤습니다', acceptedAnswers: ['어제 열 시에 잤습니다', '어제 10시에 잤습니다'] },
    { id: 'h2', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['아홉 시', '부터', '다섯 시', '까지', '일합니다'] },
    { id: 'h3', type: LESSON_EXERCISE_TYPE.FILL_BLANK, difficulty: 'hard', sentenceTemplate: '일요일___ 일하지 않___니다.', answer: '에는/습' },
    { id: 'h4', type: LESSON_EXERCISE_TYPE.TRANSLATE, difficulty: 'hard', sourceKey: `${P}.ex.h4src`, targetAnswer: '점심시간은 열두 시부터 한 시까지입니다', acceptedAnswers: ['점심시간은 열두 시부터 한 시까지입니다', '점심시간은 12시부터 1시까지입니다'] },
    { id: 'h5', type: LESSON_EXERCISE_TYPE.QCM, difficulty: 'hard', questionKey: `${P}.ex.h5q`, options: [ { labelKey: `${P}.ex.h5a`, correct: false }, { labelKey: `${P}.ex.h5b`, correct: true }, { labelKey: `${P}.ex.h5c`, correct: false }, { labelKey: `${P}.ex.h5d`, correct: false } ] },
    { id: 'h6', type: LESSON_EXERCISE_TYPE.REORDER, difficulty: 'hard', correctOrder: ['오늘은', '끝났습니다'] },
  ],
}
