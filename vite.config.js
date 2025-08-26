import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Base rules:
// - dev: '/'
// - build --mode netlify: '/'
// - other builds (e.g., GitHub Pages): '/kaagaz-web/'
export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve';
  const isNetlify = mode === 'netlify' || process.env.NETLIFY === 'true';
  return {
    base: isDev || isNetlify ? '/' : '/kaagaz-web/',
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  };
});
