import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';

function precacheManifestPlugin(): Plugin {
  return {
    name: 'food-science-precache-manifest',
    apply: 'build',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const assetsDir = path.join(distDir, 'assets');
      const assetUrls: string[] = [
        '/',
        '/index.html',
        '/manifest.json',
        '/icon.svg',
        '/pwa-192x192.png',
        '/pwa-512x512.png',
        '/pwa-maskable-512x512.png',
        '/apple-touch-icon.png'
      ];

      if (fs.existsSync(assetsDir)) {
        const files = fs.readdirSync(assetsDir);
        for (const f of files) {
          if (/\.(js|css|woff2|woff|svg|png|json)$/i.test(f)) {
            assetUrls.push(`/assets/${f}`);
          }
        }
      }

      const manifestPayload = {
        version: 'v5',
        generatedAt: new Date().toISOString(),
        assets: Array.from(new Set(assetUrls))
      };

      fs.writeFileSync(
        path.join(distDir, 'precache-manifest.json'),
        JSON.stringify(manifestPayload, null, 2),
        'utf8'
      );
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), precacheManifestPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    worker: {
      format: 'es' as const,
    },
    build: {
      rollupOptions: {
        external: ['/pyodide/pyodide.mjs'],
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
