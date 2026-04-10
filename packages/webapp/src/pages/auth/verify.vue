<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth.store'
definePageMeta({ layout: 'auth' })
const { t } = useI18n()
const auth = useAuthStore()

const digits = ref(['', '', '', '', '', ''])
const error = ref('')
const loading = ref(false)
const resendLoading = ref(false)
const resendSuccess = ref(false)
const resendCooldown = ref(0)

const code = computed(() => digits.value.join(''))
const isComplete = computed(() => code.value.length === 6 && /^\d{6}$/.test(code.value))

onMounted(() => {
  auth.restoreFromStorage()
  if (!auth.pendingIdentifier) navigateTo('/auth/register')
  startCooldown()
})

function startCooldown(seconds = 60) {
  resendCooldown.value = seconds
  const interval = setInterval(() => { resendCooldown.value--; if (resendCooldown.value <= 0) clearInterval(interval) }, 1000)
}

function onDigitInput(index: number, e: Event) {
  const input = e.target as HTMLInputElement
  const val = input.value.replace(/\D/g, '').slice(-1)
  digits.value[index] = val
  if (val && index < 5) document.getElementById(`otp-${index + 1}`)?.focus()
}

function onKeydown(index: number, e: KeyboardEvent) {
  if (e.key === 'Backspace' && !digits.value[index] && index > 0) document.getElementById(`otp-${index - 1}`)?.focus()
}

function onPaste(e: ClipboardEvent) {
  e.preventDefault()
  const text = e.clipboardData?.getData('text')?.replace(/\D/g, '').slice(0, 6) ?? ''
  text.split('').forEach((c, i) => { digits.value[i] = c })
  document.getElementById(`otp-${Math.min(text.length, 5)}`)?.focus()
}

async function submit() {
  if (!isComplete.value) return; error.value = ''; loading.value = true
  try { await auth.verifyOtp(code.value); await navigateTo('/dashboard') }
  catch (e: any) { error.value = e?.data?.statusMessage || t('common.error'); digits.value = ['', '', '', '', '', '']; document.getElementById('otp-0')?.focus() }
  finally { loading.value = false }
}

async function resend() {
  if (resendCooldown.value > 0) return; resendLoading.value = true; resendSuccess.value = false; error.value = ''
  try { await auth.resendOtp(); resendSuccess.value = true; startCooldown() }
  catch (e: any) { error.value = e?.data?.statusMessage || t('common.error') }
  finally { resendLoading.value = false }
}
</script>

<template>
  <div class="af">
    <NuxtLink to="/" class="af__logo">
      <span class="af__mark">T</span>
      <span class="af__brand">TeachMe</span>
    </NuxtLink>

    <div class="af__icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 7 10-7" />
      </svg>
    </div>

    <h1 class="af__title">{{ t('auth.verifyTitle') }}</h1>
    <p class="af__sub">{{ auth.pendingChannel === 'sms' ? t('auth.verifySub_sms', { masked: auth.pendingMasked }) : t('auth.verifySub_email', { masked: auth.pendingMasked }) }}</p>

    <form class="af__form" @submit.prevent="submit">
      <div class="otp-row">
        <input v-for="(_, i) in digits" :id="`otp-${i}`" :key="i" v-model="digits[i]" class="otp-cell" type="text" inputmode="numeric" maxlength="1" pattern="\d" autocomplete="one-time-code" :data-cy="`otp-${i}`" :aria-label="`Digit ${i + 1}`" @input="onDigitInput(i, $event)" @keydown="onKeydown(i, $event)" @paste="onPaste" />
      </div>
      <div v-if="error" class="alert alert--error">{{ error }}</div>
      <div v-if="resendSuccess" class="alert alert--success">{{ t('auth.otpResent') }}</div>
      <button class="btn btn--primary btn--full" type="submit" :disabled="loading || !isComplete" data-cy="btn-verify">{{ loading ? t('common.loading') : t('auth.verify') }}</button>
    </form>

    <div class="af__resend">
      <span>{{ t('auth.noCode') }}</span>
      <button class="af__resend-btn" type="button" :disabled="resendCooldown > 0 || resendLoading" data-cy="btn-resend" @click="resend">
        {{ resendCooldown > 0 ? t('auth.resendIn', { s: resendCooldown }) : t('auth.resend') }}
      </button>
    </div>

    <NuxtLink to="/auth/register" class="af__link af__link--secondary">{{ t('auth.changeIdentifier') }}</NuxtLink>
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
.af__icon {
  width: 48px; height: 48px; border-radius: var(--radius-full);
  background: var(--color-primary-subtle); color: var(--color-primary);
  display: flex; align-items: center; justify-content: center;
}
.af__title { font-size: var(--text-xl); font-weight: 600; color: var(--color-text); }
.af__sub { font-size: var(--text-sm); color: var(--color-text-muted); max-width: 300px; line-height: 1.5; margin-top: calc(-1 * var(--space-3)); }
.af__form { display: flex; flex-direction: column; gap: var(--space-4); width: 100%; }

.otp-row { display: flex; gap: var(--space-2); justify-content: center; }
.otp-cell {
  width: 44px; height: 48px; text-align: center; font-size: var(--text-lg); font-weight: 600;
  color: var(--color-text); background: var(--color-bg-surface);
  border: 1px solid var(--color-border-strong); border-radius: var(--radius-lg);
  outline: none; caret-color: var(--color-primary); transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.otp-cell:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-ring); }

.af__resend { display: flex; align-items: center; gap: var(--space-2); font-size: var(--text-sm); color: var(--color-text-muted); }
.af__resend-btn { background: none; border: none; cursor: pointer; padding: 0; color: var(--color-primary); font-weight: 500; font-size: var(--text-sm); }
.af__resend-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.af__resend-btn:not(:disabled):hover { text-decoration: underline; }

.af__link { color: var(--color-primary); font-weight: 500; text-decoration: none; font-size: var(--text-sm); }
.af__link:hover { text-decoration: underline; }
.af__link--secondary { color: var(--color-text-subtle); }
</style>
