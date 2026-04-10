<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'
const auth = useAuthStore()
auth.restoreFromStorage()
await navigateTo(auth.isAuthenticated ? '/dashboard' : '/auth/login', { replace: true })
</script>
