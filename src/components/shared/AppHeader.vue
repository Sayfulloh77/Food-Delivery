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
      <div class="flex items-center justify-end">
        <RouterLink
          to="/login"
          class="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Log in
        </RouterLink>
      </div>

    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { Search, UtensilsCrossed } from '@lucide/vue'

const search = ref('')

defineEmits(['search'])

</script>
