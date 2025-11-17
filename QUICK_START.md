# ⚡ Quick Start - VitalTrack con PrimeNG

## 🚀 Inicio Rápido (5 minutos)

### Opción 1: Usando Task (Recomendado)

```bash
# 1. Instalar Task (si no lo tienes)
# Windows: choco install go-task
# Mac: brew install go-task
# Linux: sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d -b /usr/local/bin

# 2. Clonar y entrar al proyecto
git clone <tu-repo>
cd VitalTrack

# 3. Iniciar backend (Terminal 1)
task api

# 4. Iniciar frontend (Terminal 2)
task client

# 5. Abrir navegador
# http://localhost:4200
```

### Opción 2: Manual (Sin Task)

```bash
# 1. Clonar proyecto
git clone <tu-repo>
cd VitalTrack

# 2. Iniciar backend (Terminal 1)
cd backend
npm install
npm start
# Backend en http://localhost:4000

# 3. Iniciar frontend (Terminal 2)
cd frontend
npm install
npm start
# Frontend en http://localhost:4200
```

### Opción 3: Docker

```bash
# 1. Iniciar con Docker Compose
docker compose up -d --build

# 2. Acceder
# API: http://localhost:4000
# Frontend: Manual (ver Opción 2, paso 3)
```

## ✅ Verificación Rápida

### 1. Backend funcionando:
```bash
curl http://localhost:4000/health
# Respuesta esperada: {"status":"ok"}
```

### 2. Frontend cargado:
- Abrir: http://localhost:4200
- Deberías ver: Pestañas azules con iconos
- Probar: Cambiar entre pestañas

### 3. Crear un usuario de prueba:
1. Ir a pestaña "Usuarios"
2. Llenar formulario:
   - Cédula: 123456
   - Nombre: Test User
   - Email: test@example.com
   - Fecha: Seleccionar del calendario
   - ☑️ Marcar checkbox
3. Clic en "Crear Usuario"
4. Verificar: Toast verde aparece arriba a la derecha
5. Usuario aparece en la tabla

## 🎨 Características PrimeNG que Verás

### Visual Inmediato:
- ✅ Pestañas con iconos (👤 🪪 📈 📱 📄 📊)
- ✅ Tabla con filas alternadas (blanco/gris)
- ✅ Botones con iconos (✏️ 🗑️ ⟳)
- ✅ Calendario con picker visual
- ✅ Inputs con bordes azules al focus

### Interactivo:
- ✅ Toast notifications (esquina superior derecha)
- ✅ ConfirmDialog al eliminar
- ✅ Edición inline en tablas
- ✅ Hover effects en botones y filas

## 🧪 Test Rápido de Funcionalidades

```bash
# Test 1: Crear Usuario
1. Llenar formulario
2. Clic "Crear Usuario"
3. ✅ Toast verde aparece
4. ✅ Usuario en tabla

# Test 2: Editar Usuario
1. Clic "Editar" en tabla
2. Modificar campo
3. Clic "Guardar"
4. ✅ Toast verde
5. ✅ Cambios reflejados

# Test 3: Eliminar Usuario
1. Clic "Eliminar"
2. ✅ ConfirmDialog aparece
3. Clic "Sí"
4. ✅ Toast verde
5. ✅ Usuario desaparece

# Test 4: Crear Perfil
1. Ir a pestaña "Perfiles"
2. Usuario ID: 1
3. Llenar campos
4. Clic "Crear Perfil"
5. ✅ Toast verde

# Test 5: Generar Reporte
1. Ir a pestaña "Reportes"
2. Clic "Generar Reporte PDF"
3. ✅ PDF descarga automáticamente
```

## 🐛 Solución Rápida de Problemas

### Problema: "Cannot find module 'primeng'"
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Problema: Backend no responde
```bash
# Verificar que está corriendo
curl http://localhost:4000/health

# Si no responde, reiniciar
cd backend
npm start
```

### Problema: Puerto 4200 ocupado
```bash
# Matar proceso en Windows
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Matar proceso en Mac/Linux
lsof -ti:4200 | xargs kill -9
```

### Problema: Estilos no se aplican
```bash
# Limpiar caché del navegador
# Ctrl + Shift + R (Windows/Linux)
# Cmd + Shift + R (Mac)

# O probar en modo incógnito
```

### Problema: Toast no aparece
- Verificar que `<p-toast>` está en el template
- Abrir consola del navegador (F12)
- Buscar errores

## 📚 Documentación Disponible

- **[PRIMENG_INTEGRATION.md](./PRIMENG_INTEGRATION.md)** - Guía completa de integración
- **[PRIMENG_COMPARISON.md](./PRIMENG_COMPARISON.md)** - Comparación antes/después
- **[PRIMENG_CHECKLIST.md](./PRIMENG_CHECKLIST.md)** - Checklist de verificación
- **[PRIMENG_VISUAL_GUIDE.md](./PRIMENG_VISUAL_GUIDE.md)** - Guía visual de componentes
- **[PRIMENG_SUMMARY.md](./PRIMENG_SUMMARY.md)** - Resumen ejecutivo

## 🎯 Siguientes Pasos

1. **Explorar todas las pestañas:**
   - Usuarios, Perfiles, Actividades, Dispositivos, Reportes, Estadísticas

2. **Probar todas las operaciones CRUD:**
   - Crear, leer, actualizar, eliminar en cada entidad

3. **Observar las notificaciones:**
   - Toast de éxito, error, warning, info
   - ConfirmDialog antes de eliminar

4. **Revisar la documentación:**
   - Leer guías para entender mejor la integración

5. **Personalizar:**
   - Cambiar colores en styles.css
   - Agregar más campos
   - Implementar paginación y filtros

## 💡 Tips Útiles

### Atajos de Teclado:
- `Tab`: Navegar entre campos del formulario
- `Enter`: Enviar formulario
- `Esc`: Cerrar modales y calendarios

### Desarrollo:
- Hot reload activado: Los cambios se reflejan automáticamente
- Consola del navegador (F12): Para ver errores
- Network tab: Para ver peticiones HTTP

### Base de Datos:
- SQLite local: `backend/database.sqlite`
- Resetear DB: `task api:reset` o eliminar el archivo

## 📊 Estructura del Proyecto

```
VitalTrack/
├── backend/              # API Node.js + Express
│   ├── src/
│   │   ├── server.js     # Entry point
│   │   └── ...
│   ├── database.sqlite   # Base de datos
│   └── package.json
├── frontend/             # Angular 18 + PrimeNG 18
│   ├── src/
│   │   ├── app/
│   │   │   └── app.prime.component.ts  # Componente principal
│   │   ├── styles.css    # Estilos globales + PrimeNG
│   │   └── main.ts
│   └── package.json
├── PRIMENG_*.md          # Documentación PrimeNG
├── Taskfile.yml          # Comandos Task
└── README.md
```

## 🎨 Tema y Colores

- **Tema:** Lara Light Blue
- **Color primario:** #3b82f6 (azul)
- **Iconos:** PrimeIcons 7.x
- **Responsive:** Mobile-first
- **Accesibilidad:** WCAG compliant

## 🔗 Enlaces Útiles

- **PrimeNG Docs:** https://primeng.org/
- **PrimeIcons:** https://primeng.org/icons
- **Angular Docs:** https://angular.dev/
- **Express Docs:** https://expressjs.com/

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Revisa los logs del backend
3. Consulta [PRIMENG_CHECKLIST.md](./PRIMENG_CHECKLIST.md)
4. Revisa el apartado "Troubleshooting" en [PRIMENG_INTEGRATION.md](./PRIMENG_INTEGRATION.md)

## ✨ ¡Listo!

Tu aplicación VitalTrack con PrimeNG está funcionando. Disfruta de:
- 🎨 Interfaz moderna y profesional
- 🚀 Componentes listos para usar
- 📱 Diseño responsive
- ♿ Accesibilidad incluida
- 🎯 CRUD completo funcionando

---

**Tiempo estimado de setup:** 5 minutos  
**Versión:** PrimeNG 18.0.0 + Angular 18.0.0  
**Estado:** ✅ Producción ready
