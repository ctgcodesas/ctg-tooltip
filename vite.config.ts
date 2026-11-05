import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'ctg-tooltip',
    },
    rollupOptions: {
      external: [/^lit/, /^@floating-ui\//],
    },
  },
})
