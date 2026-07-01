<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="max-w-2xl mx-auto px-4 py-8">

      <h1 class="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>

      <!-- Empty cart -->
      <div v-if="cartStore.items.length === 0" class="text-center py-24">
        <div class="text-6xl mb-4">🛒</div>
        <p class="text-gray-500 text-lg font-medium">Your cart is empty</p>
        <p class="text-gray-400 text-sm mt-1">Add items from a restaurant to get started</p>
        <RouterLink
          to="/restaurants"
          class="mt-6 inline-block px-6 py-3 rounded-xl text-white text-sm font-semibold"
          style="background:#ff5722"
        >
          Browse Restaurants
        </RouterLink>
      </div>

      <!-- Cart items -->
      <template v-else>
        <div class="space-y-3 mb-6">
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="bg-white rounded-2xl p-4 flex gap-4 shadow-sm"
          >
            <!-- Image -->
            <div class="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
              <img
                v-if="item.img_product"
                :src="item.img_product"
                :alt="item.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-3xl">🍽️</div>
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 text-sm truncate">{{ item.name }}</h3>
              <p class="text-gray-400 text-xs mt-0.5">{{ item.restaurantName }}</p>
              <div class="flex items-center justify-between mt-2">
                <span class="font-bold text-gray-900 text-sm">
                  {{ formatPrice((item.new_price ?? item.price) * item.qty) }}
                </span>
                <!-- Qty controls -->
                <div class="flex items-center gap-2">
                  <button
                    class="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
                    @click="cartStore.removeItem(item.id)"
                  >
                    <Minus class="w-3 h-3" />
                  </button>
                  <span class="w-5 text-center text-sm font-semibold">{{ item.qty }}</span>
                  <button
                    class="w-7 h-7 rounded-full flex items-center justify-center text-white transition"
                    style="background:#ff5722"
                    @click="cartStore.addItem(item)"
                  >
                    <Plus class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Delete -->
            <button
              class="self-start text-gray-300 hover:text-red-400 transition"
              @click="cartStore.deleteItem(item.id)"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Summary -->
        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <div class="flex justify-between text-sm text-gray-500 mb-2">
            <span>Items ({{ cartStore.totalItems }})</span>
            <span>{{ formatPrice(cartStore.totalPrice) }}</span>
          </div>
          <div class="flex justify-between text-sm text-gray-500 mb-4">
            <span>Delivery fee</span>
            <span class="text-green-600 font-medium">Free</span>
          </div>
          <div class="border-t pt-4 flex justify-between font-bold text-gray-900 text-base">
            <span>Total</span>
            <span>{{ formatPrice(cartStore.totalPrice) }}</span>
          </div>

          <p v-if="orderError" class="mt-3 text-sm text-red-400 text-center">{{ orderError }}</p>
          <button
            class="mt-4 w-full py-3.5 rounded-xl font-semibold text-sm transition active:scale-95 disabled:opacity-50"
            style="background:#f97316;color:#000"
            :disabled="placing"
            @click="placeOrder"
          >
            {{ placing ? 'Placing order…' : 'Place Order' }}
          </button>

          <button
            class="mt-3 w-full py-2.5 rounded-xl text-gray-500 text-sm font-medium hover:bg-gray-100 transition"
            @click="cartStore.clear()"
          >
            Clear cart
          </button>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Minus, Plus, X } from '@lucide/vue'
import { useCartStore } from '@/stores/cart'
import { orderApi } from '@/api/order'

const cartStore = useCartStore()
const router = useRouter()
const placing = ref(false)
const orderError = ref('')

function formatPrice(amount) {
  return new Intl.NumberFormat('uz-UZ').format(amount) + ' UZS'
}

async function placeOrder() {
  if (cartStore.items.length === 0) return
  placing.value = true
  orderError.value = ''

  const restaurantId = cartStore.items[0]?.restaurantId
  if (!restaurantId) { orderError.value = 'Cart error — missing restaurant.'; placing.value = false; return }

  try {
    const items = cartStore.items.map(item => ({
      menuItemId: item.id,
      name: item.name,
      qty: item.qty,
      price: item.new_price ?? item.price,
    }))

    await orderApi.create({ restaurantId, items })

    cartStore.clear()
    router.push('/orders')
  } catch {
    orderError.value = 'Failed to place order. Please try again.'
  } finally {
    placing.value = false
  }
}
</script>
