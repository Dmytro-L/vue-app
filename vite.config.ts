import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
console.log(path.resolve(__dirname, './src'))

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@types': path.resolve(__dirname, './src'),
    }
  }
})
