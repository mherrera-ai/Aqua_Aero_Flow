import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'render': ['./src/render/canvas2d.js', './src/render/webgl.js'],
          'core': ['./src/core/particle.js', './src/core/flowfield.js'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})