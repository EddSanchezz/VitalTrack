# VitalTrack

API y base de datos para estadísticas de salud tipo Google Fit.

Este repo incluye:

- MySQL 8 inicializado con el esquema de VitalTrack (Docker)
- Backend Node.js (Express) con 4 CRUDs: usuarios, perfiles, dispositivos y actividades
- phpMyAdmin para explorar la base de datos

## Ejecutar con Docker

Requisitos: Docker y Docker Compose.

1. Levanta todo el stack:

```bash
docker compose up -d --build
```

2. Servicios:

- API: http://localhost:3000 (health: /health)
- phpMyAdmin: http://localhost:8081 (host: db, usuario: vt_user, pass: vt_pass)
- MySQL: localhost:3306 (database: vitaltrack)

3. Variables (se configuran en docker-compose.yml):

- DB_HOST=db, DB_USER=vt_user, DB_PASSWORD=vt_pass, DB_NAME=vitaltrack

## Endpoints principales

Base URL: http://localhost:3000/api

- GET/POST/PUT/DELETE `/usuarios`
- GET/POST/PUT/DELETE `/perfiles`
- GET/POST/PUT/DELETE `/dispositivos`
- GET/POST/PUT/DELETE `/actividades`
  - Filtro opcional: `/actividades?usuario_id=1`

Ejemplo crear usuario:

```bash
curl -X POST http://localhost:3000/api/usuarios \
	-H 'Content-Type: application/json' \
	-d '{"cedula":"123","nombre":"Ana","email":"ana@example.com","fecha_nacimiento":"1995-05-10","consentimiento_privacidad":true}'
```

## Desarrollo

Durante el desarrollo, el contenedor del backend usa `nodemon` con hot reload y monta `./backend` como volumen.

## Próximos pasos

- Crear frontend en Angular y consumir estos endpoints
- Añadir autenticación y más entidades del diagrama (sensores, lecturas, retos, etc.)
