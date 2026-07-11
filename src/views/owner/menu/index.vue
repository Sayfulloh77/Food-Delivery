<template>
  <div class="space-y-5">

    <!-- Tabs -->
    <div class="flex gap-1 p-1 rounded-xl w-fit" style="background:#060d1c">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
        :style="activeTab === tab.key ? 'background:#f97316;color:#000' : 'color:#64748b'"
      >
        {{ tab.label }}
        <span class="ml-1.5 text-xs px-1.5 py-0.5 rounded-full" :class="activeTab === tab.key ? 'bg-black/20 text-black' : 'bg-white/5 text-slate-600'">
          {{ counts[tab.key] }}
        </span>
      </button>
    </div>

    <!-- Add button -->
    <div class="flex justify-end">
      <button @click="openCreate" class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-black transition-all hover:opacity-85" style="background:#f97316">
        <Plus class="w-4 h-4" /> Add {{ tabLabel }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <div class="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style="border-color:#f97316;border-top-color:transparent" />
    </div>

    <!-- RESTAURANTS -->
    <div v-else-if="activeTab === 'restaurants'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-if="restaurantRows.length === 0" class="col-span-3 flex flex-col items-center justify-center py-16 text-zinc-700">
        <UtensilsCrossed class="w-10 h-10 mb-2 opacity-40" /><p class="text-sm">No restaurants yet</p>
      </div>
      <div
        v-for="r in restaurantRows" :key="r.id"
        class="rounded-2xl overflow-hidden border transition-all hover:border-zinc-700"
        style="background:#0d1b35;border-color:#1a2d4d"
      >
        <div class="h-36 relative" style="background:#1a2d4d">
          <img v-if="r.restaurant_img" :src="r.restaurant_img" class="w-full h-full object-cover opacity-80" />
          <div v-else class="w-full h-full flex items-center justify-center"><UtensilsCrossed class="w-10 h-10 text-zinc-700" /></div>
          <span class="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full" :class="r.is_open ? 'bg-green-600/90 text-white' : 'bg-zinc-700 text-zinc-300'">
            {{ r.is_open ? 'Open' : 'Closed' }}
          </span>
        </div>
        <div class="p-4">
          <p class="font-bold text-white truncate">{{ r.name }}</p>
          <p class="text-xs text-zinc-500 mt-0.5 truncate">{{ r.address }}</p>
          <div class="flex justify-end mt-3">
            <button @click="deleteRow(r.id)" class="text-xs px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- MENU ITEMS -->
    <div v-else-if="activeTab === 'items'" class="rounded-2xl border overflow-hidden" style="background:#060d1c;border-color:#1a2d4d">
      <div v-if="itemRows.length === 0" class="flex flex-col items-center justify-center py-16 text-zinc-700">
        <ShoppingBag class="w-10 h-10 mb-2 opacity-40" /><p class="text-sm">No menu items yet</p>
      </div>
      <table v-else class="w-full text-sm">
        <thead class="border-b" style="background:#0d1b35;border-color:#1a2d4d">
          <tr>
            <th class="text-left px-5 py-3 font-medium text-zinc-500">Item</th>
            <th class="text-left px-5 py-3 font-medium text-zinc-500">Price</th>
            <th class="text-left px-5 py-3 font-medium text-zinc-500">Discount</th>
            <th class="text-left px-5 py-3 font-medium text-zinc-500">Delivery</th>
            <th class="text-right px-5 py-3 font-medium text-zinc-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in itemRows" :key="item.id" class="border-b hover:bg-white/2 transition-colors" style="border-color:#1a2d4d">
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl overflow-hidden shrink-0" style="background:#1a2d4d">
                  <img v-if="item.img_product" :src="item.img_product" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center"><ShoppingBag class="w-4 h-4 text-zinc-700" /></div>
                </div>
                <div>
                  <p class="font-semibold text-white">{{ item.name }}</p>
                  <p class="text-xs text-zinc-600 truncate max-w-40">{{ item.description || '—' }}</p>
                </div>
              </div>
            </td>
            <td class="px-5 py-3.5 font-semibold text-white">{{ Number(item.price).toLocaleString() }} UZS</td>
            <td class="px-5 py-3.5">
              <span v-if="item.discount_status" class="px-2 py-0.5 rounded-full text-xs bg-green-500/15 text-green-400">{{ item.discount }}%</span>
              <span v-else class="text-zinc-600">—</span>
            </td>
            <td class="px-5 py-3.5 text-zinc-500">{{ item.delivery_time || '—' }}</td>
            <td class="px-5 py-3.5 text-right">
              <button @click="deleteRow(item.id)" class="text-xs px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- CATEGORIES (per-restaurant item categories) -->
    <div v-else-if="activeTab === 'categories'" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <div v-if="categoryRows.length === 0" class="col-span-4 flex flex-col items-center justify-center py-16 text-zinc-700">
        <Tag class="w-10 h-10 mb-2 opacity-40" /><p class="text-sm">No categories yet</p>
      </div>
      <div v-for="c in categoryRows" :key="c.id" class="rounded-2xl p-4 border flex items-center justify-between" style="background:#0d1b35;border-color:#1a2d4d">
        <span class="font-medium text-white truncate">{{ c.name }}</span>
        <button @click="deleteRow(c.id)" class="ml-2 shrink-0 text-red-500/60 hover:text-red-400 transition-colors">
          <Trash2 class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- ADS -->
    <div v-else-if="activeTab === 'ads'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-if="adRows.length === 0" class="col-span-3 flex flex-col items-center justify-center py-16 text-zinc-700">
        <Megaphone class="w-10 h-10 mb-2 opacity-40" /><p class="text-sm">No ads yet</p>
      </div>
      <div v-for="ad in adRows" :key="ad.id" class="rounded-2xl overflow-hidden border" style="background:#0d1b35;border-color:#1a2d4d">
        <div class="h-40" style="background:#1a2d4d">
          <img v-if="ad.image_ads" :src="ad.image_ads" class="w-full h-full object-cover opacity-80" />
        </div>
        <div class="p-4 flex items-center justify-between gap-2">
          <p class="text-sm font-semibold text-white truncate">{{ ad.promotion }}</p>
          <button @click="deleteRow(ad.id)" class="shrink-0 text-red-500/60 hover:text-red-400 transition-colors">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- CREATE MODAL -->
    <div v-if="showCreate" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div class="rounded-2xl shadow-2xl w-full max-w-lg p-6 my-auto border" style="background:#0d1b35;border-color:#1a2d4d">
        <h3 class="text-lg font-bold text-white mb-5">Add {{ tabLabel }}</h3>

        <!-- Restaurant form -->
        <div v-if="activeTab === 'restaurants'" class="space-y-4">
          <MField label="Name *"><input v-model="form.name" type="text" class="m-input" placeholder="Restaurant name" /></MField>
          <MField label="Description"><textarea v-model="form.description" class="m-input resize-none h-20" placeholder="Short description" /></MField>
          <MField label="Address URL *"><input v-model="form.address" type="url" class="m-input" placeholder="https://maps.google.com/..." /></MField>
          <MField label="Image"><input type="file" accept="image/*" @change="onFile($event, 'restaurant_img')" class="text-sm text-zinc-400" /></MField>
          <MField label="Category IDs (comma separated)"><input v-model="form.categoriesRaw" type="text" class="m-input" placeholder="1, 2, 3" /></MField>
          <label class="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
            <input type="checkbox" v-model="form.is_open" class="accent-orange-500" /> Open now
          </label>
        </div>

        <!-- Menu item form -->
        <div v-else-if="activeTab === 'items'" class="space-y-4">
          <MField label="Restaurant *">
            <select v-model="form.restaurant" class="m-input">
              <option value="" disabled>Select restaurant</option>
              <option v-for="r in restaurants" :key="r.id" :value="r.id">{{ r.name }}</option>
            </select>
          </MField>
          <MField label="Item Category *">
            <select v-model="form.category" class="m-input">
              <option value="" disabled>Select category</option>
              <option v-for="c in categoriesForRestaurant(form.restaurant)" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </MField>
          <MField label="Name *"><input v-model="form.name" type="text" class="m-input" placeholder="Item name" /></MField>
          <MField label="Description"><textarea v-model="form.description" class="m-input resize-none h-16" /></MField>
          <div class="grid grid-cols-2 gap-4">
            <MField label="Price *"><input v-model="form.price" type="number" class="m-input" placeholder="0.00" /></MField>
            <MField label="Discount %"><input v-model="form.discount" type="number" class="m-input" placeholder="0" /></MField>
          </div>
          <MField label="Delivery time"><input v-model="form.delivery_time" type="text" class="m-input" placeholder="30 min" /></MField>
          <MField label="Image"><input type="file" accept="image/*" @change="onFile($event, 'img_product')" class="text-sm text-zinc-400" /></MField>
          <label class="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
            <input type="checkbox" v-model="form.discount_status" class="accent-orange-500" /> Has discount
          </label>
        </div>

        <!-- Category form -->
        <div v-else-if="activeTab === 'categories'" class="space-y-4">
          <MField label="Restaurant *">
            <select v-model="form.restaurant" class="m-input">
              <option value="" disabled>Select restaurant</option>
              <option v-for="r in restaurants" :key="r.id" :value="r.id">{{ r.name }}</option>
            </select>
          </MField>
          <MField label="Category name *"><input v-model="form.name" type="text" class="m-input" placeholder="e.g. Appetizers" /></MField>
        </div>

        <!-- Ads form -->
        <div v-else-if="activeTab === 'ads'" class="space-y-4">
          <MField label="Restaurant *">
            <select v-model="form.restaurant" class="m-input">
              <option value="" disabled>Select restaurant</option>
              <option v-for="r in restaurants" :key="r.id" :value="r.id">{{ r.name }}</option>
            </select>
          </MField>
          <MField label="Promotion text *"><input v-model="form.promotion" type="text" class="m-input" placeholder="50% off today!" /></MField>
          <MField label="Ad image *"><input type="file" accept="image/*" @change="onFile($event, 'image_ads')" class="text-sm text-zinc-400" /></MField>
        </div>

        <p v-if="createError" class="mt-3 text-sm text-red-400">{{ createError }}</p>
        <div class="flex gap-3 mt-6">
          <button @click="showCreate = false; createError = ''" class="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 border border-zinc-800 hover:bg-white/5 transition-colors">Cancel</button>
          <button @click="submitCreate" :disabled="creating" class="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-black transition-all hover:opacity-85 disabled:opacity-40" style="background:#f97316">
            {{ creating ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, h, type PropType, type Slot } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { Plus, UtensilsCrossed, ShoppingBag, Tag, Trash2, Megaphone } from '@lucide/vue'
import { restaurantApi, menuitemApi, menuCategoryApi, adsApi, type Restaurant, type MenuItem, type CategoryMenu, type Advertisement } from '@/api/restaurant'
import { queryKeys } from '@/api/queryKeys'
import { useAuthStore } from '@/stores/auth'

type Tab = 'restaurants' | 'items' | 'categories' | 'ads'

// Fields for every tab's create form live on one object — it's serialized straight into
// FormData (buildFormData) — so all four tabs' fields are declared together, each optional.
interface OwnerForm {
  name?: string
  description?: string
  address?: string
  restaurant_img?: File | null
  categoriesRaw?: string
  is_open?: boolean
  restaurant?: string
  category?: string | number
  price?: string | number
  discount?: string | number
  delivery_time?: string
  img_product?: File | null
  discount_status?: boolean
  promotion?: string
  image_ads?: File | null
}

const authStore = useAuthStore()
const ownerId = computed(() => authStore.user?.id)
const isAdmin = computed(() => ['ADMIN', 'SUPERADMIN'].includes(authStore.user?.role ?? ''))

const MField = {
  props: { label: { type: String as PropType<string>, required: true } },
  setup(props: { label: string }, { slots }: { slots: { default?: Slot } }) {
    return () => h('div', [
      h('label', { class: 'block text-xs font-medium text-zinc-500 mb-1.5' }, props.label),
      slots.default?.(),
    ])
  },
}

const tabs: { key: Tab; label: string }[] = [
  { key: 'restaurants', label: 'Restaurants' },
  { key: 'items', label: 'Menu Items' },
  { key: 'categories', label: 'Categories' },
  { key: 'ads', label: 'Ads' },
]

const queryClient = useQueryClient()
const activeTab = ref<Tab>('restaurants')
const showCreate = ref(false)
const createError = ref('')
const form = ref<OwnerForm>({})

// One query per tab (cached independently), same pattern as admin/users.
const restaurantsQuery = useQuery<Restaurant[]>({
  queryKey: queryKeys.restaurants.all,
  queryFn: () => (isAdmin.value ? restaurantApi.getAll() : restaurantApi.getByOwner(ownerId.value as number)).then(res => res.data ?? []),
  enabled: computed(() => isAdmin.value || !!ownerId.value),
})
const itemsQuery = useQuery<MenuItem[]>({
  queryKey: queryKeys.menuItems.all,
  queryFn: () => menuitemApi.getAll().then(res => res.data ?? []),
})
const categoriesQuery = useQuery<CategoryMenu[]>({
  queryKey: queryKeys.menuCategories.all,
  queryFn: () => menuCategoryApi.getAll().then(res => res.data ?? []),
})
const adsQuery = useQuery<Advertisement[]>({
  queryKey: queryKeys.ads.all,
  queryFn: () => adsApi.getAll().then(res => res.data ?? []),
})

const restaurants = computed(() => restaurantsQuery.data.value ?? [])
const restaurantRows = restaurants
const itemRows = computed(() => itemsQuery.data.value ?? [])
const categoryRows = computed(() => categoriesQuery.data.value ?? [])
const adRows = computed(() => adsQuery.data.value ?? [])
const loading = computed(() => {
  if (activeTab.value === 'restaurants') return restaurantsQuery.isLoading.value
  if (activeTab.value === 'items') return itemsQuery.isLoading.value
  if (activeTab.value === 'categories') return categoriesQuery.isLoading.value
  return adsQuery.isLoading.value
})
const counts = computed(() => ({
  restaurants: restaurants.value.length,
  items: itemRows.value.length,
  categories: categoryRows.value.length,
  ads: adRows.value.length,
}))
const tabLabel = computed(() => tabs.find(t => t.key === activeTab.value)?.label ?? '')

function categoriesForRestaurant(restaurantId: string | number | undefined) {
  if (!restaurantId) return []
  return categoryRows.value.filter(c => c.restaurant === restaurantId)
}

function openCreate() {
  form.value = { is_open: true, discount_status: false, restaurant: '', category: '' }
  createError.value = ''
  showCreate.value = true
}

function onFile(e: Event, field: 'restaurant_img' | 'img_product' | 'image_ads') {
  const target = e.target as HTMLInputElement
  form.value[field] = target.files?.[0] ?? null
}

function buildFormData() {
  const fd = new FormData()
  for (const [k, v] of Object.entries(form.value)) {
    if (k === 'categoriesRaw' || v === null || v === undefined) continue
    const key = activeTab.value === 'items' && k === 'restaurant' ? 'restaurant_uuid' : k
    fd.append(key, v instanceof File ? v : String(v))
  }
  if (activeTab.value === 'restaurants' && form.value.categoriesRaw) {
    String(form.value.categoriesRaw).split(',').map(s => s.trim()).filter(Boolean).forEach(id => fd.append('categories', id))
  }
  return fd
}

function errorMessage(e: unknown, fallback: string) {
  const err = e as { response?: { data?: { detail?: string; message?: string } } }
  return err.response?.data?.detail ?? err.response?.data?.message ?? fallback
}

const TAB_QUERY_KEY: Record<Tab, readonly unknown[]> = {
  restaurants: queryKeys.restaurants.all,
  items: queryKeys.menuItems.all,
  categories: queryKeys.menuCategories.all,
  ads: queryKeys.ads.all,
}

const createMutation = useMutation({
  mutationFn: (fd: FormData) => {
    if (activeTab.value === 'restaurants') return restaurantApi.create(fd)
    if (activeTab.value === 'items') return menuitemApi.create(fd)
    if (activeTab.value === 'categories') return menuCategoryApi.create(fd)
    return adsApi.create(fd)
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: TAB_QUERY_KEY[activeTab.value] })
    showCreate.value = false
  },
  onError: (e) => { createError.value = errorMessage(e, 'Failed to save') },
})
const creating = createMutation.isPending

function submitCreate() {
  createError.value = ''
  createMutation.mutate(buildFormData())
}

const deleteMutation = useMutation({
  mutationFn: ({ tab, id }: { tab: Tab; id: string | number }) => {
    if (tab === 'restaurants') return restaurantApi.delete(id as string)
    if (tab === 'items') return menuitemApi.delete(id as number)
    if (tab === 'categories') return menuCategoryApi.delete(id as number)
    return adsApi.delete(id as number)
  },
  onSuccess: (_res, { tab }) => queryClient.invalidateQueries({ queryKey: TAB_QUERY_KEY[tab] }),
  onError: (e) => alert(errorMessage(e, 'Failed to delete')),
})

function deleteRow(id: string | number) {
  if (!confirm('Delete this item?')) return
  deleteMutation.mutate({ tab: activeTab.value, id })
}
</script>

<style scoped>
.m-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 0.75rem;
  color: white;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s;
}
.m-input { background: #060d1c; border-color: #1a2d4d; }
.m-input:focus { border-color: #f97316; }
.m-input option { background: #060d1c; }
</style>
