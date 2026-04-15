# CLAUDE.md — TeachMe

## Tech Stack

- **Nuxt 3** + **Vue 3** + **TypeScript** (strict mode off)
- **Pinia** — state management
- **@nuxtjs/i18n 9** — internationalisation (Composition API, `legacy: false`)
- **Knex.js** — SQL query builder (SQLite default, PostgreSQL supported)
- **better-sqlite3** — SQLite driver (dev/default)
- **Nitro** — integrated server (API routes, middleware, plugins)
- **Tauri 2** — native desktop app (`packages/desktop`)
- **ioredis** — Redis client (OTP sessions)
- **nodemailer** — email via Mailpit (dev) or SMTP (prod)
- **Vite 6** — dev server on port 5000

## Commands

```bash
# ── Local dev (no Docker) ──────────────────────────────────────────
npm run dev              # frontend (3000) + webapp (5000) concurrently
npm run dev:frontend     # Landing only  (port 3000)
npm run dev:webapp       # Webapp only   (port 5000)

# ── Docker: infra only (postgres + redis + mailpit) ───────────────
npm run docker:infra
npm run docker:infra:down

# ── Docker: dev (infra + both services hot-reload) ────────────────
npm run docker:dev
npm run docker:dev:build
npm run docker:dev:down

# ── Docker: prod ──────────────────────────────────────────────────
npm run docker:prod:build
npm run docker:prod:down

# ── Tauri desktop ─────────────────────────────────────────────────
npm run tauri:dev        # frontend + webapp + Tauri window
npm run tauri:build      # build webapp → compile Tauri bundle
npm run tauri:icon -- icon.png

# ── Per-package ───────────────────────────────────────────────────
cd packages/frontend     # landing
cd packages/webapp       # app
npm run dev / build / typecheck / clean
```

## Ports (all 5xxx — easy to group and kill)

| Service      | Host port | Notes                        |
|--------------|-----------|------------------------------|
| Frontend     | **5000**  | Landing / marketing site     |
| Webapp       | **5001**  | App + Nitro API              |
| Tauri devUrl | **5001**  | Wraps webapp                 |
| PostgreSQL   | **5433**  | container internal: 5432     |
| Redis        | **5379**  | container internal: 6379     |
| Mailpit UI   | **5080**  | Web inbox                    |
| Mailpit SMTP | **5025**  | container internal: 1025     |

## Project Structure

```
packages/
  frontend/     — Landing/marketing site (port 3000, @teachme/frontend)
    src/
    ├── pages/index.vue       # Landing page (uses <a> links to APP_URL)
    ├── layouts/default.vue   # Topbar + footer with external links to webapp
    └── assets/               # CSS vars + SCSS (copy of webapp's)
  webapp/       — Nuxt 3 app (port 5000, @teachme/webapp, API + UI in one process)
    src/
    ├── pages/            # File-based routing
    ├── components/       # Auto-imported Vue components
    ├── composables/      # Business logic hooks (use*.ts)
    ├── layouts/          # default.vue, auth.vue
    ├── stores/           # Pinia stores (*.store.ts)
    ├── services/         # $fetch wrappers extending BaseService
    ├── middleware/       # Nuxt route middleware (client-side)
    ├── plugins/          # Nuxt plugins
    ├── assets/
    │   ├── scss/         # main.scss (global styles)
    │   └── locales/      # en.json (source of truth), fr.json
    └── server/           # Nitro server (runs in Node.js, never in browser)
        ├── api/
        │   └── v1/       # API routes → /api/v1/*
        │       ├── auth/         register.post.ts, login.post.ts, verify.post.ts, resend.post.ts
        │       ├── characters/   index.get.ts, [id].get.ts
        │       ├── strokes/      [characterId].get.ts
        │       ├── review/       due.get.ts, index.post.ts
        │       └── health.get.ts
        ├── db/
        │   └── connection.ts     # Knex instance + runMigrations()
        ├── middleware/
        │   └── auth.ts           # Guards /api/v1/review routes
        ├── plugins/
        │   └── database.ts       # Calls initDb() on server start
        └── utils/
            ├── auth.ts           # signToken, verifyToken, hashPassword
            ├── redis.ts          # ioredis singleton
            ├── otp.ts            # OTP generate/verify (Redis-backed)
            ├── mailer.ts         # nodemailer → Mailpit/SMTP
            ├── sms.ts            # Twilio or console mock
            └── sm2.ts            # SM-2 spaced repetition algorithm
  desktop/      — Tauri 2 shell (wraps webapp at port 5000)
    src-tauri/
      src/       — Rust (main.rs, lib.rs)
      tauri.conf.json
      capabilities/default.json
      icons/     — RGBA PNGs (generate with npm run tauri:icon -- icon.png)
```

## CRITICAL RULES

- **Never use raw hex colors in components** — use CSS variables
- **Always update CLAUDE.md** when an important rule or pattern is discovered
- **Use `sass` not `sass-embedded`** — `sass-embedded` requires macOS 14+; `sass` (pure-JS) works everywhere
- **Pinia `hasOwnProperty` patch required** — `scripts/patch-pinia.js` patches `node_modules/pinia/dist/pinia.{mjs,cjs}`. Run automatically via `postinstall`.
- **Nuxt 3.16 VirtualFSPlugin workaround** — `hooks['app:templates']`: (1) force all templates to disk; (2) push `plugins.mjs` shim re-exporting from `plugins.server.mjs`. Applied in both `packages/frontend` and `packages/webapp` nuxt.config.ts.
- **`externals.inline` — never add ioredis / nodemailer / pg** — these packages use `class X extends EventEmitter`. When esbuild inlines them it wraps Node's `events` module as an ESM namespace, causing `Class extends value [object Module]` at startup, which in turn prevents the Nuxt renderer from initialising (`Cannot access 'renderer$1' before initialization` on every request). Only inline pure-JS CJS packages with no Node-builtin class inheritance: `jsonwebtoken`, `bcryptjs`.
- **i18n `@` in locale values must be escaped** — use `{'@'}` (e.g. `"you{'@'}example.com"`).
- **No `import` of Vue/app files in `nuxt.config.ts`** — causes circular VirtualFS error.
- **No `vite.config.ts`** — all Vite config goes in the `vite:` key of `nuxt.config.ts`.
- **BaseService uses relative URL `/api/v1`** — API and UI share the same Nitro process.
- **i18n** — always use `useI18n()` + `t()`, never hardcode strings; locale cookie: `teachme_locale`
- **i18n locale files** — `en.json` is source of truth; mirror every key in `fr.json`. Each package has its own locale files (frontend = landing keys only, webapp = app keys only).
- **Assets** — CSS in `src/assets/css/`, SCSS in `src/assets/scss/`, locales in `src/assets/locales/`
- **Server-only code** in `src/server/` — never import from client-side code
- **frontend vs webapp** — `packages/frontend` = landing (no auth, no DB, links to webapp via `APP_URL`). `packages/webapp` = the actual app. **Never add server/DB code to frontend.**
- **Tauri wraps webapp** — `devUrl: http://localhost:5000`, `frontendDist: ../../webapp/.output/public`
- **Tauri icons must be RGBA PNGs** — run `npm run tauri:icon -- icon.png` before `tauri:build`
- **Docker inter-service hostnames** — use service names (`postgres`, `redis`, `mailpit`), internal ports (5432, 6379, 1025)

## Database

- Default: SQLite (`teach-me.db` in project root)
- Tables auto-created on first server start via `runMigrations()` in `packages/webapp/src/server/db/connection.ts`
- Switch to PostgreSQL: set `DB_TYPE=postgres` + `DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME`

## Data Model

| Table | Key Columns |
|---|---|
| `users` | id, email?, phone?, username, password, verified, created_at, updated_at |
| `characters` | id, lang, type, symbol, romanization, created_at, updated_at |
| `strokes` | id, character_id (fk), order, path (SVG) |
| `words` | id, lang, value, meaning, reading?, created_at, updated_at |
| `review_items` | id, user_id (fk), ref_id, type, ease, interval, repetitions, next_review, created_at, updated_at |

## Naming Conventions

### File names

| Layer | Pattern | Examples |
|---|---|---|
| Components | `PascalCase.vue` | `CharacterCard.vue`, `LevelBadge.vue` |
| Pages | `kebab-case.vue` | `forgot-password.vue`, `[n].vue` |
| Composables | `camelCase.ts` | `useAuth.ts`, `useKoreanLevels.ts` |
| Services | `kebab-case.service.ts` | `character.service.ts` |
| Interfaces | `kebab-case.interface.ts` | `character.interface.ts` |
| Stores | `kebab-case.store.ts` | `auth.store.ts` |
| Server API routes | `index.<method>.ts` | `index.get.ts`, `register.post.ts` |

### Identifiers

**Interfaces** — `I` prefix: `ICharacter`, `ILoginPayload`
**Types** — `T` prefix: `TLanguage`
**Enums** — SCREAMING_SNAKE_CASE: `export enum LANGUAGE { KOREAN = 'kr' }`
**Constants** — SCREAMING_SNAKE_CASE: `PUBLIC_ROUTES`
**Composables** — `use` prefix: `useAuth()`

## Component Conventions

- `<script setup lang="ts">` always
- Composables own all business logic — pages and components stay thin
- Stores hold shared reactive state
- `data-cy="..."` on all interactive elements
- `aria-label` on icon-only interactive elements
- Animations via CSS transitions only
