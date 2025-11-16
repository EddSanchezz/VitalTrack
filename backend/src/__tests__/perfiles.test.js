import request from 'supertest';
import express from 'express';
import cors from 'cors';
import usuariosRouter from '../routes/usuarios.js';
import perfilesRouter from '../routes/perfiles.js';
import { setupDatabase } from '../../scripts/setup-db.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/usuarios', usuariosRouter);
app.use('/api/perfiles', perfilesRouter);

let usuarioId;

beforeAll(async () => {
  await setupDatabase();

  const usersRes = await request(app).get('/api/usuarios').expect(200);
  const demo = usersRes.body.find(u => u.email === 'demo@vitaltrack.local');
  usuarioId = demo ? demo.id : usersRes.body[0].id;
});

describe('Perfiles API', () => {
  let perfilId;

  test('POST /api/perfiles - crear perfil', async () => {
    const payload = { usuario_id: usuarioId, objetivo: 'Mantener', sexo: 'F', altura: 165.5, estado: 'activo' };
    const res = await request(app).post('/api/perfiles').send(payload).expect(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.usuario_id).toBe(usuarioId);
    perfilId = res.body.id;
  });

  test('GET /api/perfiles/:id - obtener perfil', async () => {
    const res = await request(app).get(`/api/perfiles/${perfilId}`).expect(200);
    expect(res.body).toHaveProperty('id', perfilId);
  });

  test('PUT /api/perfiles/:id - actualizar perfil', async () => {
    const res = await request(app)
      .put(`/api/perfiles/${perfilId}`)
      .send({ usuario_id: usuarioId, objetivo: 'Ganar masa', sexo: 'M', altura: 170, estado: 'activo' })
      .expect(200);
    expect(res.body.objetivo).toBe('Ganar masa');
  });

  test('DELETE /api/perfiles/:id - eliminar perfil', async () => {
    await request(app).delete(`/api/perfiles/${perfilId}`).expect(204);
    await request(app).get(`/api/perfiles/${perfilId}`).expect(404);
  });

  test('POST /api/perfiles - falta usuario_id', async () => {
    await request(app).post('/api/perfiles').send({ objetivo: 'X' }).expect(400);
  });
});
