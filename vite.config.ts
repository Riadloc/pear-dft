import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import PurgeIcons from 'vite-plugin-purge-icons'
import styleImport, { VantResolve } from 'vite-plugin-style-import'
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    styleImport({
      resolves: [VantResolve()]
    }),
    PurgeIcons(),
    createHtmlPlugin({
      inject: {
        data: {
          title: import.meta.env.VITE_DOMAIN_NAME
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    port: 8000,
    host: '0.0.0.0'
  },
  esbuild: {
    pure: ['console.log'],
    minify: true
  }
})
