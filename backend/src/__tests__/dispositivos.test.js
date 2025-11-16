import request from 'supertest';
import express from 'express';
import cors from 'cors';
import usuariosRouter from '../routes/usuarios.js';
import dispositivosRouter from '../routes/dispositivos.js';
import { setupDatabase } from '../../scripts/setup-db.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/usuarios', usuariosRouter);
app.use('/api/dispositivos', dispositivosRouter);

let usuarioId;

beforeAll(async () => {
  await setupDatabase();
  const usersRes = await request(app).get('/api/usuarios').expect(200);
  usuarioId = usersRes.body[0].id;
});

describe('Dispositivos API', () => {
  let dispositivoId;

  test('POST /api/dispositivos - crear dispositivo', async () => {
    const payload = { usuario_id: usuarioId, serial: 'ABC123', marca: 'FitCo', modelo: 'X1', fecha_vinculacion: '2024-01-01' };
    const res = await request(app).post('/api/dispositivos').send(payload).expect(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.serial).toBe('ABC123');
    dispositivoId = res.body.id;
  });

  test('POST /api/dispositivos - serial duplicado', async () => {
    const payload = { usuario_id: usuarioId, serial: 'ABC123' };
    await request(app).post('/api/dispositivos').send(payload).expect(409);
  });

  test('GET /api/dispositivos/:id - obtener dispositivo', async () => {
    const res = await request(app).get(`/api/dispositivos/${dispositivoId}`).expect(200);
    expect(res.body).toHaveProperty('id', dispositivoId);
  });

  test('PUT /api/dispositivos/:id - actualizar dispositivo', async () => {
    const res = await request(app)
      .put(`/api/dispositivos/${dispositivoId}`)
      .send({ usuario_id: usuarioId, serial: 'ABC123', marca: 'FitCo', modelo: 'X2' })
      .expect(200);
    expect(res.body.modelo).toBe('X2');
  });

  test('DELETE /api/dispositivos/:id - eliminar dispositivo', async () => {
    await request(app).delete(`/api/dispositivos/${dispositivoId}`).expect(204);
    await request(app).get(`/api/dispositivos/${dispositivoId}`).expect(404);
  });

  test('POST /api/dispositivos - falta usuario_id', async () => {
    await request(app).post('/api/dispositivos').send({ serial: 'ZZZ' }).expect(400);
  });
});
