import { Router } from 'express';
import { query } from '../db.js';
import { validateRequired, badRequest, notFound, emailRegex } from '../utils/http.js';

const router = Router();

// Helper function to handle datetime for SQLite compatibility
function getCurrentDateTime() {
  return new Date().toISOString();
}

// Create
router.post('/', async (req, res) => {
  try {
    if (!validateRequired(res, req.body, ['nombre', 'email'])) return;
    const { cedula, nombre, email, fecha_nacimiento, consentimiento_privacidad } = req.body;
    if (!emailRegex.test(email)) return badRequest(res, 'Formato de email inválido');

    const existing = await query('SELECT id FROM usuario WHERE email = ?', [email]);
    if (Array.isArray(existing) && existing.length) return badRequest(res, 'Email ya registrado');

    const dbType = process.env.DB_TYPE || 'sqlite';
    let sql, params;
    if (dbType === 'sqlite') {
      sql = `INSERT INTO usuario (cedula, nombre, email, fecha_registro, fecha_nacimiento, consentimiento_privacidad)
             VALUES (?, ?, ?, ?, ?, ?)`;
      params = [cedula || null, nombre, email, getCurrentDateTime(), fecha_nacimiento || null, Boolean(consentimiento_privacidad) ? 1 : 0];
    } else {
      sql = `INSERT INTO usuario (cedula, nombre, email, fecha_registro, fecha_nacimiento, consentimiento_privacidad)
             VALUES (?, ?, ?, NOW(), ?, ?)`;
      params = [cedula || null, nombre, email, fecha_nacimiento || null, Boolean(consentimiento_privacidad)];
    }
    const result = await query(sql, params);
    const insertId = result.insertId;
    const user = await query('SELECT * FROM usuario WHERE id = ?', [insertId]);
    res.status(201).json(Array.isArray(user) ? user[0] : user);
  } catch (e) {
    badRequest(res, 'Error creando usuario', e.message);
  }
});

// Read all
router.get('/', async (_req, res) => {
  try {
    const rows = await query('SELECT * FROM usuario ORDER BY id DESC');
    res.json(Array.isArray(rows) ? rows : [rows]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Read one
router.get('/:id', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM usuario WHERE id = ?', [req.params.id]);
    const user = Array.isArray(rows) ? rows[0] : rows;
    if (!user) return notFound(res, 'Usuario');
    res.json(user);
  } catch (e) {
    badRequest(res, 'Error consultando usuario', e.message);
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    if (!validateRequired(res, req.body, ['nombre', 'email'])) return;
    const { cedula, nombre, email, fecha_nacimiento, consentimiento_privacidad } = req.body;
    if (!emailRegex.test(email)) return badRequest(res, 'Formato de email inválido');
    const target = await query('SELECT id FROM usuario WHERE id = ?', [req.params.id]);
    if (!Array.isArray(target) || !target.length) return notFound(res, 'Usuario');

    const duplicate = await query('SELECT id FROM usuario WHERE email = ? AND id <> ?', [email, req.params.id]);
    if (Array.isArray(duplicate) && duplicate.length) return badRequest(res, 'Email ya utilizado por otro usuario');

    const sql = `UPDATE usuario SET cedula = ?, nombre = ?, email = ?, fecha_nacimiento = ?, consentimiento_privacidad = ?
                 WHERE id = ?`;
    const params = [cedula || null, nombre, email, fecha_nacimiento || null, Boolean(consentimiento_privacidad) ? 1 : 0, req.params.id];
    const result = await query(sql, params);
    if (result.affectedRows === 0) return notFound(res, 'Usuario');
    const user = await query('SELECT * FROM usuario WHERE id = ?', [req.params.id]);
    res.json(Array.isArray(user) ? user[0] : user);
  } catch (e) {
    badRequest(res, 'Error actualizando usuario', e.message);
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM usuario WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return notFound(res, 'Usuario');
    res.status(204).send();
  } catch (e) {
    badRequest(res, 'Error eliminando usuario', e.message);
  }
});

export default router;
