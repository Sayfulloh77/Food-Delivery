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

    <!-- Ads Swiper Carousel -->
    <section v-if="ads.length > 0" class="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
      <div class="relative overflow-hidden rounded-2xl">

        <!-- Slides -->
        <div
          class="flex transition-transform duration-500 ease-in-out"
          :style="{ transform: `translateX(-${activeSlide * 100}%)` }"
        >
          <div
            v-for="ad in ads"
            :key="ad.id"
            class="shrink-0 w-full h-48 sm:h-64 relative"
          >
            <img
              v-if="ad.image_ads"
              :src="ad.image_ads"
              :alt="ad.promotion"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-white text-xl font-bold"
              style="background: linear-gradient(135deg, #ff5722, #ff8a65)"
            >
              {{ ad.promotion }}
            </div>

            <!-- Promotion badge -->
            <span
              v-if="ad.promotion"
              class="absolute bottom-4 left-4 bg-black/50 text-white text-sm font-semibold px-3 py-1 rounded-full backdrop-blur-sm"
            >
              {{ ad.promotion }}
            </span>
          </div>
        </div>

        <!-- Prev / Next buttons -->
        <button
          v-if="ads.length > 1"
          class="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition backdrop-blur-sm"
          @click="prevSlide"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>
        <button
          v-if="ads.length > 1"
          class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition backdrop-blur-sm"
          @click="nextSlide"
        >
          <ChevronRight class="w-4 h-4" />
        </button>

        <!-- Dots -->
        <div v-if="ads.length > 1" class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          <button
            v-for="(_, i) in ads"
            :key="i"
            class="w-2 h-2 rounded-full transition-all"
            :class="i === activeSlide ? 'bg-white w-5' : 'bg-white/50'"
            @click="goToSlide(i)"
          />
        </div>
      </div>
    </section>

    <!-- Category pills -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div class="flex gap-2 overflow-x-auto pb-1">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="activeCategory = cat.id === 'all' ? 'all' : cat.name"
          class="shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all"
          :class="activeCategory === (cat.id === 'all' ? 'all' : cat.name)
            ? 'text-white border-transparent'
            : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'"
          :style="activeCategory === (cat.id === 'all' ? 'all' : cat.name) ? 'background:#ff5722; border-color:#ff5722' : ''"
        >
          {{ cat.name }}
        </button>
      </div>
    </section>

    <!-- Restaurants grid -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
      <h2 class="text-xl font-bold text-gray-900 mb-5">
        {{ activeCategory === 'all' ? 'All Restaurants' : activeCategory }}
        <span class="text-gray-400 font-normal text-base ml-1">({{ restaurants.length }})</span>
      </h2>

      <!-- Loading skeleton -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <div v-for="n in 8" :key="n" class="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
          <div class="h-44 bg-gray-200" />
          <div class="p-4 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-3/4" />
            <div class="h-3 bg-gray-200 rounded w-1/2" />
            <div class="h-3 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="restaurants.length === 0" class="text-center py-20 text-gray-400">
        No restaurants found in this category.
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <RouterLink
          v-for="restaurant in restaurants"
          :key="restaurant.id"
          :to="`/restaurants/${restaurant.id}`"
          class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
        >
          <div class="relative h-44 overflow-hidden bg-gray-100">
            <img
              v-if="restaurant.restaurant_img"
              :src="restaurant.restaurant_img"
              :alt="restaurant.name"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-300 text-4xl">🍽️</div>

            <span
              class="absolute top-3 left-3 text-white text-xs font-semibold px-2 py-0.5 rounded-full"
              :class="restaurant.is_open ? 'bg-green-500' : 'bg-gray-400'"
            >
              {{ restaurant.is_open ? 'Open' : 'Closed' }}
            </span>
          </div>

          <div class="p-4">
            <h3 class="font-bold text-gray-900 text-base truncate">{{ restaurant.name }}</h3>
            <p class="text-gray-500 text-sm mt-0.5 truncate">{{ restaurant.description ?? restaurant.address }}</p>
            <div class="flex items-center gap-1 mt-2 text-sm text-gray-400">
              <MapPin class="w-3.5 h-3.5 shrink-0" />
              <span class="truncate">{{ restaurant.address }}</span>
            </div>
          </div>
        </RouterLink>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { MapPin, ChevronLeft, ChevronRight } from '@lucide/vue'
import { categoryApi, restaurantApi, adsApi } from '@/api/restaurant'

const activeCategory = ref('all')
const categories = ref([{ id: 'all', name: 'All' }])
const restaurants = ref([])
const loading = ref(false)
const ads = ref([])

// Swiper state
const activeSlide = ref(0)
let autoPlayTimer = null

function nextSlide() {
  activeSlide.value = (activeSlide.value + 1) % ads.value.length
}
function prevSlide() {
  activeSlide.value = (activeSlide.value - 1 + ads.value.length) % ads.value.length
}
function goToSlide(i) {
  activeSlide.value = i
}
function startAutoPlay() {
  if (ads.value.length > 1) {
    autoPlayTimer = setInterval(nextSlide, 3500)
  }
}
function stopAutoPlay() {
  clearInterval(autoPlayTimer)
}

async function fetchRestaurants(category) {
  loading.value = true
  try {
    if (category === 'all') {
      const res = await restaurantApi.getAll()
      restaurants.value = res.data
    } else {
      const res = await categoryApi.getRestaurants(category)
      restaurants.value = res.data
    }
  } catch {
    restaurants.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const [catRes] = await Promise.allSettled([
    categoryApi.getAll(),
    adsApi.getAll().then((r) => {
      ads.value = r.data
      startAutoPlay()
    }).catch(() => {}),
  ])

  if (catRes.status === 'fulfilled') {
    categories.value = [{ id: 'all', name: 'All' }, ...catRes.value.data]
  }

  await fetchRestaurants('all')
})

onUnmounted(stopAutoPlay)

watch(activeCategory, (val) => fetchRestaurants(val))
</script>
