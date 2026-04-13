import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages (and the S3 deployment) both serve from /react-ascii-text/.
  // In dev mode the base stays at '/' so localhost works as normal.
  base: process.env.NODE_ENV === 'production' ? '/react-ascii-text/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      // Always import from library source so the demo reflects hook changes
      // immediately — no need to rebuild the library dist during development.
      'react-ascii-text': path.resolve(__dirname, '../react-ascii-text/src/index.tsx'),
    },
  },
})
