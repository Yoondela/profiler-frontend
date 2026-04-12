import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import svgr from 'vite-plugin-svgr';
// import viteBasicSslPlugin from 'node_modules/@vitejs/plugin-basic-ssl/dist';
// import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // basicSsl(),
    svgr({ svgrOptions: { icon: true } }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // https: true,
    // host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // your Express port
        changeOrigin: true,
      },
    },
  },
});
