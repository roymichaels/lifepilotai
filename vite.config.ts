import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'

export default defineConfig({
  define: {
    'import.meta.env.VITE_USE_PYTHAGORA': JSON.stringify(process.env.VITE_USE_PYTHAGORA ?? 'false')
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
  },
  server: {
    host: true,
    proxy: {
      '/logs': {
        target: 'http://localhost:4444',
        changeOrigin: true,
      },
      '/projects': {
        target: API_BASE_URL,
        changeOrigin: true,
        rewrite: (path) => path,
      },
      '/subscription': {
        target: API_BASE_URL,
        changeOrigin: true,
        rewrite: (path) => path,
      },
      '/users': {
        target: API_BASE_URL,
        changeOrigin: true,
        rewrite: (path) => path,
      },
      '/boards': {
        target: API_BASE_URL,
        changeOrigin: true,
        rewrite: (path) => path,
      },
      '/widgets': {
        target: API_BASE_URL,
        changeOrigin: true,
        rewrite: (path) => path,
      },
      '/goals': {
        target: API_BASE_URL,
        changeOrigin: true,
        rewrite: (path) => path,
      },
      '/roadmap': {
        target: API_BASE_URL,
        changeOrigin: true,
        rewrite: (path) => path,
      },
      '/achievements': {
        target: API_BASE_URL,
        changeOrigin: true,
        rewrite: (path) => path,
      },
      '/rewards': {
        target: API_BASE_URL,
        changeOrigin: true,
        rewrite: (path) => path,
      },
      '/character': {
        target: API_BASE_URL,
        changeOrigin: true,
        rewrite: (path) => path,
      },
      '/auth': {
        target: API_BASE_URL,
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
    allowedHosts: [
      'localhost',
      '.pythagora.ai'
    ],
    watch: {
      ignored: ['**/node_modules/**', '**/dist/**', '**/public/**', '**/log/**']
    }
  },
})
