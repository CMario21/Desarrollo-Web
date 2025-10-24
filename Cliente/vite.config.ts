// Cliente/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Si alguna vez sirves desde subruta en prod, ajusta base:
  // base: '/',
});