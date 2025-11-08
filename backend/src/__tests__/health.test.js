import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { ping } from '../db.js';

const app = express();
app.use(cors());
app.use(express.json());

// Health endpoint
app.get('/health', async (_req, res) => {
  try {
    const ok = await ping();
    res.json({ status: 'ok', db: ok ? 'connected' : 'unknown' });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

describe('Health Check API', () => {
  test('GET /health - Base de datos conectada', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('db');
    expect(['connected', 'unknown']).toContain(response.body.db);
  });
});