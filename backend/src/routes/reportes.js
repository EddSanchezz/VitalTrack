import { Router } from 'express';
import PDFDocument from 'pdfkit';
import { query } from '../db.js';

const router = Router();

// Helper para dibujar tablas en el PDF
function drawTable(doc, table, startY) {
  let y = startY;
  const { headers, rows } = table;
  const colWidths = headers.map((header, i) => {
    const maxDataWidth = Math.max(...rows.map(row => doc.widthOfString(String(row[i]))));
    const headerWidth = doc.widthOfString(header);
    return Math.max(maxDataWidth, headerWidth) + 10;
  });

  const tableWidth = colWidths.reduce((a, b) => a + b, 0);
  const startX = (doc.page.width - tableWidth) / 2;
  let x = startX;

  // Headers
  doc.font('Helvetica-Bold');
  headers.forEach((header, i) => {
    doc.text(header, x, y, { width: colWidths[i], align: 'center' });
    x += colWidths[i];
  });
  y += 20;
  doc.font('Helvetica');

  // Rows
  rows.forEach(row => {
    x = startX;
    row.forEach((cell, i) => {
      doc.text(String(cell), x, y, { width: colWidths[i], align: 'center' });
      x += colWidths[i];
    });
    y += 20;
    if (y > doc.page.height - 50) {
      doc.addPage();
      y = 50;
    }
  });

  return y + 10; // Espacio después de la tabla
}

router.get('/generar', async (req, res) => {
  try {
    // 1) Recolectar datos primero (evita enviar headers si falla algo)
    
    // Reporte 1: Últimos 10 usuarios registrados (Simple)
    const ultimosUsuarios = await query(`
      SELECT nombre, email, fecha_registro
      FROM usuario
      ORDER BY fecha_registro DESC
      LIMIT 10
    `);

    // Reporte 2: Última lectura registrada para un sensor específico (Simple)
    // Usaremos el primer sensor de frecuencia cardíaca como ejemplo
    const ultimaLectura = await query(`
      SELECT s.tipo, s.unidad, l.valor, l.fecha_hora, d.marca, d.modelo
      FROM lectura l
      JOIN sensor s ON l.sensor_id = s.id
      JOIN dispositivo d ON s.dispositivo_id = d.id
      WHERE s.tipo = 'frecuencia_cardiaca'
      ORDER BY l.fecha_hora DESC
      LIMIT 1
    `);

    // Reporte 3: Cantidad de sensores que posee cada dispositivo (Simple)
    const sensoresPorDispositivo = await query(`
      SELECT d.marca, d.modelo, d.serial, COUNT(s.id) as cantidad_sensores
      FROM dispositivo d
      LEFT JOIN sensor s ON d.id = s.dispositivo_id
      GROUP BY d.id
      ORDER BY cantidad_sensores DESC
    `);

    // Reporte 4: Promedio diario de lecturas de un sensor en los últimos 7 días (Intermedia)
    const promediosSensor = await query(`
      SELECT 
        DATE(l.fecha_hora) as fecha,
        s.tipo,
        s.unidad,
        AVG(l.valor) as promedio_diario,
        COUNT(l.id) as num_lecturas
      FROM lectura l
      JOIN sensor s ON l.sensor_id = s.id
      WHERE l.fecha_hora >= datetime('now', '-7 days')
      GROUP BY DATE(l.fecha_hora), s.tipo
      ORDER BY fecha DESC, s.tipo
    `);

    // Reporte 5: Listado de sensores junto con su dispositivo y el usuario dueño (Intermedia)
    const sensoresCompleto = await query(`
      SELECT 
        u.nombre as usuario,
        d.marca,
        d.modelo,
        s.tipo as sensor_tipo,
        s.unidad,
        s.umbral_min,
        s.umbral_max
      FROM sensor s
      JOIN dispositivo d ON s.dispositivo_id = d.id
      JOIN usuario u ON d.usuario_id = u.id
      ORDER BY u.nombre, d.marca
    `);

    // Reporte 6: Usuarios inscritos en retos activos con su progreso actual (Intermedia)
    const retosProgreso = await query(`
      SELECT 
        u.nombre as usuario,
        r.nombre as reto,
        r.objetivo_tipo,
        r.objetivo_valor,
        ru.progreso,
        CASE WHEN ru.completado = 1 THEN 'Completado' ELSE 'En progreso' END as estado
      FROM reto_usuario ru
      JOIN usuario u ON ru.usuario_id = u.id
      JOIN reto r ON ru.reto_id = r.id
      WHERE r.estado = 'activo'
      ORDER BY u.nombre, r.nombre
    `);

    // Reporte 7: Actualización o inserción automática del resumen diario (Intermedia - UPSERT)
    // Primero ejecutamos el UPSERT
    await query(`
      INSERT INTO resumen_diario (sensor_id, fecha, promedio, maximo, minimo, num_lecturas)
      SELECT 
        l.sensor_id,
        DATE(l.fecha_hora) as fecha,
        AVG(l.valor) as promedio,
        MAX(l.valor) as maximo,
        MIN(l.valor) as minimo,
        COUNT(l.id) as num_lecturas
      FROM lectura l
      WHERE DATE(l.fecha_hora) = DATE('now')
      GROUP BY l.sensor_id, DATE(l.fecha_hora)
      ON CONFLICT(sensor_id, fecha) DO UPDATE SET
        promedio = excluded.promedio,
        maximo = excluded.maximo,
        minimo = excluded.minimo,
        num_lecturas = excluded.num_lecturas,
        fecha_actualizacion = CURRENT_TIMESTAMP
    `);
    // Luego consultamos el resumen generado
    const resumenDiario = await query(`
      SELECT 
        s.tipo as sensor_tipo,
        s.unidad,
        rd.fecha,
        rd.promedio,
        rd.maximo,
        rd.minimo,
        rd.num_lecturas
      FROM resumen_diario rd
      JOIN sensor s ON rd.sensor_id = s.id
      WHERE rd.fecha = DATE('now')
    `);

    // Reporte 8: Usuarios con lecturas por encima de umbral en un rango de fechas (Compleja)
    const usuariosUmbral = await query(`
      SELECT DISTINCT
        u.nombre as usuario,
        s.tipo as sensor_tipo,
        l.valor,
        s.umbral_max,
        l.fecha_hora
      FROM lectura l
      JOIN sensor s ON l.sensor_id = s.id
      JOIN dispositivo d ON s.dispositivo_id = d.id
      JOIN usuario u ON d.usuario_id = u.id
      WHERE l.valor > s.umbral_max
        AND l.fecha_hora BETWEEN datetime('now', '-30 days') AND datetime('now')
      ORDER BY l.fecha_hora DESC
    `);

    // Reporte 9: Cálculo de media móvil de 7 días para las lecturas de cada sensor (Compleja)
    const mediaMovil = await query(`
      SELECT 
        s.tipo as sensor_tipo,
        s.unidad,
        DATE(l.fecha_hora) as fecha,
        AVG(l.valor) OVER (
          PARTITION BY s.id 
          ORDER BY DATE(l.fecha_hora) 
          ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ) as media_movil_7d,
        l.valor as valor_actual
      FROM lectura l
      JOIN sensor s ON l.sensor_id = s.id
      WHERE l.fecha_hora >= datetime('now', '-30 days')
      GROUP BY s.id, DATE(l.fecha_hora)
      ORDER BY s.tipo, fecha DESC
    `);

    // Reporte 10: Top 5 usuarios con mayor incremento porcentual en promedio de lecturas (Compleja)
    const topIncrementos = await query(`
      WITH periodo_reciente AS (
        SELECT 
          d.usuario_id,
          AVG(l.valor) as promedio_reciente
        FROM lectura l
        JOIN sensor s ON l.sensor_id = s.id
        JOIN dispositivo d ON s.dispositivo_id = d.id
        WHERE l.fecha_hora BETWEEN datetime('now', '-30 days') AND datetime('now')
        GROUP BY d.usuario_id
      ),
      periodo_anterior AS (
        SELECT 
          d.usuario_id,
          AVG(l.valor) as promedio_anterior
        FROM lectura l
        JOIN sensor s ON l.sensor_id = s.id
        JOIN dispositivo d ON s.dispositivo_id = d.id
        WHERE l.fecha_hora BETWEEN datetime('now', '-60 days') AND datetime('now', '-30 days')
        GROUP BY d.usuario_id
      )
      SELECT 
        u.nombre as usuario,
        ROUND(pr.promedio_reciente, 2) as promedio_reciente,
        ROUND(pa.promedio_anterior, 2) as promedio_anterior,
        ROUND(((pr.promedio_reciente - pa.promedio_anterior) / pa.promedio_anterior) * 100, 2) as incremento_porcentual
      FROM periodo_reciente pr
      JOIN periodo_anterior pa ON pr.usuario_id = pa.usuario_id
      JOIN usuario u ON pr.usuario_id = u.id
      WHERE pa.promedio_anterior > 0
      ORDER BY incremento_porcentual DESC
      LIMIT 5
    `);

    // 2) Construir y enviar el PDF
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=reporte_vitaltrack.pdf');
    doc.pipe(res);

    doc.fontSize(20).text('Reporte VitalTrack - Sensores y Retos', { align: 'center' });
    doc.moveDown();

    // --- Reportes Simples ---
    doc.fontSize(16).text('Reportes Simples', { underline: true });
    doc.moveDown();

    // 1. Últimos 10 usuarios registrados
    doc.fontSize(12).text('1. Últimos 10 Usuarios Registrados (Simple)');
    let y = drawTable(
      doc,
      {
        headers: ['Nombre', 'Email', 'Fecha Registro'],
        rows: ultimosUsuarios.map((u) => [u.nombre, u.email, String(u.fecha_registro || '').slice(0, 10)])
      },
      doc.y
    );
    doc.y = y;
    doc.moveDown();

    // 2. Última lectura de sensor específico
    doc.fontSize(12).text('2. Última Lectura de Sensor de Frecuencia Cardíaca (Simple)');
    y = drawTable(
      doc,
      {
        headers: ['Tipo Sensor', 'Valor', 'Unidad', 'Fecha/Hora', 'Dispositivo'],
        rows: ultimaLectura.map((l) => [
          l.tipo, 
          l.valor, 
          l.unidad, 
          String(l.fecha_hora || '').slice(0, 19),
          `${l.marca} ${l.modelo}`
        ])
      },
      doc.y
    );
    doc.y = y;
    doc.moveDown();

    // 3. Cantidad de sensores por dispositivo
    doc.fontSize(12).text('3. Cantidad de Sensores por Dispositivo (Simple)');
    y = drawTable(
      doc,
      {
        headers: ['Marca', 'Modelo', 'Serial', 'Cantidad Sensores'],
        rows: sensoresPorDispositivo.map((d) => [d.marca, d.modelo, d.serial, d.cantidad_sensores])
      },
      doc.y
    );
    doc.y = y;
    doc.addPage();

    // --- Reportes Intermedios ---
    doc.fontSize(16).text('Reportes Intermedios', { underline: true });
    doc.moveDown();

    // 4. Promedio diario de lecturas (últimos 7 días)
    doc.fontSize(12).text('4. Promedio Diario de Lecturas por Sensor - Últimos 7 Días (Intermedia)');
    y = drawTable(
      doc,
      {
        headers: ['Fecha', 'Tipo Sensor', 'Unidad', 'Promedio', 'Núm. Lecturas'],
        rows: promediosSensor.map((p) => [
          p.fecha, 
          p.tipo, 
          p.unidad, 
          Number(p.promedio_diario).toFixed(2), 
          p.num_lecturas
        ])
      },
      doc.y
    );
    doc.y = y;
    doc.moveDown();

    // 5. Listado de sensores con dispositivo y usuario
    doc.fontSize(12).text('5. Listado Completo de Sensores (Intermedia)');
    y = drawTable(
      doc,
      {
        headers: ['Usuario', 'Marca', 'Modelo', 'Tipo Sensor', 'Unidad', 'Min', 'Max'],
        rows: sensoresCompleto.map((s) => [
          s.usuario, 
          s.marca, 
          s.modelo, 
          s.sensor_tipo, 
          s.unidad, 
          s.umbral_min, 
          s.umbral_max
        ])
      },
      doc.y
    );
    doc.y = y;
    doc.addPage();

    // 6. Usuarios en retos activos con progreso
    doc.fontSize(12).text('6. Usuarios en Retos Activos con Progreso (Intermedia)');
    y = drawTable(
      doc,
      {
        headers: ['Usuario', 'Reto', 'Objetivo Tipo', 'Objetivo Valor', 'Progreso %', 'Estado'],
        rows: retosProgreso.map((r) => [
          r.usuario, 
          r.reto, 
          r.objetivo_tipo, 
          r.objetivo_valor, 
          Number(r.progreso).toFixed(1), 
          r.estado
        ])
      },
      doc.y
    );
    doc.y = y;
    doc.moveDown();

    // 7. Resumen diario actualizado (UPSERT)
    doc.fontSize(12).text('7. Resumen Diario de Lecturas - Actualizado Automáticamente (Intermedia - UPSERT)');
    y = drawTable(
      doc,
      {
        headers: ['Tipo Sensor', 'Unidad', 'Fecha', 'Promedio', 'Máximo', 'Mínimo', 'Núm. Lecturas'],
        rows: resumenDiario.map((r) => [
          r.sensor_tipo, 
          r.unidad, 
          r.fecha, 
          Number(r.promedio).toFixed(2), 
          r.maximo, 
          r.minimo, 
          r.num_lecturas
        ])
      },
      doc.y
    );
    doc.y = y;
    doc.addPage();

    // --- Reportes Complejos ---
    doc.fontSize(16).text('Reportes Complejos', { underline: true });
    doc.moveDown();

    // 8. Usuarios con valores por encima del umbral
    doc.fontSize(12).text('8. Usuarios con Lecturas Por Encima del Umbral - Últimos 30 Días (Compleja)');
    y = drawTable(
      doc,
      {
        headers: ['Usuario', 'Tipo Sensor', 'Valor', 'Umbral Máx', 'Fecha/Hora'],
        rows: usuariosUmbral.map((u) => [
          u.usuario, 
          u.sensor_tipo, 
          u.valor, 
          u.umbral_max, 
          String(u.fecha_hora || '').slice(0, 19)
        ])
      },
      doc.y
    );
    doc.y = y;
    doc.moveDown();

    // 9. Media móvil de 7 días
    doc.fontSize(12).text('9. Media Móvil de 7 Días para Lecturas de Sensores (Compleja)');
    y = drawTable(
      doc,
      {
        headers: ['Tipo Sensor', 'Unidad', 'Fecha', 'Media Móvil 7D', 'Valor Actual'],
        rows: mediaMovil.slice(0, 20).map((m) => [
          m.sensor_tipo, 
          m.unidad, 
          m.fecha, 
          Number(m.media_movil_7d).toFixed(2), 
          m.valor_actual
        ])
      },
      doc.y
    );
    doc.y = y;
    doc.addPage();

    // 10. Top 5 usuarios con mayor incremento porcentual
    doc.fontSize(12).text('10. Top 5 Usuarios con Mayor Incremento en Promedio de Lecturas (Compleja)');
    y = drawTable(
      doc,
      {
        headers: ['Usuario', 'Promedio Reciente', 'Promedio Anterior', 'Incremento %'],
        rows: topIncrementos.map((t) => [
          t.usuario, 
          t.promedio_reciente, 
          t.promedio_anterior, 
          t.incremento_porcentual
        ])
      },
      doc.y
    );
    doc.y = y;

    doc.end();
  } catch (error) {
    console.error('Error generando el reporte PDF:', error);
    // Aún no se enviaron headers si falló durante la fase de datos
    res.status(500).json({ message: 'Error generando el reporte', error: String(error?.message || error) });
  }
});

export default router;
