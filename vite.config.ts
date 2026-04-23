import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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
