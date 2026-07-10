  <template>
  <div>
    <!-- Header row -->
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div class="flex items-center gap-3 flex-wrap">
        <button
          v-for="s in ['ALL', ...STATUSES]"
          :key="s"
          class="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all"
          :style="filterStatus === s
            ? 'background:rgba(249,115,22,0.15);border-color:#f97316;color:#f97316'
            : 'background:#060d1c;border-color:#1a2d4d;color:#64748b'"
          @click="filterStatus = s"
        >
          {{ s }}
        </button>
      </div>
      <button class="flex items-center gap-1.5 text-sm font-semibold text-orange-400 hover:text-orange-300 transition" @click="() => refetch()">
        <RefreshCw class="w-3.5 h-3.5" /> Refresh
      </button>
    </div>

    <!-- No restaurant yet -->
    <div v-if="!isLoading && !restaurantId" class="text-center py-20 text-slate-600">
      No restaurant found for your account yet — add one under Restaurants &amp; Menu first.
    </div>

    <!-- Loading -->
    <div v-else-if="isLoading" class="space-y-3 animate-pulse">
      <div v-for="n in 5" :key="n" class="h-20 rounded-2xl" style="background:#0d1b35" />
    </div>

    <!-- Error -->
    <div v-else-if="isError" class="text-center py-20">
      <p class="text-white font-bold">Failed to load orders — backend may be unavailable</p>
      <button class="mt-4 px-5 py-2 rounded-xl text-black text-sm font-bold" style="background:#f97316" @click="() => refetch()">Retry</button>
    </div>

    <!-- Empty -->
    <div v-else-if="filtered.length === 0" class="text-center py-20 text-slate-600">
      No orders found for this status.
    </div>

    <!-- Table -->
    <div v-else class="rounded-2xl border overflow-hidden" style="border-color:#1a2d4d">
      <table class="w-full text-sm">
        <thead>
          <tr style="background:#0d1b35;border-bottom:1px solid #1a2d4d">
            <th class="px-4 py-3 text-left text-xs font-bold text-slate-500">Order ID</th>
            <th class="px-4 py-3 text-left text-xs font-bold text-slate-500">Items</th>
            <th class="px-4 py-3 text-left text-xs font-bold text-slate-500">Total</th>
            <th class="px-4 py-3 text-left text-xs font-bold text-slate-500">Status</th>
            <th class="px-4 py-3 text-left text-xs font-bold text-slate-500">Date</th>
            <th class="px-4 py-3 text-left text-xs font-bold text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in filtered"
            :key="order.id"
            class="border-b transition-colors"
            style="background:#060d1c;border-color:#1a2d4d"
            onmouseover="this.style.background='#0a1628'"
            onmouseout="this.style.background='#060d1c'"
          >
            <td class="px-4 py-3 font-mono text-xs text-slate-400">#{{ order.id.slice(0,8).toUpperCase() }}</td>
            <td class="px-4 py-3">
              <div class="text-white text-xs">
                <span v-for="(item, i) in order.items" :key="item.id">
                  {{ item.name }}<span v-if="i < order.items.length - 1">, </span>
                </span>
              </div>
              <p class="text-slate-600 text-xs mt-0.5">{{ order.items.length }} item{{ order.items.length > 1 ? 's' : '' }}</p>
            </td>
            <td class="px-4 py-3 font-bold text-orange-400 whitespace-nowrap">{{ formatPrice(order.totalPrice) }}</td>
            <td class="px-4 py-3">
              <span class="text-xs font-bold px-2.5 py-1 rounded-full" :style="statusStyle(order.status)">{{ order.status }}</span>
            </td>
            <td class="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{{ formatDate(order.createdAt) }}</td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <!-- Status transitions (owner only progresses up to READY — courier takes it from there) -->
                <select
                  v-if="nextStatus(order.status)"
                  class="text-xs rounded-lg px-2 py-1.5 font-semibold outline-none transition-all"
                  style="background:#0d1b35;border:1px solid #1a2d4d;color:#f97316"
                  :disabled="updating === order.id"
                  @change="changeStatus(order, ($event.target as HTMLSelectElement).value as OrderStatus)"
                >
                  <option value="">Move to…</option>
                  <option v-for="s in nextStatus(order.status)" :key="s" :value="s">{{ s }}</option>
                </select>

                <span v-if="order.status === 'READY'" class="text-xs text-slate-600">Waiting for courier…</span>

                <!-- Cancel -->
                <button
                  v-if="['CREATED','CONFIRMED'].includes(order.status)"
                  class="text-xs px-3 py-1.5 rounded-lg font-bold text-red-400 border border-red-900/50 hover:bg-red-950/30 transition"
                  :disabled="updating === order.id"
                  @click="changeStatus(order, 'CANCELLED')"
                >
                  Cancel
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { RefreshCw } from '@lucide/vue'
import { orderApi, type Order } from '@/api/order'
import { restaurantApi } from '@/api/restaurant'
import { useAuthStore } from '@/stores/auth'
import { queryKeys } from '@/api/queryKeys'
import type { OrderStatus } from '@/constants/orderStatus'

const authStore = useAuthStore()
const queryClient = useQueryClient()

const STATUSES: OrderStatus[] = ['CREATED','CONFIRMED','PREPARING','READY','DELIVERING','DELIVERED','CANCELLED']

// Owner only drives the kitchen side of the lifecycle — once READY, the courier
// pool (self-claim) takes it through DELIVERING/DELIVERED.
const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  CREATED: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY'],
  READY: [],
  DELIVERING: [],
  DELIVERED: [],
  CANCELLED: [],
}

const filterStatus = ref<'ALL' | OrderStatus>('ALL')
const updating = ref<string | null>(null)

// Chained query: first resolve this owner's restaurant id, then load its orders.
const ownerRestaurantQuery = useQuery<string | null>({
  queryKey: computed(() => queryKeys.restaurants.byOwner(authStore.user?.id ?? -1)),
  queryFn: () => restaurantApi.getByOwner(authStore.user!.id!).then(res => res.data?.[0]?.id ?? null),
  enabled: computed(() => !!authStore.user?.id),
})
const restaurantId = computed(() => ownerRestaurantQuery.data.value ?? null)

const ordersQuery = useQuery<Order[]>({
  queryKey: computed(() => queryKeys.orders.byRestaurant(restaurantId.value ?? '')),
  queryFn: () => orderApi.getByRestaurant(restaurantId.value as string).then(res =>
    (res.data ?? []).sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  ),
  enabled: computed(() => !!restaurantId.value),
})
const orders = computed(() => ordersQuery.data.value ?? [])
const isLoading = computed(() => ownerRestaurantQuery.isLoading.value || ordersQuery.isLoading.value)
const isError = computed(() => ownerRestaurantQuery.isError.value || ordersQuery.isError.value)
function refetch() {
  ownerRestaurantQuery.refetch()
  ordersQuery.refetch()
}

const filtered = computed(() => {
  if (filterStatus.value === 'ALL') return orders.value
  return orders.value.filter(o => o.status === filterStatus.value)
})

function nextStatus(status: OrderStatus) {
  const arr = STATUS_TRANSITIONS[status] ?? []
  return arr.length ? arr : null
}

const changeStatusMutation = useMutation({
  mutationFn: ({ order, status }: { order: Order; status: OrderStatus }) => orderApi.updateStatus(order.id, status),
  onSuccess: () => {
    if (restaurantId.value) queryClient.invalidateQueries({ queryKey: queryKeys.orders.byRestaurant(restaurantId.value) })
  },
  onSettled: () => { updating.value = null },
})

function changeStatus(order: Order, status: OrderStatus | '') {
  if (!status) return
  updating.value = order.id
  changeStatusMutation.mutate({ order, status })
}

function formatPrice(val: number | string | undefined) {
  return Number(val || 0).toLocaleString() + ' UZS'
}

function formatDate(str: string | undefined) {
  if (!str) return ''
  return new Date(str).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function statusStyle(status: OrderStatus) {
  const map: Record<OrderStatus, string> = {
    CREATED: 'background:rgba(59,130,246,0.15);color:#60a5fa',
    CONFIRMED: 'background:rgba(249,115,22,0.15);color:#fb923c',
    PREPARING: 'background:rgba(234,179,8,0.15);color:#facc15',
    READY: 'background:rgba(168,85,247,0.15);color:#c084fc',
    DELIVERING: 'background:rgba(249,115,22,0.25);color:#f97316',
    DELIVERED: 'background:rgba(16,185,129,0.15);color:#34d399',
    CANCELLED: 'background:rgba(239,68,68,0.1);color:#f87171',
  }
  return map[status] ?? 'background:#1a2d4d;color:#94a3b8'
}
</script>
