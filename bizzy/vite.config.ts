import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/core': path.resolve(__dirname, './core'),
      '@/extensions': path.resolve(__dirname, './extensions')
    }
  }
}); 