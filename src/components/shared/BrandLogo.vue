<template>
  <RouterLink to="/" class="flex items-center gap-2.5 shrink-0">
    <div
      class="flex items-center justify-center rounded-xl bg-orange-500 shadow-md shadow-orange-500/30"
      :style="`width:${size}px;height:${size}px`"
    >
      <component :is="UtensilsCrossed" :size="Math.round(size * 0.55)" color="white" :stroke-width="2.2" />
    </div>
    <span v-if="showText" class="font-bold tracking-tight leading-none" :style="`font-size:${fontSize}px`">
      <span class="text-white">Food</span><span class="text-orange-500">Express</span>
    </span>
  </RouterLink>
</template>

<script setup lang="ts">
import { UtensilsCrossed } from '@lucide/vue'

defineProps({
  size: { type: Number, default: 36 },
  fontSize: { type: Number, default: 18 },
  showText: { type: Boolean, default: true },
})
</script>
