import { apiRouter } from './routes';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';

dotenv.config();

const PORT = 3000;

export async function startServer() {
  const app = express();

  app.use(express.json({ limit: '10mb' }));

  // Mount API routes first
  app.use('/api', apiRouter);

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      appType: 'spa',
      server: { middlewareMode: true },
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
    console.log(`GeM-Verify Server running on http://0.0.0.0:${PORT}`);
  });

  return app;
}

startServer();
