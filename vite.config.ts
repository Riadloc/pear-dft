import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import PurgeIcons from 'vite-plugin-purge-icons'
import styleImport, { VantResolve } from 'vite-plugin-style-import'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    styleImport({
      resolves: [VantResolve()]
    }),
    PurgeIcons()
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    port: 8000
  }
})
