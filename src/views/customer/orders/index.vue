<template>
  <div class="min-h-screen" style="background:#060d1c">
    <div class="max-w-3xl mx-auto px-4 py-10">

      <h1 class="text-2xl font-extrabold text-white mb-8">My Orders</h1>

      <!-- Loading -->
      <div v-if="loading" class="space-y-3 animate-pulse">
        <div v-for="n in 4" :key="n" class="h-28 rounded-2xl" style="background:#0d1b35" />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-20">
        <p class="text-white font-bold">Failed to load orders</p>
        <button class="mt-4 px-5 py-2 rounded-xl text-black text-sm font-bold" style="background:#f97316" @click="load">Retry</button>
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
              <span class="text-orange-400 font-semibold">{{ formatPrice(item.price * item.qty) }}</span>
            </div>
          </div>

          <!-- Total -->
          <div class="mt-4 pt-4 flex items-center justify-between" style="border-top:1px solid #1a2d4d">
            <span class="text-slate-500 text-sm">Total</span>
            <span class="text-orange-400 font-black text-lg">{{ formatPrice(order.totalPrice) }}</span>
          </div>

          <!-- Cancel button — only if CREATED -->
          <button
            v-if="order.status === 'CREATED'"
            class="mt-3 w-full py-2 rounded-xl text-sm font-semibold text-red-400 border transition hover:bg-red-950/30"
            style="border-color:#3f1010"
            @click.stop.prevent="cancelOrder(order.id)"
          >
            Cancel order
          </button>
        </RouterLink>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { orderApi } from '@/api/order'
import { orderStatusStyle } from '@/constants/orderStatus'

const orders = ref([])
const loading = ref(true)
const error = ref(false)

async function load() {
  loading.value = true
  error.value = false
  try {
    const res = await orderApi.getAll()
    orders.value = res.data ?? []
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

async function cancelOrder(id) {
  try {
    await orderApi.updateStatus(id, 'CANCELLED')
    const o = orders.value.find(o => o.id === id)
    if (o) o.status = 'CANCELLED'
  } catch {}
}

function formatPrice(val) {
  if (!val) return '0'
  return Number(val).toLocaleString() + ' UZS'
}

function formatDate(str) {
  if (!str) return ''
  return new Date(str).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

onMounted(load)
</script>
