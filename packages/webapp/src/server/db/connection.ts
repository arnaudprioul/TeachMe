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
}

async function migrate(db: ReturnType<typeof knex>): Promise<void> {
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
    // Add columns added after initial creation (idempotent)
    const hasPhone = await db.schema.hasColumn('users', 'phone')
    if (!hasPhone) await db.schema.alterTable('users', (t) => { t.string('phone').unique().nullable() })
    const hasVerified = await db.schema.hasColumn('users', 'verified')
    if (!hasVerified) await db.schema.alterTable('users', (t) => { t.boolean('verified').notNullable().defaultTo(false) })
    const hasUpdatedAt = await db.schema.hasColumn('users', 'updated_at')
    if (!hasUpdatedAt) await db.schema.alterTable('users', (t) => { t.timestamp('updated_at').defaultTo(db.fn.now()) })
  }

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
}
