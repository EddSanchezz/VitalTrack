import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ping } from './db.js';

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

// Routes
app.use('/api/usuarios', usuariosRouter);
app.use('/api/perfiles', perfilesRouter);
app.use('/api/dispositivos', dispositivosRouter);
app.use('/api/actividades', actividadesRouter);

// 404
app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`VitalTrack API listening on http://localhost:${PORT}`);
});
