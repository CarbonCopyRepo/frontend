import dotenv from 'dotenv';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

dotenv.config();
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    exclude: [
      '**/playwright/**',
      '**/node_modules/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
    ],
  },
  preview: {
    port: 8080,
    strictPort: true,
  },
  server: {
    port: 8080,
    strictPort: true,
    host: true,
  },
  define: {
    'process.env': process.env,
  },
});
