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
- MySQL: localhost:3307 (database: vitaltrack)

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

## Ejecutar con Task (recomendado)

Instala la herramienta Task (go-task): https://taskfile.dev/installation/

Comandos útiles desde la raíz del repo:

```bash
# Levantar todo (DB + API + phpMyAdmin) con Docker
task run

# Solo DB (y phpMyAdmin)
task db

# DB en Docker + backend local con nodemon
task dev:local

# Comprobar salud de la API
task health

# Ver logs del backend (contenedor)
task logs

# Apagar contenedores / resetear datos
task stop
task reset
```

## Ejecutar en local (sin dockerizar el backend)

Si prefieres correr la API en tu máquina y usar solo MySQL en Docker:

1. Levanta solo la base de datos (y phpMyAdmin, opcional):

```bash
docker compose up -d db phpmyadmin
```

2. Instala dependencias del backend y configura variables:

```bash
cd backend
npm install
cp .env.example .env
# .env ya apunta a localhost (127.0.0.1:3307) con vt_user/vt_pass
```

3. Arranca el servidor en modo desarrollo (hot reload):

```bash
npm run dev
```

La API quedará en http://localhost:3000. Puedes verificar con:

```bash
curl http://localhost:3000/health
```

4. Probar un CRUD (ejemplo crear actividad del usuario 1):

```bash
curl -X POST http://localhost:3000/api/actividades \
	-H 'Content-Type: application/json' \
	-d '{"usuario_id":1, "tipo":"caminar", "hora_inicio":"2025-11-04T08:00:00Z", "hora_fin":"2025-11-04T08:30:00Z", "duracion_segundos":1800}'
```

## Próximos pasos

- Crear frontend en Angular y consumir estos endpoints
- Añadir autenticación y más entidades del diagrama (sensores, lecturas, retos, etc.)
