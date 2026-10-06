import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Permanent fix: Vite strips all favicon <link> tags except favicon.png during build.
// This plugin explicitly copies every favicon file from public/ to dist/ after each build.
const copyFavicons = () => ({
  name: 'copy-favicons',
  writeBundle() {
    const publicDir = path.resolve(__dirname, 'public');
    const distDir = path.resolve(__dirname, 'dist');
    const faviconFiles = [
      'favicon.ico',
      'favicon.png',
      'favicon-32x32.png',
      'favicon-48x48.png',
      'favicon-96x96.png',
      'favicon-180x180.png',
      'favicon-192x192.png',
      'apple-touch-icon.png',
    ];
    faviconFiles.forEach((file) => {
      const src = path.join(publicDir, file);
      const dest = path.join(distDir, file);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`[copy-favicons] Copied ${file} → dist/`);
      } else {
        console.warn(`[copy-favicons] WARNING: ${file} not found in public/`);
      }
    });
  },
});

export default defineConfig({
  root: __dirname,
  plugins: [copyFavicons()],
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
