<script setup lang="ts">
import { useCourseAudio } from '~/composables/useCourseAudio'

const props = defineProps<{ text: string }>()
const { speak, isSpeaking, isSupported } = useCourseAudio()
</script>

<template>
  <button
    v-if="isSupported"
    class="audio-btn"
    :class="{ 'audio-btn--active': isSpeaking }"
    :aria-label="`Play pronunciation: ${props.text}`"
    @click="speak(props.text)"
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path v-if="!isSpeaking" d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path v-if="!isSpeaking" d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <line v-if="isSpeaking" x1="23" y1="9" x2="17" y2="15" />
      <line v-if="isSpeaking" x1="17" y1="9" x2="23" y2="15" />
    </svg>
  </button>
</template>

<style scoped>
.audio-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: var(--color-bg-surface);
  color: var(--color-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.audio-btn:hover {
  background: var(--color-primary-subtle);
  border-color: var(--color-primary);
}

.audio-btn--active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}
</style>
