<template>
  <div>
    <!-- Pool switch -->
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div class="flex gap-1 p-1 rounded-xl" style="background:#060d1c">
        <button
          v-for="t in [{ key: 'available', label: 'Available' }, { key: 'delivering', label: 'My Deliveries' }]"
          :key="t.key"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          :style="pool === t.key ? 'background:#f97316;color:#000' : 'color:#64748b'"
          @click="switchPool(t.key)"
        >
          {{ t.label }}
        </button>
      </div>
      <button class="flex items-center gap-1.5 text-sm font-semibold text-orange-400 hover:text-orange-300 transition" @click="load">
        <RefreshCw class="w-3.5 h-3.5" /> Refresh
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-3 animate-pulse">
      <div v-for="n in 5" :key="n" class="h-20 rounded-2xl" style="background:#0d1b35" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-20">
      <p class="text-white font-bold">Failed to load orders — backend may be unavailable</p>
      <button class="mt-4 px-5 py-2 rounded-xl text-black text-sm font-bold" style="background:#f97316" @click="load">Retry</button>
    </div>

    <!-- Empty -->
    <div v-else-if="orders.length === 0" class="text-center py-20 text-slate-600">
      {{ emptyMessage }}
    </div>

    <!-- Cards -->
    <div v-else class="space-y-3">
      <div
        v-for="order in orders"
        :key="order.id"
        class="rounded-2xl border p-5"
        style="background:#0d1b35;border-color:#1a2d4d"
      >
        <div class="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p class="font-mono text-xs text-slate-500">#{{ order.id.slice(0,8).toUpperCase() }}</p>
            <p class="text-white text-sm mt-1">
              <span v-for="(item, i) in order.items" :key="item.id">
                {{ item.name }} x{{ item.qty }}<span v-if="i < order.items.length - 1">, </span>
              </span>
            </p>
            <p class="text-slate-600 text-xs mt-1">{{ order.restaurantName }}<span v-if="order.createdAt"> - {{ formatDate(order.createdAt) }}</span></p>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold px-2.5 py-1 rounded-full" :style="statusStyle(order.status)">{{ order.status }}</span>
            <span class="font-bold text-orange-400 text-sm">{{ formatPrice(order.totalPrice) }}</span>
          </div>
        </div>

        <div class="mt-3 pt-3 space-y-1" style="border-top:1px solid #1a2d4d">
          <p v-if="order.restaurantAddress" class="text-xs text-slate-500">
            <span class="text-slate-600">Pickup:</span>
            <a v-if="isLink(order.restaurantAddress)" :href="order.restaurantAddress" target="_blank" rel="noopener" class="text-orange-400 hover:underline">Open map</a>
            <span v-else>{{ order.restaurantAddress }}</span>
          </p>
          <p v-if="order.deliveryAddress" class="text-xs text-slate-500">
            <span class="text-slate-600">Deliver to:</span>
            <a v-if="isLink(order.deliveryAddress)" :href="order.deliveryAddress" target="_blank" rel="noopener" class="text-orange-400 hover:underline">Open map</a>
            <span v-else>{{ order.deliveryAddress }}</span>
          </p>
        </div>

        <div class="mt-4 flex justify-end">
          <button
            v-if="pool === 'available'"
            class="text-xs px-4 py-2 rounded-lg font-bold text-black transition hover:opacity-85 disabled:opacity-40"
            style="background:#f97316"
            :disabled="claiming === order.id"
            @click="claim(order)"
          >
            {{ claiming === order.id ? 'Claiming...' : 'Claim delivery' }}
          </button>
          <button
            v-else-if="order.status === 'READY'"
            class="text-xs px-4 py-2 rounded-lg font-bold text-black transition hover:opacity-85 disabled:opacity-40"
            style="background:#f97316"
            :disabled="updating === order.id"
            @click="changeStatus(order, 'DELIVERING')"
          >
            {{ updating === order.id ? 'Updating...' : 'Start delivering' }}
          </button>
          <button
            v-else-if="order.status === 'DELIVERING'"
            class="text-xs px-4 py-2 rounded-lg font-bold text-black transition hover:opacity-85 disabled:opacity-40"
            style="background:#22c55e"
            :disabled="updating === order.id"
            @click="changeStatus(order, 'DELIVERED')"
          >
            {{ updating === order.id ? 'Updating...' : 'Mark delivered' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RefreshCw } from '@lucide/vue'
import { orderApi } from '@/api/order'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const POOL_FETCHERS = {
  available: () => orderApi.getAvailableForCourier(),
  delivering: () => orderApi.getDeliveringForCourier(),
}

const EMPTY_MESSAGES = {
  available: 'No unclaimed orders right now — check back soon.',
  delivering: 'No deliveries assigned to you right now.',
}

const pool = ref('available')
const orders = ref([])
const loading = ref(true)
const error = ref(false)
const updating = ref(null)
const claiming = ref(null)

const emptyMessage = computed(() => EMPTY_MESSAGES[pool.value])

function switchPool(key) {
  pool.value = key
  load()
}

async function load() {
  loading.value = true
  error.value = false
  try {
    const res = await POOL_FETCHERS[pool.value]()
    // Every courier-scoped endpoint returns CourierResponse (keyed by orderId) — normalize to `id`.
    const list = (res.data ?? []).map(o => ({ ...o, id: o.orderId }))
    orders.value = list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

async function claim(order) {
  claiming.value = order.id
  try {
    await orderApi.assignCourier({
      courierId: authStore.user?.id,
      orderId: order.id,
      courierName: authStore.user?.name ?? '',
      phoneNumber: authStore.user?.phone_number ?? '',
    })
    orders.value = orders.value.filter(o => o.id !== order.id)
  } catch (err) {
    error.value = true
    console.error('Failed to claim order:', err)
  } finally { claiming.value = null }
}

async function changeStatus(order, status) {
  updating.value = order.id
  try {
    const res = await orderApi.updateStatus(order.id, status)
    order.status = res.data.status ?? status
    if (status === 'DELIVERED') orders.value = orders.value.filter(o => o.id !== order.id)
  } catch (err) {
    console.error('Failed to update order status:', err)
  } finally { updating.value = null }
}

function isLink(str) {
  return /^https?:\/\//.test(str)
}

function formatPrice(val) {
  return Number(val || 0).toLocaleString() + ' UZS'
}

function formatDate(str) {
  if (!str) return ''
  return new Date(str).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function statusStyle(status) {
  const map = {
    READY: 'background:rgba(168,85,247,0.15);color:#c084fc',
    DELIVERING: 'background:rgba(249,115,22,0.25);color:#f97316',
    DELIVERED: 'background:rgba(16,185,129,0.15);color:#34d399',
  }
  return map[status] ?? 'background:#1a2d4d;color:#94a3b8'
}

load()
</script>
