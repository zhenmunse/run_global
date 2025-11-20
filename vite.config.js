import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: process.env.VITE_BASE || '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    // Disable SPA fallback for specific patterns (markdown files)
    middlewareMode: false,
    fs: {
      strict: false
    }
  },
  // Ensure public directory files are served correctly
  publicDir: 'public',
  assetsInclude: ['**/*.md'],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
