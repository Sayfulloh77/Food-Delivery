<template>
  <div class="min-h-screen" style="background:#060d1c">
    <div class="max-w-2xl mx-auto px-4 py-10">

      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-extrabold text-white">Notifications</h1>
        <button
          v-if="unreadCount > 0"
          class="text-sm font-semibold text-orange-400 hover:text-orange-300 transition"
          @click="markAllRead"
        >
          Mark all read
        </button>
      </div>

      <!-- Unread count chip -->
      <div v-if="unreadCount > 0" class="mb-5">
        <span class="text-xs font-bold px-3 py-1.5 rounded-full" style="background:rgba(249,115,22,0.15);color:#f97316;border:1px solid rgba(249,115,22,0.3)">
          {{ unreadCount }} unread
        </span>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="space-y-3 animate-pulse">
        <div v-for="n in 5" :key="n" class="rounded-2xl p-4 h-20" style="background:#0d1b35" />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-20">
        <p class="text-white font-bold">Failed to load notifications</p>
        <button class="mt-4 px-5 py-2 rounded-xl text-black text-sm font-bold" style="background:#f97316" @click="load">Retry</button>
      </div>

      <!-- Empty -->
      <div v-else-if="notifications.length === 0" class="text-center py-24">
        <div class="text-6xl mb-4">🔔</div>
        <p class="text-white font-bold text-lg">No notifications yet</p>
        <p class="text-slate-500 text-sm mt-1">You'll see order updates here</p>
      </div>

      <!-- List -->
      <div v-else class="space-y-3">
        <div
          v-for="n in notifications"
          :key="n.id"
          class="rounded-2xl p-4 flex gap-3 transition-all border"
          :style="n.is_read
            ? 'background:#0d1b35;border-color:#1a2d4d;opacity:0.6'
            : 'background:#0f1f3d;border-color:#1e3a6e;cursor:pointer'"
          @click="markRead(n)"
        >
          <div class="mt-1 shrink-0">
            <span class="w-2.5 h-2.5 rounded-full block" :style="n.is_read ? 'background:#1a2d4d' : 'background:#f97316'" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <p class="font-bold text-white text-sm">{{ n.title }}</p>
              <span class="text-slate-600 text-xs shrink-0">{{ timeAgo(n.created_at) }}</span>
            </div>
            <p class="text-slate-400 text-xs mt-0.5 line-clamp-2">{{ n.body }}</p>
            <span
              v-if="n.type"
              class="mt-2 inline-block text-xs font-bold px-2 py-0.5 rounded-full"
              style="background:rgba(59,130,246,0.15);color:#60a5fa"
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
