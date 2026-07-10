<template>
  <div class="min-h-screen" style="background:#060d1c">
    <div class="max-w-2xl mx-auto px-4 py-10">

      <RouterLink to="/orders" class="text-slate-500 text-sm hover:text-slate-300 transition">&larr; Back to orders</RouterLink>

      <!-- Loading -->
      <div v-if="isLoading" class="mt-6 space-y-3 animate-pulse">
        <div class="h-8 w-1/2 rounded" style="background:#0d1b35" />
        <div class="h-40 rounded-2xl" style="background:#0d1b35" />
      </div>

      <!-- Error -->
      <div v-else-if="isError" class="text-center py-24">
        <p class="text-white font-bold">Failed to load order</p>
        <button class="mt-4 px-5 py-2 rounded-xl text-black text-sm font-bold" style="background:#f97316" @click="() => refetch()">Retry</button>
      </div>

      <template v-else-if="order">
        <div class="mt-6 flex items-start justify-between gap-3">
          <div>
            <h1 class="text-2xl font-extrabold text-white">Order #{{ order.id.slice(0,8).toUpperCase() }}</h1>
            <p class="text-slate-500 text-xs mt-1">{{ formatDate(order.createdAt) }}</p>
          </div>
          <span class="text-xs font-bold px-3 py-1 rounded-full shrink-0" :style="orderStatusStyle(order.status)">
            {{ ORDER_STATUS_LABEL[order.status] ?? order.status }}
          </span>
        </div>

        <!-- Delivered confirmation -->
        <div v-if="order.status === 'DELIVERED'" class="mt-8 rounded-2xl border p-8 text-center" style="background:#0d1b35;border-color:rgba(16,185,129,0.3)">
          <div class="text-6xl mb-3">✅</div>
          <p class="text-emerald-400 font-extrabold text-xl">Delivered!</p>
          <p class="text-slate-400 text-sm mt-1">Your order has arrived. Enjoy your meal 🎉</p>
        </div>

        <!-- Cancelled -->
        <div v-else-if="order.status === 'CANCELLED'" class="mt-8 rounded-2xl border p-8 text-center" style="background:#0d1b35;border-color:rgba(239,68,68,0.25)">
          <div class="text-6xl mb-3">✕</div>
          <p class="text-red-400 font-extrabold text-xl">Order cancelled</p>
        </div>

        <!-- Progress tracker -->
        <div v-else class="mt-8 rounded-2xl border p-6" style="background:#0d1b35;border-color:#1a2d4d">
          <div v-for="(step, i) in ORDER_STEPS" :key="step" class="flex gap-4">
            <div class="flex flex-col items-center">
              <div
                class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                :style="stepIndex >= i ? 'background:#f97316;color:#000' : 'background:#1a2d4d;color:#475569'"
              >
                {{ stepIndex > i ? '✓' : '' }}
              </div>
              <div v-if="i < ORDER_STEPS.length - 1" class="w-0.5 flex-1 min-h-[28px]" :style="stepIndex > i ? 'background:#f97316' : 'background:#1a2d4d'" />
            </div>
            <p class="pb-7 text-sm font-semibold" :style="stepIndex >= i ? 'color:#fff' : 'color:#475569'">
              {{ ORDER_STATUS_LABEL[step] }}
            </p>
          </div>
          <p class="text-slate-600 text-xs -mt-2">Updates automatically every few seconds</p>
        </div>

        <!-- Items -->
        <div class="mt-6 rounded-2xl border p-5" style="background:#0d1b35;border-color:#1a2d4d">
          <div v-for="item in order.items" :key="item.id" class="flex items-center justify-between text-sm py-1.5">
            <span class="text-slate-300">{{ item.name }} <span class="text-slate-600">&times; {{ item.qty }}</span></span>
            <span class="text-orange-400 font-semibold">{{ formatPrice(Number(item.price) * item.qty) }}</span>
          </div>
          <div class="mt-3 pt-3 flex items-center justify-between" style="border-top:1px solid #1a2d4d">
            <span class="text-slate-500 text-sm">Total</span>
            <span class="text-orange-400 font-black text-lg">{{ formatPrice(order.totalPrice) }}</span>
          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useRoute, RouterLink } from 'vue-router'
import { orderApi, type Order } from '@/api/order'
import { queryKeys } from '@/api/queryKeys'
import { ORDER_STEPS, ORDER_STATUS_LABEL, orderStatusStyle } from '@/constants/orderStatus'

const route = useRoute()
const orderId = computed(() => route.params.id as string)

const { data: order, isLoading, isError, refetch } = useQuery<Order>({
  queryKey: computed(() => queryKeys.orders.detail(orderId.value)),
  queryFn: () => orderApi.getById(orderId.value).then(res => res.data),
  // Stop polling once the order reaches a terminal state — no point hammering
  // the backend for an order that will never change again.
  refetchInterval: (query) => {
    const status = query.state.data?.status
    return status === 'DELIVERED' || status === 'CANCELLED' ? false : 5000
  },
})

const stepIndex = computed(() => order.value ? ORDER_STEPS.indexOf(order.value.status as typeof ORDER_STEPS[number]) : -1)

function formatPrice(val: number | string | undefined) {
  if (!val) return '0'
  return Number(val).toLocaleString() + ' UZS'
}

function formatDate(str: string | undefined) {
  if (!str) return ''
  return new Date(str).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>
