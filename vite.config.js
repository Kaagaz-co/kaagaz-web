import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Base rules:
// - dev: '/'
// - build --mode netlify: '/'
// - build --mode vercel or VERCEL env: '/'
// - other builds (e.g., GitHub Pages): '/kaagaz-web/'
export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve';
  const isNetlify = mode === 'netlify' || process.env.NETLIFY === 'true';
  const isVercel = mode === 'vercel' || process.env.VERCEL === '1';
  return {
    base: isDev || isNetlify || isVercel ? '/' : '/kaagaz-web/',
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  };
});
