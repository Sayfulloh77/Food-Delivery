<template>
  <template v-if="isAdminRoute">
    <AdminLayout>
      <RouterView />
    </AdminLayout>
  </template>
  <template v-else-if="isOwnerRoute">
    <OwnerLayout>
      <RouterView />
    </OwnerLayout>
  </template>
  <template v-else-if="isCourierRoute">
    <CourierLayout>
      <RouterView />
    </CourierLayout>
  </template>
  <template v-else-if="isAuthRoute">
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </template>
  <template v-else >
    <AppHeader />
    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
    <CartDrawer />
  </template>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/shared/AppHeader.vue'
import AppFooter from '@/components/shared/AppFooter.vue'
import CartDrawer from '@/components/shared/CartDrawer.vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import OwnerLayout from '@/components/owner/OwnerLayout.vue'
import CourierLayout from '@/components/courier/CourierLayout.vue'

const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
const isOwnerRoute = computed(() => route.path.startsWith('/owner'))
const isCourierRoute = computed(() => route.path.startsWith('/courier'))
const isAuthRoute = computed(() => route.path.startsWith('/auth'))
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
