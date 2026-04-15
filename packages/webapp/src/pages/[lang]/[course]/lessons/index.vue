<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCourseContext } from '~/composables/useCourseContext'
import { useLessonProgressStore } from '~/stores/lesson-progress.store'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t } = useI18n()
const { module, courseKey, language, paths, tKey } = useCourseContext()
const progressStore = useLessonProgressStore()

const course = computed(() => language.value!)
const lessons = computed(() => module.value?.lessons ?? [])

function goToLesson(lessonId: number) {
  navigateTo(paths.value.lesson(lessonId))
}
</script>

<template>
  <div class="ll page-container" :style="{ '--color-course': course?.color }">
    <Breadcrumb />

    <div class="ll__header">
      <h1>{{ t(tKey('lessons.title')) }}</h1>
      <p class="ll__desc">{{ t(tKey('lessons.desc')) }}</p>
    </div>

    <div class="ll__list">
      <LessonCard
        v-for="lesson in lessons"
        :key="lesson.id"
        :lesson="lesson"
        :progress="progressStore.getProgress(courseKey, lesson.id)"
        :unlocked="progressStore.isUnlocked(courseKey, lesson.id)"
        :locale-prefix="module!.config.localePrefix"
        @click="goToLesson(lesson.id)"
      />
    </div>

    <div class="ll__back">
      <NuxtLink :to="paths.root" class="btn btn--ghost">
        {{ t('common.back') }}
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.ll {
  max-width: 640px; margin: 0 auto;
  padding-top: var(--space-8); padding-bottom: var(--space-10);
  display: flex; flex-direction: column; gap: var(--space-6);
}

.ll__header { text-align: center; }
.ll__header h1 { font-size: var(--text-2xl); font-weight: 700; color: var(--color-text); }
.ll__desc { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: var(--space-2); }

.ll__list { display: flex; flex-direction: column; gap: var(--space-3); }

.ll__back { display: flex; justify-content: center; }
</style>
