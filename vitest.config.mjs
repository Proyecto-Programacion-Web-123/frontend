import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'url'
import path from 'path'

const src = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@': src,
      '@/*': path.join(src, '/*'),
    },
  },

   esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
  
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    css: true,
    coverage: { provider: 'v8', reporter: ['text', 'html'] },
    exclude: [
      '**/Products.test.tsx',
      '**/Products.error.test.tsx',
      '**/node_modules/**'
    ]

  },
})
