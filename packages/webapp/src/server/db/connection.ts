import knex from 'knex'
import { join } from 'node:path'

let _db: ReturnType<typeof knex> | null = null

export function getDb(): ReturnType<typeof knex> {
  if (!_db) throw new Error('DB not initialized')
  return _db
}

export async function initDb(): Promise<void> {
  if (_db) return

  const dbType = process.env.DB_TYPE ?? 'better-sqlite3'

  if (dbType === 'postgres') {
    _db = knex({
      client: 'pg',
      connection: {
        host: process.env.DB_HOST ?? 'localhost',
        port: Number(process.env.DB_PORT ?? 5433),
        database: process.env.DB_NAME ?? 'teachme',
        user: process.env.DB_USER ?? 'teachme',
        password: process.env.DB_PASSWORD ?? 'teachme_secret',
      },
    })
  } else {
    const dbPath = process.env.DB_PATH ?? join(process.cwd(), 'teach-me.db')
    _db = knex({ client: 'better-sqlite3', connection: { filename: dbPath }, useNullAsDefault: true })
  }

  await migrate(_db)

  // Seed lessons from static TS data on every boot (TS is the source of
  // truth during iteration; DB is a read-through mirror).
  // Set `TEACHME_SKIP_SEED=1` to disable — useful when testing DB-only edits.
  if (process.env.TEACHME_SKIP_SEED !== '1') {
    const { seedLessons } = await import('./seed-lessons')
    await seedLessons(_db)
  }
}

async function migrate(db: ReturnType<typeof knex>): Promise<void> {
  // ═══════════════════════════════════════════════════════
  // USERS
  // ═══════════════════════════════════════════════════════
  if (!(await db.schema.hasTable('users'))) {
    await db.schema.createTable('users', (t) => {
      t.string('id').primary()
      t.string('email').unique().nullable()
      t.string('phone').unique().nullable()
      t.string('username').unique().notNullable()
      t.string('password').notNullable()
      t.boolean('verified').notNullable().defaultTo(false)
      t.timestamp('created_at').defaultTo(db.fn.now())
      t.timestamp('updated_at').defaultTo(db.fn.now())
    })
  } else {
    const hasPhone = await db.schema.hasColumn('users', 'phone')
    if (!hasPhone) await db.schema.alterTable('users', (t) => { t.string('phone').unique().nullable() })
    const hasVerified = await db.schema.hasColumn('users', 'verified')
    if (!hasVerified) await db.schema.alterTable('users', (t) => { t.boolean('verified').notNullable().defaultTo(false) })
    const hasUpdatedAt = await db.schema.hasColumn('users', 'updated_at')
    if (!hasUpdatedAt) await db.schema.alterTable('users', (t) => { t.timestamp('updated_at').defaultTo(db.fn.now()) })
  }

  // ═══════════════════════════════════════════════════════
  // QUIZ RESULTS (legacy, kept for character training)
  // ═══════════════════════════════════════════════════════
  if (!(await db.schema.hasTable('quiz_results'))) {
    await db.schema.createTable('quiz_results', (t) => {
      t.string('id').primary()
      t.string('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      t.string('char_id').notNullable()
      t.boolean('correct').notNullable()
      t.string('mode').notNullable()
      t.timestamp('created_at').defaultTo(db.fn.now())
    })
  }

  // ═══════════════════════════════════════════════════════
  // LANGUAGES
  // ═══════════════════════════════════════════════════════
  if (!(await db.schema.hasTable('languages'))) {
    await db.schema.createTable('languages', (t) => {
      t.string('id').primary()
      t.string('flag').notNullable()
      t.string('color').notNullable()
      t.string('color_light').notNullable()
      t.string('color_subtle').notNullable()
      t.string('status').notNullable().defaultTo('available')
      t.integer('sort_order').notNullable().defaultTo(0)
      t.timestamp('created_at').defaultTo(db.fn.now())
      t.timestamp('updated_at').defaultTo(db.fn.now())
    })
  }

  // ═══════════════════════════════════════════════════════
  // COURSES
  // ═══════════════════════════════════════════════════════
  if (!(await db.schema.hasTable('courses'))) {
    await db.schema.createTable('courses', (t) => {
      t.string('id').primary()
      t.string('language_id').notNullable().references('id').inTable('languages').onDelete('CASCADE')
      t.string('slug').notNullable()
      t.string('kind').notNullable() // 'characters' | 'lessons'
      t.string('locale_prefix').notNullable()
      t.string('tts_lang').notNullable()
      t.json('tts_voice_prefs').notNullable()
      t.string('official_level').nullable()
      t.string('estimated_duration').nullable()
      t.string('hero_image').nullable()
      t.integer('sort_order').notNullable().defaultTo(0)
      t.boolean('has_origin_story').notNullable().defaultTo(false)
      t.boolean('has_cosmology').notNullable().defaultTo(false)
      t.boolean('has_silent_initial_rule').notNullable().defaultTo(false)
      t.boolean('has_syllable_composition').notNullable().defaultTo(false)
      t.timestamp('created_at').defaultTo(db.fn.now())
      t.timestamp('updated_at').defaultTo(db.fn.now())
      t.index(['language_id'])
    })
  }

  // ═══════════════════════════════════════════════════════
  // LEVEL INTROS
  // ═══════════════════════════════════════════════════════
  if (!(await db.schema.hasTable('level_intros'))) {
    await db.schema.createTable('level_intros', (t) => {
      t.string('course_id').primary().references('id').inTable('courses').onDelete('CASCADE')
      t.string('description_key').notNullable()
      t.json('objective_keys').notNullable()
      t.string('official_level_info_key').nullable()
      t.string('official_level_link').nullable()
      t.timestamp('created_at').defaultTo(db.fn.now())
      t.timestamp('updated_at').defaultTo(db.fn.now())
    })
  }

  // ═══════════════════════════════════════════════════════
  // LESSONS
  // ═══════════════════════════════════════════════════════
  if (!(await db.schema.hasTable('lessons'))) {
    await db.schema.createTable('lessons', (t) => {
      t.string('id').primary()
      t.string('course_id').notNullable().references('id').inTable('courses').onDelete('CASCADE')
      t.integer('lesson_number').notNullable()
      t.string('theme_key').notNullable()
      t.integer('sort_order').notNullable().defaultTo(0)
      t.timestamp('created_at').defaultTo(db.fn.now())
      t.timestamp('updated_at').defaultTo(db.fn.now())
      t.unique(['course_id', 'lesson_number'])
      t.index(['course_id'])
    })
  }

  // ═══════════════════════════════════════════════════════
  // LESSON WORDS
  // ═══════════════════════════════════════════════════════
  if (!(await db.schema.hasTable('lesson_words'))) {
    await db.schema.createTable('lesson_words', (t) => {
      t.string('id').notNullable()
      t.string('lesson_id').notNullable().references('id').inTable('lessons').onDelete('CASCADE')
      t.string('word').notNullable()
      t.string('romanization').notNullable()
      t.string('translation_en').notNullable()
      t.string('translation_fr').notNullable()
      t.string('image_path').nullable()
      t.string('emoji').nullable()
      t.string('audio_text').nullable()
      t.integer('sort_order').notNullable().defaultTo(0)
      t.timestamp('created_at').defaultTo(db.fn.now())
      t.timestamp('updated_at').defaultTo(db.fn.now())
      t.primary(['lesson_id', 'id'])
    })
  }

  // ═══════════════════════════════════════════════════════
  // LESSON CONTENT BLOCKS
  // ═══════════════════════════════════════════════════════
  if (!(await db.schema.hasTable('lesson_content_blocks'))) {
    await db.schema.createTable('lesson_content_blocks', (t) => {
      t.string('id').primary()
      t.string('lesson_id').notNullable().references('id').inTable('lessons').onDelete('CASCADE')
      t.string('block_type').notNullable()
      t.integer('sort_order').notNullable()
      t.json('data').notNullable()
      t.timestamp('created_at').defaultTo(db.fn.now())
      t.timestamp('updated_at').defaultTo(db.fn.now())
      t.index(['lesson_id'])
    })
  }

  // ═══════════════════════════════════════════════════════
  // LESSON EXERCISES
  // ═══════════════════════════════════════════════════════
  if (!(await db.schema.hasTable('lesson_exercises'))) {
    await db.schema.createTable('lesson_exercises', (t) => {
      t.string('id').notNullable()
      t.string('lesson_id').notNullable().references('id').inTable('lessons').onDelete('CASCADE')
      t.string('exercise_type').notNullable()
      t.string('difficulty').notNullable()
      t.integer('sort_order').notNullable().defaultTo(0)
      t.json('data').notNullable()
      t.timestamp('created_at').defaultTo(db.fn.now())
      t.timestamp('updated_at').defaultTo(db.fn.now())
      t.primary(['lesson_id', 'id'])
    })
  }

  // ═══════════════════════════════════════════════════════
  // USER REVIEW CARDS (SRS / Anki-style)
  // ═══════════════════════════════════════════════════════
  if (!(await db.schema.hasTable('user_review_cards'))) {
    await db.schema.createTable('user_review_cards', (t) => {
      t.string('id').primary()
      t.string('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      t.string('lang').notNullable()          // 'korean', 'japanese'
      t.string('word_id').notNullable()       // matches ILessonWord.id (e.g. 'hello')
      t.string('course_id').notNullable()     // where the word was added from
      t.integer('lesson_id').notNullable()    // lesson number
      // SM-2 algorithm state
      t.float('ease_factor').notNullable().defaultTo(2.5)
      t.integer('interval_days').notNullable().defaultTo(0)
      t.integer('repetitions').notNullable().defaultTo(0)
      t.timestamp('next_review_at').nullable()
      t.timestamp('last_reviewed_at').nullable()
      t.timestamp('created_at').defaultTo(db.fn.now())
      t.timestamp('updated_at').defaultTo(db.fn.now())
      t.unique(['user_id', 'lang', 'word_id', 'course_id', 'lesson_id'])
      t.index(['user_id', 'lang'])
    })
  }

  // ═══════════════════════════════════════════════════════
  // USER LESSON PROGRESS
  // ═══════════════════════════════════════════════════════
  if (!(await db.schema.hasTable('user_lesson_progress'))) {
    await db.schema.createTable('user_lesson_progress', (t) => {
      t.string('id').primary()
      t.string('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      t.string('course_key').notNullable()
      t.string('lesson_id').notNullable()
      t.boolean('completed').notNullable().defaultTo(false)
      t.integer('best_score').notNullable().defaultTo(0)
      t.integer('attempts').notNullable().defaultTo(0)
      t.timestamp('last_attempt_at').nullable()
      t.timestamp('created_at').defaultTo(db.fn.now())
      t.timestamp('updated_at').defaultTo(db.fn.now())
      t.unique(['user_id', 'course_key', 'lesson_id'])
    })
  } else {
    const hasCourseKey = await db.schema.hasColumn('user_lesson_progress', 'course_key')
    if (!hasCourseKey) {
      await db.schema.alterTable('user_lesson_progress', (t) => {
        t.string('course_key').notNullable().defaultTo('')
      })
    }
  }

  // ═══════════════════════════════════════════════════════
  // USER EXERCISE PROGRESS
  // ═══════════════════════════════════════════════════════
  if (!(await db.schema.hasTable('user_exercise_progress'))) {
    await db.schema.createTable('user_exercise_progress', (t) => {
      t.string('id').primary()
      t.string('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      t.string('course_key').notNullable()
      t.string('lesson_id').notNullable()
      t.string('difficulty').notNullable()
      t.integer('best_score').notNullable().defaultTo(0)
      t.integer('best_streak').notNullable().defaultTo(0)
      t.integer('attempts').notNullable().defaultTo(0)
      t.timestamp('last_attempt_at').nullable()
      t.timestamp('created_at').defaultTo(db.fn.now())
      t.timestamp('updated_at').defaultTo(db.fn.now())
      t.unique(['user_id', 'course_key', 'lesson_id', 'difficulty'])
    })
  }
}
