import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,      // 👈 allow LAN access
    port: 5173,      // optional (default)
    strictPort: true // optional but recommended
  }
})
