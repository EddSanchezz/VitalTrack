import { Router } from 'express';
import { query } from '../db.js';
import { validateRequired, badRequest, notFound } from '../utils/http.js';

const router = Router();

// Create actividad
router.post('/', async (req, res) => {
  try {
    if (!validateRequired(res, req.body, ['usuario_id'])) return;
    let { usuario_id, tipo, hora_inicio, hora_fin, duracion_segundos } = req.body;
    const usuario = await query('SELECT id FROM usuario WHERE id = ?', [usuario_id]);
    if (!Array.isArray(usuario) || !usuario.length) return badRequest(res, 'usuario_id no existe');
    if (hora_inicio && hora_fin) {
      const start = new Date(hora_inicio);
      const end = new Date(hora_fin);
      const diff = (end - start) / 1000;
      if (isNaN(diff)) return badRequest(res, 'Formato de fechas inválido');
      if (diff < 0) return badRequest(res, 'hora_fin debe ser posterior a hora_inicio');
      if (!duracion_segundos) duracion_segundos = Math.round(diff);
    }
    const sql = `INSERT INTO actividad (usuario_id, tipo, hora_inicio, hora_fin, duracion_segundos)
                 VALUES (?, ?, ?, ?, ?)`;
    const params = [usuario_id, tipo || null, hora_inicio || null, hora_fin || null, duracion_segundos || null];
    const result = await query(sql, params);
    const insertId = result.insertId;
    const actividad = await query('SELECT * FROM actividad WHERE id = ?', [insertId]);
    res.status(201).json(Array.isArray(actividad) ? actividad[0] : actividad);
  } catch (e) {
    badRequest(res, 'Error creando actividad', e.message);
  }
});

// List actividades (optionally by usuario)
router.get('/', async (req, res) => {
  try {
    const { usuario_id } = req.query;
    let rows;
    if (usuario_id) {
      rows = await query('SELECT * FROM actividad WHERE usuario_id = ? ORDER BY hora_inicio DESC', [usuario_id]);
    } else {
      rows = await query('SELECT * FROM actividad ORDER BY hora_inicio DESC');
    }
    res.json(Array.isArray(rows) ? rows : [rows]);
  } catch (e) {
    badRequest(res, 'Error listando actividades', e.message);
  }
});

// Get one
router.get('/:id', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM actividad WHERE id = ?', [req.params.id]);
    const actividad = Array.isArray(rows) ? rows[0] : rows;
    if (!actividad) return notFound(res, 'Actividad');
    res.json(actividad);
  } catch (e) {
    badRequest(res, 'Error obteniendo actividad', e.message);
  }
});

// Update actividad
router.put('/:id', async (req, res) => {
  try {
    const { usuario_id, tipo, hora_inicio, hora_fin, duracion_segundos } = req.body;
    const currentRows = await query('SELECT * FROM actividad WHERE id = ?', [req.params.id]);
    const current = Array.isArray(currentRows) ? currentRows[0] : currentRows;
    if (!current) return notFound(res, 'Actividad');

    const finalUsuarioId = usuario_id ?? current.usuario_id;
    if (finalUsuarioId !== current.usuario_id) {
      const usuario = await query('SELECT id FROM usuario WHERE id = ?', [finalUsuarioId]);
      if (!Array.isArray(usuario) || !usuario.length) return badRequest(res, 'usuario_id no existe');
    }

    let finalInicio = hora_inicio ?? current.hora_inicio;
    let finalFin = hora_fin ?? current.hora_fin;
    let finalTipo = tipo ?? current.tipo;
    let finalDuracion = duracion_segundos ?? current.duracion_segundos ?? null;
    if (finalInicio && finalFin) {
      const start = new Date(finalInicio);
      const end = new Date(finalFin);
      const diff = (end - start) / 1000;
      if (isNaN(diff)) return badRequest(res, 'Formato de fechas inválido');
      if (diff < 0) return badRequest(res, 'hora_fin debe ser posterior a hora_inicio');
      if (duracion_segundos == null) finalDuracion = Math.round(diff);
    }
    const sql = `UPDATE actividad SET usuario_id = ?, tipo = ?, hora_inicio = ?, hora_fin = ?, duracion_segundos = ?
                 WHERE id = ?`;
    const params = [finalUsuarioId, finalTipo || null, finalInicio || null, finalFin || null, finalDuracion, req.params.id];
    const result = await query(sql, params);
    if (result.affectedRows === 0) return notFound(res, 'Actividad');
    const actividad = await query('SELECT * FROM actividad WHERE id = ?', [req.params.id]);
    res.json(Array.isArray(actividad) ? actividad[0] : actividad);
  } catch (e) {
    badRequest(res, 'Error actualizando actividad', e.message);
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM actividad WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return notFound(res, 'Actividad');
    res.status(204).send();
  } catch (e) {
    badRequest(res, 'Error eliminando actividad', e.message);
  }
});

export default router;
