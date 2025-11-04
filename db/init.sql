-- VitalTrack initial schema
-- This file is executed automatically by the MySQL container on first run

CREATE DATABASE IF NOT EXISTS vitaltrack CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

USE vitaltrack;

-- Users
CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cedula VARCHAR(20) NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_nacimiento DATE NULL,
    consentimiento_privacidad BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE = InnoDB;

-- Profile of the user
CREATE TABLE IF NOT EXISTS perfil (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    objetivo TEXT NULL,
    sexo CHAR(1) NULL,
    altura DECIMAL(5, 2) NULL,
    estado VARCHAR(20) NULL,
    CONSTRAINT fk_perfil_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Device linked to a user
CREATE TABLE IF NOT EXISTS dispositivo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    serial VARCHAR(100) NOT NULL UNIQUE,
    marca VARCHAR(50) NULL,
    modelo VARCHAR(50) NULL,
    fecha_vinculacion DATE NULL,
    CONSTRAINT fk_dispositivo_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Activity of a user
CREATE TABLE IF NOT EXISTS actividad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo VARCHAR(50) NULL,
    hora_inicio DATETIME NULL,
    hora_fin DATETIME NULL,
    duracion_segundos INT NULL,
    CONSTRAINT fk_actividad_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE,
    INDEX idx_actividad_usuario_fecha (usuario_id, hora_inicio)
) ENGINE = InnoDB;

-- Seed basic data
INSERT INTO
    usuario (
        cedula,
        nombre,
        email,
        fecha_nacimiento,
        consentimiento_privacidad
    )
VALUES (
        '1234567890',
        'Usuario Demo',
        'demo@vitaltrack.local',
        '1990-01-01',
        TRUE
    )
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre);

INSERT INTO
    perfil (
        usuario_id,
        objetivo,
        sexo,
        altura,
        estado
    )
SELECT u.id, 'Bajar 5kg', 'M', 175.00, 'activo'
FROM usuario u
WHERE
    u.email = 'demo@vitaltrack.local'
ON DUPLICATE KEY UPDATE
    objetivo = VALUES(objetivo);