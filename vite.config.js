import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // If deploying to GitHub Pages at https://Kaagaz-co.github.io/kaagaz-web/
  // set base to '/kaagaz-web/' so assets resolve correctly.
  base: '/kaagaz-web/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
