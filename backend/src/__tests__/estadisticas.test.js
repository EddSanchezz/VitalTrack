import request from 'supertest';
import express from 'express';
import cors from 'cors';
import usuariosRouter from '../routes/usuarios.js';
import perfilesRouter from '../routes/perfiles.js';
import dispositivosRouter from '../routes/dispositivos.js';
import actividadesRouter from '../routes/actividades.js';
import estadisticasRouter from '../routes/estadisticas.js';
import { setupDatabase } from '../../scripts/setup-db.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/usuarios', usuariosRouter);
app.use('/api/perfiles', perfilesRouter);
app.use('/api/dispositivos', dispositivosRouter);
app.use('/api/actividades', actividadesRouter);
app.use('/api/estadisticas', estadisticasRouter);

describe('Estadisticas API', () => {
  beforeAll(async () => {
    await setupDatabase();
  });
  test('GET /api/estadisticas returns summary structure', async () => {
    const res = await request(app).get('/api/estadisticas').expect(200);
    expect(res.body).toHaveProperty('totals');
    expect(res.body).toHaveProperty('actividadesPorTipo');
    expect(res.body).toHaveProperty('promedioDuracionSegundos');
    expect(res.body).toHaveProperty('dispositivosPorUsuario');
    expect(res.body).toHaveProperty('recientes');
  });

  test('GET /api/estadisticas/usuario/1 returns user stats or 404', async () => {
    const res = await request(app).get('/api/estadisticas/usuario/1');
    if (res.status === 200) {
      expect(res.body).toHaveProperty('usuario_id', 1);
      expect(res.body).toHaveProperty('actividades');
      expect(res.body).toHaveProperty('dispositivos');
    } else {
      expect(res.status).toBe(404);
    }
  });
});
