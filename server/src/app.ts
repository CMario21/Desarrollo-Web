// server/src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import routes from './routes/index.js';

(BigInt.prototype as any).toJSON = function () { return this.toString(); };

// __dirname compatible con ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Mantengo tu configuración original de CORS basada en variable de entorno
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// ----- API primero -----
app.use('/api', routes);

// ----- Estáticos del frontend (Vite) -----
// En producción, el build de Vite se copiará a server/dist/public
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir, { index: false }));

// ----- Fallback SPA para React Router -----
// Cualquier ruta que NO sea /api devuelve index.html
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.sendFile(path.join(staticDir, 'index.html'));
});

export default app;