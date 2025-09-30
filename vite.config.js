import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Jharkhand_Tourism_Website-main/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
