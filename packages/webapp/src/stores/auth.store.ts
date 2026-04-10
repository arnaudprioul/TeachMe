import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const TOKEN_KEY = 'teachme_token'
const PENDING_KEY = 'teachme_pending_otp'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<{ id: string; email: string | null; username: string } | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = computed(() => !!token.value)

  // OTP flow state
  const pendingIdentifier = ref<string | null>(null)
  const pendingChannel = ref<'email' | 'sms' | null>(null)
  const pendingMasked = ref<string | null>(null)

  async function login(identifier: string, password: string) {
    const res = await $fetch<{ data: { user: typeof user.value; token: string } }>('/api/v1/auth/login', {
      method: 'POST', body: { identifier, password },
    })
    _setAuth(res.data)
  }

  async function register(identifier: string, username: string, password: string) {
    const res = await $fetch<{ data: { channel: 'email' | 'sms'; masked: string } }>('/api/v1/auth/register', {
      method: 'POST', body: { identifier, username, password },
    })
    pendingIdentifier.value = identifier
    pendingChannel.value = res.data.channel
    pendingMasked.value = res.data.masked
    if (import.meta.client) {
      localStorage.setItem(PENDING_KEY, JSON.stringify({ identifier, channel: res.data.channel, masked: res.data.masked }))
    }
  }

  async function verifyOtp(code: string) {
    if (!pendingIdentifier.value) throw new Error('No pending registration')
    const res = await $fetch<{ data: { user: typeof user.value; token: string } }>('/api/v1/auth/verify', {
      method: 'POST', body: { identifier: pendingIdentifier.value, code },
    })
    pendingIdentifier.value = null
    pendingChannel.value = null
    pendingMasked.value = null
    if (import.meta.client) localStorage.removeItem(PENDING_KEY)
    _setAuth(res.data)
  }

  async function resendOtp() {
    if (!pendingIdentifier.value) throw new Error('No pending registration')
    await $fetch('/api/v1/auth/resend', {
      method: 'POST', body: { identifier: pendingIdentifier.value },
    })
  }

  function _setAuth(data: { user: typeof user.value; token: string }) {
    user.value = data.user
    token.value = data.token
    if (import.meta.client) localStorage.setItem(TOKEN_KEY, data.token)
  }

  function logout() {
    user.value = null
    token.value = null
    pendingIdentifier.value = null
    pendingChannel.value = null
    pendingMasked.value = null
    if (import.meta.client) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(PENDING_KEY)
    }
  }

  function restoreFromStorage() {
    if (import.meta.client) {
      const stored = localStorage.getItem(TOKEN_KEY)
      if (stored) token.value = stored
      const pending = localStorage.getItem(PENDING_KEY)
      if (pending) {
        try {
          const p = JSON.parse(pending)
          pendingIdentifier.value = p.identifier
          pendingChannel.value = p.channel
          pendingMasked.value = p.masked
        } catch { localStorage.removeItem(PENDING_KEY) }
      }
    }
  }

  return {
    user, token, isAuthenticated,
    pendingIdentifier, pendingChannel, pendingMasked,
    login, register, verifyOtp, resendOtp, logout, restoreFromStorage,
  }
})
