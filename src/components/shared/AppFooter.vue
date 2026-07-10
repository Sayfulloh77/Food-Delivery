<template>
  <footer class="mt-auto border-t" style="background:#060d1c;border-color:#1a2d4d">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <BrandLogo :size="32" :font-size="16" />
          </div>
          <p class="text-sm text-slate-500 leading-relaxed">Fast, fresh food delivered to your door.</p>
        </div>

        <div>
          <h4 class="text-slate-400 font-semibold mb-4 text-xs uppercase tracking-widest">Company</h4>
          <ul class="space-y-2 text-sm text-slate-500">
            <li><a href="#" class="hover:text-white transition-colors">About us</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Blog</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-slate-400 font-semibold mb-4 text-xs uppercase tracking-widest">For Restaurants</h4>
          <ul class="space-y-2 text-sm text-slate-500">
            <li><a href="#" class="hover:text-white transition-colors">Partner with us</a></li>            <li><RouterLink to="/admin/restaurants" class="hover:text-white transition-colors">Restaurant portal</RouterLink></li>
          </ul>
        </div>

        <div>
          <h4 class="text-slate-400 font-semibold mb-4 text-xs uppercase tracking-widest">Legal</h4>
          <ul class="space-y-2 text-sm text-slate-500">
            <li><a href="#" class="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Terms of Service</a></li>
          </ul>
        </div>

      </div>

      <div class="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-700" style="border-color:#1a2d4d">
        <p>© {{ new Date().getFullYear() }} FoodExpress. All rights reserved.</p>
        <div class="flex items-center gap-1 text-orange-500">
          <Heart class="w-3.5 h-3.5 fill-current" />
          <span>Made with love</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Heart } from '@lucide/vue'
import BrandLogo from '@/components/shared/BrandLogo.vue'
</script>
