<template>
  <template v-if="isAdminRoute">
    <AdminLayout>
      <RouterView />
    </AdminLayout>
  </template>
  <template v-else-if="isAuthRoute">
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </template>
  <template v-else>
    <AppHeader @search="onSearch" />
    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :search="searchQuery" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
    <CartDrawer />
  </template>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/shared/AppHeader.vue'
import AppFooter from '@/components/shared/AppFooter.vue'
import CartDrawer from '@/components/shared/CartDrawer.vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'

const route = useRoute()
const searchQuery = ref('')
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
const isAuthRoute = computed(() => route.path.startsWith('/auth'))

function onSearch(q) { searchQuery.value = q }
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
