#!/usr/bin/env node

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sqlite3 from 'sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupDatabase() {
	try {
		// Iniciando configuración de la base de datos
		
		const dbType = process.env.DB_TYPE || 'sqlite';
		// Tipo de base de datos

		if (dbType === 'sqlite') {
			const dbPath = join(__dirname, '../database.sqlite');
			
			const db = new sqlite3.Database(dbPath, (err) => {
				if (err) {
					console.error('Error creando SQLite:', err);
					process.exit(1);
				}
				// Archivo SQLite
			});

			// SQLite schema (adapted from MySQL)
			const sqliteSchema = [
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
					sexo CHAR(1),
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
				
				// Insert seed data
				`INSERT OR IGNORE INTO usuario (cedula, nombre, email, fecha_nacimiento, consentimiento_privacidad)
				 VALUES ('1234567890', 'Usuario Demo', 'demo@vitaltrack.local', '1990-01-01', 1)`,
				
				// Insert profile for demo user
				`INSERT OR IGNORE INTO perfil (usuario_id, objetivo, sexo, altura, estado)
				 SELECT id, 'Bajar 5kg', 'M', 175.00, 'activo'
				 FROM usuario WHERE email = 'demo@vitaltrack.local'`
			];

			// Execute all statements
			for (const sql of sqliteSchema) {
				await new Promise((resolve, reject) => {
					db.run(sql, (err) => {
						if (err) {
							console.error('Error ejecutando SQL:', err);
							reject(err);
						} else {
							resolve();
						}
					});
				});
			}

			db.close();
			// Base de datos SQLite configurada correctamente

		} else {
			// Configuración MySQL no implementada en este script
			// Use Docker Compose para MySQL: docker compose up -d db
		}

		// Base de datos lista para usar

	} catch (error) {
		console.error('Error configurando base de datos:', error);
		process.exit(1);
	}
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
	setupDatabase();
}

export { setupDatabase };