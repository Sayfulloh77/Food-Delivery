<template>
  <div class="bg-gray-50 min-h-screen">

    <!-- Hero banner -->
    <section class="text-white py-14 px-4" style="background: linear-gradient(135deg, #ff5722 0%, #ff8a65 100%)">
      <div class="max-w-7xl mx-auto text-center">
        <h1 class="text-4xl sm:text-5xl font-bold mb-3 tracking-tight">
          Hungry? We've got you. 🍔
        </h1>
        <p class="text-orange-100 text-lg">Order from the best local restaurants — fast delivery, every time.</p>
      </div>
    </section>

    <!-- Category pills -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div class="flex gap-2 overflow-x-auto pb-1">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="activeCategory = cat.id"
          class="shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all"
          :class="activeCategory === cat.id
            ? 'text-white border-transparent'
            : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'"
          :style="activeCategory === cat.id ? 'background:#ff5722; border-color:#ff5722' : ''"
        >
          {{ cat.icon }} {{ cat.label }}
        </button>
      </div>
    </section>

    <!-- Restaurants grid -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
      <h2 class="text-xl font-bold text-gray-900 mb-5">
        {{ activeCategory === 'all' ? 'All Restaurants' : categories.find(c => c.id === activeCategory)?.label }}
        <span class="text-gray-400 font-normal text-base ml-1">({{ filteredRestaurants.length }})</span>
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <RouterLink
          v-for="restaurant in filteredRestaurants"
          :key="restaurant.id"
          :to="`/restaurants/${restaurant.id}`"
          class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
        >
          <!-- Thumbnail -->
          <div class="relative h-44 overflow-hidden">
            <img
              :src="restaurant.image"
              :alt="restaurant.name"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div class="absolute top-3 left-3 flex gap-1">
              <span v-if="restaurant.isNew" class="bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">New</span>
              <span v-if="restaurant.discount" class="text-white text-xs font-semibold px-2 py-0.5 rounded-full" style="background:#ff5722">{{ restaurant.discount }}</span>
            </div>
          </div>

          <!-- Info -->
          <div class="p-4">
            <h3 class="font-bold text-gray-900 text-base truncate">{{ restaurant.name }}</h3>
            <p class="text-gray-500 text-sm mt-0.5 truncate">{{ restaurant.cuisine }}</p>

            <div class="flex items-center gap-3 mt-3 text-sm text-gray-500">
              <span class="flex items-center gap-1">
                <Star class="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span class="font-medium text-gray-700">{{ restaurant.rating }}</span>
                <span>({{ restaurant.reviews }})</span>
              </span>
              <span class="text-gray-300">·</span>
              <span class="flex items-center gap-1">
                <Clock class="w-4 h-4" />
                {{ restaurant.deliveryTime }} min
              </span>
              <span class="text-gray-300">·</span>
              <span class="flex items-center gap-1">
                <Bike class="w-4 h-4" />
                {{ restaurant.deliveryFee === 0 ? 'Free' : `$${restaurant.deliveryFee}` }}
              </span>
            </div>
          </div>
        </RouterLink>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Star, Clock, Bike } from '@lucide/vue'

const activeCategory = ref('all')

const categories = [
  { id: 'all',     icon: '🍽️', label: 'All' },
  { id: 'burgers', icon: '🍔', label: 'Burgers' },
  { id: 'pizza',   icon: '🍕', label: 'Pizza' },
  { id: 'sushi',   icon: '🍣', label: 'Sushi' },
  { id: 'asian',   icon: '🍜', label: 'Asian' },
  { id: 'salads',  icon: '🥗', label: 'Salads' },
  { id: 'desserts',icon: '🍰', label: 'Desserts' },
  { id: 'drinks',  icon: '🥤', label: 'Drinks' },
]

// Mock data — replace with GET /restaurants once backend is ready
const restaurants = [
  { id: 1, name: 'Burger Palace',    cuisine: 'American · Burgers',  category: 'burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80', rating: 4.8, reviews: 342, deliveryTime: 25, deliveryFee: 0,    isNew: false, discount: '20% OFF' },
  { id: 2, name: 'Pizza Napoli',     cuisine: 'Italian · Pizza',     category: 'pizza',   image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&q=80', rating: 4.6, reviews: 218, deliveryTime: 30, deliveryFee: 1.99, isNew: false, discount: null },
  { id: 3, name: 'Tokyo Sushi Bar',  cuisine: 'Japanese · Sushi',    category: 'sushi',   image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80', rating: 4.9, reviews: 487, deliveryTime: 35, deliveryFee: 0,    isNew: true,  discount: null },
  { id: 4, name: 'Pho Saigon',       cuisine: 'Vietnamese · Asian',  category: 'asian',   image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=600&q=80', rating: 4.7, reviews: 156, deliveryTime: 20, deliveryFee: 0.99, isNew: true,  discount: null },
  { id: 5, name: 'Green Bowl',       cuisine: 'Healthy · Salads',    category: 'salads',  image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80', rating: 4.5, reviews: 93,  deliveryTime: 15, deliveryFee: 0,    isNew: false, discount: null },
  { id: 6, name: 'Sweet Tooth',      cuisine: 'Desserts · Cakes',    category: 'desserts',image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80', rating: 4.7, reviews: 201, deliveryTime: 20, deliveryFee: 1.49, isNew: false, discount: '15% OFF' },
  { id: 7, name: 'The Grill House',  cuisine: 'American · BBQ',      category: 'burgers', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80', rating: 4.6, reviews: 314, deliveryTime: 30, deliveryFee: 0,    isNew: false, discount: null },
  { id: 8, name: 'Bubble Tea House', cuisine: 'Drinks · Asian',      category: 'drinks',  image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', rating: 4.4, reviews: 128, deliveryTime: 15, deliveryFee: 0.99, isNew: true,  discount: null },
]

const filteredRestaurants = computed(() =>
  activeCategory.value === 'all'
    ? restaurants
    : restaurants.filter(r => r.category === activeCategory.value)
)
</script>
