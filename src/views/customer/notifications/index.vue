<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="max-w-2xl mx-auto px-4 py-8">

      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Notifications</h1>
        <button
          v-if="unreadCount > 0"
          class="text-sm font-medium"
          style="color:#ff5722"
          @click="markAllRead"
        >
          Mark all read
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="space-y-3 animate-pulse">
        <div v-for="n in 5" :key="n" class="bg-white rounded-2xl p-4 h-20" />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-20 text-gray-400">
        <p>Failed to load notifications.</p>
        <button class="mt-3 text-sm font-medium" style="color:#ff5722" @click="load">Retry</button>
      </div>

      <!-- Empty -->
      <div v-else-if="notifications.length === 0" class="text-center py-24">
        <div class="text-5xl mb-4">🔔</div>
        <p class="text-gray-500 font-medium">No notifications yet</p>
        <p class="text-gray-400 text-sm mt-1">You'll see order updates here</p>
      </div>

      <!-- List -->
      <div v-else class="space-y-3">
        <div
          v-for="n in notifications"
          :key="n.id"
          class="bg-white rounded-2xl p-4 shadow-sm flex gap-3 cursor-pointer transition hover:shadow-md"
          :class="n.is_read ? 'opacity-60' : ''"
          @click="markRead(n)"
        >
          <!-- Dot indicator -->
          <div class="mt-1 shrink-0">
            <span
              class="w-2.5 h-2.5 rounded-full block"
              :class="n.is_read ? 'bg-gray-200' : 'bg-orange-500'"
            />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <p class="font-semibold text-gray-900 text-sm">{{ n.title }}</p>
              <span class="text-gray-400 text-xs shrink-0">{{ timeAgo(n.created_at) }}</span>
            </div>
            <p class="text-gray-500 text-xs mt-0.5 line-clamp-2">{{ n.body }}</p>
            <span
              v-if="n.type"
              class="mt-1.5 inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-600"
            >
              {{ n.type }}
            </span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { notificationApi } from '@/api/notification'

const notifications = ref([])
const loading = ref(true)
const error = ref(false)

const unreadCount = computed(() => notifications.value.filter((n) => !n.is_read).length)

async function load() {
  loading.value = true
  error.value = false
  try {
    const res = await notificationApi.getAll()
    notifications.value = res.data
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

async function markRead(n) {
  if (n.is_read) return
  try {
    await notificationApi.markRead(n.id)
    n.is_read = true
  } catch {}
}

async function markAllRead() {
  const unread = notifications.value.filter((n) => !n.is_read)
  await Promise.all(unread.map((n) => markRead(n)))
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

onMounted(load)
</script>
