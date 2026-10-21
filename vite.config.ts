import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';

function saveDefaultsPlugin() {
  return {
    name: 'save-defaults-plugin',
    configureServer(server: any) {
      server.middlewares.use('/api/save-defaults', (req: any, res: any) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const newConfig = JSON.parse(body);
              const filePath = path.resolve(__dirname, 'src/config/defaultData.ts');
              const currentContent = fs.readFileSync(filePath, 'utf-8');
              const marker = 'export const DEFAULT_SITE_CONFIG: SiteConfig = ';
              const markerIndex = currentContent.indexOf(marker);
              if (markerIndex !== -1) {
                const prefix = currentContent.substring(0, markerIndex + marker.length);
                const updatedContent = `${prefix}${JSON.stringify(newConfig, null, 2)};\n`;
                fs.writeFileSync(filePath, updatedContent, 'utf-8');
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
                return;
              }
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Config marker not found' }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }
        res.statusCode = 405;
        res.end();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), saveDefaultsPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
