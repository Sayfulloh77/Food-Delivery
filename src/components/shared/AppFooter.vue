<template>
  <footer class="bg-gray-900 text-gray-400 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-12">

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

        <!-- Brand -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:#ff5722">
              <UtensilsCrossed class="w-4 h-4 text-white" />
            </div>
            <span class="font-bold text-white text-lg">Food<span style="color:#ff5722">Express</span></span>
          </div>
          <p class="text-sm leading-relaxed">
            Fast, fresh, and delicious food delivered to your door. Order from the best local restaurants.
          </p>
        </div>

        <!-- Company -->
        <div>
          <h4 class="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="hover:text-white transition-colors">About us</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Blog</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Press</a></li>
          </ul>
        </div>

        <!-- For restaurants -->
        <div>
          <h4 class="text-white font-semibold mb-4 text-sm uppercase tracking-wider">For Restaurants</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="hover:text-white transition-colors">Partner with us</a></li>
            <li><RouterLink to="/admin/menu" class="hover:text-white transition-colors">Restaurant portal</RouterLink></li>
            <li><a href="#" class="hover:text-white transition-colors">Business support</a></li>
          </ul>
        </div>

        <!-- Legal -->
        <div>
          <h4 class="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Cookie Policy</a></li>
          </ul>
        </div>

      </div>

      <!-- Bottom bar -->
      <div class="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <p>© {{ new Date().getFullYear() }} FoodExpress. All rights reserved.</p>
        <div class="flex items-center gap-1 text-gray-500">
          <Heart class="w-4 h-4 fill-current" style="color:#ff5722" />
          <span>Made with love for foodies</span>
        </div>
      </div>

    </div>
  </footer>
</template>

<script setup>
import { UtensilsCrossed, Heart } from '@lucide/vue'
</script>
