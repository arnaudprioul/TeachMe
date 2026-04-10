export default defineNuxtConfig({
  compatibilityDate: '2024-01-01',
  devtools: { enabled: true },
  srcDir: 'src/',
  devServer: { port: 5000 },

  runtimeConfig: {
    public: {
      appUrl: process.env.APP_URL ?? 'http://localhost:5001',
    },
  },

  // Nuxt 3.16 monorepo fix (same as app)
  hooks: {
    'app:templates'(app) {
      for (const t of app.templates) t.write = true
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

  modules: ['@nuxtjs/i18n'],

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

  vite: {
    cacheDir: '/tmp/vite-cache-frontend',
  },

  css: ['~/assets/scss/main.scss'],
  typescript: { strict: false },
})
