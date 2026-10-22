import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 8083,
    proxy: {
      '/api': {
        // Apunta al nombre real del contenedor 'Ux-backend' en el puerto '3001'
        target: process.env.VITE_PROXY_TARGET || 'http://Ux-backend:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});