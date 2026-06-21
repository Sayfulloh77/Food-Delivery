<template>
  <AppHeader />
  <main class="flex-1">
    <RouterView />
  </main>
  <AppFooter />
</template>

<script setup>
import AppHeader from '@/components/shared/AppHeader.vue'
import AppFooter from '@/components/shared/AppFooter.vue'
</script>
