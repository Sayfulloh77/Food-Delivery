<template>
  <div class="min-h-screen" style="background:#060d1c">

    <!-- Loading -->
    <div v-if="loading" class="max-w-5xl mx-auto px-4 py-8 animate-pulse space-y-6">
      <div class="h-72 rounded-2xl" style="background:#0d1b35" />
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div v-for="n in 6" :key="n" class="h-52 rounded-2xl" style="background:#0d1b35" />
      </div>
    </div>

    <template v-else-if="restaurant">

      <!-- Hero banner -->
      <div class="relative h-64 sm:h-80 w-full overflow-hidden" style="background:#0d1b35">
        <img v-if="restaurant.restaurant_img" :src="restaurant.restaurant_img" :alt="restaurant.name" class="w-full h-full object-cover opacity-50" />
        <div class="absolute inset-0" style="background:linear-gradient(to top, #060d1c 0%, rgba(6,13,28,0.6) 50%, transparent 100%)" />

        <!-- Back button -->
        <button class="absolute top-4 left-4 flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white transition" @click="$router.back()">
          <ChevronLeft class="w-4 h-4" /> Back
        </button>

        <div class="absolute bottom-0 left-0 p-6">
          <span class="text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block" :class="restaurant.is_open ? 'badge-open' : 'badge-closed'">
            {{ restaurant.is_open ? '● Open now' : '● Closed' }}
          </span>
          <h1 class="text-2xl sm:text-4xl font-extrabold text-white mt-1">{{ restaurant.name }}</h1>
          <p v-if="restaurant.description" class="text-slate-400 text-sm mt-1 max-w-lg">{{ restaurant.description }}</p>
          <p class="text-slate-600 text-xs mt-2 flex items-center gap-1">
            <MapPin class="w-3 h-3 text-orange-500" /> {{ restaurant.address }}
          </p>
        </div>
      </div>

      <!-- Menu -->
      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div class="flex items-center gap-3 mb-7">
          <h2 class="text-lg font-bold text-white">Menu</h2>
          <span class="text-xs px-2.5 py-0.5 rounded-full font-semibold" style="background:#0d1b35;color:#64748b;border:1px solid #1a2d4d">{{ menuItems.length }} items</span>
        </div>

        <div v-if="menuItems.length === 0" class="text-center py-20 text-slate-600">No menu items available.</div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(item, i) in menuItems"
            :key="item.id"
            class="reveal rounded-2xl overflow-hidden border transition-all duration-300 group"
            :class="`reveal-delay-${Math.min(i % 3 + 1, 4)}`"
            style="background:#0d1b35;border-color:#1a2d4d"
            onmouseover="this.style.borderColor='#f97316';this.style.transform='translateY(-3px)';this.style.boxShadow='0 12px 32px rgba(249,115,22,0.12)'"
            onmouseout="this.style.borderColor='#1a2d4d';this.style.transform='';this.style.boxShadow=''"
          >
            <div class="relative h-40 overflow-hidden" style="background:#1a2d4d">
              <img v-if="item.img_product" :src="item.img_product" :alt="item.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div v-else class="w-full h-full flex items-center justify-center text-5xl">🍽️</div>

              <span v-if="item.discount_status && item.discount" class="absolute top-2 left-2 text-white text-xs font-black px-2 py-0.5 rounded-full" style="background:#ef4444">
                -{{ item.discount }}%
              </span>
              <span v-if="item.promotion" class="absolute top-2 right-2 text-black text-xs font-black px-2 py-0.5 rounded-full" style="background:#f97316">
                {{ item.promotion }}
              </span>
            </div>

            <div class="p-4">
              <h3 class="font-bold text-white text-sm truncate">{{ item.name }}</h3>
              <p v-if="item.description" class="text-slate-500 text-xs mt-0.5 line-clamp-2">{{ item.description }}</p>

              <div class="flex items-end justify-between mt-3">
                <div>
                  <span class="font-black text-orange-400 text-lg">{{ formatPrice(item.new_price ?? item.price) }}</span>
                  <span v-if="item.new_price" class="text-slate-600 text-xs line-through ml-1">{{ formatPrice(item.price) }}</span>
                </div>
                <div v-if="item.delivery_time" class="flex items-center gap-1 text-slate-600 text-xs">
                  <Clock class="w-3 h-3" /> {{ item.delivery_time }}
                </div>
              </div>

              <button
                class="mt-3 w-full py-2.5 rounded-xl text-sm font-bold text-black transition-all active:scale-95"
                style="background:#f97316"
                onmouseover="this.style.opacity='0.85'"
                onmouseout="this.style.opacity='1'"
                @click="addToCart(item)"
              >
                + Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="text-center py-24 text-slate-600">Restaurant not found.</div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { MapPin, Clock, ChevronLeft } from '@lucide/vue'
import { restaurantApi } from '@/api/restaurant'
import { useCartStore } from '@/stores/cart'
import { useReveal } from '@/composables/useReveal'

useReveal()

const route = useRoute()
const cartStore = useCartStore()
const loading = ref(true)
const restaurant = ref(null)
const menuItems = ref([])

function formatPrice(val) {
  if (!val) return '0 UZS'
  return Number(val).toLocaleString() + ' UZS'
}

function addToCart(item) {
  cartStore.addItem({
    id: item.id,
    name: item.name,
    img_product: item.img_product,
    price: item.price,
    new_price: item.new_price ?? null,
    restaurantId: route.params.id,
    restaurantName: restaurant.value?.name ?? '',
  })
}

onMounted(async () => {
  try {
    const [restaurantRes, menuRes] = await Promise.all([
      restaurantApi.getById(route.params.id),
      restaurantApi.getMenu(route.params.id),
    ])
    restaurant.value = restaurantRes.data
    menuItems.value = menuRes.data ?? []
  } catch {
    restaurant.value = null
  } finally {
    loading.value = false
  }
})
</script>
