# 🚀 VitalTrack - Configuración de Desarrollo

VitalTrack es una aplicación web para seguimiento de actividades vitales con Angular (frontend) y Express.js (backend).

## 📋 Requisitos Previos

- **Node.js** v18+ (instalado ✅)
- **npm** (instalado ✅)
- **Task** (Go Task) para ejecutar comandos
- **Angular CLI** (instalado ✅)

## ⚡ Instalación Rápida

```bash
# 1. Instalar todas las dependencias
task install

# 2. Configurar la base de datos SQLite
task api:setup-db
```

## 🛠️ Comandos Principales

### Frontend (Angular)
```bash
# Ejecutar frontend en modo desarrollo
task client

# Construir para producción
task client:build

# Ejecutar tests del frontend
task client:test
```

### Backend (Express.js + SQLite)
```bash
# Ejecutar backend con base de datos SQLite
task api

# Configurar/resetear base de datos
task api:setup-db
task api:reset

# Ejecutar tests del API
task api:test
```

### Desarrollo Completo
```bash
# Ver todos los comandos disponibles
task --list

# Ejecutar tests completos (frontend + backend)
task test

# Verificar estado de la API
task health
```

## 🌐 URLs de Acceso

- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:4000
- **Health Check:** http://localhost:4000/health

## 📦 Estructura del Proyecto

```
VitalTrack/
├── frontend/          # Aplicación Angular
├── backend/           # API Express.js
│   ├── src/          # Código fuente
│   ├── scripts/      # Scripts de configuración
│   └── database.sqlite # Base de datos SQLite (creada automáticamente)
├── Taskfile.yml      # Comandos de desarrollo
└── README.md         # Esta documentación
```

## 🗄️ Base de Datos

El proyecto ahora usa **SQLite** por defecto para simplificar el desarrollo local. La base de datos se crea automáticamente al ejecutar `task api`.

### Tablas principales:
- `usuario` - Información de usuarios
- `perfil` - Perfiles de usuario  
- `dispositivo` - Dispositivos vinculados
- `actividad` - Registro de actividades

## 🧪 Testing

```bash
# Tests del backend
task api:test

# Tests del frontend  
task client:test

# Todos los tests
task test
```

## 📝 Comandos de Desarrollo

| Comando | Descripción |
|---------|-------------|
| `task client` | Inicia frontend Angular |
| `task api` | Inicia backend + BD SQLite |
| `task api:test` | Tests del API |
| `task client:test` | Tests del frontend |
| `task health` | Verifica estado de la API |
| `task install` | Instala dependencias |
| `task clean` | Limpia node_modules |

## 🐳 Docker (Opcional)

Los comandos Docker legacy están disponibles para quien prefiera usarlos:

```bash
task docker:up    # Levantar con Docker Compose
task docker:down  # Apagar contenedores
```

## 🛠️ Desarrollo

1. **Terminal 1:** `task api` (Backend)
2. **Terminal 2:** `task client` (Frontend)

¡Ya tienes VitalTrack corriendo! 🎉