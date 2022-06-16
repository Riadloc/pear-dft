import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import PurgeIcons from 'vite-plugin-purge-icons'
import styleImport, { VantResolve } from 'vite-plugin-style-import'
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vitejs.dev/config/
export default ({ mode }) => defineConfig({
  plugins: [
    vue(),
    styleImport({
      resolves: [VantResolve()]
    }),
    PurgeIcons(),
    createHtmlPlugin({
      inject: {
        data: {
          title: loadEnv(mode, process.cwd()).VITE_DOMAIN_NAME
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
