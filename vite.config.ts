import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,

    // Vite usa esbuild por defecto. Esto evita depender de "terser".
    minify: 'esbuild',

    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'lucide-react', '@google/genai'],
        },
      },
    },
  },

  server: {
    port: 3000,
    strictPort: true,
  },
});
