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
      <button class="flex items-center gap-1.5 text-sm font-semibold text-orange-400 hover:text-orange-300 transition" @click="() => refetch()">
        <RefreshCw class="w-3.5 h-3.5" /> Refresh
      </button>
    </div>

    <!-- Claim error -->
    <div v-if="claimError" class="mb-4 px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between gap-3" style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.4);color:#f87171">
      <span>{{ claimError }}</span>
      <button class="shrink-0 hover:opacity-70" @click="claimError = ''">✕</button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="space-y-3 animate-pulse">
      <div v-for="n in 5" :key="n" class="h-20 rounded-2xl" style="background:#0d1b35" />
    </div>

    <!-- Error -->
    <div v-else-if="isError" class="text-center py-20">
      <p class="text-white font-bold">Failed to load orders — backend may be unavailable</p>
      <button class="mt-4 px-5 py-2 rounded-xl text-black text-sm font-bold" style="background:#f97316" @click="() => refetch()">Retry</button>
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

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { RefreshCw } from '@lucide/vue'
import { orderApi, type Order } from '@/api/order'
import { useAuthStore } from '@/stores/auth'
import { queryKeys } from '@/api/queryKeys'
import type { OrderStatus } from '@/constants/orderStatus'

const authStore = useAuthStore()
const queryClient = useQueryClient()

type Pool = 'available' | 'delivering'

const POOL_FETCHERS: Record<Pool, () => ReturnType<typeof orderApi.getAvailableForCourier>> = {
  available: () => orderApi.getAvailableForCourier(),
  delivering: () => orderApi.getDeliveringForCourier(),
}

const EMPTY_MESSAGES: Record<Pool, string> = {
  available: 'No unclaimed orders right now — check back soon.',
  delivering: 'No deliveries assigned to you right now.',
}

const pool = ref<Pool>('available')
const updating = ref<string | null>(null)
const claiming = ref<string | null>(null)
const claimError = ref('')

const emptyMessage = computed(() => EMPTY_MESSAGES[pool.value])

function switchPool(key: Pool) {
  pool.value = key
}

const { data, isLoading, isError, refetch } = useQuery<Order[]>({
  queryKey: computed(() => queryKeys.orders.courierPool(pool.value)),
  queryFn: () => POOL_FETCHERS[pool.value]().then(res => {
    // Every courier-scoped endpoint returns CourierResponse (keyed by orderId) — normalize to `id`.
    const list = (res.data ?? []).map((o: Order & { orderId: string }) => ({ ...o, id: o.orderId }))
    return list.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }),
})
const orders = computed(() => data.value ?? [])

const claimMutation = useMutation({
  mutationFn: (order: Order) => {
    const courierId = authStore.user?.id ?? authStore.user?.user_id
    if (!courierId) throw new Error('Missing courier id')
    return orderApi.assignCourier({
      // The JWT only carries `user_id`, never `id` — decodeToken() doesn't remap it.
      courierId,
      orderId: order.id,
      courierName: authStore.user?.name ?? '',
      phoneNumber: authStore.user?.phone_number ?? '',
    })
  },
  onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.orders.courierPool('available') }),
  onError: (err) => {
    const e = err as { response?: { data?: { message?: string } }; message?: string }
    claimError.value = e?.response?.data?.message || e?.message || 'Could not claim this order — it may have been taken already.'
    console.error('Failed to claim order:', err)
  },
  onSettled: () => { claiming.value = null },
})

function claim(order: Order) {
  claiming.value = order.id
  claimError.value = ''
  claimMutation.mutate(order)
}

const changeStatusMutation = useMutation({
  mutationFn: ({ order, status }: { order: Order; status: OrderStatus }) => orderApi.updateStatus(order.id, status),
  onSuccess: (_res, { status }) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.orders.courierPool('delivering') })
    if (status === 'DELIVERED') queryClient.invalidateQueries({ queryKey: queryKeys.orders.courierPool('available') })
  },
  onError: (err) => console.error('Failed to update order status:', err),
  onSettled: () => { updating.value = null },
})

function changeStatus(order: Order, status: OrderStatus) {
  updating.value = order.id
  changeStatusMutation.mutate({ order, status })
}

function isLink(str: string | undefined) {
  return !!str && /^https?:\/\//.test(str)
}

function formatPrice(val: number | string | undefined) {
  return Number(val || 0).toLocaleString() + ' UZS'
}

function formatDate(str: string | undefined) {
  if (!str) return ''
  return new Date(str).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function statusStyle(status: OrderStatus) {
  const map: Partial<Record<OrderStatus, string>> = {
    READY: 'background:rgba(168,85,247,0.15);color:#c084fc',
    DELIVERING: 'background:rgba(249,115,22,0.25);color:#f97316',
    DELIVERED: 'background:rgba(16,185,129,0.15);color:#34d399',
  }
  return map[status] ?? 'background:#1a2d4d;color:#94a3b8'
}
</script>
