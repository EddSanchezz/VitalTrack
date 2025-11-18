# VitalTrack

> Sistema de Gestión de Salud y Actividad Física - Aplicación Full Stack con Angular 18 + PrimeNG 18 + Express + SQLite

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Angular](https://img.shields.io/badge/Angular-18-red.svg)](https://angular.io/)
[![PrimeNG](https://img.shields.io/badge/PrimeNG-18-blue.svg)](https://primeng.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 📋 Descripción

VitalTrack es una plataforma completa para el seguimiento y gestión de estadísticas de salud, similar a Google Fit. Permite gestionar usuarios, perfiles de salud, actividades físicas, dispositivos wearables y generar reportes consolidados en PDF.

**🎨 Interfaz moderna con PrimeNG 18:**
- Sistema de navegación por pestañas (TabView)
- Tablas interactivas con edición inline
- Formularios validados con componentes PrimeNG
- Notificaciones Toast profesionales
- Diálogos de confirmación modal
- Iconos PrimeIcons (1500+ disponibles)
- Tema Lara Light Blue

## 🚀 Inicio Rápido

### Opción 1: Scripts Automáticos (Recomendado)

**Windows:**
```bash
# 1. Instalar dependencias
install.bat

# 2. Iniciar servidores
start.bat
```

**Linux/Mac:**
```bash
# 1. Instalar dependencias
chmod +x install.sh start.sh
./install.sh

# 2. Iniciar servidores
./start.sh
```

### Opción 2: Manual

**Backend:**
```bash
cd backend
npm install
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

### Acceso a la Aplicación

- **Frontend:** http://localhost:4200
- **API Backend:** http://localhost:4000
- **Documentación Swagger:** http://localhost:4000/api/docs

## 📚 Documentación Completa

Para instrucciones detalladas de instalación, configuración y solución de problemas, consulta:

👉 **[INSTRUCCIONES.md](./INSTRUCCIONES.md)** - Guía completa de instalación y configuración

## 🏗️ Arquitectura

### Stack Tecnológico

**Backend:**
- Express.js - Framework web
- SQLite - Base de datos embebida
- Swagger/OpenAPI - Documentación automática
- Jest - Testing

**Frontend:**
- Angular 18 - Framework de aplicación (standalone components)
- PrimeNG 18 - Librería de componentes UI
- PrimeIcons 7 - Sistema de iconos
- TypeScript - Lenguaje tipado
- RxJS - Programación reactiva

### Estructura del Proyecto

```
VitalTrack/
├── backend/                    # API REST con Express
│   ├── src/
│   │   ├── server.js          # Servidor principal
│   │   ├── db.js              # Configuración SQLite
│   │   ├── routes/            # Endpoints de la API
│   │   │   ├── usuarios.js
│   │   │   ├── perfiles.js
│   │   │   ├── actividades.js
│   │   │   └── dispositivos.js
│   │   └── __tests__/         # Tests unitarios
│   ├── openapi.yaml           # Documentación OpenAPI
│   └── package.json
│
├── frontend/                   # Aplicación Angular 18
│   ├── src/
│   │   ├── app/
│   │   │   └── app.component.ts   # Componente principal con PrimeNG
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.css         # Estilos globales + PrimeNG
│   ├── angular.json
│   └── package.json
│
├── db/
│   └── init.sql               # Script de inicialización
│
├── docker-compose.yml         # Configuración Docker
├── install.bat / install.sh   # Scripts de instalación
├── start.bat / start.sh       # Scripts de inicio
├── README.md                  # Este archivo
└── INSTRUCCIONES.md          # Documentación detallada
```

## ✨ Características

### Gestión de Usuarios
- ✅ Crear, editar y eliminar usuarios
- ✅ Validación de campos (email, cédula, fecha de nacimiento)
- ✅ Gestión de consentimiento de privacidad
- ✅ Edición inline en tabla

### Perfiles de Salud
- ✅ Vincular perfiles a usuarios
- ✅ Configurar objetivos de salud
- ✅ Registrar datos biométricos (altura, sexo)
- ✅ Estados activo/inactivo

### Actividades Físicas
- ✅ Registrar actividades (correr, caminar, etc.)
- ✅ Control de duración y tiempo
- ✅ Historial completo de actividades
- ✅ Edición con calendario de fecha/hora

### Dispositivos Wearables
- ✅ Vincular dispositivos (Fitbit, Garmin, etc.)
- ✅ Gestión de marca y modelo
- ✅ Número de serie único
- ✅ Fecha de vinculación

### Reportes
- ✅ Generación de PDF consolidado
- ✅ 10 análisis diferentes incluidos
- ✅ Descarga automática del archivo

## 📡 API Endpoints

### Usuarios
```http
GET    /api/usuarios           # Listar todos
POST   /api/usuarios           # Crear nuevo
PUT    /api/usuarios/:id       # Actualizar
DELETE /api/usuarios/:id       # Eliminar
```

### Perfiles
```http
GET    /api/perfiles           # Listar todos
POST   /api/perfiles           # Crear nuevo
PUT    /api/perfiles/:id       # Actualizar
DELETE /api/perfiles/:id       # Eliminar
```

### Actividades
```http
GET    /api/actividades        # Listar todas
POST   /api/actividades        # Crear nueva
PUT    /api/actividades/:id    # Actualizar
DELETE /api/actividades/:id    # Eliminar
```

### Dispositivos
```http
GET    /api/dispositivos       # Listar todos
POST   /api/dispositivos       # Crear nuevo
PUT    /api/dispositivos/:id   # Actualizar
DELETE /api/dispositivos/:id   # Eliminar
```

### Reportes
```http
GET    /api/reportes/generar   # Generar PDF
```

### Health Check
```http
GET    /health                 # Estado del servidor
```

## 🧪 Testing

**Backend:**
```bash
cd backend
npm test
```

Ejecuta 25+ tests unitarios cubriendo todos los endpoints.

## 🐳 Docker

```bash
# Construir e iniciar con Docker Compose
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

## 🔧 Comandos Útiles

### Backend

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia el servidor en puerto 4000 |
| `npm run dev` | Modo desarrollo con hot-reload |
| `npm test` | Ejecuta tests unitarios |
| `npm run db:setup` | Reinicia la base de datos |

### Frontend

| Comando | Descripción |
|---------|-------------|
| `npm start` | Servidor desarrollo en puerto 4200 |
| `npm run build` | Compilar para producción |
| `npm test` | Ejecuta tests |
| `npm run lint` | Verificar código |

## 🎨 Componentes PrimeNG Utilizados

- **p-tabView** - Navegación por pestañas
- **p-table** - Tablas de datos interactivas
- **pInputText** - Campos de entrada
- **p-calendar** - Selector de fecha/hora
- **p-checkbox** - Casillas de verificación
- **pButton** - Botones estilizados
- **p-toast** - Notificaciones emergentes
- **p-confirmDialog** - Diálogos de confirmación
- **p-card** - Tarjetas de contenido
- **p-divider** - Separadores visuales

## 🔍 Solución de Problemas

### Puerto en uso

```bash
# Windows - Liberar puerto
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Linux/Mac - Liberar puerto
lsof -ti:4200 | xargs kill -9
```

### Error de conexión Backend

1. Verifica que el backend esté corriendo: `curl http://localhost:4000/health`
2. Revisa `frontend/proxy.conf.json`
3. Verifica CORS en `backend/src/server.js`

### Problemas con dependencias

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

Consulta **[INSTRUCCIONES.md](./INSTRUCCIONES.md)** para más soluciones.

## 📝 Notas Importantes

- **Primera Ejecución:** La base de datos SQLite se crea automáticamente con datos de ejemplo
- **PrimeNG v18:** Los temas CSS se cargan desde CDN (unpkg.com) porque v18 no incluye `resources/` en npm
- **Proxy:** En desarrollo, `/api` se redirige a `http://localhost:4000`
- **Producción:** Ver `INSTRUCCIONES.md` para configuración de despliegue

## 🤝 Contribuir

1. Haz fork del repositorio
2. Crea tu rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -am 'Agrega nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Crea un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo `LICENSE` para más detalles.

## 📧 Soporte

- **Issues:** [GitHub Issues](https://github.com/EddSanchezz/VitalTrack/issues)
- **Documentación:** [INSTRUCCIONES.md](./INSTRUCCIONES.md)

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

- Reporte PDF consolidado: `GET /reportes/generar` descarga un PDF con 10 análisis (sensores/retos, UPSERT de resumen diario, tendencias con media móvil, etc.).

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

3. Frontend (Angular 18 + PrimeNG 18)

```bash
cd frontend
npm install
npm start
```

La app se sirve en http://localhost:4200 con un proxy a la API (http://localhost:4000).

**🎨 Integración PrimeNG:**
- El proyecto utiliza **PrimeNG 18.x** con el tema **Lara Light Blue**
- Todos los componentes UI usan PrimeNG: tablas, formularios, botones, calendarios, notificaciones, etc.
- Los estilos se importan directamente desde `node_modules` en `styles.css`
- Iconos con **PrimeIcons 7.x** (1500+ iconos disponibles)
- Sistema de notificaciones con **Toast** (esquina superior derecha)
- Diálogos de confirmación con **ConfirmDialog** modal
- Ver documentación completa en: [PRIMENG_INTEGRATION.md](./PRIMENG_INTEGRATION.md)

**Características del Frontend:**
- ✅ CRUD completo de Usuarios con validaciones
- ✅ CRUD completo de Perfiles de salud
- ✅ CRUD completo de Actividades físicas
- ✅ CRUD completo de Dispositivos wearables
- ✅ Generación de Reportes PDF consolidados
- ✅ Sistema de notificaciones Toast profesional
- ✅ Edición inline en tablas
- ✅ Confirmaciones modales para eliminaciones
- ✅ Validaciones de formularios en tiempo real
- ✅ Manejo robusto de errores con mensajes descriptivos
- ✅ Diseño responsive (mobile-first)
- ✅ Accesibilidad WCAG incluida

**Documentación adicional:**
- [Comparación Antes/Después](./PRIMENG_COMPARISON.md)
- [Checklist de Verificación](./PRIMENG_CHECKLIST.md)

4. Probar un CRUD (ejemplo crear actividad del usuario 1):

```bash
curl -X POST http://localhost:4000/api/actividades \
	-H 'Content-Type: application/json' \
	-d '{"usuario_id":1, "tipo":"caminar", "hora_inicio":"2025-11-04T08:00:00Z", "hora_fin":"2025-11-04T08:30:00Z", "duracion_segundos":1800}'
```

## Próximos pasos

- Extender reportes y estadísticas del sistema
- Añadir autenticación y más entidades del diagrama (sensores, lecturas, retos, etc.)
- Implementar gráficos y visualizaciones de datos en la sección Estadísticas
- Agregar paginación, ordenamiento y filtros avanzados a las tablas
