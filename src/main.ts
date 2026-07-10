import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import App from './App.vue'
import router from './router/index.js'
import { useAuthStore } from './stores/auth.js'
import './style.css'

const app = createApp(App)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Backend data here changes from other users' actions (new orders, status
      // updates), so keep results fresh rather than trusting a long stale time.
      staleTime: 15_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin, { queryClient })

// A refreshed page only has the JWT's own claims (user_id, role, permissions) —
// no name/email/phone — so reload the full profile whenever a session already exists.
const authStore = useAuthStore()
if (authStore.isLoggedIn) authStore.fetchMe()

app.mount('#app')
