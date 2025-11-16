# VitalTrack

API y base de datos para estadísticas de salud tipo Google Fit.

Arquitectura actual (SQLite-only):

- Backend Node.js (Express) con CRUDs: usuarios, perfiles, dispositivos y actividades
- Base de datos SQLite embebida (archivo `backend/database.sqlite`)
- Frontend Angular que consume la API

## Ejecutar con Docker (SQLite)

Requisitos: Docker y Docker Compose.

1. Levanta el backend (usa SQLite embebido y se autoconfigura al iniciar):

```bash
docker compose up -d --build
```

2. Servicio disponible:

- API: http://localhost:4000 (health: /health y Swagger en /api/docs)

No se requiere MySQL ni phpMyAdmin. Todos los datos se guardan en `backend/database.sqlite` (persisten en tu carpeta local).

## Endpoints principales

Base URL: http://localhost:4000/api

- GET/POST/PUT/DELETE `/usuarios`
- GET/POST/PUT/DELETE `/perfiles`
- GET/POST/PUT/DELETE `/dispositivos`
- GET/POST/PUT/DELETE `/actividades`
  - Filtro opcional: `/actividades?usuario_id=1`

Ejemplo crear usuario:

```bash
curl -X POST http://localhost:4000/api/usuarios \
	-H 'Content-Type: application/json' \
	-d '{"cedula":"123","nombre":"Ana","email":"ana@example.com","fecha_nacimiento":"1995-05-10","consentimiento_privacidad":true}'
```

## Desarrollo

Durante el desarrollo, el contenedor del backend usa `nodemon` con hot reload y monta `./backend` como volumen. También puedes ejecutar todo localmente sin Docker.

## Ejecutar con Task (recomendado)

Instala la herramienta Task (go-task): https://taskfile.dev/installation/

Comandos útiles desde la raíz del repo:

```bash
# Backend: prepara SQLite y levanta API con hot reload
task api

# Frontend: levanta Angular con proxy a la API
task client

# Health check rápido
task health

# Resetear base de datos SQLite
task api:reset
```

## Ejecutar en local (sin Docker)

1. Instala dependencias del backend y configura variables (SQLite):

```bash
cd backend
npm install
cp .env.example .env
# .env ejemplo ya usa SQLite: DB_TYPE=sqlite, DB_FILE=./database.sqlite
# Inicializa la base de datos (crea tablas y datos de prueba)
npm run db:setup
```

2. Arranca el servidor en modo desarrollo (hot reload):

```bash
npm run dev
```

La API quedará en http://localhost:4000. Puedes verificar con:

```bash
curl http://localhost:4000/health
```

3. Probar un CRUD (ejemplo crear actividad del usuario 1):

```bash
curl -X POST http://localhost:4000/api/actividades \
	-H 'Content-Type: application/json' \
	-d '{"usuario_id":1, "tipo":"caminar", "hora_inicio":"2025-11-04T08:00:00Z", "hora_fin":"2025-11-04T08:30:00Z", "duracion_segundos":1800}'
```

## Próximos pasos

- Extender reportes y estadísticas del sistema
- Añadir autenticación y más entidades del diagrama (sensores, lecturas, retos, etc.)
