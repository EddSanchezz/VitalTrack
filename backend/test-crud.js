import { spawn } from 'child_process';
import fetch from 'node-fetch';
import { promisify } from 'util';
import { setTimeout as wait } from 'timers/promises';

async function api(method, path, body) {
  const url = `http://localhost:4000${path}`;
  const init = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) init.body = JSON.stringify(body);
  const res = await fetch(url, init);
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) throw new Error(`${method} ${path} => ${res.status} ${text}`);
  return data;
}

async function runCrudTests() {
  console.log('🚀 Starting backend server on :4000...');
  const server = spawn('node', ['src/server.js'], { env: { ...process.env, PORT: '4000' }, cwd: process.cwd() });
  server.stdout.on('data', d => process.stdout.write(d));
  server.stderr.on('data', d => process.stderr.write(d));

  try {
    // wait for server
    await wait(1500);

    // Usuarios
    console.log('\n=== Usuarios CRUD ===');
    const users0 = await api('GET', '/api/usuarios');
    console.log(`Usuarios iniciales: ${users0.length}`);

    const email = `test${Date.now()}@vt.local`;
    const uCreated = await api('POST', '/api/usuarios', { cedula: '999', nombre: 'Test User', email, fecha_nacimiento: '1990-01-01', consentimiento_privacidad: true });
    console.log('Creado:', uCreated.id, uCreated.email);

    const uList1 = await api('GET', '/api/usuarios');
    const foundU = uList1.find(u => u.id === (uCreated.id || uCreated.insertId));
    if (!foundU) throw new Error('Usuario creado no aparece en listado');

    const uUpd = await api('PUT', `/api/usuarios/${uCreated.id}`, { cedula: '1000', nombre: 'User Edit', email, fecha_nacimiento: '1991-02-02', consentimiento_privacidad: false });
    if (uUpd.nombre !== 'User Edit') throw new Error('Usuario no actualizado');

    await api('DELETE', `/api/usuarios/${uCreated.id}`);
    const uList2 = await api('GET', '/api/usuarios');
    if (uList2.find(u => u.id === uCreated.id)) throw new Error('Usuario no eliminado');
    console.log('Usuarios CRUD OK');

    // Perfiles
    console.log('\n=== Perfiles CRUD ===');
    const users = await api('GET', '/api/usuarios');
    const ana = users.find(u => u.email === 'ana@vitaltrack.local') || users[0];
    const p0 = await api('GET', '/api/perfiles');
    console.log(`Perfiles iniciales: ${p0.length}`);
    const pCreated = await api('POST', '/api/perfiles', { usuario_id: ana.id, objetivo: 'Objetivo test', sexo: 'femenino', altura: 160, estado: 'activo' });
    const pUpd = await api('PUT', `/api/perfiles/${pCreated.id}`, { usuario_id: ana.id, objetivo: 'Objetivo edit', sexo: 'femenino', altura: 161, estado: 'activo' });
    if (pUpd.objetivo !== 'Objetivo edit') throw new Error('Perfil no actualizado');
    await api('DELETE', `/api/perfiles/${pCreated.id}`);
    console.log('Perfiles CRUD OK');

    // Actividades
    console.log('\n=== Actividades CRUD ===');
    const aCreated = await api('POST', '/api/actividades', { usuario_id: ana.id, tipo: 'prueba', hora_inicio: '2025-11-16T10:00:00Z', hora_fin: '2025-11-16T10:30:00Z' });
    const aUpd = await api('PUT', `/api/actividades/${aCreated.id}`, { usuario_id: ana.id, tipo: 'edit', hora_inicio: '2025-11-16T10:00:00Z', hora_fin: '2025-11-16T11:00:00Z' });
    if (aUpd.tipo !== 'edit' || aUpd.duracion_segundos < 3599) throw new Error('Actividad no actualizada correctamente');
    await api('DELETE', `/api/actividades/${aCreated.id}`);
    console.log('Actividades CRUD OK');

    // Dispositivos
    console.log('\n=== Dispositivos CRUD ===');
    const serial = `TEST-${Date.now()}`;
    const dCreated = await api('POST', '/api/dispositivos', { usuario_id: ana.id, serial, marca: 'TestBrand', modelo: 'TestModel', fecha_vinculacion: '2025-11-01' });
    const dUpd = await api('PUT', `/api/dispositivos/${dCreated.id}`, { usuario_id: ana.id, serial, marca: 'BrandX', modelo: 'ModelY', fecha_vinculacion: '2025-11-02' });
    if (dUpd.marca !== 'BrandX') throw new Error('Dispositivo no actualizado');
    await api('DELETE', `/api/dispositivos/${dCreated.id}`);
    console.log('Dispositivos CRUD OK');

    console.log('\n🎉 Todos los CRUD verificados correctamente');
  } catch (err) {
    console.error('❌ Falla en verificación:', err.message);
    process.exit(1);
  } finally {
    // stop server
    console.log('\n🛑 Deteniendo servidor...');
    server.kill();
  }
}

runCrudTests();
