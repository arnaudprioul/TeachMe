import { ref } from 'vue'

export interface IToast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

const toasts = ref<IToast[]>([])
let nextId = 0

export function useToast() {
  function show(message: string, type: IToast['type'] = 'info', duration = 3000) {
    const id = ++nextId
    toasts.value = [...toasts.value, { id, message, type }]
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, duration)
  }

  function success(message: string, duration?: number) { show(message, 'success', duration) }
  function error(message: string, duration?: number) { show(message, 'error', duration) }
  function info(message: string, duration?: number) { show(message, 'info', duration) }

  return { toasts, show, success, error, info }
}
