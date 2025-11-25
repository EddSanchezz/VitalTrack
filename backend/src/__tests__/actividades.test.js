import request from 'supertest';
import express from 'express';
import cors from 'cors';
import usuariosRouter from '../routes/usuarios.js';
import actividadesRouter from '../routes/actividades.js';
import { setupDatabase } from '../../scripts/setup-db.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/usuarios', usuariosRouter);
app.use('/api/actividades', actividadesRouter);

let usuarioId;

beforeAll(async () => {
  process.env.DB_TYPE = 'sqlite';
  process.env.DB_FILE = './test-database.sqlite';
  await setupDatabase();
  const usersRes = await request(app).get('/api/usuarios').expect(200);
  usuarioId = usersRes.body[0].id;
});

describe('Actividades API', () => {
  let actividadId;

  test('POST /api/actividades - crear actividad con duración automática', async () => {
    const start = '2024-01-01T10:00:00.000Z';
    const end = '2024-01-01T10:30:00.000Z';
    const res = await request(app)
      .post('/api/actividades')
      .send({ usuario_id: usuarioId, tipo: 'correr', hora_inicio: start, hora_fin: end })
      .expect(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.duracion_segundos).toBe(1800);
    actividadId = res.body.id;
  });

  test('GET /api/actividades?usuario_id= - listar por usuario', async () => {
    const res = await request(app).get(`/api/actividades?usuario_id=${usuarioId}`).expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('PUT /api/actividades/:id - actualizar actividad', async () => {
    const res = await request(app)
      .put(`/api/actividades/${actividadId}`)
      .send({ tipo: 'caminar', hora_inicio: '2024-01-01T10:00:00.000Z', hora_fin: '2024-01-01T10:45:00.000Z' })
      .expect(200);
    expect(res.body.tipo).toBe('caminar');
    expect(res.body.duracion_segundos).toBe(2700);
  });

  test('POST /api/actividades - validación de horas', async () => {
    await request(app)
      .post('/api/actividades')
      .send({ usuario_id: usuarioId, hora_inicio: '2024-01-01T11:00:00.000Z', hora_fin: '2024-01-01T10:00:00.000Z' })
      .expect(400);
  });

  test('DELETE /api/actividades/:id - eliminar actividad', async () => {
    await request(app).delete(`/api/actividades/${actividadId}`).expect(204);
    await request(app).get(`/api/actividades/${actividadId}`).expect(404);
  });
});
