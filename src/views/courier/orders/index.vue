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
      <p class="text-white font-bold">Failed to load your deliveries — backend may be unavailable</p>
      <button class="mt-4 px-5 py-2 rounded-xl text-black text-sm font-bold" style="background:#f97316" @click="load">Retry</button>
    </div>

    <!-- Empty -->
    <div v-else-if="filtered.length === 0" class="text-center py-20 text-slate-600">
      No deliveries assigned to you right now.
    </div>

    <!-- Cards -->
    <div v-else class="space-y-3">
      <div
        v-for="order in filtered"
        :key="order.id"
        class="rounded-2xl border p-5"
        style="background:#0d1b35;border-color:#1a2d4d"
      >
        <div class="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p class="font-mono text-xs text-slate-500">#{{ order.id.slice(0,8).toUpperCase() }}</p>
            <p class="text-white text-sm mt-1">
              <span v-for="(item, i) in order.items" :key="item.id">
                {{ item.name }} × {{ item.qty }}<span v-if="i < order.items.length - 1">, </span>
              </span>
            </p>
            <p class="text-slate-600 text-xs mt-1">{{ formatDate(order.createdAt) }}</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold px-2.5 py-1 rounded-full" :style="statusStyle(order.status)">{{ order.status }}</span>
            <span class="font-bold text-orange-400 text-sm">{{ formatPrice(order.totalPrice) }}</span>
          </div>
        </div>

        <div class="mt-4 flex justify-end">
          <button
            v-if="order.status === 'READY'"
            class="text-xs px-4 py-2 rounded-lg font-bold text-black transition hover:opacity-85 disabled:opacity-40"
            style="background:#f97316"
            :disabled="updating === order.id"
            @click="changeStatus(order, 'DELIVERING')"
          >
            {{ updating === order.id ? 'Updating…' : 'Start delivering' }}
          </button>
          <button
            v-else-if="order.status === 'DELIVERING'"
            class="text-xs px-4 py-2 rounded-lg font-bold text-black transition hover:opacity-85 disabled:opacity-40"
            style="background:#22c55e"
            :disabled="updating === order.id"
            @click="changeStatus(order, 'DELIVERED')"
          >
            {{ updating === order.id ? 'Updating…' : 'Mark delivered' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RefreshCw } from '@lucide/vue'
import { orderApi } from '@/api/order'

const STATUSES = ['READY', 'DELIVERING', 'DELIVERED']

const orders = ref([])
const loading = ref(true)
const error = ref(false)
const filterStatus = ref('ALL')
const updating = ref(null)

const filtered = computed(() => {
  if (filterStatus.value === 'ALL') return orders.value
  return orders.value.filter(o => o.status === filterStatus.value)
})

async function load() {
  loading.value = true
  error.value = false
  try {
    const res = await orderApi.getAll()
    orders.value = (res.data ?? []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

async function changeStatus(order, status) {
  updating.value = order.id
  try {
    const res = await orderApi.updateStatus(order.id, status)
    order.status = res.data.status ?? status
  } catch {}
  finally { updating.value = null }
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

onMounted(load)
</script>
