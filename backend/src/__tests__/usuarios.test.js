import request from 'supertest';
import express from 'express';
import cors from 'cors';
import usuariosRouter from '../routes/usuarios.js';
import { setupDatabase } from '../../scripts/setup-db.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/usuarios', usuariosRouter);

// Setup test database before running tests
beforeAll(async () => {
  // Set test environment
  process.env.DB_TYPE = 'sqlite';
  process.env.DB_FILE = './test-database.sqlite';
  
  await setupDatabase();
});

describe('Usuarios API', () => {
  let createdUserId;

  test('POST /api/usuarios - Crear usuario', async () => {
    const newUser = {
      cedula: '9876543210',
      nombre: 'Test User',
      email: 'test@vitaltrack.local',
      fecha_nacimiento: '1995-05-15',
      consentimiento_privacidad: true
    };

    const response = await request(app)
      .post('/api/usuarios')
      .send(newUser)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.nombre).toBe(newUser.nombre);
    expect(response.body.email).toBe(newUser.email);
    
    createdUserId = response.body.id;
  });

  test('GET /api/usuarios - Obtener todos los usuarios', async () => {
    const response = await request(app)
      .get('/api/usuarios')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /api/usuarios/:id - Obtener usuario específico', async () => {
    const response = await request(app)
      .get(`/api/usuarios/${createdUserId}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', createdUserId);
    expect(response.body).toHaveProperty('nombre', 'Test User');
  });

  test('PUT /api/usuarios/:id - Actualizar usuario', async () => {
    const updatedData = {
      cedula: '9876543210',
      nombre: 'Test User Updated',
      email: 'test-updated@vitaltrack.local',
      fecha_nacimiento: '1995-05-15',
      consentimiento_privacidad: true
    };

    const response = await request(app)
      .put(`/api/usuarios/${createdUserId}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.nombre).toBe(updatedData.nombre);
    expect(response.body.email).toBe(updatedData.email);
  });

  test('DELETE /api/usuarios/:id - Eliminar usuario', async () => {
    await request(app)
      .delete(`/api/usuarios/${createdUserId}`)
      .expect(204);

    // Verify user is deleted
    await request(app)
      .get(`/api/usuarios/${createdUserId}`)
      .expect(404);
  });

  test('GET /api/usuarios/999 - Usuario no encontrado', async () => {
    await request(app)
      .get('/api/usuarios/999')
      .expect(404);
  });
});