# DB Schema — Lessons, Levels, Vocabulary

## Context

Today, all lesson data (vocabulary, content blocks, exercises, level intros) lives hardcoded in TypeScript files under `packages/webapp/src/composables/data/courses/`. That's fine for rapid iteration, but once the structure stabilizes we want it in the DB so:

- Non-devs can edit content without a code release
- The app can fetch only the lesson it needs (smaller bundles)
- User-specific overlays (progress, favorites, notes) can join against content rows
- Content can be versioned and A/B tested

This doc proposes the SQL schema to mirror the current TS model **verbatim** — same shape, same fields, same IDs. Migration = one big seed script that reads the TS exports and `INSERT`s them.

## Tables

### `languages`
Top-level language (Korean, Japanese, etc.). Matches the `useCourses` data today.

```
id              string pk      -- 'korean', 'japanese', 'chinese'
flag            string         -- '🇰🇷'
color           string         -- '#ff9600'
color_light     string
color_subtle    string
status          string         -- 'available' | 'coming_soon'
sort_order      integer
created_at      timestamp
updated_at      timestamp
```

### `courses`
One row per `ICourseModule` (e.g. `korean-hangeul`, `korean-level-1`, `japanese-hiragana`, `japanese-level-1`).

```
id              string pk      -- 'korean-level-1' (matches ICourseModule.key)
language_id     string fk      -- references languages.id
slug            string         -- 'level-1' (matches ICourseModule.course)
kind            string         -- 'characters' | 'lessons'
locale_prefix   string         -- 'courses.korean.level1'
tts_lang        string         -- 'ko-KR'
tts_voice_prefs json           -- array of strings
official_level  string nullable -- 'TOPIK I', 'JLPT N5'
estimated_duration string nullable -- '~10h'
hero_image      string nullable
sort_order      integer
-- Landing-page feature flags for character-based courses
has_origin_story        boolean default false
has_cosmology           boolean default false
has_silent_initial_rule boolean default false
has_syllable_composition boolean default false
created_at      timestamp
updated_at      timestamp
```

Character-based courses continue to use the `config.categories`, `syllables`, `strokes`, etc. in code (tied to rendering). Lesson-based courses store their content in the tables below.

### `level_intros`
Optional per-course level intro (shown on `/korean/level-1` landing page).

```
course_id          string pk fk  -- references courses.id (1:1)
description_key    string        -- i18n key
objective_keys     json          -- array of i18n keys, ordered
created_at         timestamp
updated_at         timestamp
```

### `lessons`
One row per lesson within a course.

```
id              string pk      -- uuid
course_id       string fk      -- references courses.id
lesson_number   integer        -- matches ILesson.id (1, 2, 3...)
theme_key       string         -- 'greetings', 'numbers'
sort_order      integer        -- same as lesson_number, explicit for sort stability
created_at      timestamp
updated_at      timestamp

UNIQUE (course_id, lesson_number)
```

### `lesson_words`
Vocabulary items for a lesson.

```
id              string pk      -- 'hello', 'thank-you' (matches ILessonWord.id but scoped per lesson)
lesson_id       string fk      -- references lessons.id
word            string         -- '안녕하세요'
romanization    string
translation_en  string         -- 'Hello' (base translation for all locales)
translation_fr  string         -- 'Bonjour' (alternative locale)
image_path      string nullable -- '~/assets/images/vocab/greetings/hello.svg'
emoji           string nullable
audio_text      string nullable
sort_order      integer
created_at      timestamp
updated_at      timestamp

UNIQUE (lesson_id, id)
```

**Note**: `translation_en` and `translation_fr` are denormalized as columns to mirror the TS model. If we add more locales later, consider a separate `lesson_word_translations` table keyed by locale.

### `lesson_content_blocks`
The ordered list of course content blocks per lesson.

```
id              string pk      -- uuid
lesson_id       string fk      -- references lessons.id
block_type      string         -- 'TEXT' | 'EXAMPLE' | 'DIALOGUE' | 'TIP' | 'RULE'
                               -- | 'GRAMMAR_BOARD' | 'CHARACTER_PROFILES'
                               -- | 'VOCABULARY_TABLE' | 'CULTURAL_NOTE'
                               -- | 'PRACTICE_INLINE' | 'SECTION_HEADER'
                               -- | 'EXAMPLE_GROUP' | 'SECTION_CTA'
sort_order      integer
data            json           -- polymorphic payload (see below)
created_at      timestamp
updated_at      timestamp
```

**Polymorphic `data` payload** — shape depends on `block_type`:

- `TEXT` / `TIP` / `CULTURAL_NOTE`: `{ textKey, culturalTitleKey? }`
- `EXAMPLE`: `{ example: { sentence, romanization, translationKey } }`
- `EXAMPLE_GROUP`: `{ examples: [{ sentence, romanization, translationKey }, ...] }`
- `DIALOGUE`: `{ dialogue: [{ speaker, sentence, romanization, translationKey }, ...] }`
- `RULE`: `{ rule: { patternKey, explanationKey, examples: [...] } }`
- `GRAMMAR_BOARD`: `{ board: { titleKey, structures: [{ parts: [{text, color, labelKey?}] }] } }`
- `CHARACTER_PROFILES`: `{ characters: [{ name, nameKr, country, flag, jobKey }] }`
- `VOCABULARY_TABLE`: `{ vocabTable: { titleKey, items: [{ word, romanization, translationKey }] } }`
- `PRACTICE_INLINE`: `{ practiceInline: { instructionKey, items: [{ promptKey, answerKey }] } }`
- `SECTION_HEADER`: `{ sectionHeader: { eyebrowKey, titleKey, subtitleKey?, highlightKey?, variant? } }`
- `SECTION_CTA`: `{ sectionCta: { eyebrowKey?, titleKey, subtitleKey?, ctaLabelKey, ctaHref } }`

**Why JSON for `data`?** Content blocks have 13 very different shapes. A single polymorphic JSON column is clean, matches the TS discriminated union, avoids 13 sparse columns or 13 child tables. Postgres has `jsonb` for this; SQLite stores it as text. Trade-off: no FK integrity on nested keys, but all payloads are owned by the app anyway.

### `lesson_exercises`
Practice exercises at the end of each lesson.

```
id              string pk      -- 'e1', 'm1', 'h1' (matches ILessonExercise.id)
lesson_id       string fk      -- references lessons.id
exercise_type   string         -- 'QCM' | 'FILL_BLANK' | 'REORDER' | 'TRANSLATE'
difficulty      string         -- 'easy' | 'medium' | 'hard'
sort_order      integer
data            json           -- polymorphic payload
created_at      timestamp
updated_at      timestamp

UNIQUE (lesson_id, id)
```

**Polymorphic `data` payload** — shape depends on `exercise_type`:

- `QCM`: `{ questionKey, options: [{ labelKey, correct }] }`
- `FILL_BLANK`: `{ sentenceTemplate, answer, acceptedAnswers? }`
- `REORDER`: `{ correctOrder: string[] }`
- `TRANSLATE`: `{ sourceKey, targetAnswer, acceptedAnswers? }`

### `user_lesson_progress`
Per-user progress, replaces the localStorage `teachme_lesson_progress` data.

```
id              string pk      -- uuid
user_id         string fk      -- references users.id
lesson_id       string fk      -- references lessons.id
completed       boolean        -- true once best_score >= 60
best_score      integer        -- 0-100
attempts        integer        -- default 0
last_attempt_at timestamp nullable
created_at      timestamp
updated_at      timestamp

UNIQUE (user_id, lesson_id)
```

### i18n keys — deferred

All `*_key` columns reference i18n keys that currently live in `assets/locales/en.json` and `fr.json`. Initial migration keeps these in static JSON — no DB-backed i18n. If we later want editable content, add a `translations` table keyed by `(locale, key)`.

---

## Migration strategy

1. **Write the migration** in `server/db/connection.ts` following the existing idempotent pattern (`hasTable` → `createTable`).
2. **Seed script** (`server/db/seed-lessons.ts`): imports the TS course modules, iterates over their data, and writes rows. Idempotent via `INSERT ... ON CONFLICT DO UPDATE` (Postgres) or `INSERT OR REPLACE` (SQLite).
3. **Repository layer** (`server/repositories/lesson.repository.ts`): functions like `getCourse(id)`, `getLesson(id)`, `getLessonsByCourse(courseId)` returning `ILesson` / `ICourseModule` shapes.
4. **API routes** (`server/api/v1/courses/*`, `server/api/v1/lessons/*`) serving these to the frontend.
5. **Frontend swap**: replace `COURSE_REGISTRY` lookup with a fetch to `/api/v1/courses/:id`. The `ICourseModule` shape stays unchanged — only the source changes.
6. **Character-based courses** (Hangeul, Hiragana, Katakana) stay in code for now — they're deeply tied to stroke rendering, SVG assets, and category predicates that are hard to serialize cleanly.

## Open questions

- **Should i18n keys be swapped for inline strings?** Keeps the DB self-contained but requires a translations table for fr/en. Keeping keys is simpler for v1.
- **Should `lesson_content_blocks.data` be `jsonb` on Postgres?** Yes — enables indexing on block_type if we ever need to query by it.
- **Versioning**: do we want to track edits? Probably not in v1 — YAGNI.
- **Image paths**: currently `~/assets/...` imports. Once in DB, the frontend needs to resolve these — either keep as module import paths and rely on Vite's static analysis (fragile) or serve images from `/public` and use plain URLs (recommended).
