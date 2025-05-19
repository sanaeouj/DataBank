import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
       external: ['@rollup/rollup-linux-x64-gnu'],  
    },
  },
});