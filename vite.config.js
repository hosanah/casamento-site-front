import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '5173-iwkr8qyofo1hq333cftog-dc36dad8.manus.computer',
      '5174-iwkr8qyofo1hq333cftog-dc36dad8.manus.computer',
      'localhost'
    ]
  }
})
