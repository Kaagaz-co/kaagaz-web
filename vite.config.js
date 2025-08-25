import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Use root base in dev; keep '/kaagaz-web/' for production builds (GitHub Pages)
export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : '/kaagaz-web/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
}));
