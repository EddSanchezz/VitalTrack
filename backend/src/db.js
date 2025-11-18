import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { DB_TYPE = 'sqlite', DB_FILE = './database.sqlite' } = process.env;

let db = null;

// Initialize database connection (SQLite only)
export function initializeDatabase() {
	const dbPath = join(__dirname, '..', DB_FILE);
	db = new sqlite3.Database(dbPath, (err) => {
		if (err) {
			console.error('Error conectando SQLite:', err);
		} else {
			// Enforce foreign keys
			db.run('PRAGMA foreign_keys = ON');

			// Always ensure schema exists (idempotent)
			const createStatements = [
				`CREATE TABLE IF NOT EXISTS usuario (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					cedula VARCHAR(20),
					nombre VARCHAR(100) NOT NULL,
					email VARCHAR(120) NOT NULL UNIQUE,
					fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
					fecha_nacimiento DATE,
					consentimiento_privacidad BOOLEAN NOT NULL DEFAULT 1
				)`,
				`CREATE TABLE IF NOT EXISTS perfil (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					usuario_id INTEGER NOT NULL,
					objetivo TEXT,
					sexo VARCHAR(20),
					altura DECIMAL(5, 2),
					estado VARCHAR(20),
					FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE
				)`,
				`CREATE TABLE IF NOT EXISTS dispositivo (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					usuario_id INTEGER NOT NULL,
					serial VARCHAR(100) NOT NULL UNIQUE,
					marca VARCHAR(50),
					modelo VARCHAR(50),
					fecha_vinculacion DATE,
					FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE
				)`,
				`CREATE TABLE IF NOT EXISTS actividad (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					usuario_id INTEGER NOT NULL,
					tipo VARCHAR(50),
					hora_inicio DATETIME,
					hora_fin DATETIME,
					duracion_segundos INTEGER,
					FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE
				)`,
				`CREATE INDEX IF NOT EXISTS idx_actividad_usuario_fecha ON actividad (usuario_id, hora_inicio)`,
				`CREATE TABLE IF NOT EXISTS sensor (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					dispositivo_id INTEGER NOT NULL,
					tipo VARCHAR(50) NOT NULL,
					unidad VARCHAR(20),
					umbral_min DECIMAL(10, 2),
					umbral_max DECIMAL(10, 2),
					FOREIGN KEY (dispositivo_id) REFERENCES dispositivo (id) ON DELETE CASCADE
				)`,
				`CREATE TABLE IF NOT EXISTS lectura (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					sensor_id INTEGER NOT NULL,
					valor DECIMAL(10, 2) NOT NULL,
					fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
					FOREIGN KEY (sensor_id) REFERENCES sensor (id) ON DELETE CASCADE
				)`,
				`CREATE INDEX IF NOT EXISTS idx_lectura_sensor_fecha ON lectura (sensor_id, fecha_hora)`,
				`CREATE TABLE IF NOT EXISTS resumen_diario (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					sensor_id INTEGER NOT NULL,
					fecha DATE NOT NULL,
					promedio DECIMAL(10, 2),
					minimo DECIMAL(10, 2),
					maximo DECIMAL(10, 2),
					num_lecturas INTEGER,
					fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
					UNIQUE(sensor_id, fecha),
					FOREIGN KEY (sensor_id) REFERENCES sensor (id) ON DELETE CASCADE
				)`,
				`CREATE TABLE IF NOT EXISTS reto (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					nombre VARCHAR(100) NOT NULL,
					descripcion TEXT,
					fecha_inicio DATE,
					fecha_fin DATE,
					objetivo_tipo VARCHAR(50),
					objetivo_valor DECIMAL(10, 2),
					estado VARCHAR(20) DEFAULT 'activo'
				)`,
				`CREATE TABLE IF NOT EXISTS reto_usuario (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					reto_id INTEGER NOT NULL,
					usuario_id INTEGER NOT NULL,
					progreso DECIMAL(5, 2) DEFAULT 0,
					completado BOOLEAN DEFAULT 0,
					FOREIGN KEY (reto_id) REFERENCES reto (id) ON DELETE CASCADE,
					FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE,
					UNIQUE(reto_id, usuario_id)
				)`
			];

			db.serialize(() => {
				for (const s of createStatements) {
					db.run(s, (se) => {
						if (se) console.error('Error creando esquema SQLite:', se);
					});
				}

				// Conditional seed: base entities if no usuarios
				db.get('SELECT COUNT(1) AS c FROM usuario', (e1, r1) => {
					if (e1) {
						console.error('Error verificando usuarios:', e1);
						return;
					}
					if ((r1?.c ?? 0) === 0) {
						const baseSeeds = [
							`INSERT OR IGNORE INTO usuario (cedula, nombre, email, fecha_nacimiento, consentimiento_privacidad) VALUES
							 ('1234567890', 'Ana García', 'ana@vitaltrack.local', '1995-05-10', 1),
							 ('2345678901', 'Juan Pérez', 'juan@vitaltrack.local', '1988-07-22', 1),
							 ('3456789012', 'María López', 'maria@vitaltrack.local', '2000-09-30', 1),
							 ('4567890123', 'Carlos Ruiz', 'carlos@vitaltrack.local', '1982-01-15', 1)`,
							`INSERT OR IGNORE INTO perfil (usuario_id, objetivo, sexo, altura, estado)
							 SELECT u.id, 'Bajar 5kg', 'femenino', 165.00, 'activo' FROM usuario u WHERE u.email = 'ana@vitaltrack.local'`,
							`INSERT OR IGNORE INTO perfil (usuario_id, objetivo, sexo, altura, estado)
							 SELECT u.id, 'Ganar masa muscular', 'masculino', 178.00, 'activo' FROM usuario u WHERE u.email = 'juan@vitaltrack.local'`,
							`INSERT OR IGNORE INTO perfil (usuario_id, objetivo, sexo, altura, estado)
							 SELECT u.id, 'Mantener', 'femenino', 170.00, 'inactivo' FROM usuario u WHERE u.email = 'maria@vitaltrack.local'`,
							`INSERT OR IGNORE INTO perfil (usuario_id, objetivo, sexo, altura, estado)
							 SELECT u.id, 'Bajar 10kg', 'masculino', 180.00, 'activo' FROM usuario u WHERE u.email = 'carlos@vitaltrack.local'`,
							`INSERT OR IGNORE INTO dispositivo (usuario_id, serial, marca, modelo, fecha_vinculacion)
							 SELECT u.id, 'FIT-0001', 'Fitbit', 'Charge 5', '2025-01-10' FROM usuario u WHERE u.email = 'ana@vitaltrack.local'`,
							`INSERT OR IGNORE INTO dispositivo (usuario_id, serial, marca, modelo, fecha_vinculacion)
							 SELECT u.id, 'GAR-0001', 'Garmin', 'Vivoactive 4', '2025-02-05' FROM usuario u WHERE u.email = 'juan@vitaltrack.local'`,
							`INSERT OR IGNORE INTO dispositivo (usuario_id, serial, marca, modelo, fecha_vinculacion)
							 SELECT u.id, 'GAR-0002', 'Garmin', 'Forerunner 255', '2025-03-12' FROM usuario u WHERE u.email = 'juan@vitaltrack.local'`,
							`INSERT OR IGNORE INTO dispositivo (usuario_id, serial, marca, modelo, fecha_vinculacion)
							 SELECT u.id, 'XIA-0001', 'Xiaomi', 'Mi Band 7', '2025-04-20' FROM usuario u WHERE u.email = 'maria@vitaltrack.local'`,
							`INSERT OR IGNORE INTO dispositivo (usuario_id, serial, marca, modelo, fecha_vinculacion)
							 SELECT u.id, 'FIT-0002', 'Fitbit', 'Versa 3', '2025-05-18' FROM usuario u WHERE u.email = 'carlos@vitaltrack.local'`,
							`INSERT OR IGNORE INTO actividad (usuario_id, tipo, hora_inicio, hora_fin, duracion_segundos)
							 SELECT u.id, 'correr', datetime('now','-5 days'), datetime('now','-5 days','+45 minutes'), 2700 FROM usuario u WHERE u.email = 'ana@vitaltrack.local'`,
							`INSERT OR IGNORE INTO actividad (usuario_id, tipo, hora_inicio, hora_fin, duracion_segundos)
							 SELECT u.id, 'caminar', datetime('now','-10 days'), datetime('now','-10 days','+30 minutes'), 1800 FROM usuario u WHERE u.email = 'ana@vitaltrack.local'`,
							`INSERT OR IGNORE INTO actividad (usuario_id, tipo, hora_inicio, hora_fin, duracion_segundos)
							 SELECT u.id, 'ciclismo', datetime('now','-2 days'), datetime('now','-2 days','+2 hours'), 7200 FROM usuario u WHERE u.email = 'juan@vitaltrack.local'`,
							`INSERT OR IGNORE INTO actividad (usuario_id, tipo, hora_inicio, hora_fin, duracion_segundos)
							 SELECT u.id, 'correr', datetime('now','-40 days'), datetime('now','-40 days','+30 minutes'), 1800 FROM usuario u WHERE u.email = 'maria@vitaltrack.local'`,
							`INSERT OR IGNORE INTO actividad (usuario_id, tipo, hora_inicio, hora_fin, duracion_segundos)
							 SELECT u.id, 'natación', datetime('now','-1 days'), datetime('now','-1 days','+1 hours'), 3600 FROM usuario u WHERE u.email = 'carlos@vitaltrack.local'`
						];
						for (const s of baseSeeds) {
							db.run(s, (se) => {
								if (se) console.error('Error insertando datos base:', se);
							});
						}
					}

					// Conditional seed: sensors/lecturas/retos if no sensors
					db.get('SELECT COUNT(1) AS c FROM sensor', (e2, r2) => {
						if (e2) {
							console.error('Error verificando sensores:', e2);
							return;
						}
						if ((r2?.c ?? 0) === 0) {
							const extendedSeeds = [
								`INSERT OR IGNORE INTO sensor (dispositivo_id, tipo, unidad, umbral_min, umbral_max)
								 SELECT d.id, 'frecuencia_cardiaca', 'bpm', 50, 180 FROM dispositivo d WHERE d.serial = 'FIT-0001'`,
								`INSERT OR IGNORE INTO sensor (dispositivo_id, tipo, unidad, umbral_min, umbral_max)
								 SELECT d.id, 'pasos', 'pasos', 0, 50000 FROM dispositivo d WHERE d.serial = 'FIT-0001'`,
								`INSERT OR IGNORE INTO sensor (dispositivo_id, tipo, unidad, umbral_min, umbral_max)
								 SELECT d.id, 'frecuencia_cardiaca', 'bpm', 50, 200 FROM dispositivo d WHERE d.serial = 'GAR-0001'`,
								`INSERT OR IGNORE INTO sensor (dispositivo_id, tipo, unidad, umbral_min, umbral_max)
								 SELECT d.id, 'temperatura', '°C', 35, 42 FROM dispositivo d WHERE d.serial = 'GAR-0001'`,
								`INSERT OR IGNORE INTO sensor (dispositivo_id, tipo, unidad, umbral_min, umbral_max)
								 SELECT d.id, 'oxigeno', '%', 85, 100 FROM dispositivo d WHERE d.serial = 'XIA-0001'`,
								// Lecturas de frecuencia cardíaca (sensor id 1)
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT s.id, 75, datetime('now','-1 hours') FROM sensor s WHERE s.tipo = 'frecuencia_cardiaca' AND s.id = 1`,
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT s.id, 82, datetime('now','-2 hours') FROM sensor s WHERE s.tipo = 'frecuencia_cardiaca' AND s.id = 1`,
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT s.id, 195, datetime('now','-1 days') FROM sensor s WHERE s.tipo = 'frecuencia_cardiaca' AND s.id = 1`,
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT s.id, 88, datetime('now','-1 days','-6 hours') FROM sensor s WHERE s.tipo = 'frecuencia_cardiaca' AND s.id = 1`,
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT s.id, 72, datetime('now','-2 days') FROM sensor s WHERE s.tipo = 'frecuencia_cardiaca' AND s.id = 1`,
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT s.id, 85, datetime('now','-3 days') FROM sensor s WHERE s.tipo = 'frecuencia_cardiaca' AND s.id = 1`,
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT s.id, 78, datetime('now','-4 days') FROM sensor s WHERE s.tipo = 'frecuencia_cardiaca' AND s.id = 1`,
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT s.id, 90, datetime('now','-5 days') FROM sensor s WHERE s.tipo = 'frecuencia_cardiaca' AND s.id = 1`,
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT s.id, 76, datetime('now','-6 days') FROM sensor s WHERE s.tipo = 'frecuencia_cardiaca' AND s.id = 1`,
								// Lecturas de pasos (sensor id 2)
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT s.id, 8500, datetime('now','-1 days') FROM sensor s WHERE s.tipo = 'pasos' AND s.id = 2`,
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT s.id, 12000, datetime('now','-2 days') FROM sensor s WHERE s.tipo = 'pasos' AND s.id = 2`,
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT s.id, 9800, datetime('now','-3 days') FROM sensor s WHERE s.tipo = 'pasos' AND s.id = 2`,
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT s.id, 11500, datetime('now','-4 days') FROM sensor s WHERE s.tipo = 'pasos' AND s.id = 2`,
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT s.id, 10200, datetime('now','-5 days') FROM sensor s WHERE s.tipo = 'pasos' AND s.id = 2`,
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT s.id, 8900, datetime('now','-6 days') FROM sensor s WHERE s.tipo = 'pasos' AND s.id = 2`,
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT s.id, 9600, datetime('now','-7 days') FROM sensor s WHERE s.tipo = 'pasos' AND s.id = 2`,
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT s.id, 7500, datetime('now','-35 days') FROM sensor s WHERE s.tipo = 'pasos' AND s.id = 2`,
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT s.id, 8000, datetime('now','-36 days') FROM sensor s WHERE s.tipo = 'pasos' AND s.id = 2`,
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT s.id, 7800, datetime('now','-37 days') FROM sensor s WHERE s.tipo = 'pasos' AND s.id = 2`,
								// Lecturas de temperatura (sensor id 4)
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT s.id, 36.5, datetime('now','-1 hours') FROM sensor s WHERE s.tipo = 'temperatura' AND s.id = 4`,
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT s.id, 36.8, datetime('now','-1 days') FROM sensor s WHERE s.tipo = 'temperatura' AND s.id = 4`,
								// Lecturas de oxígeno (sensor id 5)
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT s.id, 97, datetime('now','-30 minutes') FROM sensor s WHERE s.tipo = 'oxigeno' AND s.id = 5`,
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT s.id, 98, datetime('now','-1 days') FROM sensor s WHERE s.tipo = 'oxigeno' AND s.id = 5`,
								// Periodo anterior para sensor 3 (frecuencia cardíaca Garmin)
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT 3, 70, datetime('now','-35 days')`,
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT 3, 72, datetime('now','-40 days')`,
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT 3, 68, datetime('now','-45 days')`,
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT 3, 75, datetime('now','-50 days')`,
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT 3, 71, datetime('now','-55 days')`,
								// Reciente para sensor 3 (últimos 30 días)
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT 3, 85, datetime('now','-5 days')`,
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT 3, 88, datetime('now','-10 days')`,
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT 3, 90, datetime('now','-15 days')`,
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT 3, 92, datetime('now','-20 days')`,
								`INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
								 SELECT 3, 87, datetime('now','-25 days')`,
								// Retos y relaciones
								`INSERT OR IGNORE INTO reto (nombre, descripcion, fecha_inicio, fecha_fin, objetivo_tipo, objetivo_valor, estado)
								 VALUES ('10K Steps Challenge', 'Camina 10,000 pasos diarios durante 30 días', date('now','-10 days'), date('now','+20 days'), 'pasos', 10000, 'activo')`,
								`INSERT OR IGNORE INTO reto (nombre, descripcion, fecha_inicio, fecha_fin, objetivo_tipo, objetivo_valor, estado)
								 VALUES ('Cardio Warrior', 'Mantén tu ritmo cardíaco en zona de ejercicio 5 veces por semana', date('now','-5 days'), date('now','+25 days'), 'frecuencia_cardiaca', 120, 'activo')`,
								`INSERT OR IGNORE INTO reto_usuario (reto_id, usuario_id, progreso, completado)
								 SELECT r.id, u.id, 65.5, 0 FROM reto r, usuario u WHERE r.nombre = '10K Steps Challenge' AND u.email = 'ana@vitaltrack.local'`,
								`INSERT OR IGNORE INTO reto_usuario (reto_id, usuario_id, progreso, completado)
								 SELECT r.id, u.id, 100, 1 FROM reto r, usuario u WHERE r.nombre = '10K Steps Challenge' AND u.email = 'juan@vitaltrack.local'`,
								`INSERT OR IGNORE INTO reto_usuario (reto_id, usuario_id, progreso, completado)
								 SELECT r.id, u.id, 42.0, 0 FROM reto r, usuario u WHERE r.nombre = 'Cardio Warrior' AND u.email = 'carlos@vitaltrack.local'`
							];
							for (const s of extendedSeeds) {
								db.run(s, (se) => {
									if (se) console.error('Error insertando datos extendidos:', se);
								});
							}
						}
					});
				});
			});
		}
	});
	return db;
}

export async function ping() {
	return new Promise((resolve) => {
		try {
			if (!db) initializeDatabase();
			db.get('SELECT 1 AS ok', (err, result) => {
				if (err) {
					console.error('Error ping base de datos:', err);
					resolve(false);
				} else {
					resolve(result?.ok === 1);
				}
			});
		} catch (error) {
			console.error('Error ping base de datos:', error);
			resolve(false);
		}
	});
}

export async function query(sql, params = []) {
	return new Promise((resolve, reject) => {
		try {
			if (!db) initializeDatabase();
			if (sql.toLowerCase().includes('select')) {
				db.all(sql, params, (err, rows) => {
					if (err) {
						console.error('Error consulta base de datos:', err);
						reject(err);
					} else {
						resolve(rows || []);
					}
				});
			} else {
				db.run(sql, params, function (err) {
					if (err) {
						console.error('Error consulta base de datos:', err);
						reject(err);
					} else {
						resolve({ insertId: this.lastID, affectedRows: this.changes });
					}
				});
			}
		} catch (error) {
			console.error('Error consulta base de datos:', error);
			reject(error);
		}
	});
}

export function getDatabase() {
	if (!db) initializeDatabase();
	return db;
}

// Initialize on import
initializeDatabase();

