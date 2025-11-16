import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.sqlite');

console.log('📊 Verificando datos en la base de datos...\n');

const queries = [
  { name: 'Usuarios', sql: 'SELECT COUNT(*) as count FROM usuario' },
  { name: 'Perfiles', sql: 'SELECT COUNT(*) as count FROM perfil' },
  { name: 'Dispositivos', sql: 'SELECT COUNT(*) as count FROM dispositivo' },
  { name: 'Actividades', sql: 'SELECT COUNT(*) as count FROM actividad' },
  { name: 'Sensores', sql: 'SELECT COUNT(*) as count FROM sensor' },
  { name: 'Lecturas', sql: 'SELECT COUNT(*) as count FROM lectura' },
  { name: 'Retos', sql: 'SELECT COUNT(*) as count FROM reto' },
  { name: 'Reto_Usuario', sql: 'SELECT COUNT(*) as count FROM reto_usuario' },
  { name: 'Resumen Diario', sql: 'SELECT COUNT(*) as count FROM resumen_diario' }
];

async function runQuery(query) {
  return new Promise((resolve, reject) => {
    db.get(query.sql, (err, row) => {
      if (err) reject(err);
      else resolve({ name: query.name, count: row.count });
    });
  });
}

async function verify() {
  try {
    for (const query of queries) {
      const result = await runQuery(query);
      console.log(`✅ ${result.name.padEnd(20)}: ${result.count} registros`);
    }
    
    // Verificar esquema de resumen_diario
    console.log('\n📋 Esquema de resumen_diario:');
    db.all("PRAGMA table_info(resumen_diario)", (err, rows) => {
      if (err) {
        console.error('❌ Error:', err);
      } else {
        rows.forEach(col => {
          console.log(`   - ${col.name} (${col.type})`);
        });
      }
      db.close();
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    db.close();
    process.exit(1);
  }
}

verify();
