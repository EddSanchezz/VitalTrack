# VitalTrack

Sistema de estadísticas de salud (tipo Google Fit) con backend Express + MySQL y frontend Angular.

## Stack

- **Backend**: Node.js (Express) con 4 CRUDs REST: usuarios, perfiles, dispositivos y actividades
- **Base de datos**: MySQL 8 en Docker con esquema inicial
- **Frontend**: Angular 20 con HttpClient, routing y proxy a API
- **Gestión DB**: phpMyAdmin para explorar la base de datos

## Ejecutar todo el proyecto

### Requisitos

- Docker y Docker Compose
- Node.js 18+ (para el frontend)

### Pasos

1️⃣ **Levantar backend + base de datos en Docker**

```bash
docker compose up -d --build
```

Esto inicia:

- MySQL en `localhost:3306` (DB: vitaltrack, user: vt_user, pass: vt_pass)
- Backend API en `http://localhost:3000` (health: /health)
- phpMyAdmin en `http://localhost:8081`

2️⃣ **Instalar dependencias del frontend**

```bash
cd frontend
npm install
```

3️⃣ **Ejecutar el frontend Angular con proxy**

```bash
npm start
```

El frontend abre en `http://localhost:4200` y proxy `/api` hacia el backend en puerto 3000.

Navega a:

- http://localhost:4200/usuarios
- http://localhost:4200/perfiles
- http://localhost:4200/dispositivos
- http://localhost:4200/actividades

## Estructura

```
VitalTrack/
├── backend/          # API Express + MySQL
│   ├── src/
│   │   ├── server.js
│   │   ├── db.js
│   │   └── routes/   # usuarios, perfiles, dispositivos, actividades
│   ├── Dockerfile
│   └── package.json
├── frontend/         # Angular 20
│   ├── src/app/
│   │   ├── models/
│   │   ├── services/
│   │   ├── pages/
│   │   └── features/users/
│   ├── proxy.conf.json
│   └── package.json
├── db/
│   └── init.sql      # Esquema inicial + datos
└── docker-compose.yml
```

## Endpoints API

Base URL: `http://localhost:3000/api`

| Método | Endpoint      | Descripción        |
| ------ | ------------- | ------------------ |
| GET    | /usuarios     | Listar usuarios    |
| POST   | /usuarios     | Crear usuario      |
| GET    | /usuarios/:id | Obtener usuario    |
| PUT    | /usuarios/:id | Actualizar usuario |
| DELETE | /usuarios/:id | Eliminar usuario   |

| ... (igual para perfiles, dispositivos, actividades)

Filtro especial:

- `GET /actividades?usuario_id=1` - Actividades de un usuario

### Ejemplo crear usuario

```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H 'Content-Type: application/json' \
  -d '{"cedula":"123","nombre":"Ana","email":"ana@example.com","fecha_nacimiento":"1995-05-10","consentimiento_privacidad":true}'
```

## Solo Docker (sin frontend local)

Si quieres correr solo el backend dockerizado y probar la API directamente:

```bash
docker compose up -d --build
curl http://localhost:3000/health
```

## Solo backend local (sin Docker)

Si prefieres correr el backend fuera de Docker:

```bash
# 1. Levanta solo MySQL
docker compose up -d db phpmyadmin

# 2. Instala backend y configura .env
cd backend
npm install
cp .env.example .env

# 3. Arranca el servidor
npm run dev
```

## Próximos pasos

- Añadir autenticación (JWT)
- Integrar más entidades del diagrama (sensores, lecturas, retos, etc.)
- Desplegar en la nube (Azure/AWS)
