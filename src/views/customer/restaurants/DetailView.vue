<template>
  <div class="bg-gray-50 min-h-screen">

    <!-- Loading -->
    <div v-if="loading" class="max-w-5xl mx-auto px-4 py-10 animate-pulse space-y-6">
      <div class="h-56 bg-gray-200 rounded-2xl" />
      <div class="h-6 bg-gray-200 rounded w-1/3" />
      <div class="h-4 bg-gray-200 rounded w-1/2" />
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
        <div v-for="n in 6" :key="n" class="h-48 bg-gray-200 rounded-2xl" />
      </div>
    </div>

    <template v-else-if="restaurant">

      <!-- Restaurant Header -->
      <div class="relative h-56 sm:h-72 w-full overflow-hidden bg-gray-200">
        <img
          v-if="restaurant.restaurant_img"
          :src="restaurant.restaurant_img"
          :alt="restaurant.name"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        <div class="absolute bottom-0 left-0 p-6 text-white">
          <span
            class="text-xs font-semibold px-2 py-0.5 rounded-full mb-2 inline-block"
            :class="restaurant.is_open ? 'bg-green-500' : 'bg-gray-500'"
          >
            {{ restaurant.is_open ? 'Open' : 'Closed' }}
          </span>
          <h1 class="text-2xl sm:text-3xl font-bold">{{ restaurant.name }}</h1>
          <p v-if="restaurant.description" class="text-white/80 text-sm mt-1">{{ restaurant.description }}</p>
          <p class="text-white/60 text-xs mt-1 flex items-center gap-1">
            <MapPin class="w-3 h-3" /> {{ restaurant.address }}
          </p>
        </div>
      </div>

      <!-- Menu Section -->
      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h2 class="text-xl font-bold text-gray-900 mb-5">
          Menu
          <span class="text-gray-400 font-normal text-base ml-1">({{ menuItems.length }})</span>
        </h2>

        <!-- Empty menu -->
        <div v-if="menuItems.length === 0" class="text-center py-16 text-gray-400">
          No menu items available.
        </div>

        <!-- Menu grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="item in menuItems"
            :key="item.id"
            class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <!-- Item image -->
            <div class="relative h-40 bg-gray-100 overflow-hidden">
              <img
                v-if="item.img_product"
                :src="item.img_product"
                :alt="item.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-4xl text-gray-300">🍽️</div>

              <!-- Discount badge -->
              <span
                v-if="item.discount_status && item.discount"
                class="absolute top-2 left-2 text-white text-xs font-bold px-2 py-0.5 rounded-full"
                style="background:#ff5722"
              >
                -{{ item.discount }}%
              </span>

              <!-- Promotion badge -->
              <span
                v-if="item.promotion"
                class="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full"
              >
                {{ item.promotion }}
              </span>
            </div>

            <!-- Item info -->
            <div class="p-4">
              <h3 class="font-bold text-gray-900 text-sm truncate">{{ item.name }}</h3>
              <p v-if="item.description" class="text-gray-400 text-xs mt-0.5 line-clamp-2">{{ item.description }}</p>

              <div class="flex items-center justify-between mt-3">
                <div>
                  <span v-if="item.new_price" class="font-bold text-gray-900 text-base">${{ item.new_price }}</span>
                  <span v-else class="font-bold text-gray-900 text-base">${{ item.price }}</span>
                  <span v-if="item.new_price" class="text-gray-400 text-xs line-through ml-1">${{ item.price }}</span>
                </div>
                <div v-if="item.delivery_time" class="flex items-center gap-1 text-gray-400 text-xs">
                  <Clock class="w-3 h-3" /> {{ item.delivery_time }}
                </div>
              </div>

              <button
                class="mt-3 w-full py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                style="background:#ff5722"
                @click="addToCart(item)"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Error -->
    <div v-else class="text-center py-24 text-gray-400">
      Restaurant not found.
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MapPin, Clock } from '@lucide/vue'
import { restaurantApi } from '@/api/restaurant'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const cartStore = useCartStore()

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
  router.push('/cart')
}

const route = useRoute()
const loading = ref(true)
const restaurant = ref(null)
const menuItems = ref([])

onMounted(async () => {
  try {
    const [restaurantRes, menuRes] = await Promise.all([
      restaurantApi.getById(route.params.id),
      restaurantApi.getMenu(route.params.id),
    ])
    restaurant.value = restaurantRes.data
    menuItems.value = menuRes.data
  } catch {
    restaurant.value = null
    menuItems.value = []
  } finally {
    loading.value = false
  }
})
</script>
