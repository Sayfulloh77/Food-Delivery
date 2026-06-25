<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="text-center">
      <p class="text-7xl font-bold" style="color:#ff5722">403</p>
      <h1 class="text-2xl font-bold text-gray-900 mt-3">Access Denied</h1>
      <p class="text-gray-400 mt-2">You don't have permission to view this page.</p>
      <RouterLink
        to="/restaurants"
        class="mt-6 inline-block px-6 py-3 rounded-xl text-white text-sm font-semibold"
        style="background:#ff5722"
      >
        Go Home
      </RouterLink>
    </div>
  </div>
</template>
