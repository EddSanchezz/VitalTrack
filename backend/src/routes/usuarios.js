import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// Create
router.post('/', async (req, res) => {
  try {
    const { cedula, nombre, email, fecha_nacimiento, consentimiento_privacidad } = req.body;
    const [result] = await pool.execute(
      `INSERT INTO usuario (cedula, nombre, email, fecha_registro, fecha_nacimiento, consentimiento_privacidad)
       VALUES (?, ?, ?, NOW(), ?, ?)`,
      [cedula || null, nombre, email, fecha_nacimiento || null, Boolean(consentimiento_privacidad)]
    );
    const [rows] = await pool.execute('SELECT * FROM usuario WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Read all
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM usuario ORDER BY id DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Read one
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM usuario WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const { cedula, nombre, email, fecha_nacimiento, consentimiento_privacidad } = req.body;
    const [result] = await pool.execute(
      `UPDATE usuario SET cedula = ?, nombre = ?, email = ?, fecha_nacimiento = ?, consentimiento_privacidad = ?
       WHERE id = ?`,
      [cedula || null, nombre, email, fecha_nacimiento || null, Boolean(consentimiento_privacidad), req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    const [rows] = await pool.execute('SELECT * FROM usuario WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM usuario WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
