import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  base: process.env.VITE_BASE || (command === 'build' ? './' : '/'),
  plugins: [react()],
  server: { port: process.env.PORT ? Number(process.env.PORT) : undefined, host: true },
}));
