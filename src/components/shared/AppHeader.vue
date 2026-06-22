<template>
  <header class="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 grid grid-cols-3 items-center">

      <!-- Logo (left) -->
      <RouterLink to="/" class="flex items-center gap-2">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center" style="background:#ff5722">
          <UtensilsCrossed class="w-5 h-5 text-white" />
        </div>
        <span class="font-bold text-xl tracking-tight text-gray-900">
          Food<span style="color:#ff5722">Express</span>
        </span>
      </RouterLink>

      <!-- Search (center) -->
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          v-model="search"
          type="text"
          placeholder="Search restaurants..."
          class="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-orange-400 focus:bg-white transition-all"
          @input="$emit('search', search)"
        />
      </div>

      <!-- Auth (right) -->
      <div class="flex items-center justify-end gap-3">

        <!-- Logged in -->
        <template v-if="authStore.isLoggedIn">
          <RouterLink to="/orders" class="text-gray-500 hover:text-gray-800 transition-colors">
            <ShoppingBag class="w-5 h-5" />
          </RouterLink>
          <div class="relative" ref="dropdownRef">
            <button
              @click="dropdownOpen = !dropdownOpen"
              class="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div class="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style="background:#ff5722">
                {{ userInitial }}
              </div>
              <span class="text-sm font-medium text-gray-700">{{ userName }}</span>
              <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
            </button>

            <!-- Dropdown -->
            <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
              <RouterLink to="/orders" @click="dropdownOpen = false" class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <ClipboardList class="w-4 h-4 text-gray-400" /> My orders
              </RouterLink>
              <RouterLink to="/notifications" @click="dropdownOpen = false" class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Bell class="w-4 h-4 text-gray-400" /> Notifications
              </RouterLink>
              <hr class="my-1 border-gray-100" />
              <button @click="handleLogout" class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                <LogOut class="w-4 h-4" /> Log out
              </button>
            </div>
          </div>
        </template>

        <!-- Logged out -->
        <RouterLink
          v-else
          to="/auth"
          class="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 active:scale-95 transition-all"
        >
          Log in
        </RouterLink>

      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, UtensilsCrossed, ShoppingBag, ChevronDown, LogOut, ClipboardList, Bell } from '@lucide/vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const search = ref('')
const dropdownOpen = ref(false)
const dropdownRef = ref(null)

defineEmits(['search'])

const userName = computed(() => authStore.user?.name ?? authStore.user?.role ?? 'Account')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

function handleLogout() {
  authStore.logout()
  dropdownOpen.value = false
  router.push('/auth')
}

function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    dropdownOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>
