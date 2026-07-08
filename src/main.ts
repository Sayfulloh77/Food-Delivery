import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'
import { useAuthStore } from './stores/auth.js'
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// A refreshed page only has the JWT's own claims (user_id, role, permissions) —
// no name/email/phone — so reload the full profile whenever a session already exists.
const authStore = useAuthStore()
if (authStore.isLoggedIn) authStore.fetchMe()

app.mount('#app')
