<template>
  <div class="min-h-screen" style="background:#060d1c">

    <template v-if="!searchQuery">
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
            <p class="text-2xl font-black text-emerald-400">{{ restaurants.filter((r: Restaurant) => r.is_open).length }}</p>
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
      <section v-if="visibleAds.length > 0" class="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <div class="relative overflow-hidden rounded-2xl" style="border:1px solid #1a2d4d">
          <div class="flex transition-transform duration-500 ease-in-out" :style="{ transform: `translateX(-${activeSlide * 100}%)` }">
            <div v-for="ad in visibleAds" :key="ad.id" class="shrink-0 w-full h-52 sm:h-64 relative">
              <img v-if="ad.image_ads" :src="ad.image_ads" :alt="ad.promotion" class="w-full h-full object-cover" @error="onAdImageError(ad.id)" />
              <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              <span v-if="ad.promotion" class="absolute bottom-4 left-4 text-sm font-black px-3 py-1.5 rounded-full text-black" style="background:#f97316">
                {{ ad.promotion }}
              </span>
            </div>
          </div>
          <button v-if="visibleAds.length > 1" class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition backdrop-blur-sm" @click="prevSlide">
            <ChevronLeft class="w-4 h-4" />
          </button>
          <button v-if="visibleAds.length > 1" class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition backdrop-blur-sm" @click="nextSlide">
            <ChevronRight class="w-4 h-4" />
          </button>
          <div v-if="visibleAds.length > 1" class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            <button v-for="(_, i) in visibleAds" :key="i" class="h-1.5 rounded-full transition-all" :class="i === activeSlide ? 'w-5' : 'bg-white/30 w-1.5'" :style="i === activeSlide ? 'background:#f97316' : ''" @click="goToSlide(i)" />
          </div>
        </div>
      </section>

      <!-- Category pills -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <div class="flex gap-2 overflow-x-auto pb-1" style="scrollbar-width:none">
          <button
            v-for="cat in categories"
            :key="categoryKey(cat)"
            @click="selectCategory(cat)"
            class="shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all border"
            :style="isActiveCategory(cat)
              ? 'background:#f97316;border-color:#f97316;color:#000'
              : 'background:#0d1b35;border-color:#1a2d4d;color:#64748b'"
          >
            {{ cat.name }}
          </button>
        </div>
      </section>
    </template>

    <!-- Search header -->
    <section v-else class="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-6 flex items-center justify-between">
      <h1 class="text-xl sm:text-2xl font-extrabold text-white">Results for "{{ searchQuery }}"</h1>
      <button @click="clearSearch" class="text-sm font-semibold text-orange-400 hover:text-orange-300 transition">
        ✕ Clear search
      </button>
    </section>

    <!-- Results -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 pb-24">

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
      <div v-else-if="searchQuery ? searchGroups.length === 0 : restaurants.length === 0" class="text-center py-20 text-slate-600">
        {{ searchQuery ? `No dishes or restaurants match "${searchQuery}".` : 'No restaurants found.' }}
      </div>

      <!-- Browse mode: restaurant grid -->
      <div v-else-if="!searchQuery" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

      <!-- Search mode: restaurant, then its matching products -->
      <div v-else class="space-y-10">
        <div v-for="group in searchGroups" :key="group.restaurant.id">
          <RouterLink :to="`/restaurants/${group.restaurant.id}`" class="flex items-center gap-4 mb-4 group w-fit">
            <div class="w-14 h-14 rounded-xl overflow-hidden shrink-0" style="background:#1a2d4d">
              <img v-if="group.restaurant.restaurant_img" :src="group.restaurant.restaurant_img" :alt="group.restaurant.name" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
            </div>
            <div>
              <h3 class="font-bold text-white group-hover:text-orange-400 transition">{{ group.restaurant.name }}</h3>
              <p class="text-xs text-slate-500 flex items-center gap-1">
                <MapPin class="w-3 h-3 shrink-0 text-orange-500" /> {{ group.restaurant.address }}
              </p>
            </div>
          </RouterLink>

          <div v-if="group.items.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <RouterLink
              v-for="item in group.items"
              :key="item.id"
              :to="`/restaurants/${group.restaurant.id}`"
              class="rounded-2xl overflow-hidden border transition-all duration-300 hover:border-orange-500"
              style="background:#0d1b35;border-color:#1a2d4d"
            >
              <div class="h-32 overflow-hidden" style="background:#1a2d4d">
                <img v-if="item.img_product" :src="item.img_product" :alt="item.name" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-3xl">🍽️</div>
              </div>
              <div class="p-3">
                <p class="text-white text-sm font-semibold truncate">{{ item.name }}</p>
                <p class="text-orange-400 text-sm font-bold mt-1">{{ formatPrice(item.new_price ?? item.price) }}</p>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useRoute, useRouter } from 'vue-router'
import { MapPin, ChevronLeft, ChevronRight } from '@lucide/vue'
import { categoryApi, restaurantApi, adsApi, searchApi, type Category, type Restaurant } from '@/api/restaurant'
import { queryKeys } from '@/api/queryKeys'
import { useReveal } from '@/composables/useReveal'

useReveal()

interface SearchResultCategory {
  id: number
  restaurant: string
  name: string
}

interface SearchResultItem {
  id: number
  name: string
  img_product?: string | null
  price: string
  new_price?: string | null
  categories?: SearchResultCategory[]
}

interface SearchResponse {
  restaurants?: Restaurant[]
  items?: SearchResultItem[]
}

interface SearchGroup {
  restaurant: Restaurant
  items: SearchResultItem[]
}

type PillCategory = Category | { id: 'all'; name: string }

const route = useRoute()
const router = useRouter()

const activeCategory = ref<string>('all')
const activeSlide = ref(0)
let autoPlayTimer: ReturnType<typeof setInterval> | null = null

const searchQuery = ref(typeof route.query.q === 'string' ? route.query.q : '')

function formatPrice(val: number | string | undefined | null) {
  if (!val) return '0 UZS'
  return Number(val).toLocaleString() + ' UZS'
}

function clearSearch() {
  router.push({ path: '/restaurants' })
}

function categoryKey(cat: PillCategory) {
  return cat.id === 'all' ? 'all' : String(cat.id)
}
function isActiveCategory(cat: PillCategory) {
  return activeCategory.value === (cat.id === 'all' ? 'all' : cat.name)
}
function selectCategory(cat: PillCategory) {
  activeCategory.value = cat.id === 'all' ? 'all' : cat.name
  if (route.query.q) router.push({ path: '/restaurants' })
}

// Ads carousel
interface AdSlide {
  id: number
  promotion: string
  image_ads?: string
}

// Real photos from a themed stock-photo proxy (not our own "/ads/" path, so ad-blockers
// won't touch them) — used whenever the real ads API call fails.
const MOCK_ADS: AdSlide[] = [
  { id: -1, promotion: '1+1 on combos', image_ads: 'https://loremflickr.com/800/400/burger,food' },
  { id: -2, promotion: '20% OFF your first order', image_ads: 'https://loremflickr.com/800/400/discount,sale' },
  { id: -3, promotion: 'Free delivery today', image_ads: 'https://loremflickr.com/800/400/delivery,scooter' },
]

const { data: adsData } = useQuery<AdSlide[]>({
  queryKey: queryKeys.ads.all,
  queryFn: async () => {
    try {
      const res = await adsApi.getAll()
      return res.data && res.data.length > 0 ? res.data : MOCK_ADS
    } catch {
      return MOCK_ADS
    }
  },
})
const ads = computed(() => adsData.value ?? MOCK_ADS)

// An ad whose image is blocked (ad-blockers reject anything with "/ads/" in the
// URL) is dropped from the carousel entirely rather than shown broken or with a
// fallback — it just isn't there.
const failedAdIds = ref<number[]>([])
function onAdImageError(id: number) {
  if (!failedAdIds.value.includes(id)) failedAdIds.value = [...failedAdIds.value, id]
}
const visibleAds = computed(() => ads.value.filter(ad => !failedAdIds.value.includes(ad.id)))

function nextSlide() { activeSlide.value = (activeSlide.value + 1) % visibleAds.value.length }
function prevSlide() { activeSlide.value = (activeSlide.value - 1 + visibleAds.value.length) % visibleAds.value.length }
function goToSlide(i: number) { activeSlide.value = i }
function startAutoPlay() { if (autoPlayTimer) clearInterval(autoPlayTimer); if (visibleAds.value.length > 1) autoPlayTimer = setInterval(nextSlide, 4000) }
watch(visibleAds, () => { activeSlide.value = 0; startAutoPlay() })
onUnmounted(() => { if (autoPlayTimer) clearInterval(autoPlayTimer) })

// Category pills
const { data: categoryData } = useQuery<Category[]>({
  queryKey: queryKeys.categories.all,
  queryFn: () => categoryApi.getAll().then(res => res.data ?? []),
})
const categories = computed<PillCategory[]>(() => [{ id: 'all', name: 'All' }, ...(categoryData.value ?? [])])

// Full restaurant list — used both as the "all" browse view and as the lookup table
// search results are grouped against. TanStack Query caches this once and both uses share it.
const allRestaurantsQuery = useQuery<Restaurant[]>({
  queryKey: queryKeys.restaurants.all,
  queryFn: () => restaurantApi.getAll().then(res => res.data ?? []),
})

// Restaurants filtered by a specific (non-"all") category
const categoryRestaurantsQuery = useQuery<Restaurant[]>({
  queryKey: computed(() => [...queryKeys.restaurants.all, 'category', activeCategory.value] as const),
  queryFn: () => categoryApi.getRestaurants(activeCategory.value).then(res => res.data ?? []),
  enabled: computed(() => !searchQuery.value && activeCategory.value !== 'all'),
})

const restaurants = computed<Restaurant[]>(() => {
  if (activeCategory.value === 'all') return allRestaurantsQuery.data.value ?? []
  return categoryRestaurantsQuery.data.value ?? []
})

// Matches dish names against the lowercased query, finds which restaurant
// owns each matching dish, then groups: restaurant first, its matching
// products underneath. Also keeps restaurants whose own name matches.
const searchResultQuery = useQuery<SearchResponse>({
  queryKey: computed(() => queryKeys.search(searchQuery.value)),
  queryFn: () => searchApi.search(searchQuery.value).then(res => res.data as SearchResponse),
  enabled: computed(() => !!searchQuery.value),
})

const searchGroups = computed<SearchGroup[]>(() => {
  const data = searchResultQuery.data.value
  if (!data) return []
  const needle = searchQuery.value.toLowerCase()
  const byId = new Map((allRestaurantsQuery.data.value ?? []).map((r: Restaurant) => [r.id, r] as const))
  const groups = new Map<string, SearchGroup>()

  function groupFor(restaurant: Restaurant) {
    if (!groups.has(restaurant.id)) groups.set(restaurant.id, { restaurant, items: [] })
    return groups.get(restaurant.id)!
  }

  for (const r of data.restaurants ?? []) {
    if (r.name?.toLowerCase().includes(needle)) groupFor(r)
  }

  for (const item of data.items ?? []) {
    if (!item.name?.toLowerCase().includes(needle)) continue
    for (const c of item.categories ?? []) {
      const restaurant = byId.get(c.restaurant)
      if (!restaurant) continue
      const group = groupFor(restaurant)
      if (!group.items.some(i => i.id === item.id)) group.items.push(item)
    }
  }

  return [...groups.values()]
})

const loading = computed(() =>
  searchQuery.value
    ? (searchResultQuery.isLoading.value || allRestaurantsQuery.isLoading.value)
    : (activeCategory.value === 'all' ? allRestaurantsQuery.isLoading.value : categoryRestaurantsQuery.isLoading.value)
)

// A request that never got a response (server down, no connection) is a different
// problem than the server returning zero results — surface it as a server error, not "empty."
function hasNoResponse(error: unknown) {
  return !!error && !(error as { response?: unknown }).response
}
const serverError = computed(() =>
  searchQuery.value
    ? hasNoResponse(searchResultQuery.error.value)
    : (activeCategory.value === 'all' ? hasNoResponse(allRestaurantsQuery.error.value) : hasNoResponse(categoryRestaurantsQuery.error.value))
)

function retry() {
  if (searchQuery.value) searchResultQuery.refetch()
  else if (activeCategory.value === 'all') allRestaurantsQuery.refetch()
  else categoryRestaurantsQuery.refetch()
}

watch(() => route.query.q, (q) => {
  searchQuery.value = typeof q === 'string' ? q : ''
})
</script>
