import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const TOKEN_KEY = 'teachme_token'
const USER_KEY = 'teachme_user'
const PENDING_KEY = 'teachme_pending_otp'

interface IAuthUser { id: string; email: string | null; username: string }

function readStoredUser(): IAuthUser | null {
  if (typeof localStorage === 'undefined') return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try { return JSON.parse(raw) as IAuthUser }
  catch { localStorage.removeItem(USER_KEY); return null }
}

function readStoredToken(): string | null {
  if (typeof localStorage === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

interface IPendingOtp {
  identifier: string
  channel: 'email' | 'sms'
  masked: string
}

function readStoredPending(): IPendingOtp | null {
  if (typeof localStorage === 'undefined') return null
  const raw = localStorage.getItem(PENDING_KEY)
  if (!raw) return null
  try { return JSON.parse(raw) as IPendingOtp }
  catch { localStorage.removeItem(PENDING_KEY); return null }
}

export const useAuthStore = defineStore('auth', () => {
  // Hydrate from localStorage at the very moment the store is instantiated.
  // This guarantees the *first* call to useAuthStore() — wherever it comes
  // from (route middleware, plugin, component) — already sees the persisted
  // session, with no plugin-ordering gymnastics required.
  const user = ref<IAuthUser | null>(readStoredUser())
  const token = ref<string | null>(readStoredToken())
  const isAuthenticated = computed(() => !!token.value)

  // OTP flow state (also persisted across reloads)
  const _pending = readStoredPending()
  const pendingIdentifier = ref<string | null>(_pending?.identifier ?? null)
  const pendingChannel = ref<'email' | 'sms' | null>(_pending?.channel ?? null)
  const pendingMasked = ref<string | null>(_pending?.masked ?? null)

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

  function _setAuth(data: { user: IAuthUser | null; token: string }) {
    user.value = data.user
    token.value = data.token
    if (import.meta.client) {
      localStorage.setItem(TOKEN_KEY, data.token)
      if (data.user) localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    }
  }

  function logout() {
    user.value = null
    token.value = null
    pendingIdentifier.value = null
    pendingChannel.value = null
    pendingMasked.value = null
    if (import.meta.client) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(PENDING_KEY)
    }
  }

  return {
    user, token, isAuthenticated,
    pendingIdentifier, pendingChannel, pendingMasked,
    login, register, verifyOtp, resendOtp, logout,
  }
})
