import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: 'src/ui_frontend',
  server: { 
    port: 5174,
    hmr: {
      overlay: false // Disable error overlay to prevent blocking
    },
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      },
      '/ws': {
        target: 'ws://localhost:4000',
        ws: true
      }
    }
  },
  build: { outDir: '../../dist/ui', emptyOutDir: true },
  esbuild: {
    // Skip TypeScript checking in esbuild to avoid path issues
    tsconfigRaw: {
      compilerOptions: {
        jsx: 'react-jsx'
      }
    }
  }
})


