import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: __dirname,
  server: {
    port: 5173,
    host: true,
    allowedHosts: true,
    cors: true
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    minify: 'esbuild',
    cssMinify: true,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) {
            return 'vendor-three';
          }
          if (id.includes('node_modules/firebase')) {
            return 'vendor-firebase';
          }
          if (id.includes('node_modules/gsap') || id.includes('node_modules/ogl')) {
            return 'vendor-animations';
          }
        }
      }
    }
  }
});
