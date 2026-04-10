<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth.store'
definePageMeta({ layout: 'auth' })
const { t } = useI18n()
const auth = useAuthStore()
const identifier = ref(''); const password = ref(''); const error = ref(''); const loading = ref(false)

async function submit() {
  error.value = ''; loading.value = true
  try { await auth.login(identifier.value, password.value); await navigateTo('/dashboard') }
  catch (e: any) { error.value = e?.data?.statusMessage || t('auth.invalidCredentials') }
  finally { loading.value = false }
}
</script>

<template>
  <div class="af">
    <NuxtLink to="/" class="af__logo">
      <span class="af__mark">T</span>
      <span class="af__brand">TeachMe</span>
    </NuxtLink>

    <h1 class="af__title">{{ t('auth.welcomeBack') }}</h1>
    <p class="af__sub">{{ t('auth.loginSubtitle') }}</p>

    <form class="af__form" @submit.prevent="submit">
      <div class="field">
        <label class="field__label" for="identifier">{{ t('auth.identifierLabel') }}</label>
        <input id="identifier" v-model="identifier" class="field__input" type="text" autocomplete="username" :placeholder="t('auth.identifierPlaceholder')" required data-cy="input-identifier" />
      </div>
      <div class="field">
        <label class="field__label" for="password">{{ t('auth.password') }}</label>
        <input id="password" v-model="password" class="field__input" type="password" autocomplete="current-password" :placeholder="t('auth.passwordPlaceholder')" required data-cy="input-password" />
      </div>
      <div v-if="error" class="alert alert--error">{{ error }}</div>
      <button class="btn btn--primary btn--full" type="submit" :disabled="loading" data-cy="btn-submit">
        {{ loading ? t('common.loading') : t('auth.login') }}
      </button>
    </form>

    <p class="af__footer">{{ t('auth.noAccount') }} <NuxtLink to="/auth/register" class="af__link">{{ t('auth.register') }}</NuxtLink></p>
  </div>
</template>

<style scoped>
.af { display: flex; flex-direction: column; gap: var(--space-5); align-items: center; text-align: center; }
.af__logo { display: flex; align-items: center; gap: var(--space-2); text-decoration: none; }
.af__mark {
  width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
  background: var(--color-primary); color: #fff; font-weight: 600; font-size: var(--text-xs); border-radius: var(--radius-md);
}
.af__brand { font-size: var(--text-sm); font-weight: 600; color: var(--color-text); letter-spacing: -0.02em; }
.af__title { font-size: var(--text-xl); font-weight: 600; color: var(--color-text); }
.af__sub { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: calc(-1 * var(--space-3)); }
.af__form { display: flex; flex-direction: column; gap: var(--space-4); width: 100%; text-align: left; }
.af__footer { font-size: var(--text-sm); color: var(--color-text-muted); }
.af__link { color: var(--color-primary); font-weight: 500; text-decoration: none; }
.af__link:hover { text-decoration: underline; }
</style>
