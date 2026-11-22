import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import chatRouter from './server/routes/chat';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Global Middleware
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Allow Capacitor Android WebView origins (https://localhost, capacitor://localhost) to call online AI endpoints
  const ALLOWED_CAPACITOR_ORIGINS = new Set([
    'https://localhost',
    'http://localhost',
    'capacitor://localhost',
  ]);
  app.use('/api', (req, res, next) => {
    const origin = req.headers.origin;
    if (origin && ALLOWED_CAPACITOR_ORIGINS.has(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    }
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    next();
  });

  // API Routes
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Food Science AI Server',
      timestamp: new Date().toISOString(),
      activeProvider: process.env.AI_PROVIDER || 'mock'
    });
  });

  app.use('/api/chat', chatRouter);

  // Serve local Pyodide WebAssembly static assets
  app.use('/pyodide', express.static(path.join(process.cwd(), 'public/pyodide'), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.wasm')) {
        res.setHeader('Content-Type', 'application/wasm');
      } else if (filePath.endsWith('.mjs') || filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      } else if (filePath.endsWith('.whl') || filePath.endsWith('.zip')) {
        res.setHeader('Content-Type', 'application/octet-stream');
      }
    }
  }));

  // Prevent missing /pyodide/* assets from falling through to SPA index.html (silent 200 OK HTML bug)
  app.use('/pyodide', (req, res) => {
    res.status(404).json({
      error: 'Pyodide asset not found',
      path: req.originalUrl
    });
  });

  // Vite middleware for development vs Static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Food Science AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
