import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CartItem {
  id: number
  name: string
  img_product?: string | null
  price: number | string
  new_price?: number | string | null
  restaurantId?: string
  restaurantName?: string
  qty: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(JSON.parse(localStorage.getItem('cart') || '[]'))

  const totalItems = computed(() => items.value.reduce((sum, i) => sum + i.qty, 0))

  const totalPrice = computed(() =>
    items.value.reduce((sum, i) => sum + Number(i.new_price ?? i.price) * i.qty, 0),
  )

  function save() {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }

  function removeItem(id: number) {
    const idx = items.value.findIndex((i) => i.id === id)
    if (idx === -1) return
    if (items.value[idx].qty > 1) {
      items.value[idx].qty--
    } else {
      items.value.splice(idx, 1)
    }
    save()
  }

  function deleteItem(id: number) {
    items.value = items.value.filter((i) => i.id !== id)
    save()
  }

  function clear() {
    items.value = []
    save()
  }

  const drawerOpen = ref(false)
  function openDrawer() { drawerOpen.value = true }
  function closeDrawer() { drawerOpen.value = false }

  function addItem(item: Omit<CartItem, 'qty'>) {
    // Orders can only belong to one restaurant — the backend rejects a checkout whose
    // items span more than one, so a cart can't silently mix restaurants either.
    const fromDifferentRestaurant = items.value.length > 0 && items.value[0].restaurantId !== item.restaurantId
    if (fromDifferentRestaurant) {
      const ok = confirm(`Your cart has items from ${items.value[0].restaurantName ?? 'another restaurant'}. Adding this item will clear your current cart. Continue?`)
      if (!ok) return
      items.value = []
    }
    const existing = items.value.find((i) => i.id === item.id)
    if (existing) { existing.qty++ } else { items.value.push({ ...item, qty: 1 }) }
    save()
    drawerOpen.value = true
  }

  return { items, totalItems, totalPrice, drawerOpen, openDrawer, closeDrawer, addItem, removeItem, deleteItem, clear }
})
