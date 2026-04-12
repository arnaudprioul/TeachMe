
export default defineNuxtConfig({
  compatibilityDate: '2024-01-01',
  devtools: { enabled: true },
  srcDir: 'src/',
  devServer: { port: 5001 },

  // SPA mode — the webapp is wrapped by Tauri, no SEO need.
  // Disabling SSR lets the auth middleware read the token from localStorage
  // on first render (otherwise the server has no access to it and would
  // redirect every reload to /auth/login).
  ssr: false,

  // Nuxt 3.16 monorepo fix:
  // 1. Force all templates to disk so the #build alias can resolve them
  // 2. Add a plugins.mjs shim (SSR entry) so vite-node can resolve #build/plugins
  hooks: {
    'app:templates'(app) {
      for (const t of app.templates) t.write = true

      // Nuxt 3.16 splits plugins into plugins.client.mjs / plugins.server.mjs.
      // vite-node (SSR runtime) looks up #build/plugins → .nuxt/plugins.mjs which
      // doesn't exist. Add it as a thin re-export shim so the alias resolves.
      const already = app.templates.some((t: any) => t.filename === 'plugins.mjs')
      if (!already) {
        app.templates.push({
          filename: 'plugins.mjs',
          write: true,
          getContents: () => `export { default } from './plugins.server.mjs'\n`,
        } as any)
      }
    },
  },

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  modules: ['@pinia/nuxt', '@nuxtjs/i18n'],

  i18n: {
    restructureDir: false,
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'fr', name: 'Français', file: 'fr.json' },
    ],
    defaultLocale: 'en',
    langDir: 'assets/locales/',
    strategy: 'no_prefix',
    detectBrowserLanguage: { useCookie: true, cookieKey: 'teachme_locale' },
    bundle: { optimizeTranslationDirective: false },
  },

  nitro: {
    // Only inline pure-JS CJS packages with no native bindings, no class-extends-EventEmitter,
    // and no internal async salt generation (bcryptjs hash() breaks when inlined by esbuild).
    // Nitro's file tracer will copy non-inlined packages to .output/server/node_modules.
    externals: { inline: ['jsonwebtoken'] },
  },

  vite: {
    cacheDir: '.nuxt/vite-cache',
  },

  css: ['~/assets/scss/main.scss'],
  typescript: { strict: false },
})
