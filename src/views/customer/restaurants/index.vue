<template>
  <div class="min-h-screen" style="background:#060d1c">

    <!-- Hero -->
    <section class="relative px-4 pt-16 pb-12 text-center overflow-hidden">
      <!-- Ambient glow blobs -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none" style="background:radial-gradient(circle,#f97316,transparent 70%)"></div>
      <div class="absolute top-10 left-1/4 w-64 h-64 rounded-full opacity-5 blur-3xl pointer-events-none" style="background:#3b82f6"></div>

      <p class="relative text-xs font-bold tracking-widest text-orange-400 uppercase mb-3">🔥 Hot &amp; Fresh Near You</p>
      <h1 class="relative text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-4 leading-tight">
        Hungry? <br class="sm:hidden" />
        <span style="background:linear-gradient(135deg,#f97316,#fbbf24);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">
          We deliver.
        </span>
      </h1>
      <p class="relative text-slate-400 text-base max-w-md mx-auto leading-relaxed">
        Order from the best local restaurants — lightning fast delivery, every time.
      </p>

      <!-- Stats row -->
      <div class="relative flex items-center justify-center gap-8 mt-8">
        <div class="text-center">
          <p class="text-2xl font-black text-white">{{ restaurants.length || '—' }}</p>
          <p class="text-xs text-slate-500 mt-0.5">Restaurants</p>
        </div>
        <div class="w-px h-8" style="background:#1a2d4d"></div>
        <div class="text-center">
          <p class="text-2xl font-black text-emerald-400">{{ restaurants.filter(r => r.is_open).length }}</p>
          <p class="text-xs text-slate-500 mt-0.5">Open now</p>
        </div>
        <div class="w-px h-8" style="background:#1a2d4d"></div>
        <div class="text-center">
          <p class="text-2xl font-black text-orange-400">{{ categories.length - 1 }}</p>
          <p class="text-xs text-slate-500 mt-0.5">Categories</p>
        </div>
      </div>
    </section>

    <!-- Ads Carousel -->
    <section v-if="ads.length > 0" class="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
      <div class="relative overflow-hidden rounded-2xl" style="border:1px solid #1a2d4d">
        <div class="flex transition-transform duration-500 ease-in-out" :style="{ transform: `translateX(-${activeSlide * 100}%)` }">
          <div v-for="ad in ads" :key="ad.id" class="shrink-0 w-full h-52 sm:h-64 relative">
            <img v-if="ad.image_ads" :src="ad.image_ads" :alt="ad.promotion" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center font-bold text-xl text-white" style="background:#0d1b35">{{ ad.promotion }}</div>
            <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
            <span v-if="ad.promotion" class="absolute bottom-4 left-4 text-sm font-black px-3 py-1.5 rounded-full text-black" style="background:#f97316">
              {{ ad.promotion }}
            </span>
          </div>
        </div>
        <button v-if="ads.length > 1" class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition backdrop-blur-sm" @click="prevSlide">
          <ChevronLeft class="w-4 h-4" />
        </button>
        <button v-if="ads.length > 1" class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition backdrop-blur-sm" @click="nextSlide">
          <ChevronRight class="w-4 h-4" />
        </button>
        <div v-if="ads.length > 1" class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          <button v-for="(_, i) in ads" :key="i" class="h-1.5 rounded-full transition-all" :class="i === activeSlide ? 'w-5' : 'bg-white/30 w-1.5'" :style="i === activeSlide ? 'background:#f97316' : ''" @click="goToSlide(i)" />
        </div>
      </div>
    </section>

    <!-- Category pills -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
      <div class="flex gap-2 overflow-x-auto pb-1" style="scrollbar-width:none">
        <button
          v-for="cat in categories"
          :key="cat.id ?? cat.name"
          @click="activeCategory = cat.id === 'all' ? 'all' : cat.name"
          class="shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all border"
          :style="isActiveCategory(cat)
            ? 'background:#f97316;border-color:#f97316;color:#000'
            : 'background:#0d1b35;border-color:#1a2d4d;color:#64748b'"
        >
          {{ cat.name }}
        </button>
      </div>
    </section>

    <!-- Restaurants grid -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-sm font-bold text-white">
          {{ activeCategory === 'all' ? 'All Restaurants' : activeCategory }}
          <span class="text-slate-600 font-normal ml-1">({{ restaurants.length }})</span>
        </h2>
      </div>

      <!-- Skeleton -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div v-for="n in 8" :key="n" class="rounded-2xl overflow-hidden animate-pulse" style="background:#0d1b35">
          <div class="h-44" style="background:#1a2d4d" />
          <div class="p-4 space-y-2">
            <div class="h-4 rounded w-3/4" style="background:#1a2d4d" />
            <div class="h-3 rounded w-1/2" style="background:#1a2d4d" />
          </div>
        </div>
      </div>

      <!-- Server error -->
      <div v-else-if="serverError" class="text-center py-24">
        <div class="text-5xl mb-4">🔌</div>
        <p class="text-white font-bold text-lg">Server is temporarily offline</p>
        <p class="text-slate-500 text-sm mt-1">Our restaurant service is restarting. Please try again in a moment.</p>
        <button class="mt-6 px-6 py-2.5 rounded-xl font-semibold text-black text-sm transition hover:opacity-90" style="background:#f97316" @click="retry">
          Try again
        </button>
      </div>

      <!-- Empty -->
      <div v-else-if="restaurants.length === 0" class="text-center py-20 text-slate-600">
        No restaurants found.
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <RouterLink
          v-for="(r, i) in restaurants"
          :key="r.id"
          :to="`/restaurants/${r.id}`"
          class="reveal rounded-2xl overflow-hidden border transition-all duration-300 group"
          :class="`reveal-delay-${Math.min(i % 4 + 1, 4)}`"
          style="background:#0d1b35;border-color:#1a2d4d"
          onmouseover="this.style.borderColor='#f97316';this.style.transform='translateY(-4px)';this.style.boxShadow='0 16px 40px rgba(249,115,22,0.15)'"
          onmouseout="this.style.borderColor='#1a2d4d';this.style.transform='';this.style.boxShadow=''"
        >
          <div class="relative h-44 overflow-hidden" style="background:#1a2d4d">
            <img v-if="r.restaurant_img" :src="r.restaurant_img" :alt="r.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div v-else class="w-full h-full flex items-center justify-center text-5xl">🍽️</div>
            <div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <span class="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full" :class="r.is_open ? 'badge-open' : 'badge-closed'">
              {{ r.is_open ? '● Open' : '● Closed' }}
            </span>
          </div>
          <div class="p-4">
            <h3 class="font-bold text-white text-sm truncate">{{ r.name }}</h3>
            <p class="text-slate-500 text-xs mt-0.5 truncate">{{ r.description ?? r.address }}</p>
            <div class="flex items-center gap-1 mt-3 text-xs text-slate-600">
              <MapPin class="w-3 h-3 shrink-0 text-orange-500" />
              <span class="truncate">{{ r.address }}</span>
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
import { useReveal } from '@/composables/useReveal'

useReveal()

const activeCategory = ref('all')
const categories = ref([{ id: 'all', name: 'All' }])
const restaurants = ref([])
const loading = ref(false)
const serverError = ref(false)
const ads = ref([])
const activeSlide = ref(0)
let autoPlayTimer = null

function isActiveCategory(cat) {
  return activeCategory.value === (cat.id === 'all' ? 'all' : cat.name)
}
function nextSlide() { activeSlide.value = (activeSlide.value + 1) % ads.value.length }
function prevSlide() { activeSlide.value = (activeSlide.value - 1 + ads.value.length) % ads.value.length }
function goToSlide(i) { activeSlide.value = i }
function startAutoPlay() { if (ads.value.length > 1) autoPlayTimer = setInterval(nextSlide, 4000) }
function stopAutoPlay() { clearInterval(autoPlayTimer) }

async function fetchRestaurants(category) {
  loading.value = true
  serverError.value = false
  try {
    const res = category === 'all' ? await restaurantApi.getAll() : await categoryApi.getRestaurants(category)
    restaurants.value = res.data ?? []
  } catch (e) {
    if (!e.response) serverError.value = true
    restaurants.value = []
  } finally {
    loading.value = false
  }
}

async function retry() {
  await fetchRestaurants(activeCategory.value)
}

onMounted(async () => {
  const [catRes] = await Promise.allSettled([
    categoryApi.getAll(),
    adsApi.getAll().then(r => { ads.value = r.data ?? []; startAutoPlay() }).catch(() => {}),
  ])
  if (catRes.status === 'fulfilled') {
    categories.value = [{ id: 'all', name: 'All' }, ...(catRes.value.data ?? [])]
  }
  await fetchRestaurants('all')
})
onUnmounted(stopAutoPlay)
watch(activeCategory, val => fetchRestaurants(val))
</script>
