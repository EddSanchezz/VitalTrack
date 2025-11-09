import { Router } from 'express';
import { query } from '../db.js';
import { validateRequired, badRequest, notFound, conflict } from '../utils/http.js';

const router = Router();

// Create dispositivo
router.post('/', async (req, res) => {
  try {
    if (!validateRequired(res, req.body, ['usuario_id', 'serial'])) return;
    const { usuario_id, serial, marca, modelo, fecha_vinculacion } = req.body;
    const usuario = await query('SELECT id FROM usuario WHERE id = ?', [usuario_id]);
    if (!Array.isArray(usuario) || !usuario.length) return badRequest(res, 'usuario_id no existe');
    const dup = await query('SELECT id FROM dispositivo WHERE serial = ?', [serial]);
    if (Array.isArray(dup) && dup.length) return conflict(res, 'Serial ya existe');
    const sql = `INSERT INTO dispositivo (usuario_id, serial, marca, modelo, fecha_vinculacion)
                 VALUES (?, ?, ?, ?, ?)`;
    const params = [usuario_id, serial, marca || null, modelo || null, fecha_vinculacion || null];
    const result = await query(sql, params);
    const insertId = result.insertId;
    const dispositivo = await query('SELECT * FROM dispositivo WHERE id = ?', [insertId]);
    res.status(201).json(Array.isArray(dispositivo) ? dispositivo[0] : dispositivo);
  } catch (e) {
    badRequest(res, 'Error creando dispositivo', e.message);
  }
});

// List dispositivos
router.get('/', async (_req, res) => {
  try {
    const rows = await query('SELECT * FROM dispositivo ORDER BY id DESC');
    res.json(Array.isArray(rows) ? rows : [rows]);
  } catch (e) {
    badRequest(res, 'Error listando dispositivos', e.message);
  }
});

// Get one
router.get('/:id', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM dispositivo WHERE id = ?', [req.params.id]);
    const dispositivo = Array.isArray(rows) ? rows[0] : rows;
    if (!dispositivo) return notFound(res, 'Dispositivo');
    res.json(dispositivo);
  } catch (e) {
    badRequest(res, 'Error obteniendo dispositivo', e.message);
  }
});

// Update dispositivo
router.put('/:id', async (req, res) => {
  try {
    const { usuario_id, serial, marca, modelo, fecha_vinculacion } = req.body;
    const target = await query('SELECT id FROM dispositivo WHERE id = ?', [req.params.id]);
    if (!Array.isArray(target) || !target.length) return notFound(res, 'Dispositivo');
    if (usuario_id) {
      const usuario = await query('SELECT id FROM usuario WHERE id = ?', [usuario_id]);
      if (!Array.isArray(usuario) || !usuario.length) return badRequest(res, 'usuario_id no existe');
    }
    if (serial) {
      const dup = await query('SELECT id FROM dispositivo WHERE serial = ? AND id <> ?', [serial, req.params.id]);
      if (Array.isArray(dup) && dup.length) return conflict(res, 'Serial ya existe');
    }
    const sql = `UPDATE dispositivo SET usuario_id = ?, serial = ?, marca = ?, modelo = ?, fecha_vinculacion = ?
                 WHERE id = ?`;
    const params = [usuario_id || null, serial || null, marca || null, modelo || null, fecha_vinculacion || null, req.params.id];
    const result = await query(sql, params);
    if (result.affectedRows === 0) return notFound(res, 'Dispositivo');
    const dispositivo = await query('SELECT * FROM dispositivo WHERE id = ?', [req.params.id]);
    res.json(Array.isArray(dispositivo) ? dispositivo[0] : dispositivo);
  } catch (e) {
    badRequest(res, 'Error actualizando dispositivo', e.message);
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM dispositivo WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return notFound(res, 'Dispositivo');
    res.status(204).send();
  } catch (e) {
    badRequest(res, 'Error eliminando dispositivo', e.message);
  }
});

export default router;
