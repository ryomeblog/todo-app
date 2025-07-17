import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// リポジトリ名を指定（GitHub Pagesでの公開用）
const repoName = 'todo-app'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? `/${repoName}/` : '/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  }
})