<template>
  <!-- Backdrop -->
  <Transition name="fade">
    <div v-if="cartStore.drawerOpen" class="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm" @click="cartStore.closeDrawer()" />
  </Transition>

  <!-- Drawer -->
  <Transition name="slide">
    <div v-if="cartStore.drawerOpen" class="fixed top-0 right-0 h-full w-full max-w-sm z-50 flex flex-col" style="background:#060d1c;border-left:1px solid #1a2d4d">

      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b" style="border-color:#1a2d4d">
        <div class="flex items-center gap-2">
          <ShoppingCart class="w-5 h-5 text-orange-400" />
          <span class="font-bold text-white text-lg">Your Cart</span>
          <span class="text-xs px-2 py-0.5 rounded-full text-black font-bold" style="background:#f97316">{{ cartStore.totalItems }}</span>
        </div>
        <button @click="cartStore.closeDrawer()" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
          <X class="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <!-- Empty state -->
      <div v-if="cartStore.items.length === 0" class="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <ShoppingCart class="w-14 h-14 text-slate-700" />
        <p class="text-white font-bold">Your cart is empty</p>
        <p class="text-slate-500 text-sm">Add some food to get started</p>
        <button @click="cartStore.closeDrawer()" class="mt-2 px-5 py-2.5 text-black text-sm font-bold rounded-xl transition-all hover:opacity-90" style="background:#f97316">
          Browse restaurants
        </button>
      </div>

      <!-- Items list -->
      <div v-else class="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        <div
          v-for="item in cartStore.items"
          :key="item.id"
          class="flex items-center gap-3 p-3 rounded-2xl border"
          style="background:#0d1b35;border-color:#1a2d4d"
        >
          <div class="w-14 h-14 rounded-xl overflow-hidden shrink-0" style="background:#1a2d4d">
            <img v-if="item.img_product" :src="item.img_product" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
          </div>

          <div class="flex-1 min-w-0">
            <p class="text-white text-sm font-semibold truncate">{{ item.name }}</p>
            <p class="text-orange-400 text-sm font-bold mt-0.5">
              {{ formatPrice(item.new_price ?? item.price) }}
            </p>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button
              @click="cartStore.removeItem(item.id)"
              class="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold transition-colors hover:bg-red-600"
              style="background:#1a2d4d"
            >
              <Minus class="w-3 h-3" />
            </button>
            <span class="text-white font-bold text-sm w-4 text-center">{{ item.qty }}</span>
            <button
              @click="cartStore.addItem(item)"
              class="w-7 h-7 rounded-lg flex items-center justify-center text-black font-bold transition-all hover:opacity-80"
              style="background:#f97316"
            >
              <Plus class="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="cartStore.items.length > 0" class="px-5 py-4 border-t space-y-3" style="border-color:#1a2d4d">
        <div class="flex items-center justify-between text-sm text-slate-400">
          <span>{{ cartStore.totalItems }} item{{ cartStore.totalItems > 1 ? 's' : '' }}</span>
          <button @click="cartStore.clear()" class="text-red-400 hover:text-red-300 text-xs transition-colors">Clear all</button>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-white font-semibold">Total</span>
          <span class="text-orange-400 font-black text-xl">{{ formatPrice(cartStore.totalPrice) }}</span>
        </div>
        <button
          class="block w-full py-3.5 text-black font-bold text-center rounded-2xl transition-all text-sm hover:opacity-90 active:scale-95"
          style="background:#f97316"
          @click="checkout"
        >
          Place Order →
        </button>
      </div>

    </div>
  </Transition>
</template>

<script setup>
import { ShoppingCart, X, Plus, Minus } from '@lucide/vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { orderApi } from '@/api/order'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

function formatPrice(val) {
  if (!val) return '0 UZS'
  return Number(val).toLocaleString() + ' UZS'
}

async function checkout() {
  if (!authStore.isLoggedIn) {
    cartStore.closeDrawer()
    router.push('/auth')
    return
  }
  // Get restaurant id from first item
  const restaurantId = cartStore.items[0]?.restaurantId
  if (!restaurantId) return

  try {
    await orderApi.create({ restaurantId })
    cartStore.clear()
    cartStore.closeDrawer()
    router.push('/orders')
  } catch (e) {
    // If order service fails, just navigate to orders page
    cartStore.closeDrawer()
    router.push('/orders')
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.3s cubic-bezier(.4,0,.2,1); }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
