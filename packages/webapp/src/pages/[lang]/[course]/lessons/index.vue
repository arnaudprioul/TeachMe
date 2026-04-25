<script setup lang="ts">
import { useCourseContext } from '~/composables/useCourseContext'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { paths } = useCourseContext()

// Redirect to level page — lesson list no longer exists as a standalone page
navigateTo(paths.value.root, { replace: true })
</script>

<template>
  <div></div>
</template>
