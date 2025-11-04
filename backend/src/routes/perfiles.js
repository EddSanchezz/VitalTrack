import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// Create perfil
router.post('/', async (req, res) => {
  try {
    const { usuario_id, objetivo, sexo, altura, estado } = req.body;
    const [result] = await pool.execute(
      `INSERT INTO perfil (usuario_id, objetivo, sexo, altura, estado)
       VALUES (?, ?, ?, ?, ?)`,
      [usuario_id, objetivo || null, sexo || null, altura || null, estado || null]
    );
    const [rows] = await pool.execute('SELECT * FROM perfil WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) {
    if (e.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ message: 'usuario_id no existe' });
    }
    res.status(500).json({ message: e.message });
  }
});

// List perfiles
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM perfil ORDER BY id DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Get by id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM perfil WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Perfil no encontrado' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Update perfil
router.put('/:id', async (req, res) => {
  try {
    const { usuario_id, objetivo, sexo, altura, estado } = req.body;
    const [result] = await pool.execute(
      `UPDATE perfil SET usuario_id = ?, objetivo = ?, sexo = ?, altura = ?, estado = ?
       WHERE id = ?`,
      [usuario_id, objetivo || null, sexo || null, altura || null, estado || null, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Perfil no encontrado' });
    const [rows] = await pool.execute('SELECT * FROM perfil WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Delete perfil
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM perfil WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Perfil no encontrado' });
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
