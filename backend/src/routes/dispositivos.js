import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// Create dispositivo
router.post('/', async (req, res) => {
  try {
    const { usuario_id, serial, marca, modelo, fecha_vinculacion } = req.body;
    const [result] = await pool.execute(
      `INSERT INTO dispositivo (usuario_id, serial, marca, modelo, fecha_vinculacion)
       VALUES (?, ?, ?, ?, ?)`
      , [usuario_id, serial, marca || null, modelo || null, fecha_vinculacion || null]
    );
    const [rows] = await pool.execute('SELECT * FROM dispositivo WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Serial ya existe' });
    }
    res.status(500).json({ message: e.message });
  }
});

// List dispositivos
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM dispositivo ORDER BY id DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Get one
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM dispositivo WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Dispositivo no encontrado' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Update dispositivo
router.put('/:id', async (req, res) => {
  try {
    const { usuario_id, serial, marca, modelo, fecha_vinculacion } = req.body;
    const [result] = await pool.execute(
      `UPDATE dispositivo SET usuario_id = ?, serial = ?, marca = ?, modelo = ?, fecha_vinculacion = ?
       WHERE id = ?`,
      [usuario_id, serial, marca || null, modelo || null, fecha_vinculacion || null, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Dispositivo no encontrado' });
    const [rows] = await pool.execute('SELECT * FROM dispositivo WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM dispositivo WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Dispositivo no encontrado' });
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
