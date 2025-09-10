/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,                  // allows describe, it, expect without imports
    environment: 'jsdom',           // needed for React component testing
    setupFiles: './tests/setup.ts', // path to your setup file
  },
});
