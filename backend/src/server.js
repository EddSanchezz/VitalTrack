import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ping } from './db.js';
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import usuariosRouter from './routes/usuarios.js';
import perfilesRouter from './routes/perfiles.js';
import dispositivosRouter from './routes/dispositivos.js';
import actividadesRouter from './routes/actividades.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Health
app.get('/health', async (_req, res) => {
  try {
    const ok = await ping();
    res.json({ status: 'ok', db: ok ? 'connected' : 'unknown' });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// Swagger Docs
try {
  // Resolve openapi.yaml relative to this file so it works regardless of CWD
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const specPath = join(__dirname, '../openapi.yaml');
  const file = readFileSync(specPath, 'utf8');
  const openapiDocument = yaml.load(file);
  app.get('/api/docs.json', (_req, res) => res.json(openapiDocument));
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));
  // Documentación Swagger disponible en /api/docs
} catch (e) {
  console.warn('No se pudo cargar la especificación Swagger:', e.message);
}

// Routes
app.use('/api/usuarios', usuariosRouter);
app.use('/api/perfiles', perfilesRouter);
app.use('/api/dispositivos', dispositivosRouter);
app.use('/api/actividades', actividadesRouter);

// 404
app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // API VitalTrack iniciada
});
