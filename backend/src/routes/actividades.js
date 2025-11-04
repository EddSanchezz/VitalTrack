import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// Create actividad
router.post('/', async (req, res) => {
  try {
    const { usuario_id, tipo, hora_inicio, hora_fin, duracion_segundos } = req.body;
    const [result] = await pool.execute(
      `INSERT INTO actividad (usuario_id, tipo, hora_inicio, hora_fin, duracion_segundos)
       VALUES (?, ?, ?, ?, ?)`
      , [usuario_id, tipo || null, hora_inicio || null, hora_fin || null, duracion_segundos || null]
    );
    const [rows] = await pool.execute('SELECT * FROM actividad WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// List actividades (optionally by usuario)
router.get('/', async (req, res) => {
  try {
    const { usuario_id } = req.query;
    if (usuario_id) {
      const [rows] = await pool.execute('SELECT * FROM actividad WHERE usuario_id = ? ORDER BY hora_inicio DESC', [usuario_id]);
      return res.json(rows);
    }
    const [rows] = await pool.query('SELECT * FROM actividad ORDER BY hora_inicio DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Get one
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM actividad WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Actividad no encontrada' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Update actividad
router.put('/:id', async (req, res) => {
  try {
    const { usuario_id, tipo, hora_inicio, hora_fin, duracion_segundos } = req.body;
    const [result] = await pool.execute(
      `UPDATE actividad SET usuario_id = ?, tipo = ?, hora_inicio = ?, hora_fin = ?, duracion_segundos = ?
       WHERE id = ?`,
      [usuario_id, tipo || null, hora_inicio || null, hora_fin || null, duracion_segundos || null, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Actividad no encontrada' });
    const [rows] = await pool.execute('SELECT * FROM actividad WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM actividad WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Actividad no encontrada' });
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
