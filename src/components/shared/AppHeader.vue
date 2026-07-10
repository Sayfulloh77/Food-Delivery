<template>
  <header class="sticky top-0 z-30 border-b backdrop-blur-md" style="background:rgba(6,13,28,0.9);border-color:#1a2d4d">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">

      <!-- Logo -->
      <BrandLogo :size="34" :font-size="17" />

      <!-- Search -->
      <div class="flex-1 relative max-w-xl mx-auto">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          v-model="search"
          type="text"
          placeholder="Search for a dish or restaurant, press Enter…"
          class="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all"
          style="background:#0d1b35;border:1px solid #1a2d4d"
          onfocus="this.style.borderColor='#f97316'"
          onblur="this.style.borderColor='#1a2d4d'"
          @keyup.enter="submitSearch"
        />
      </div>

      <!-- Right side -->
      <div class="flex items-center gap-2 shrink-0">
        <template v-if="authStore.isLoggedIn">
          <!-- Cart button -->
          <button
            @click="cartStore.openDrawer()"
            class="relative p-2 rounded-xl transition-colors hover:bg-white/5"
          >
            <ShoppingCart class="w-5 h-5 text-slate-300" />
            <span
              v-if="cartStore.totalItems > 0"
              class="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
              style="background:#f97316"
            >
              {{ cartStore.totalItems > 9 ? '9+' : cartStore.totalItems }}
            </span>
          </button>

          <!-- User dropdown -->
          <div class="relative" ref="dropdownRef">
            <button
              @click="dropdownOpen = !dropdownOpen"
              class="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-colors hover:bg-white/5"
            >
              <div class="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style="background:#f97316">
                {{ userInitial }}
              </div>
              <span class="text-sm font-medium text-slate-300 hidden sm:block">{{ userName }}</span>
              <ChevronDown class="w-3.5 h-3.5 text-slate-500" />
            </button>

            <div
              v-if="dropdownOpen"
              class="absolute right-0 mt-2 w-48 rounded-2xl shadow-2xl py-1 border overflow-hidden"
              style="background:#0d1b35;border-color:#1a2d4d;box-shadow:0 20px 60px rgba(0,0,0,0.5)"
            >
              <RouterLink to="/orders" @click="dropdownOpen = false" class="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 transition-colors">
                <ClipboardList class="w-4 h-4 text-orange-400" /> My orders
              </RouterLink>
              <RouterLink to="/notifications" @click="dropdownOpen = false" class="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 transition-colors">
                <Bell class="w-4 h-4 text-blue-400" /> Notifications
              </RouterLink>
              <div class="my-1 border-t" style="border-color:#1a2d4d" />
              <button @click="handleLogout" class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                <LogOut class="w-4 h-4" /> Log out
              </button>
            </div>
          </div>
        </template>

        <RouterLink
          v-else
          to="/auth"
          class="px-4 py-2 rounded-xl text-sm font-bold text-black transition-all hover:opacity-90"
          style="background:#f97316"
        >
          Log in
        </RouterLink>
      </div>

    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search, ShoppingCart, ChevronDown, LogOut, ClipboardList, Bell } from '@lucide/vue'
import BrandLogo from '@/components/shared/BrandLogo.vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const cartStore = useCartStore()
const search = ref(typeof route.query.q === 'string' ? route.query.q : '')
const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const userName = computed(() => authStore.user?.name ?? authStore.user?.role ?? 'Account')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

// Keep the box in sync if the user navigates back to an empty/different search.
watch(() => route.query.q, (q) => { search.value = typeof q === 'string' ? q : '' })

function submitSearch() {
  const q = search.value.trim()
  if (!q) return
  router.push({ path: '/restaurants', query: { q } })
}

function handleLogout() {
  authStore.logout()
  dropdownOpen.value = false
  router.push('/restaurants')
}

function handleClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) dropdownOpen.value = false
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>
