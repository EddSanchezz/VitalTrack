import mysql from 'mysql2/promise';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const {
	DB_TYPE = 'sqlite',
	DB_HOST = 'localhost',
	DB_PORT = '3306',
	DB_USER = 'root',
	DB_PASSWORD = 'root',
	DB_NAME = 'vitaltrack',
	DB_FILE = './database.sqlite'
} = process.env;

let pool = null;
let db = null;

// Initialize database connection based on type
export function initializeDatabase() {
	if (DB_TYPE === 'sqlite') {
		const dbPath = join(__dirname, '..', DB_FILE);
		db = new sqlite3.Database(dbPath, (err) => {
			if (err) {
				console.error('Error conectando SQLite:', err);
			} else {
				// Enforce foreign keys
				db.run('PRAGMA foreign_keys = ON');
				// SQLite inicializada
			}
		});
		return db;
	} else {
		// MySQL connection pool
		pool = mysql.createPool({
			host: DB_HOST,
			port: Number(DB_PORT),
			user: DB_USER,
			password: DB_PASSWORD,
			database: DB_NAME,
			waitForConnections: true,
			connectionLimit: 10,
			queueLimit: 0,
			timezone: 'Z'
		});
		// Pool MySQL inicializado
		return pool;
	}
}

export async function ping() {
	return new Promise((resolve) => {
		try {
			if (DB_TYPE === 'sqlite') {
				if (!db) initializeDatabase();
				db.get('SELECT 1 AS ok', (err, result) => {
					if (err) {
						console.error('Error ping base de datos:', err);
						resolve(false);
					} else {
						resolve(result?.ok === 1);
					}
				});
			} else {
				if (!pool) initializeDatabase();
				pool.query('SELECT 1 AS ok')
					.then(([rows]) => resolve(rows[0]?.ok === 1))
					.catch((error) => {
						console.error('Error ping base de datos:', error);
						resolve(false);
					});
			}
		} catch (error) {
			console.error('Error ping base de datos:', error);
			resolve(false);
		}
	});
}

export async function query(sql, params = []) {
	return new Promise((resolve, reject) => {
		try {
			if (DB_TYPE === 'sqlite') {
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
					db.run(sql, params, function(err) {
						if (err) {
							console.error('Error consulta base de datos:', err);
							reject(err);
						} else {
							resolve({ insertId: this.lastID, affectedRows: this.changes });
						}
					});
				}
			} else {
				if (!pool) initializeDatabase();
				pool.query(sql, params)
					.then(([rows]) => resolve(rows))
					.catch((error) => {
						console.error('Error consulta base de datos:', error);
						reject(error);
					});
			}
		} catch (error) {
			console.error('Error consulta base de datos:', error);
			reject(error);
		}
	});
}

export function getDatabase() {
	if (DB_TYPE === 'sqlite') {
		if (!db) initializeDatabase();
		return db;
	} else {
		if (!pool) initializeDatabase();
		return pool;
	}
}

// Initialize on import
initializeDatabase();

