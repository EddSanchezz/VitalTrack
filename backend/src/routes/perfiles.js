import { Router } from 'express';
import { query } from '../db.js';
import { validateRequired, badRequest, notFound } from '../utils/http.js';

const router = Router();

// Create perfil
router.post('/', async (req, res) => {
  try {
    if (!validateRequired(res, req.body, ['usuario_id'])) return;
    const { usuario_id, objetivo, sexo, altura, estado } = req.body;
    const usuario = await query('SELECT id FROM usuario WHERE id = ?', [usuario_id]);
    if (!Array.isArray(usuario) || !usuario.length) return badRequest(res, 'usuario_id no existe');
    const sql = `INSERT INTO perfil (usuario_id, objetivo, sexo, altura, estado)
                 VALUES (?, ?, ?, ?, ?)`;
    const params = [usuario_id, objetivo || null, sexo || null, altura || null, estado || null];
    const result = await query(sql, params);
    const insertId = result.insertId;
    const perfil = await query('SELECT * FROM perfil WHERE id = ?', [insertId]);
    res.status(201).json(Array.isArray(perfil) ? perfil[0] : perfil);
  } catch (e) {
    badRequest(res, 'Error creando perfil', e.message);
  }
});

// List perfiles
router.get('/', async (_req, res) => {
  try {
    const rows = await query('SELECT * FROM perfil ORDER BY id DESC');
    res.json(Array.isArray(rows) ? rows : [rows]);
  } catch (e) {
    badRequest(res, 'Error listando perfiles', e.message);
  }
});

// Get by id
router.get('/:id', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM perfil WHERE id = ?', [req.params.id]);
    const perfil = Array.isArray(rows) ? rows[0] : rows;
    if (!perfil) return notFound(res, 'Perfil');
    res.json(perfil);
  } catch (e) {
    badRequest(res, 'Error obteniendo perfil', e.message);
  }
});

// Update perfil
router.put('/:id', async (req, res) => {
  try {
    const { usuario_id, objetivo, sexo, altura, estado } = req.body;
    const target = await query('SELECT id FROM perfil WHERE id = ?', [req.params.id]);
    if (!Array.isArray(target) || !target.length) return notFound(res, 'Perfil');
    if (usuario_id) {
      const usuario = await query('SELECT id FROM usuario WHERE id = ?', [usuario_id]);
      if (!Array.isArray(usuario) || !usuario.length) return badRequest(res, 'usuario_id no existe');
    }
    const sql = `UPDATE perfil SET usuario_id = ?, objetivo = ?, sexo = ?, altura = ?, estado = ?
                 WHERE id = ?`;
    const params = [usuario_id || null, objetivo || null, sexo || null, altura || null, estado || null, req.params.id];
    const result = await query(sql, params);
    if (result.affectedRows === 0) return notFound(res, 'Perfil');
    const perfil = await query('SELECT * FROM perfil WHERE id = ?', [req.params.id]);
    res.json(Array.isArray(perfil) ? perfil[0] : perfil);
  } catch (e) {
    badRequest(res, 'Error actualizando perfil', e.message);
  }
});

// Delete perfil
router.delete('/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM perfil WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return notFound(res, 'Perfil');
    res.status(204).send();
  } catch (e) {
    badRequest(res, 'Error eliminando perfil', e.message);
  }
});

export default router;
