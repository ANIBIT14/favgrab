import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: {
      '/api/favicon': {
        target: 'https://t0.gstatic.com',
        changeOrigin: true,
        rewrite: (path) => {
          const queryStr = path.replace('/api/favicon?', '').replace('/api/favicon', '')
          return `/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&${queryStr}`
        },
      },
    },
  },
})
