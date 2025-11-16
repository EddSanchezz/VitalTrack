import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// GET /api/estadisticas
// Aggregate metrics about the system
router.get('/', async (_req, res) => {
  try {
    // Totals
    const usuarios = await query('SELECT COUNT(*) AS total FROM usuario');
    const perfiles = await query('SELECT COUNT(*) AS total FROM perfil');
    const dispositivos = await query('SELECT COUNT(*) AS total FROM dispositivo');
    const actividades = await query('SELECT COUNT(*) AS total FROM actividad');

    // Activities per type
    const actividadesPorTipo = await query(`SELECT tipo, COUNT(*) AS total FROM actividad WHERE tipo IS NOT NULL GROUP BY tipo ORDER BY total DESC`);

    // Average activity duration (in seconds)
    const avgDurRows = await query('SELECT AVG(duracion_segundos) AS avg_duracion FROM actividad WHERE duracion_segundos IS NOT NULL');
    const avgDuracion = Array.isArray(avgDurRows) ? avgDurRows[0]?.avg_duracion : avgDurRows?.avg_duracion;

    // Devices per user (top 10)
    const dispositivosPorUsuario = await query(`SELECT usuario_id, COUNT(*) AS total FROM dispositivo GROUP BY usuario_id ORDER BY total DESC LIMIT 10`);

    // Recent activity (last 5)
    const recientes = await query(`SELECT id, usuario_id, tipo, hora_inicio, hora_fin, duracion_segundos FROM actividad ORDER BY hora_inicio DESC LIMIT 5`);

    res.json({
      totals: {
        usuarios: usuarios[0]?.total || 0,
        perfiles: perfiles[0]?.total || 0,
        dispositivos: dispositivos[0]?.total || 0,
        actividades: actividades[0]?.total || 0
      },
      actividadesPorTipo,
      promedioDuracionSegundos: avgDuracion ? Math.round(avgDuracion) : null,
      dispositivosPorUsuario,
      recientes
    });
  } catch (e) {
    res.status(500).json({ error: { code: 'ESTADISTICAS_ERROR', message: 'Error obteniendo estadísticas', details: e.message } });
  }
});

// GET /api/estadisticas/usuario/:id - stats for single user
router.get('/usuario/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioRows = await query('SELECT id FROM usuario WHERE id = ?', [id]);
    if (!Array.isArray(usuarioRows) || !usuarioRows.length) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Usuario no encontrado' } });
    }

    const dispositivos = await query('SELECT COUNT(*) AS total FROM dispositivo WHERE usuario_id = ?', [id]);
    const actividades = await query('SELECT COUNT(*) AS total FROM actividad WHERE usuario_id = ?', [id]);
    const duracionTotalRows = await query('SELECT SUM(duracion_segundos) AS total_duracion FROM actividad WHERE usuario_id = ? AND duracion_segundos IS NOT NULL', [id]);
    const duracionTotal = Array.isArray(duracionTotalRows) ? duracionTotalRows[0]?.total_duracion : duracionTotalRows?.total_duracion;

    const actividadesPorTipo = await query('SELECT tipo, COUNT(*) AS total FROM actividad WHERE usuario_id = ? AND tipo IS NOT NULL GROUP BY tipo ORDER BY total DESC', [id]);

    res.json({
      usuario_id: Number(id),
      dispositivos: dispositivos[0]?.total || 0,
      actividades: actividades[0]?.total || 0,
      duracionTotalSegundos: duracionTotal ? Number(duracionTotal) : 0,
      actividadesPorTipo
    });
  } catch (e) {
    res.status(500).json({ error: { code: 'ESTADISTICAS_ERROR', message: 'Error obteniendo estadísticas de usuario', details: e.message } });
  }
});

export default router;
