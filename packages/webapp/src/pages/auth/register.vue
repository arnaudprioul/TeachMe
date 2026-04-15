<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth.store'

definePageMeta({ layout: 'auth' })
const { t } = useI18n()
const auth = useAuthStore()

const identifier = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)

const isEmail = computed(() => identifier.value.includes('@'))
const inputType = computed(() => !identifier.value ? 'text' : isEmail.value ? 'email' : 'tel')
const identifierLabel = computed(() => !identifier.value ? t('auth.identifierLabel') : isEmail.value ? t('auth.email') : t('auth.phone'))

async function submit() {
  error.value = ''
  if (password.value !== confirmPassword.value) { error.value = t('auth.passwordsMismatch'); return }
  loading.value = true
  try { await auth.register(identifier.value, username.value, password.value); await navigateTo('/auth/verify') }
  catch (e: any) { error.value = e?.data?.statusMessage || e?.message || t('common.error') }
  finally { loading.value = false }
}
</script>

<template>
  <div class="af">
    <NuxtLink class="af__logo" to="/">
      <span class="af__mark">T</span>
      <span class="af__brand">TeachMe</span>
    </NuxtLink>

    <h1 class="af__title">{{ t('auth.createAccount') }}</h1>
    <p class="af__sub">{{ t('auth.registerSubtitle') }}</p>

    <form class="af__form" @submit.prevent="submit">
      <div class="field">
        <label class="field__label" for="identifier">{{ identifierLabel }}</label>
        <input id="identifier" v-model="identifier" :placeholder="t('auth.identifierPlaceholder')" :type="inputType" autocomplete="username" class="field__input" data-cy="input-identifier" required />
        <span v-if="identifier" class="field__hint">{{ isEmail ? t('auth.usingEmail') : t('auth.usingPhone') }}</span>
      </div>
      <div class="field">
        <label class="field__label" for="username">{{ t('auth.username') }}</label>
        <input id="username" v-model="username" :placeholder="t('auth.usernamePlaceholder')" class="field__input" data-cy="input-username" required type="text" />
      </div>
      <div class="field">
        <label class="field__label" for="password">{{ t('auth.password') }}</label>
        <input id="password" v-model="password" :placeholder="t('auth.passwordPlaceholder')" autocomplete="new-password" class="field__input" data-cy="input-password" minlength="8" required type="password" />
      </div>
      <div class="field">
        <label class="field__label" for="confirmPassword">{{ t('auth.confirmPassword') }}</label>
        <input id="confirmPassword" v-model="confirmPassword" :placeholder="t('auth.confirmPasswordPlaceholder')" autocomplete="new-password" class="field__input" data-cy="input-confirm-password" minlength="8" required type="password" />
      </div>
      <div v-if="error" class="alert alert--error">{{ error }}</div>
      <button :disabled="loading" class="btn btn--primary btn--full" data-cy="btn-submit" type="submit">
        {{ loading ? t('common.loading') : t('auth.register') }}
      </button>
    </form>

    <p class="af__footer">{{ t('auth.hasAccount') }} <NuxtLink class="af__link" to="/auth/login">{{ t('auth.login') }}</NuxtLink></p>
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
.field__hint { font-size: var(--text-xs); color: var(--color-text-subtle); margin-top: var(--space-1); display: block; }
</style>
