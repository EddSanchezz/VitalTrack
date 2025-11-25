# DICCIONARIO DE DATOS E IMPLEMENTACIÓN DE LA BD

## 6. DICCIONARIO DE LOS DATOS

### 6.1 Entidad: USUARIO
**Finalidad:** Almacenar la información de los usuarios registrados en el sistema VitalTrack, quienes utilizan dispositivos wearables para el seguimiento de su salud y actividad física.

| Atributo | Finalidad | Tipo de Dato | Restricciones | Llave Primaria | Llave Foránea | Referencia |
|----------|-----------|--------------|---------------|----------------|---------------|------------|
| id | Identificador único del usuario | INTEGER | NOT NULL, AUTOINCREMENT | ✓ | - | - |
| cedula | Documento de identidad del usuario | VARCHAR(20) | - | - | - | - |
| nombre | Nombre completo del usuario | VARCHAR(100) | NOT NULL | - | - | - |
| email | Correo electrónico único del usuario | VARCHAR(120) | NOT NULL, UNIQUE | - | - | - |
| fecha_registro | Fecha y hora de registro en el sistema | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | - | - | - |
| fecha_nacimiento | Fecha de nacimiento del usuario | DATE | - | - | - | - |
| consentimiento_privacidad | Aceptación de políticas de privacidad | BOOLEAN | NOT NULL, DEFAULT 1 | - | - | - |

---

### 6.2 Entidad: PERFIL
**Finalidad:** Almacenar información del perfil de salud de cada usuario, incluyendo objetivos de bienestar, características físicas y estado de actividad.

| Atributo | Finalidad | Tipo de Dato | Restricciones | Llave Primaria | Llave Foránea | Referencia |
|----------|-----------|--------------|---------------|----------------|---------------|------------|
| id | Identificador único del perfil | INTEGER | NOT NULL, AUTOINCREMENT | ✓ | - | - |
| usuario_id | Usuario propietario del perfil | INTEGER | NOT NULL, ON DELETE CASCADE | - | ✓ | usuario(id) |
| objetivo | Objetivo de salud del usuario | TEXT | - | - | - | - |
| sexo | Sexo biológico del usuario | VARCHAR(20) | - | - | - | - |
| altura | Altura del usuario en centímetros | DECIMAL(5,2) | - | - | - | - |
| estado | Estado de actividad (activo/inactivo) | VARCHAR(20) | - | - | - | - |

---

### 6.3 Entidad: DISPOSITIVO
**Finalidad:** Registrar los dispositivos wearables (smartwatches, fitness trackers) vinculados a cada usuario para el monitoreo de su actividad física y métricas de salud.

| Atributo | Finalidad | Tipo de Dato | Restricciones | Llave Primaria | Llave Foránea | Referencia |
|----------|-----------|--------------|---------------|----------------|---------------|------------|
| id | Identificador único del dispositivo | INTEGER | NOT NULL, AUTOINCREMENT | ✓ | - | - |
| usuario_id | Usuario propietario del dispositivo | INTEGER | NOT NULL, ON DELETE CASCADE | - | ✓ | usuario(id) |
| serial | Número de serie único del dispositivo | VARCHAR(100) | NOT NULL, UNIQUE | - | - | - |
| marca | Fabricante del dispositivo | VARCHAR(50) | - | - | - | - |
| modelo | Modelo específico del dispositivo | VARCHAR(50) | - | - | - | - |
| fecha_vinculacion | Fecha de vinculación al sistema | DATE | - | - | - | - |

---

### 6.4 Entidad: ACTIVIDAD
**Finalidad:** Registrar las actividades físicas realizadas por los usuarios, incluyendo tipo de ejercicio, duración y horarios.

| Atributo | Finalidad | Tipo de Dato | Restricciones | Llave Primaria | Llave Foránea | Referencia |
|----------|-----------|--------------|---------------|----------------|---------------|------------|
| id | Identificador único de la actividad | INTEGER | NOT NULL, AUTOINCREMENT | ✓ | - | - |
| usuario_id | Usuario que realizó la actividad | INTEGER | NOT NULL, ON DELETE CASCADE | - | ✓ | usuario(id) |
| tipo | Tipo de actividad física realizada | VARCHAR(50) | - | - | - | - |
| hora_inicio | Fecha y hora de inicio de actividad | DATETIME | - | - | - | - |
| hora_fin | Fecha y hora de finalización | DATETIME | - | - | - | - |
| duracion_segundos | Duración total en segundos | INTEGER | - | - | - | - |

**Índices:** idx_actividad_usuario_fecha (usuario_id, hora_inicio)

---

### 6.5 Entidad: SENSOR
**Finalidad:** Almacenar información de los sensores integrados en cada dispositivo wearable, definiendo el tipo de métrica que miden y sus umbrales de alerta.

| Atributo | Finalidad | Tipo de Dato | Restricciones | Llave Primaria | Llave Foránea | Referencia |
|----------|-----------|--------------|---------------|----------------|---------------|------------|
| id | Identificador único del sensor | INTEGER | NOT NULL, AUTOINCREMENT | ✓ | - | - |
| dispositivo_id | Dispositivo al que pertenece el sensor | INTEGER | NOT NULL, ON DELETE CASCADE | - | ✓ | dispositivo(id) |
| tipo | Tipo de sensor (frecuencia_cardiaca, pasos, oxigeno, etc.) | VARCHAR(50) | NOT NULL | - | - | - |
| unidad | Unidad de medida del sensor | VARCHAR(20) | - | - | - | - |
| umbral_min | Valor mínimo aceptable de la métrica | DECIMAL(10,2) | - | - | - | - |
| umbral_max | Valor máximo aceptable de la métrica | DECIMAL(10,2) | - | - | - | - |

---

### 6.6 Entidad: LECTURA
**Finalidad:** Registrar las lecturas individuales capturadas por los sensores de los dispositivos, creando un historial temporal de las métricas de salud del usuario.

| Atributo | Finalidad | Tipo de Dato | Restricciones | Llave Primaria | Llave Foránea | Referencia |
|----------|-----------|--------------|---------------|----------------|---------------|------------|
| id | Identificador único de la lectura | INTEGER | NOT NULL, AUTOINCREMENT | ✓ | - | - |
| sensor_id | Sensor que realizó la lectura | INTEGER | NOT NULL, ON DELETE CASCADE | - | ✓ | sensor(id) |
| valor | Valor medido por el sensor | DECIMAL(10,2) | NOT NULL | - | - | - |
| fecha_hora | Fecha y hora de la lectura | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | - | - | - |

**Índices:** idx_lectura_sensor_fecha (sensor_id, fecha_hora)

---

### 6.7 Entidad: RESUMEN_DIARIO
**Finalidad:** Almacenar estadísticas consolidadas diarias de las lecturas de cada sensor, optimizando consultas de análisis de tendencias y generación de reportes.

| Atributo | Finalidad | Tipo de Dato | Restricciones | Llave Primaria | Llave Foránea | Referencia |
|----------|-----------|--------------|---------------|----------------|---------------|------------|
| id | Identificador único del resumen | INTEGER | NOT NULL, AUTOINCREMENT | ✓ | - | - |
| sensor_id | Sensor del cual se genera el resumen | INTEGER | NOT NULL, ON DELETE CASCADE | - | ✓ | sensor(id) |
| fecha | Fecha del resumen consolidado | DATE | NOT NULL, UNIQUE(sensor_id, fecha) | - | - | - |
| promedio | Valor promedio de lecturas del día | DECIMAL(10,2) | - | - | - | - |
| minimo | Valor mínimo registrado en el día | DECIMAL(10,2) | - | - | - | - |
| maximo | Valor máximo registrado en el día | DECIMAL(10,2) | - | - | - | - |
| num_lecturas | Cantidad total de lecturas procesadas | INTEGER | - | - | - | - |
| fecha_actualizacion | Última actualización del resumen | DATETIME | DEFAULT CURRENT_TIMESTAMP | - | - | - |

---

### 6.8 Entidad: RETO
**Finalidad:** Definir desafíos de salud y bienestar que los usuarios pueden aceptar, con objetivos específicos, periodos de tiempo y estados de actividad.

| Atributo | Finalidad | Tipo de Dato | Restricciones | Llave Primaria | Llave Foránea | Referencia |
|----------|-----------|--------------|---------------|----------------|---------------|------------|
| id | Identificador único del reto | INTEGER | NOT NULL, AUTOINCREMENT | ✓ | - | - |
| nombre | Nombre descriptivo del reto | VARCHAR(100) | NOT NULL | - | - | - |
| descripcion | Descripción detallada del desafío | TEXT | - | - | - | - |
| fecha_inicio | Fecha de inicio del reto | DATE | - | - | - | - |
| fecha_fin | Fecha de finalización del reto | DATE | - | - | - | - |
| objetivo_tipo | Tipo de métrica del objetivo | VARCHAR(50) | - | - | - | - |
| objetivo_valor | Valor numérico del objetivo | DECIMAL(10,2) | - | - | - | - |
| estado | Estado actual del reto | VARCHAR(20) | DEFAULT 'activo' | - | - | - |

---

### 6.9 Entidad: RETO_USUARIO
**Finalidad:** Relacionar usuarios con los retos en los que participan, registrando su progreso individual y estado de completitud.

| Atributo | Finalidad | Tipo de Dato | Restricciones | Llave Primaria | Llave Foránea | Referencia |
|----------|-----------|--------------|---------------|----------------|---------------|------------|
| id | Identificador único de la participación | INTEGER | NOT NULL, AUTOINCREMENT | ✓ | - | - |
| reto_id | Reto al que el usuario está inscrito | INTEGER | NOT NULL, ON DELETE CASCADE, UNIQUE(reto_id, usuario_id) | - | ✓ | reto(id) |
| usuario_id | Usuario participante del reto | INTEGER | NOT NULL, ON DELETE CASCADE | - | ✓ | usuario(id) |
| progreso | Porcentaje de avance en el reto | DECIMAL(5,2) | DEFAULT 0 | - | - | - |
| completado | Indica si el usuario completó el reto | BOOLEAN | DEFAULT 0 | - | - | - |

---

## 7. IMPLEMENTACIÓN DE LA BD Y REPORTES

### 7.1 DDL - Código de Creación de la Base de Datos

```sql
-- Habilitar claves foráneas en SQLite
PRAGMA foreign_keys = ON;

-- Tabla: USUARIO
-- Almacena los usuarios registrados en VitalTrack
CREATE TABLE IF NOT EXISTS usuario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cedula VARCHAR(20),
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_nacimiento DATE,
    consentimiento_privacidad BOOLEAN NOT NULL DEFAULT 1
);

-- Tabla: PERFIL
-- Perfiles de salud de cada usuario
CREATE TABLE IF NOT EXISTS perfil (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    objetivo TEXT,
    sexo VARCHAR(20),
    altura DECIMAL(5, 2),
    estado VARCHAR(20),
    FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE
);

-- Tabla: DISPOSITIVO
-- Dispositivos wearables vinculados a usuarios
CREATE TABLE IF NOT EXISTS dispositivo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    serial VARCHAR(100) NOT NULL UNIQUE,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    fecha_vinculacion DATE,
    FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE
);

-- Tabla: ACTIVIDAD
-- Registro de actividades físicas realizadas
CREATE TABLE IF NOT EXISTS actividad (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    tipo VARCHAR(50),
    hora_inicio DATETIME,
    hora_fin DATETIME,
    duracion_segundos INTEGER,
    FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE
);

-- Índice para optimizar búsquedas de actividades por usuario y fecha
CREATE INDEX IF NOT EXISTS idx_actividad_usuario_fecha 
ON actividad (usuario_id, hora_inicio);

-- Tabla: SENSOR
-- Sensores integrados en los dispositivos
CREATE TABLE IF NOT EXISTS sensor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dispositivo_id INTEGER NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    unidad VARCHAR(20),
    umbral_min DECIMAL(10, 2),
    umbral_max DECIMAL(10, 2),
    FOREIGN KEY (dispositivo_id) REFERENCES dispositivo (id) ON DELETE CASCADE
);

-- Tabla: LECTURA
-- Lecturas individuales capturadas por los sensores
CREATE TABLE IF NOT EXISTS lectura (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sensor_id INTEGER NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sensor_id) REFERENCES sensor (id) ON DELETE CASCADE
);

-- Índice para optimizar consultas de lecturas por sensor y fecha
CREATE INDEX IF NOT EXISTS idx_lectura_sensor_fecha 
ON lectura (sensor_id, fecha_hora);

-- Tabla: RESUMEN_DIARIO
-- Estadísticas diarias consolidadas de lecturas
CREATE TABLE IF NOT EXISTS resumen_diario (
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
);

-- Tabla: RETO
-- Desafíos de salud y bienestar
CREATE TABLE IF NOT EXISTS reto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_inicio DATE,
    fecha_fin DATE,
    objetivo_tipo VARCHAR(50),
    objetivo_valor DECIMAL(10, 2),
    estado VARCHAR(20) DEFAULT 'activo'
);

-- Tabla: RETO_USUARIO
-- Relación de participación de usuarios en retos
CREATE TABLE IF NOT EXISTS reto_usuario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reto_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    progreso DECIMAL(5, 2) DEFAULT 0,
    completado BOOLEAN DEFAULT 0,
    FOREIGN KEY (reto_id) REFERENCES reto (id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE,
    UNIQUE(reto_id, usuario_id)
);
```

---

### 7.2 Prueba del Modelo - Script de Datos Poblados

```sql
-- Insertar usuarios de prueba
INSERT OR IGNORE INTO usuario (cedula, nombre, email, fecha_nacimiento, consentimiento_privacidad) VALUES
('1234567890', 'Ana García', 'ana@vitaltrack.local', '1995-05-10', 1),
('2345678901', 'Juan Pérez', 'juan@vitaltrack.local', '1988-07-22', 1),
('3456789012', 'María López', 'maria@vitaltrack.local', '2000-09-30', 1),
('4567890123', 'Carlos Ruiz', 'carlos@vitaltrack.local', '1982-01-15', 1);

-- Insertar perfiles de salud
INSERT OR IGNORE INTO perfil (usuario_id, objetivo, sexo, altura, estado)
SELECT u.id, 'Bajar 5kg', 'femenino', 165.00, 'activo' FROM usuario u WHERE u.email = 'ana@vitaltrack.local';

INSERT OR IGNORE INTO perfil (usuario_id, objetivo, sexo, altura, estado)
SELECT u.id, 'Ganar masa muscular', 'masculino', 178.00, 'activo' FROM usuario u WHERE u.email = 'juan@vitaltrack.local';

INSERT OR IGNORE INTO perfil (usuario_id, objetivo, sexo, altura, estado)
SELECT u.id, 'Mantener', 'femenino', 170.00, 'inactivo' FROM usuario u WHERE u.email = 'maria@vitaltrack.local';

INSERT OR IGNORE INTO perfil (usuario_id, objetivo, sexo, altura, estado)
SELECT u.id, 'Bajar 10kg', 'masculino', 180.00, 'activo' FROM usuario u WHERE u.email = 'carlos@vitaltrack.local';

-- Insertar dispositivos wearables
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

-- Insertar actividades físicas
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

-- Insertar sensores en dispositivos
INSERT OR IGNORE INTO sensor (dispositivo_id, tipo, unidad, umbral_min, umbral_max)
SELECT d.id, 'frecuencia_cardiaca', 'bpm', 50, 180 FROM dispositivo d WHERE d.serial = 'FIT-0001';

INSERT OR IGNORE INTO sensor (dispositivo_id, tipo, unidad, umbral_min, umbral_max)
SELECT d.id, 'pasos', 'pasos', 0, 50000 FROM dispositivo d WHERE d.serial = 'FIT-0001';

INSERT OR IGNORE INTO sensor (dispositivo_id, tipo, unidad, umbral_min, umbral_max)
SELECT d.id, 'frecuencia_cardiaca', 'bpm', 50, 200 FROM dispositivo d WHERE d.serial = 'GAR-0001';

INSERT OR IGNORE INTO sensor (dispositivo_id, tipo, unidad, umbral_min, umbral_max)
SELECT d.id, 'temperatura', '°C', 35, 42 FROM dispositivo d WHERE d.serial = 'GAR-0001';

INSERT OR IGNORE INTO sensor (dispositivo_id, tipo, unidad, umbral_min, umbral_max)
SELECT d.id, 'oxigeno', '%', 85, 100 FROM dispositivo d WHERE d.serial = 'XIA-0001';

-- Insertar lecturas de sensores (últimos 7 días)
-- Lecturas de frecuencia cardíaca (sensor id 1)
INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
SELECT s.id, 75, datetime('now','-1 hours') FROM sensor s WHERE s.tipo = 'frecuencia_cardiaca' AND s.id = 1;

INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
SELECT s.id, 82, datetime('now','-2 hours') FROM sensor s WHERE s.tipo = 'frecuencia_cardiaca' AND s.id = 1;

INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
SELECT s.id, 195, datetime('now','-1 days') FROM sensor s WHERE s.tipo = 'frecuencia_cardiaca' AND s.id = 1;

INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
SELECT s.id, 88, datetime('now','-1 days','-6 hours') FROM sensor s WHERE s.tipo = 'frecuencia_cardiaca' AND s.id = 1;

INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
SELECT s.id, 72, datetime('now','-2 days') FROM sensor s WHERE s.tipo = 'frecuencia_cardiaca' AND s.id = 1;

INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
SELECT s.id, 85, datetime('now','-3 days') FROM sensor s WHERE s.tipo = 'frecuencia_cardiaca' AND s.id = 1;

INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
SELECT s.id, 78, datetime('now','-4 days') FROM sensor s WHERE s.tipo = 'frecuencia_cardiaca' AND s.id = 1;

INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
SELECT s.id, 90, datetime('now','-5 days') FROM sensor s WHERE s.tipo = 'frecuencia_cardiaca' AND s.id = 1;

INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
SELECT s.id, 76, datetime('now','-6 days') FROM sensor s WHERE s.tipo = 'frecuencia_cardiaca' AND s.id = 1;

-- Lecturas de pasos (sensor id 2)
INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
SELECT s.id, 8500, datetime('now','-1 days') FROM sensor s WHERE s.tipo = 'pasos' AND s.id = 2;

INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
SELECT s.id, 12000, datetime('now','-2 days') FROM sensor s WHERE s.tipo = 'pasos' AND s.id = 2;

INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
SELECT s.id, 9800, datetime('now','-3 days') FROM sensor s WHERE s.tipo = 'pasos' AND s.id = 2;

INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
SELECT s.id, 11500, datetime('now','-4 days') FROM sensor s WHERE s.tipo = 'pasos' AND s.id = 2;

INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
SELECT s.id, 10200, datetime('now','-5 days') FROM sensor s WHERE s.tipo = 'pasos' AND s.id = 2;

INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
SELECT s.id, 8900, datetime('now','-6 days') FROM sensor s WHERE s.tipo = 'pasos' AND s.id = 2;

INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
SELECT s.id, 9600, datetime('now','-7 days') FROM sensor s WHERE s.tipo = 'pasos' AND s.id = 2;

-- Lecturas adicionales para reportes complejos (período anterior - 30 a 60 días atrás)
INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
SELECT s.id, 7500, datetime('now','-35 days') FROM sensor s WHERE s.tipo = 'pasos' AND s.id = 2;

INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
SELECT s.id, 8000, datetime('now','-36 days') FROM sensor s WHERE s.tipo = 'pasos' AND s.id = 2;

INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
SELECT s.id, 7800, datetime('now','-37 days') FROM sensor s WHERE s.tipo = 'pasos' AND s.id = 2;

-- Lecturas de temperatura (sensor id 4)
INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
SELECT s.id, 36.5, datetime('now','-1 hours') FROM sensor s WHERE s.tipo = 'temperatura' AND s.id = 4;

INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
SELECT s.id, 36.8, datetime('now','-1 days') FROM sensor s WHERE s.tipo = 'temperatura' AND s.id = 4;

-- Lecturas de oxígeno (sensor id 5)
INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
SELECT s.id, 97, datetime('now','-30 minutes') FROM sensor s WHERE s.tipo = 'oxigeno' AND s.id = 5;

INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora)
SELECT s.id, 98, datetime('now','-1 days') FROM sensor s WHERE s.tipo = 'oxigeno' AND s.id = 5;

-- Lecturas adicionales para reporte de incremento porcentual
-- Período anterior (45-60 días) para sensor 3 (frecuencia cardíaca Garmin)
INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora) VALUES (3, 70, datetime('now','-35 days'));
INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora) VALUES (3, 72, datetime('now','-40 days'));
INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora) VALUES (3, 68, datetime('now','-45 days'));
INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora) VALUES (3, 75, datetime('now','-50 days'));
INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora) VALUES (3, 71, datetime('now','-55 days'));

-- Período reciente (últimos 30 días) para sensor 3
INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora) VALUES (3, 85, datetime('now','-5 days'));
INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora) VALUES (3, 88, datetime('now','-10 days'));
INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora) VALUES (3, 90, datetime('now','-15 days'));
INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora) VALUES (3, 92, datetime('now','-20 days'));
INSERT OR IGNORE INTO lectura (sensor_id, valor, fecha_hora) VALUES (3, 87, datetime('now','-25 days'));

-- Insertar retos de salud
INSERT OR IGNORE INTO reto (nombre, descripcion, fecha_inicio, fecha_fin, objetivo_tipo, objetivo_valor, estado)
VALUES ('10K Steps Challenge', 'Camina 10,000 pasos diarios durante 30 días', date('now','-10 days'), date('now','+20 days'), 'pasos', 10000, 'activo');

INSERT OR IGNORE INTO reto (nombre, descripcion, fecha_inicio, fecha_fin, objetivo_tipo, objetivo_valor, estado)
VALUES ('Cardio Warrior', 'Mantén tu ritmo cardíaco en zona de ejercicio 5 veces por semana', date('now','-5 days'), date('now','+25 days'), 'frecuencia_cardiaca', 120, 'activo');

-- Insertar participaciones en retos
INSERT OR IGNORE INTO reto_usuario (reto_id, usuario_id, progreso, completado)
SELECT r.id, u.id, 65.5, 0 FROM reto r, usuario u WHERE r.nombre = '10K Steps Challenge' AND u.email = 'ana@vitaltrack.local';

INSERT OR IGNORE INTO reto_usuario (reto_id, usuario_id, progreso, completado)
SELECT r.id, u.id, 100, 1 FROM reto r, usuario u WHERE r.nombre = '10K Steps Challenge' AND u.email = 'juan@vitaltrack.local';

INSERT OR IGNORE INTO reto_usuario (reto_id, usuario_id, progreso, completado)
SELECT r.id, u.id, 42.0, 0 FROM reto r, usuario u WHERE r.nombre = 'Cardio Warrior' AND u.email = 'carlos@vitaltrack.local';
```

---

### 7.3 Reportes - Código SQL de las Consultas

#### **REPORTES SIMPLES (3)**

#### **Reporte Simple #1: Últimos 10 Usuarios Registrados**
**Descripción:** Historial de inscripciones recientes en el sistema VitalTrack.

**Complejidad:** Simple - Consulta directa con ordenamiento y límite.

```sql
SELECT 
    nombre, 
    email, 
    fecha_registro
FROM usuario
ORDER BY fecha_registro DESC
LIMIT 10;
```

**Salida esperada:**
| nombre | email | fecha_registro |
|--------|-------|----------------|
| Carlos Ruiz | carlos@vitaltrack.local | 2025-11-18 10:30:15 |
| María López | maria@vitaltrack.local | 2025-11-18 10:30:15 |
| Juan Pérez | juan@vitaltrack.local | 2025-11-18 10:30:15 |
| Ana García | ana@vitaltrack.local | 2025-11-18 10:30:15 |

---

#### **Reporte Simple #2: Última Lectura de Sensor de Frecuencia Cardíaca**
**Descripción:** Monitoreo en tiempo real del sensor cardíaco más reciente.

**Complejidad:** Simple - Join entre 3 tablas con filtro y orden.

```sql
SELECT 
    s.tipo, 
    s.unidad, 
    l.valor, 
    l.fecha_hora, 
    d.marca, 
    d.modelo
FROM lectura l
JOIN sensor s ON l.sensor_id = s.id
JOIN dispositivo d ON s.dispositivo_id = d.id
WHERE s.tipo = 'frecuencia_cardiaca'
ORDER BY l.fecha_hora DESC
LIMIT 1;
```

**Salida esperada:**
| tipo | unidad | valor | fecha_hora | marca | modelo |
|------|--------|-------|------------|-------|--------|
| frecuencia_cardiaca | bpm | 75 | 2025-11-18 09:30:00 | Fitbit | Charge 5 |

---

#### **Reporte Simple #3: Cantidad de Sensores por Dispositivo**
**Descripción:** Inventario de sensores disponibles por cada dispositivo wearable.

**Complejidad:** Simple - Left join con agrupación y conteo.

```sql
SELECT 
    d.marca, 
    d.modelo, 
    d.serial, 
    COUNT(s.id) as cantidad_sensores
FROM dispositivo d
LEFT JOIN sensor s ON d.id = s.dispositivo_id
GROUP BY d.id
ORDER BY cantidad_sensores DESC;
```

**Salida esperada:**
| marca | modelo | serial | cantidad_sensores |
|-------|--------|--------|-------------------|
| Fitbit | Charge 5 | FIT-0001 | 2 |
| Garmin | Vivoactive 4 | GAR-0001 | 2 |
| Xiaomi | Mi Band 7 | XIA-0001 | 1 |
| Garmin | Forerunner 255 | GAR-0002 | 0 |
| Fitbit | Versa 3 | FIT-0002 | 0 |

---

#### **REPORTES INTERMEDIOS (4)**

#### **Reporte Intermedio #1: Promedio Diario de Lecturas por Sensor (7 días)**
**Descripción:** Tendencias semanales de mediciones agrupadas por fecha y tipo de sensor.

**Complejidad:** Intermedia - Funciones de agregación con DATE(), filtro temporal, agrupación múltiple.

```sql
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
ORDER BY fecha DESC, s.tipo;
```

**Salida esperada:**
| fecha | tipo | unidad | promedio_diario | num_lecturas |
|-------|------|--------|-----------------|--------------|
| 2025-11-18 | frecuencia_cardiaca | bpm | 78.50 | 2 |
| 2025-11-17 | frecuencia_cardiaca | bpm | 141.50 | 2 |
| 2025-11-17 | pasos | pasos | 8500.00 | 1 |
| 2025-11-16 | frecuencia_cardiaca | bpm | 72.00 | 1 |
| 2025-11-16 | pasos | pasos | 12000.00 | 1 |

---

#### **Reporte Intermedio #2: Listado Completo de Sensores con Dispositivo y Usuario**
**Descripción:** Catálogo detallado de sensores con información de propietario y umbrales.

**Complejidad:** Intermedia - Join de 4 tablas con múltiples columnas.

```sql
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
ORDER BY u.nombre, d.marca;
```

**Salida esperada:**
| usuario | marca | modelo | sensor_tipo | unidad | umbral_min | umbral_max |
|---------|-------|--------|-------------|--------|------------|------------|
| Ana García | Fitbit | Charge 5 | frecuencia_cardiaca | bpm | 50 | 180 |
| Ana García | Fitbit | Charge 5 | pasos | pasos | 0 | 50000 |
| Juan Pérez | Garmin | Vivoactive 4 | frecuencia_cardiaca | bpm | 50 | 200 |
| Juan Pérez | Garmin | Vivoactive 4 | temperatura | °C | 35 | 42 |
| María López | Xiaomi | Mi Band 7 | oxigeno | % | 85 | 100 |

---

#### **Reporte Intermedio #3: Usuarios en Retos Activos con Progreso**
**Descripción:** Estado de avance en desafíos de salud de usuarios activos.

**Complejidad:** Intermedia - Join de 3 tablas, CASE para estado, filtro de estado activo.

```sql
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
ORDER BY u.nombre, r.nombre;
```

**Salida esperada:**
| usuario | reto | objetivo_tipo | objetivo_valor | progreso | estado |
|---------|------|---------------|----------------|----------|--------|
| Ana García | 10K Steps Challenge | pasos | 10000 | 65.5 | En progreso |
| Carlos Ruiz | Cardio Warrior | frecuencia_cardiaca | 120 | 42.0 | En progreso |
| Juan Pérez | 10K Steps Challenge | pasos | 10000 | 100.0 | Completado |

---

#### **Reporte Intermedio #4: Resumen Diario Actualizado (UPSERT)**
**Descripción:** Consolidado automático de métricas diarias usando INSERT...ON CONFLICT.

**Complejidad:** Intermedia - UPSERT con cláusula ON CONFLICT, agregaciones estadísticas (AVG, MAX, MIN).

**Paso 1 - Actualizar/Insertar Resumen:**
```sql
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
    fecha_actualizacion = CURRENT_TIMESTAMP;
```

**Paso 2 - Consultar Resumen Generado:**
```sql
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
WHERE rd.fecha = DATE('now');
```

**Salida esperada:**
| sensor_tipo | unidad | fecha | promedio | maximo | minimo | num_lecturas |
|-------------|--------|-------|----------|--------|--------|--------------|
| frecuencia_cardiaca | bpm | 2025-11-18 | 78.50 | 82 | 75 | 2 |
| temperatura | °C | 2025-11-18 | 36.50 | 36.5 | 36.5 | 1 |
| oxigeno | % | 2025-11-18 | 97.00 | 97 | 97 | 1 |

---

#### **REPORTES COMPLEJOS (3)**

#### **Reporte Complejo #1: Usuarios con Lecturas Sobre el Umbral (30 días)**
**Descripción:** Alertas de valores críticos detectados en los últimos 30 días.

**Complejidad:** Compleja - Join de 4 tablas, filtros temporales, comparación dinámica con umbrales, DISTINCT para evitar duplicados.

```sql
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
ORDER BY l.fecha_hora DESC;
```

**Salida esperada:**
| usuario | sensor_tipo | valor | umbral_max | fecha_hora |
|---------|-------------|-------|------------|------------|
| Ana García | frecuencia_cardiaca | 195 | 180 | 2025-11-17 10:30:00 |

---

#### **Reporte Complejo #2: Media Móvil de 7 Días para Lecturas**
**Descripción:** Análisis de tendencia con suavizado temporal usando ventana deslizante.

**Complejidad:** Compleja - Window function (OVER con PARTITION BY y ROWS BETWEEN), agrupación por fecha, cálculo de media móvil.

```sql
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
LIMIT 20;
```

**Salida esperada (primeras filas):**
| sensor_tipo | unidad | fecha | media_movil_7d | valor_actual |
|-------------|--------|-------|----------------|--------------|
| frecuencia_cardiaca | bpm | 2025-11-18 | 78.50 | 82 |
| frecuencia_cardiaca | bpm | 2025-11-17 | 105.83 | 195 |
| frecuencia_cardiaca | bpm | 2025-11-16 | 81.67 | 72 |
| frecuencia_cardiaca | bpm | 2025-11-15 | 83.00 | 85 |
| pasos | pasos | 2025-11-17 | 8500.00 | 8500 |
| pasos | pasos | 2025-11-16 | 10250.00 | 12000 |

---

#### **Reporte Complejo #3: Top 5 Usuarios con Mayor Incremento en Lecturas**
**Descripción:** Ranking de mejoras en mediciones comparando períodos de 30 días.

**Complejidad:** Compleja - Common Table Expressions (CTE) anidadas, cálculo de promedios por período, join de resultados agregados, cálculo de incremento porcentual, ordenamiento descendente.

```sql
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
LIMIT 5;
```

**Salida esperada:**
| usuario | promedio_reciente | promedio_anterior | incremento_porcentual |
|---------|-------------------|-------------------|-----------------------|
| Juan Pérez | 88.40 | 71.20 | 24.16 |
| Ana García | 9857.14 | 7766.67 | 26.91 |

**Explicación:** Juan Pérez incrementó su promedio de frecuencia cardíaca en 24.16% (de 71.2 a 88.4 bpm), mientras que Ana García mejoró su conteo de pasos en 26.91% (de 7767 a 9857 pasos).

---

## Resumen de Complejidad de Reportes

| Tipo | Cantidad | Ejemplos de Características |
|------|----------|----------------------------|
| **Simples** | 3 | SELECT básico, JOIN 2-3 tablas, ORDER BY, LIMIT |
| **Intermedios** | 4 | Múltiples JOIN, GROUP BY, funciones agregadas (AVG, COUNT), CASE, UPSERT |
| **Complejos** | 3 | Window functions, CTE, subconsultas, cálculos porcentuales, DISTINCT |

**Total: 10 reportes implementados**
