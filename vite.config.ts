import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  base: process.env.VITE_BASE || (command === 'build' ? './' : '/'),
  plugins: [react()],
  // ARTIFACT=1 inlines every image and font so the build can become one self-contained page
  build: process.env.ARTIFACT ? { assetsInlineLimit: 1e8, cssCodeSplit: false } : {},
  server: { port: process.env.PORT ? Number(process.env.PORT) : undefined, host: true },
}));
