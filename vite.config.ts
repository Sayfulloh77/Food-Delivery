import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api/auth': {
        target: 'http://13.63.45.70:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/restaurant-api': {
        target: 'http://13.60.215.42:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/restaurant-api/, ''),
      },
      '/order-api': {
        target: 'http://18.212.91.176:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/order-api/, ''),
      },
    },
  },
})
