import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    outDir: '../dist', // Specify output relative to project root
    assetsDir: 'assets',
    assetsInlineLimit: 0,
  },
  publicDir: '../public',
  root: './src',
  envDir: '../',

  // depending on your application, base can also be "/"
  base: '/', // Ensures assets are served from the root
  plugins: [react(), viteTsconfigPaths()],
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000
    port: 3000,
  },
});
