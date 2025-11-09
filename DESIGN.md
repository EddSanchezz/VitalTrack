# 🎨 VitalTrack - Guía de Diseño

## Paleta de Colores

### Colores Principales - Tonos Púrpura

```css
--primary-50: #faf5ff; /* Fondo muy claro */
--primary-100: #f3e8ff; /* Fondo claro */
--primary-200: #e9d5ff; /* Borde suave */
--primary-300: #d8b4fe; /* Hover suave */
--primary-400: #c084fc; /* Acento secundario */
--primary-500: #a855f7; /* Principal */
--primary-600: #9333ea; /* Principal oscuro */
--primary-700: #7e22ce; /* Texto sobre claro */
--primary-800: #6b21a8; /* Oscuro */
--primary-900: #581c87; /* Más oscuro */
```

### Grises Neutrales

```css
--gray-50: #fafafa; /* Fondo muy claro */
--gray-100: #f5f5f5; /* Fondo claro */
--gray-200: #e5e5e5; /* Bordes */
--gray-300: #d4d4d4; /* Bordes oscuros */
--gray-400: #a3a3a3; /* Texto deshabilitado */
--gray-500: #737373; /* Texto secundario */
--gray-600: #525252; /* Texto */
--gray-700: #404040; /* Texto principal */
--gray-800: #262626; /* Texto oscuro */
--gray-900: #171717; /* Casi negro */
```

### Colores de Estado

```css
--success: #10b981; /* Verde - Exitoso */
--warning: #f59e0b; /* Amarillo - Advertencia */
--error: #ef4444; /* Rojo - Error */
--info: #3b82f6; /* Azul - Información */
```

## Espaciado

Sistema de espaciado consistente basado en múltiplos de 4px:

```css
--space-xs: 0.25rem; /* 4px */
--space-sm: 0.5rem; /* 8px */
--space-md: 1rem; /* 16px */
--space-lg: 1.5rem; /* 24px */
--space-xl: 2rem; /* 32px */
--space-2xl: 3rem; /* 48px */
--space-3xl: 4rem; /* 64px */
```

## Bordes Redondeados

```css
--radius-sm: 0.375rem; /* 6px - Pequeño */
--radius-md: 0.5rem; /* 8px - Medio */
--radius-lg: 0.75rem; /* 12px - Grande */
--radius-xl: 1rem; /* 16px - Muy grande */
--radius-2xl: 1.5rem; /* 24px - Extra grande */
--radius-full: 9999px; /* Completamente redondo */
```

## Sombras

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-purple: 0 10px 25px -5px rgba(147, 51, 234, 0.15);
```

## Transiciones

```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
```

## Tipografía

### Fuente

**Inter** - Fuente principal del sistema

- Pesos disponibles: 300, 400, 500, 600, 700
- Fallbacks: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto

### Escala de Tamaños

```css
h1: 2.25rem; /* 36px */
h2: 1.875rem; /* 30px */
h3: 1.5rem; /* 24px */
h4: 1.25rem; /* 20px */
h5: 1.125rem; /* 18px */
h6: 1rem; /* 16px */
body: 1rem; /* 16px */
small: 0.875rem; /* 14px */
```

## Componentes

### Navegación

**Características:**

- Fondo con efecto glassmorphism (blur)
- Borde inferior sutil
- Enlaces con iconos SVG
- Estado activo con gradiente púrpura
- Responsive con diseño adaptativo

**Clases CSS:**

```css
.navbar .nav-brand .nav-links .nav-link .nav-link.active;
```

### Botones

**Variantes:**

- `btn-primary` - Gradiente púrpura con sombra
- `btn-secondary` - Gris claro
- `btn-success` - Verde
- `btn-danger` - Rojo

**Tamaños:**

- `btn-sm` - Pequeño
- `btn` - Normal (default)
- `btn-lg` - Grande

### Formularios

**Componentes:**

- `form-group` - Contenedor de campo
- `form-label` - Etiqueta descriptiva
- `form-input` - Campo de texto
- `form-select` - Selector
- `form-textarea` - Área de texto

**Estados:**

- `:focus` - Borde púrpura + sombra suave
- `:disabled` - Opacidad reducida
- `:invalid` - Borde rojo (cuando se valida)

### Cards

**Características:**

- Fondo blanco con sombra media
- Bordes muy redondeados (16px)
- Padding generoso (32px)
- Hover effect con elevación
- Transición suave

### Tablas

**Estructura:**

- `.table-container` - Contenedor con sombra y border-radius
- `.table` - Tabla base
- `thead` - Encabezado con gradiente púrpura
- `tbody tr:hover` - Fondo púrpura claro al pasar el mouse

### Badges

**Variantes:**

- `badge-primary` - Púrpura
- `badge-success` - Verde
- `badge-warning` - Amarillo
- `badge-error` - Rojo

## Iconos

Usamos iconos SVG inline de Feather Icons:

- User (usuarios)
- Users (perfiles)
- Smartphone (dispositivos)
- Activity (actividades)
- Edit, Trash, Save, Plus, X

## Animaciones

### Fade In

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

Aplicar con clase `.fade-in`

## Responsive

### Breakpoints

```css
/* Mobile */
@media (max-width: 768px) {
  /* Navbar en columna */
  /* Padding reducido */
  /* Tablas con scroll horizontal */
}
```

## Mejores Prácticas

1. **Consistencia**: Usar siempre variables CSS en lugar de valores hardcoded
2. **Espaciado**: Seguir el sistema de espaciado de 4px
3. **Accesibilidad**: Labels descriptivos, contrast ratio adecuado
4. **Performance**: Transiciones solo en propiedades optimizadas (transform, opacity)
5. **Mobile First**: Diseñar primero para móvil, luego escalar
6. **Glassmorphism**: Usar backdrop-filter con moderación
7. **Sombras**: Aplicar sombras consistentes según jerarquía

## Ejemplos de Uso

### Card con formulario

```html
<div class="card mb-4">
  <h3>Título del Card</h3>
  <form>
    <div class="form-group">
      <label class="form-label">Etiqueta</label>
      <input class="form-input" type="text" placeholder="Placeholder" />
    </div>
    <button class="btn btn-primary">Enviar</button>
  </form>
</div>
```

### Tabla con datos

```html
<div class="table-container">
  <table class="table">
    <thead>
      <tr>
        <th>Columna 1</th>
        <th>Columna 2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="badge badge-primary">#1</span></td>
        <td>Dato</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Botones con iconos

```html
<button class="btn btn-primary">
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path d="..." />
  </svg>
  Texto del botón
</button>
```
