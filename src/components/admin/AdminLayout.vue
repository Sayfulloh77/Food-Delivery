<template>
  <div class="flex h-screen" style="background:#080f22">

    <!-- Sidebar -->
    <aside class="w-56 flex flex-col border-r shrink-0" style="background:#060d1c;border-color:#1a2d4d">

      <!-- Logo -->
      <div class="h-16 flex items-center gap-2 px-4 border-b shrink-0" style="border-color:#1a2d4d">
        <BrandLogo :size="28" :font-size="13" />
        <span class="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded" style="background:rgba(249,115,22,0.15);color:#f97316">ADMIN</span>
      </div>

      <!-- Nav -->
      <nav class="flex-1 p-2 space-y-0.5">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"   
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          :style="isActive(item.to)
            ? 'background:rgba(249,115,22,0.15);color:#f97316;border-left:3px solid #f97316'
            : 'color:#64748b;padding-left:calc(0.75rem + 3px)'"
          onmouseover="if(!this.style.borderLeft)this.style.color='#94a3b8'"
          onmouseout="if(!this.style.borderLeft)this.style.color='#64748b'"
        >
          <component :is="item.icon" class="w-4 h-4 shrink-0" />
          {{ item.label }}
        </RouterLink>
      </nav>

      <!-- User + Logout -->
      <div class="p-2 border-t shrink-0" style="border-color:#1a2d4d">
        <div class="flex items-center gap-2.5 px-3 py-2 rounded-xl mb-1" style="background:#0d1b35;border:1px solid #1a2d4d">
          <div class="w-7 h-7 rounded-full flex items-center justify-center text-black text-xs font-bold shrink-0" style="background:#f97316">
            {{ adminInitial }}
          </div>
          <div class="min-w-0">
            <p class="text-xs font-semibold text-white truncate">{{ adminName }}</p>
            <p class="text-[10px] text-slate-600 truncate">{{ adminRole }}</p>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut class="w-4 h-4" /> Log out
        </button>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <header class="h-16 border-b flex items-center px-6 shrink-0" style="background:#060d1c;border-color:#1a2d4d">
        <h1 class="text-base font-bold text-white">{{ currentPageTitle }}</h1>
      </header>
      <main class="flex-1 overflow-y-auto p-6" style="background:#080f22">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Users, ClipboardList, LogOut, UtensilsCrossed } from '@lucide/vue'
import { useAuthStore } from '@/stores/auth'
import BrandLogo from '@/components/shared/BrandLogo.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const navItems = [
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { to: '/admin/restaurants', label: 'Restaurants', icon: UtensilsCrossed },
]

const pageTitles: Record<string, string> = {
  '/admin/users': 'User Management',
  '/admin/orders': 'Orders',
  '/admin/restaurants': 'Restaurants',
}

const currentPageTitle = computed(() => pageTitles[route.path] ?? 'Admin Panel')
const isActive = (path: string) => route.path === path
const adminName = computed(() => authStore.user?.name ?? 'Admin')
const adminRole = computed(() => authStore.user?.role ?? 'ADMIN')
const adminInitial = computed(() => adminName.value.charAt(0).toUpperCase())

async function handleLogout() {
  await authStore.logout()
  router.push('/restaurants')
}
</script>
