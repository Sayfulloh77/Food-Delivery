<template>
  <div class="min-h-screen" style="background:#060d1c">
    <div class="max-w-3xl mx-auto px-4 py-10">

      <h1 class="text-2xl font-extrabold text-white mb-8">My Orders</h1>

      <!-- Loading -->
      <div v-if="isLoading" class="space-y-3 animate-pulse">
        <div v-for="n in 4" :key="n" class="h-28 rounded-2xl" style="background:#0d1b35" />
      </div>

      <!-- Error -->
      <div v-else-if="isError" class="text-center py-20">
        <p class="text-white font-bold">Failed to load orders</p>
        <button class="mt-4 px-5 py-2 rounded-xl text-black text-sm font-bold" style="background:#f97316" @click="() => refetch()">Retry</button>
      </div>

      <!-- Empty -->
      <div v-else-if="orders.length === 0" class="text-center py-24">
        <div class="text-6xl mb-4">📦</div>
        <p class="text-white font-bold text-lg">No orders yet</p>
        <p class="text-slate-500 text-sm mt-1">Your order history will appear here</p>
        <RouterLink to="/" class="mt-6 inline-block px-6 py-2.5 rounded-xl text-black font-bold text-sm" style="background:#f97316">
          Browse restaurants
        </RouterLink>
      </div>

      <!-- Order cards -->
      <div v-else class="space-y-4">
        <RouterLink
          v-for="order in orders"
          :key="order.id"
          :to="`/orders/${order.id}`"
          class="block rounded-2xl border p-5 transition-all hover:border-orange-500/40"
          style="background:#0d1b35;border-color:#1a2d4d"
        >
          <!-- Header row -->
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-white font-bold text-sm">Order #{{ order.id.slice(0,8).toUpperCase() }}</p>
              <p class="text-slate-500 text-xs mt-0.5">{{ formatDate(order.createdAt) }}</p>
            </div>
            <span class="text-xs font-bold px-3 py-1 rounded-full shrink-0" :style="orderStatusStyle(order.status)">
              {{ order.status }}
            </span>
          </div>

          <!-- Items -->
          <div class="mt-4 space-y-2">
            <div v-for="item in order.items" :key="item.id" class="flex items-center justify-between text-sm">
              <span class="text-slate-300">{{ item.name }} <span class="text-slate-600">× {{ item.qty }}</span></span>
              <span class="text-orange-400 font-semibold">{{ formatPrice(Number(item.price) * item.qty) }}</span>
            </div>
          </div>

          <!-- Total -->
          <div class="mt-4 pt-4 flex items-center justify-between" style="border-top:1px solid #1a2d4d">
            <span class="text-slate-500 text-sm">Total</span>
            <span class="text-orange-400 font-black text-lg">{{ formatPrice(order.totalPrice) }}</span>
          </div>
        </RouterLink>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { RouterLink } from 'vue-router'
import { orderApi } from '@/api/order'
import { queryKeys } from '@/api/queryKeys'
import { orderStatusStyle } from '@/constants/orderStatus'

const { data, isLoading, isError, refetch } = useQuery({
  queryKey: queryKeys.orders.all,
  queryFn: () => orderApi.getAll().then(res => res.data ?? []),
})

const orders = computed(() => data.value ?? [])

function formatPrice(val: number | string | undefined) {
  if (!val) return '0'
  return Number(val).toLocaleString() + ' UZS'
}

function formatDate(str: string | undefined) {
  if (!str) return ''
  return new Date(str).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>
