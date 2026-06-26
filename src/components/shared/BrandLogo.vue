<template>
  <RouterLink to="/" class="flex items-center gap-2 shrink-0">
    <div class="relative" :style="`width:${size}px;height:${size}px`">
      <svg :width="size" :height="size" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" rx="10" fill="#f97316"/>
        <!-- Bowl -->
        <path d="M9 20 C9 26 27 26 27 20" stroke="white" stroke-width="2.2" stroke-linecap="round"/>
        <!-- Steam lines -->
        <path d="M14 16 Q15 14 14 12" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M18 15 Q19 13 18 11" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M22 16 Q23 14 22 12" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
        <!-- Base line -->
        <line x1="7" y1="23" x2="29" y2="23" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
    <span v-if="showText" class="font-bold tracking-tight" :style="`font-size:${fontSize}px;color:white`">
      Food<span style="color:#f97316">Express</span>
    </span>
  </RouterLink>
</template>

<script setup>
defineProps({
  size: { type: Number, default: 36 },
  fontSize: { type: Number, default: 18 },
  showText: { type: Boolean, default: true },
})
</script>
