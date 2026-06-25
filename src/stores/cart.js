import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref(JSON.parse(localStorage.getItem('cart') || '[]'))

  const totalItems = computed(() => items.value.reduce((sum, i) => sum + i.qty, 0))

  const totalPrice = computed(() =>
    items.value.reduce((sum, i) => sum + (i.new_price ?? i.price) * i.qty, 0),
  )

  function save() {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }

  function addItem(item) {
    const existing = items.value.find((i) => i.id === item.id)
    if (existing) {
      existing.qty++
    } else {
      items.value.push({ ...item, qty: 1 })
    }
    save()
  }

  function removeItem(id) {
    const idx = items.value.findIndex((i) => i.id === id)
    if (idx === -1) return
    if (items.value[idx].qty > 1) {
      items.value[idx].qty--
    } else {
      items.value.splice(idx, 1)
    }
    save()
  }

  function deleteItem(id) {
    items.value = items.value.filter((i) => i.id !== id)
    save()
  }

  function clear() {
    items.value = []
    save()
  }

  return { items, totalItems, totalPrice, addItem, removeItem, deleteItem, clear }
})
