-- VitalTrack initial schema (SQLite)

PRAGMA foreign_keys = ON;

-- Users
CREATE TABLE IF NOT EXISTS usuario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cedula VARCHAR(20),
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_nacimiento DATE,
    consentimiento_privacidad BOOLEAN NOT NULL DEFAULT 1
);

-- Profile of the user
CREATE TABLE IF NOT EXISTS perfil (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    objetivo TEXT,
    sexo VARCHAR(20),
    altura DECIMAL(5, 2),
    estado VARCHAR(20),
    FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE
);

-- Device linked to a user
CREATE TABLE IF NOT EXISTS dispositivo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    serial VARCHAR(100) NOT NULL UNIQUE,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    fecha_vinculacion DATE,
    FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE
);

-- Activity of a user
CREATE TABLE IF NOT EXISTS actividad (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    tipo VARCHAR(50),
    hora_inicio DATETIME,
    hora_fin DATETIME,
    duracion_segundos INTEGER,
    FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_actividad_usuario_fecha ON actividad (usuario_id, hora_inicio);

-- Seed basic data
INSERT OR IGNORE INTO usuario (cedula, nombre, email, fecha_nacimiento, consentimiento_privacidad) VALUES
 ('1234567890', 'Ana García', 'ana@vitaltrack.local', '1995-05-10', 1),
 ('2345678901', 'Juan Pérez', 'juan@vitaltrack.local', '1988-07-22', 1),
 ('3456789012', 'María López', 'maria@vitaltrack.local', '2000-09-30', 1),
 ('4567890123', 'Carlos Ruiz', 'carlos@vitaltrack.local', '1982-01-15', 1);

INSERT OR IGNORE INTO perfil (usuario_id, objetivo, sexo, altura, estado)
 SELECT u.id, 'Bajar 5kg', 'femenino', 165.00, 'activo' FROM usuario u WHERE u.email = 'ana@vitaltrack.local';
INSERT OR IGNORE INTO perfil (usuario_id, objetivo, sexo, altura, estado)
 SELECT u.id, 'Ganar masa muscular', 'masculino', 178.00, 'activo' FROM usuario u WHERE u.email = 'juan@vitaltrack.local';
INSERT OR IGNORE INTO perfil (usuario_id, objetivo, sexo, altura, estado)
 SELECT u.id, 'Mantener', 'femenino', 170.00, 'inactivo' FROM usuario u WHERE u.email = 'maria@vitaltrack.local';
INSERT OR IGNORE INTO perfil (usuario_id, objetivo, sexo, altura, estado)
 SELECT u.id, 'Bajar 10kg', 'masculino', 180.00, 'activo' FROM usuario u WHERE u.email = 'carlos@vitaltrack.local';

INSERT OR IGNORE INTO dispositivo (usuario_id, serial, marca, modelo, fecha_vinculacion)
 SELECT u.id, 'FIT-0001', 'Fitbit', 'Charge 5', '2025-01-10' FROM usuario u WHERE u.email = 'ana@vitaltrack.local';
INSERT OR IGNORE INTO dispositivo (usuario_id, serial, marca, modelo, fecha_vinculacion)
 SELECT u.id, 'GAR-0001', 'Garmin', 'Vivoactive 4', '2025-02-05' FROM usuario u WHERE u.email = 'juan@vitaltrack.local';
INSERT OR IGNORE INTO dispositivo (usuario_id, serial, marca, modelo, fecha_vinculacion)
 SELECT u.id, 'GAR-0002', 'Garmin', 'Forerunner 255', '2025-03-12' FROM usuario u WHERE u.email = 'juan@vitaltrack.local';
INSERT OR IGNORE INTO dispositivo (usuario_id, serial, marca, modelo, fecha_vinculacion)
 SELECT u.id, 'XIA-0001', 'Xiaomi', 'Mi Band 7', '2025-04-20' FROM usuario u WHERE u.email = 'maria@vitaltrack.local';
INSERT OR IGNORE INTO dispositivo (usuario_id, serial, marca, modelo, fecha_vinculacion)
 SELECT u.id, 'FIT-0002', 'Fitbit', 'Versa 3', '2025-05-18' FROM usuario u WHERE u.email = 'carlos@vitaltrack.local';

INSERT OR IGNORE INTO actividad (usuario_id, tipo, hora_inicio, hora_fin, duracion_segundos)
 SELECT u.id, 'correr', datetime('now','-5 days'), datetime('now','-5 days','+45 minutes'), 2700 FROM usuario u WHERE u.email = 'ana@vitaltrack.local';
INSERT OR IGNORE INTO actividad (usuario_id, tipo, hora_inicio, hora_fin, duracion_segundos)
 SELECT u.id, 'caminar', datetime('now','-10 days'), datetime('now','-10 days','+30 minutes'), 1800 FROM usuario u WHERE u.email = 'ana@vitaltrack.local';
INSERT OR IGNORE INTO actividad (usuario_id, tipo, hora_inicio, hora_fin, duracion_segundos)
 SELECT u.id, 'ciclismo', datetime('now','-2 days'), datetime('now','-2 days','+2 hours'), 7200 FROM usuario u WHERE u.email = 'juan@vitaltrack.local';
INSERT OR IGNORE INTO actividad (usuario_id, tipo, hora_inicio, hora_fin, duracion_segundos)
 SELECT u.id, 'correr', datetime('now','-40 days'), datetime('now','-40 days','+30 minutes'), 1800 FROM usuario u WHERE u.email = 'maria@vitaltrack.local';
INSERT OR IGNORE INTO actividad (usuario_id, tipo, hora_inicio, hora_fin, duracion_segundos)
 SELECT u.id, 'natación', datetime('now','-1 days'), datetime('now','-1 days','+1 hours'), 3600 FROM usuario u WHERE u.email = 'carlos@vitaltrack.local';