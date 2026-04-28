import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Force the editor to our script
process.env.LAUNCH_EDITOR = path.resolve(
  __dirname,
  process.platform === 'win32' ? './scripts/agy.cmd' : './scripts/agy-wrapper.sh',
)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools({
      launchEditor: path.resolve(
        __dirname,
        process.platform === 'win32' ? './scripts/agy.cmd' : './scripts/agy-wrapper.sh',
      ),
    }),
    tailwindcss(),
  ],
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
