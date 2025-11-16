import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Notificacion {
  id: number;
  tipo: 'success' | 'error' | 'warning' | 'info';
  titulo: string;
  mensaje: string;
  closing?: boolean;
}

interface Usuario {
  cedula: string;
  nombre: string;
  email: string;
  fecha_nacimiento: string;
  consentimiento_privacidad: boolean;
}

interface UsuarioResponse {
  id: number;
  cedula: string;
  nombre: string;
  email: string;
  fecha_registro: string;
  fecha_nacimiento: string;
  consentimiento_privacidad: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h1>VitalTrack - Sistema de Gestión</h1>
      
      <!-- Sistema de notificaciones flotantes -->
      <div class="notificacion-container">
        <div *ngFor="let notif of notificaciones" 
             [class]="'notificacion ' + notif.tipo + (notif.closing ? ' closing' : '')">
          <div class="notificacion-icono">
            <span *ngIf="notif.tipo === 'success'">✓</span>
            <span *ngIf="notif.tipo === 'error'">✕</span>
            <span *ngIf="notif.tipo === 'warning'">⚠</span>
            <span *ngIf="notif.tipo === 'info'">ℹ</span>
          </div>
          <div class="notificacion-contenido">
            <div class="notificacion-titulo">{{ notif.titulo }}</div>
            <div class="notificacion-mensaje">{{ notif.mensaje }}</div>
          </div>
          <button class="notificacion-cerrar" (click)="cerrarNotificacion(notif.id)">×</button>
        </div>
      </div>
      
      <div class="tabs">
        <button 
          class="tab" 
          [class.active]="activeTab === 'usuarios'"
          (click)="selectTab('usuarios')">
          Usuarios
        </button>
        <button 
          class="tab" 
          [class.active]="activeTab === 'perfiles'"
          (click)="selectTab('perfiles')">
          Perfiles
        </button>
        <button 
          class="tab" 
          [class.active]="activeTab === 'actividades'"
          (click)="selectTab('actividades')">
          Actividades
        </button>
        <button 
          class="tab" 
          [class.active]="activeTab === 'dispositivos'"
          (click)="selectTab('dispositivos')">
          Dispositivos
        </button>
        <button 
          class="tab" 
          [class.active]="activeTab === 'reportes'"
          (click)="selectTab('reportes')">
          Reportes
        </button>
        <button 
          class="tab" 
          [class.active]="activeTab === 'estadisticas'"
          (click)="selectTab('estadisticas')">
          Estadísticas
        </button>
      </div>

      <div class="panel" *ngIf="activeTab === 'usuarios'">
        <h2>Gestión de Usuarios</h2>
        
        <div class="usuarios-container">
          <!-- Formulario -->
          <div class="form-section">
            <h3>Crear Usuario</h3>
            <form (ngSubmit)="crearUsuario()" class="user-form">
              <div class="form-group">
                <label for="cedula">Cédula:</label>
                <input 
                  type="text" 
                  id="cedula" 
                  [(ngModel)]="nuevoUsuario.cedula" 
                  name="cedula"
                  required
                  placeholder="Ingrese la cédula"
                />
              </div>

              <div class="form-group">
                <label for="nombre">Nombre:</label>
                <input 
                  type="text" 
                  id="nombre" 
                  [(ngModel)]="nuevoUsuario.nombre" 
                  name="nombre"
                  required
                  placeholder="Ingrese el nombre completo"
                />
              </div>

              <div class="form-group">
                <label for="email">Email:</label>
                <input 
                  type="email" 
                  id="email" 
                  [(ngModel)]="nuevoUsuario.email" 
                  name="email"
                  required
                  placeholder="usuario@ejemplo.com"
                />
              </div>

              <div class="form-group">
                <label for="fecha_nacimiento">Fecha de Nacimiento:</label>
                <input 
                  type="date" 
                  id="fecha_nacimiento" 
                  [(ngModel)]="nuevoUsuario.fecha_nacimiento" 
                  name="fecha_nacimiento"
                  required
                />
              </div>

              <div class="form-group checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    [(ngModel)]="nuevoUsuario.consentimiento_privacidad" 
                    name="consentimiento_privacidad"
                  />
                  <span>Acepto el consentimiento de privacidad</span>
                </label>
              </div>

              <button type="submit" class="btn-submit" [disabled]="enviando">
                {{ enviando ? 'Creando...' : 'Crear Usuario' }}
              </button>
            </form>

            <div *ngIf="mensaje" class="mensaje" [class.error]="mensajeError" [class.success]="!mensajeError">
              {{ mensaje }}
            </div>
          </div>

          <!-- Tabla de Usuarios -->
          <div class="table-section">
            <h3>Lista de Usuarios</h3>
            
            <div *ngIf="cargandoUsuarios" class="loading">
              Cargando usuarios...
            </div>

            <div *ngIf="!cargandoUsuarios && usuarios.length === 0" class="empty-state">
              No hay usuarios registrados
            </div>

            <table *ngIf="!cargandoUsuarios && usuarios.length > 0" class="usuarios-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cédula</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Fecha Nacimiento</th>
                  <th>Fecha Registro</th>
                  <th>Privacidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let usuario of usuarios">
                  <td>{{ usuario.id }}</td>
                  <td>
                    <ng-container *ngIf="editandoId === usuario.id; else cedulaView">
                      <input class="edit-input" [(ngModel)]="editBuffer.cedula" />
                    </ng-container>
                    <ng-template #cedulaView>{{ usuario.cedula }}</ng-template>
                  </td>
                  <td>
                    <ng-container *ngIf="editandoId === usuario.id; else nombreView">
                      <input class="edit-input" [(ngModel)]="editBuffer.nombre" />
                    </ng-container>
                    <ng-template #nombreView>{{ usuario.nombre }}</ng-template>
                  </td>
                  <td>
                    <ng-container *ngIf="editandoId === usuario.id; else emailView">
                      <input class="edit-input" type="email" [(ngModel)]="editBuffer.email" />
                    </ng-container>
                    <ng-template #emailView>{{ usuario.email }}</ng-template>
                  </td>
                  <td>
                    <ng-container *ngIf="editandoId === usuario.id; else nacView">
                      <input class="edit-input" type="date" [(ngModel)]="editBuffer.fecha_nacimiento" />
                    </ng-container>
                    <ng-template #nacView>{{ usuario.fecha_nacimiento }}</ng-template>
                  </td>
                  <td>{{ formatearFecha(usuario.fecha_registro) }}</td>
                  <td>
                    <ng-container *ngIf="editandoId === usuario.id; else privacidadView">
                      <input type="checkbox" [(ngModel)]="editBuffer.consentimiento_privacidad" />
                    </ng-container>
                    <ng-template #privacidadView>
                      <span class="badge" [class.badge-success]="usuario.consentimiento_privacidad === 1" [class.badge-warning]="usuario.consentimiento_privacidad !== 1">
                        {{ usuario.consentimiento_privacidad === 1 ? '✓' : '✗' }}
                      </span>
                    </ng-template>
                  </td>
                  <td class="acciones">
                    <ng-container *ngIf="editandoId === usuario.id; else accionesNormales">
                      <button class="btn-mini btn-save" (click)="guardarEdicion(usuario.id)" [disabled]="guardando">Guardar</button>
                      <button class="btn-mini btn-cancel" (click)="cancelarEdicion()" [disabled]="guardando">Cancelar</button>
                    </ng-container>
                    <ng-template #accionesNormales>
                      <button class="btn-mini" (click)="iniciarEdicion(usuario)">Editar</button>
                      <button class="btn-mini btn-cancel" (click)="eliminarUsuario(usuario.id)" [disabled]="guardando">Eliminar</button>
                    </ng-template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="panel" *ngIf="activeTab === 'perfiles'">
        <h2>Gestión de Perfiles</h2>
        <div class="usuarios-container">
          <!-- Formulario Perfil -->
          <div class="form-section">
            <h3>Crear Perfil</h3>
            <form (ngSubmit)="crearPerfil()" class="user-form">
              <div class="form-group">
                <label for="usuario_id">Usuario ID *</label>
                <input 
                  type="number" 
                  id="usuario_id" 
                  [(ngModel)]="nuevoPerfil.usuario_id" 
                  name="usuario_id"
                  required
                  placeholder="ID del usuario"
                />
              </div>

              <div class="form-group">
                <label for="objetivo">Objetivo</label>
                <input 
                  type="text" 
                  id="objetivo" 
                  [(ngModel)]="nuevoPerfil.objetivo" 
                  name="objetivo"
                  placeholder="p.ej. Bajar peso"
                />
              </div>

              <div class="form-group">
                <label for="sexo">Sexo</label>
                <select id="sexo" [(ngModel)]="nuevoPerfil.sexo" name="sexo">
                  <option value="">-- Seleccione --</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div class="form-group">
                <label for="altura">Altura (cm)</label>
                <input 
                  type="number" 
                  id="altura" 
                  [(ngModel)]="nuevoPerfil.altura" 
                  name="altura"
                  placeholder="170"
                />
              </div>

              <div class="form-group">
                <label for="estado">Estado</label>
                <select id="estado" [(ngModel)]="nuevoPerfil.estado" name="estado">
                  <option value="">-- Seleccione --</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>

              <button type="submit" class="btn-submit" [disabled]="guardandoPerfil || !nuevoPerfil.usuario_id">
                {{ guardandoPerfil ? 'Creando...' : 'Crear Perfil' }}
              </button>
            </form>

            <div *ngIf="mensaje" class="mensaje" [class.error]="mensajeError" [class.success]="!mensajeError">
              {{ mensaje }}
            </div>
          </div>

          <!-- Tabla de Perfiles -->
          <div class="table-section">
            <div class="list-header" style="display:flex;align-items:center;gap:8px;">
              <h3 style="margin:0;flex:1;">Lista de Perfiles</h3>
              <button class="btn-mini" (click)="cargarPerfiles()" [disabled]="cargandoPerfiles">🔄</button>
            </div>

            <div *ngIf="cargandoPerfiles" class="loading">
              Cargando perfiles...
            </div>

            <div *ngIf="!cargandoPerfiles && perfiles.length === 0" class="empty-state">
              No hay perfiles registrados
            </div>

            <table *ngIf="!cargandoPerfiles && perfiles.length > 0" class="usuarios-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario ID</th>
                  <th>Objetivo</th>
                  <th>Sexo</th>
                  <th>Altura</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of perfiles">
                  <td>{{ p.id }}</td>
                  <td>
                    <ng-container *ngIf="editandoPerfilId === p.id; else usuarioIdView">
                      <input class="edit-input" type="number" [(ngModel)]="editBufferPerfil.usuario_id" />
                    </ng-container>
                    <ng-template #usuarioIdView>{{ p.usuario_id }}</ng-template>
                  </td>
                  <td>
                    <ng-container *ngIf="editandoPerfilId === p.id; else objetivoView">
                      <input class="edit-input" [(ngModel)]="editBufferPerfil.objetivo" />
                    </ng-container>
                    <ng-template #objetivoView>{{ p.objetivo || '-' }}</ng-template>
                  </td>
                  <td>
                    <ng-container *ngIf="editandoPerfilId === p.id; else sexoView">
                      <select class="edit-input" [(ngModel)]="editBufferPerfil.sexo">
                        <option value="">--</option>
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                        <option value="otro">Otro</option>
                      </select>
                    </ng-container>
                    <ng-template #sexoView>{{ p.sexo || '-' }}</ng-template>
                  </td>
                  <td>
                    <ng-container *ngIf="editandoPerfilId === p.id; else alturaView">
                      <input class="edit-input" type="number" [(ngModel)]="editBufferPerfil.altura" />
                    </ng-container>
                    <ng-template #alturaView>{{ p.altura ?? '-' }}</ng-template>
                  </td>
                  <td>
                    <ng-container *ngIf="editandoPerfilId === p.id; else estadoView">
                      <select class="edit-input" [(ngModel)]="editBufferPerfil.estado">
                        <option value="">--</option>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                      </select>
                    </ng-container>
                    <ng-template #estadoView>{{ p.estado || '-' }}</ng-template>
                  </td>
                  <td class="acciones">
                    <ng-container *ngIf="editandoPerfilId === p.id; else accionesPerfilNormales">
                      <button class="btn-mini btn-save" (click)="guardarPerfil(p.id)" [disabled]="guardandoPerfil">Guardar</button>
                      <button class="btn-mini btn-cancel" (click)="cancelarEdicionPerfil()" [disabled]="guardandoPerfil">Cancelar</button>
                    </ng-container>
                    <ng-template #accionesPerfilNormales>
                      <button class="btn-mini" (click)="iniciarEdicionPerfil(p)" [disabled]="guardandoPerfil">Editar</button>
                      <button class="btn-mini btn-cancel" (click)="eliminarPerfil(p.id)" [disabled]="guardandoPerfil">Eliminar</button>
                    </ng-template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="panel" *ngIf="activeTab === 'actividades'">
        <h2>Registro de Actividades</h2>
        <div class="usuarios-container">
          <!-- Formulario Actividad -->
          <div class="form-section">
            <h3>Crear Actividad</h3>
            <form (ngSubmit)="crearActividad()" class="user-form">
              <div class="form-group">
                <label for="act_usuario_id">Usuario ID *</label>
                <input 
                  type="number" 
                  id="act_usuario_id" 
                  [(ngModel)]="nuevaActividad.usuario_id" 
                  name="act_usuario_id"
                  required
                  placeholder="ID del usuario"
                />
              </div>

              <div class="form-group">
                <label for="tipo">Tipo</label>
                <input 
                  type="text" 
                  id="tipo" 
                  [(ngModel)]="nuevaActividad.tipo" 
                  name="tipo"
                  placeholder="p.ej. Correr, Caminar"
                />
              </div>

              <div class="form-group">
                <label for="hora_inicio">Hora Inicio</label>
                <input 
                  type="datetime-local" 
                  id="hora_inicio" 
                  [(ngModel)]="nuevaActividad.hora_inicio" 
                  name="hora_inicio"
                />
              </div>

              <div class="form-group">
                <label for="hora_fin">Hora Fin</label>
                <input 
                  type="datetime-local" 
                  id="hora_fin" 
                  [(ngModel)]="nuevaActividad.hora_fin" 
                  name="hora_fin"
                />
              </div>

              <div class="form-group">
                <label for="duracion_segundos">Duración (segundos)</label>
                <input 
                  type="number" 
                  id="duracion_segundos" 
                  [(ngModel)]="nuevaActividad.duracion_segundos" 
                  name="duracion_segundos"
                  placeholder="Opcional si se provee inicio/fin"
                />
              </div>

              <button type="submit" class="btn-submit" [disabled]="guardandoActividad || !nuevaActividad.usuario_id">
                {{ guardandoActividad ? 'Creando...' : 'Crear Actividad' }}
              </button>
            </form>

            <div *ngIf="mensaje" class="mensaje" [class.error]="mensajeError" [class.success]="!mensajeError">
              {{ mensaje }}
            </div>
          </div>

          <!-- Tabla de Actividades -->
          <div class="table-section">
            <div class="list-header" style="display:flex;align-items:center;gap:8px;">
              <h3 style="margin:0;flex:1;">Lista de Actividades</h3>
              <button class="btn-mini" (click)="cargarActividades()" [disabled]="cargandoActividades">🔄</button>
            </div>

            <div *ngIf="cargandoActividades" class="loading">
              Cargando actividades...
            </div>

            <div *ngIf="!cargandoActividades && actividades.length === 0" class="empty-state">
              No hay actividades registradas
            </div>

            <table *ngIf="!cargandoActividades && actividades.length > 0" class="usuarios-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario ID</th>
                  <th>Tipo</th>
                  <th>Hora Inicio</th>
                  <th>Hora Fin</th>
                  <th>Duración (seg)</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let a of actividades">
                  <td>{{ a.id }}</td>
                  <td>
                    <ng-container *ngIf="editandoActividadId === a.id; else actUsuarioIdView">
                      <input class="edit-input" type="number" [(ngModel)]="editBufferActividad.usuario_id" />
                    </ng-container>
                    <ng-template #actUsuarioIdView>{{ a.usuario_id }}</ng-template>
                  </td>
                  <td>
                    <ng-container *ngIf="editandoActividadId === a.id; else tipoView">
                      <input class="edit-input" [(ngModel)]="editBufferActividad.tipo" />
                    </ng-container>
                    <ng-template #tipoView>{{ a.tipo || '-' }}</ng-template>
                  </td>
                  <td>
                    <ng-container *ngIf="editandoActividadId === a.id; else inicioView">
                      <input class="edit-input" type="datetime-local" [(ngModel)]="editBufferActividad.hora_inicio" />
                    </ng-container>
                    <ng-template #inicioView>{{ a.hora_inicio ? formatearFecha(a.hora_inicio) : '-' }}</ng-template>
                  </td>
                  <td>
                    <ng-container *ngIf="editandoActividadId === a.id; else finView">
                      <input class="edit-input" type="datetime-local" [(ngModel)]="editBufferActividad.hora_fin" />
                    </ng-container>
                    <ng-template #finView>{{ a.hora_fin ? formatearFecha(a.hora_fin) : '-' }}</ng-template>
                  </td>
                  <td>
                    <ng-container *ngIf="editandoActividadId === a.id; else duracionView">
                      <input class="edit-input" type="number" [(ngModel)]="editBufferActividad.duracion_segundos" />
                    </ng-container>
                    <ng-template #duracionView>{{ a.duracion_segundos ?? '-' }}</ng-template>
                  </td>
                  <td class="acciones">
                    <ng-container *ngIf="editandoActividadId === a.id; else accionesActividadNormales">
                      <button class="btn-mini btn-save" (click)="guardarActividad(a.id)" [disabled]="guardandoActividad">Guardar</button>
                      <button class="btn-mini btn-cancel" (click)="cancelarEdicionActividad()" [disabled]="guardandoActividad">Cancelar</button>
                    </ng-container>
                    <ng-template #accionesActividadNormales>
                      <button class="btn-mini" (click)="iniciarEdicionActividad(a)" [disabled]="guardandoActividad">Editar</button>
                      <button class="btn-mini btn-cancel" (click)="eliminarActividad(a.id)" [disabled]="guardandoActividad">Eliminar</button>
                    </ng-template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="panel" *ngIf="activeTab === 'dispositivos'">
        <h2>Dispositivos Conectados</h2>
        <div class="usuarios-container">
          <!-- Formulario Dispositivo -->
          <div class="form-section">
            <h3>Crear Dispositivo</h3>
            <form (ngSubmit)="crearDispositivo()" class="user-form">
              <div class="form-group">
                <label for="disp_usuario_id">Usuario ID *</label>
                <input 
                  type="number" 
                  id="disp_usuario_id" 
                  [(ngModel)]="nuevoDispositivo.usuario_id" 
                  name="disp_usuario_id"
                  required
                  placeholder="ID del usuario"
                />
              </div>

              <div class="form-group">
                <label for="serial">Serial *</label>
                <input 
                  type="text" 
                  id="serial" 
                  [(ngModel)]="nuevoDispositivo.serial" 
                  name="serial"
                  required
                  placeholder="Número de serie único"
                />
              </div>

              <div class="form-group">
                <label for="marca">Marca</label>
                <input 
                  type="text" 
                  id="marca" 
                  [(ngModel)]="nuevoDispositivo.marca" 
                  name="marca"
                  placeholder="p.ej. Fitbit, Garmin"
                />
              </div>

              <div class="form-group">
                <label for="modelo">Modelo</label>
                <input 
                  type="text" 
                  id="modelo" 
                  [(ngModel)]="nuevoDispositivo.modelo" 
                  name="modelo"
                  placeholder="p.ej. Charge 5"
                />
              </div>

              <div class="form-group">
                <label for="fecha_vinculacion">Fecha Vinculación</label>
                <input 
                  type="date" 
                  id="fecha_vinculacion" 
                  [(ngModel)]="nuevoDispositivo.fecha_vinculacion" 
                  name="fecha_vinculacion"
                />
              </div>

              <button type="submit" class="btn-submit" [disabled]="guardandoDispositivo || !nuevoDispositivo.usuario_id || !nuevoDispositivo.serial">
                {{ guardandoDispositivo ? 'Creando...' : 'Crear Dispositivo' }}
              </button>
            </form>

            <div *ngIf="mensaje" class="mensaje" [class.error]="mensajeError" [class.success]="!mensajeError">
              {{ mensaje }}
            </div>
          </div>

          <!-- Tabla de Dispositivos -->
          <div class="table-section">
            <div class="list-header" style="display:flex;align-items:center;gap:8px;">
              <h3 style="margin:0;flex:1;">Lista de Dispositivos</h3>
              <button class="btn-mini" (click)="cargarDispositivos()" [disabled]="cargandoDispositivos">🔄</button>
            </div>

            <div *ngIf="cargandoDispositivos" class="loading">
              Cargando dispositivos...
            </div>

            <div *ngIf="!cargandoDispositivos && dispositivos.length === 0" class="empty-state">
              No hay dispositivos registrados
            </div>

            <table *ngIf="!cargandoDispositivos && dispositivos.length > 0" class="usuarios-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario ID</th>
                  <th>Serial</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Fecha Vinculación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let d of dispositivos">
                  <td>{{ d.id }}</td>
                  <td>
                    <ng-container *ngIf="editandoDispositivoId === d.id; else dispUsuarioIdView">
                      <input class="edit-input" type="number" [(ngModel)]="editBufferDispositivo.usuario_id" />
                    </ng-container>
                    <ng-template #dispUsuarioIdView>{{ d.usuario_id }}</ng-template>
                  </td>
                  <td>
                    <ng-container *ngIf="editandoDispositivoId === d.id; else serialView">
                      <input class="edit-input" [(ngModel)]="editBufferDispositivo.serial" />
                    </ng-container>
                    <ng-template #serialView>{{ d.serial }}</ng-template>
                  </td>
                  <td>
                    <ng-container *ngIf="editandoDispositivoId === d.id; else marcaView">
                      <input class="edit-input" [(ngModel)]="editBufferDispositivo.marca" />
                    </ng-container>
                    <ng-template #marcaView>{{ d.marca || '-' }}</ng-template>
                  </td>
                  <td>
                    <ng-container *ngIf="editandoDispositivoId === d.id; else modeloView">
                      <input class="edit-input" [(ngModel)]="editBufferDispositivo.modelo" />
                    </ng-container>
                    <ng-template #modeloView>{{ d.modelo || '-' }}</ng-template>
                  </td>
                  <td>
                    <ng-container *ngIf="editandoDispositivoId === d.id; else fechaVincView">
                      <input class="edit-input" type="date" [(ngModel)]="editBufferDispositivo.fecha_vinculacion" />
                    </ng-container>
                    <ng-template #fechaVincView>{{ d.fecha_vinculacion || '-' }}</ng-template>
                  </td>
                  <td class="acciones">
                    <ng-container *ngIf="editandoDispositivoId === d.id; else accionesDispositivoNormales">
                      <button class="btn-mini btn-save" (click)="guardarDispositivo(d.id)" [disabled]="guardandoDispositivo">Guardar</button>
                      <button class="btn-mini btn-cancel" (click)="cancelarEdicionDispositivo()" [disabled]="guardandoDispositivo">Cancelar</button>
                    </ng-container>
                    <ng-template #accionesDispositivoNormales>
                      <button class="btn-mini" (click)="iniciarEdicionDispositivo(d)" [disabled]="guardandoDispositivo">Editar</button>
                      <button class="btn-mini btn-cancel" (click)="eliminarDispositivo(d.id)" [disabled]="guardandoDispositivo">Eliminar</button>
                    </ng-template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="panel" *ngIf="activeTab === 'reportes'">
        <h2>Generación de Reportes</h2>
        <div class="reportes-container">
          <div class="reportes-descripcion">
            <p>Esta sección permite generar un reporte consolidado en formato PDF que incluye un análisis completo de los datos de la plataforma.</p>
            <p>Al hacer clic en el botón "Generar Reporte PDF", se compilarán los siguientes informes:</p>
          </div>
          
          <div class="reportes-lista">
            <div *ngFor="let reporte of reportes" class="reporte-item">
              <span class="reporte-titulo">{{ reporte.titulo }}</span>
              <span class="badge" [ngClass]="'badge-' + reporte.dificultad.toLowerCase()">{{ reporte.dificultad }}</span>
            </div>
          </div>

          <div class="reportes-accion">
            <button class="btn-submit" (click)="generarReportePDF()" [disabled]="generandoReporte">
              {{ generandoReporte ? 'Generando PDF...' : 'Generar Reporte PDF' }}
            </button>
          </div>
        </div>
      </div>

      <div class="panel" *ngIf="activeTab === 'estadisticas'">
        <h2>Estadísticas</h2>
        <div class="empty-state">
          <p>Próximamente: Gráficos y visualizaciones de datos.</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  activeTab: string = 'usuarios';
  enviando: boolean = false;
  mensaje: string = '';
  mensajeError: boolean = false;
  cargandoUsuarios: boolean = false;
  usuarios: UsuarioResponse[] = [];
  private readonly API_URL = 'http://localhost:4000';
  
  // Sistema de notificaciones
  notificaciones: Notificacion[] = [];
  private notificacionIdCounter = 0;
  
  // Perfiles state
  cargandoPerfiles: boolean = false;
  perfiles: any[] = [];
  nuevoPerfil: any = { usuario_id: '', objetivo: '', sexo: '', altura: '', estado: '' };
  editandoPerfilId: number | null = null;
  editBufferPerfil: any = {};
  guardandoPerfil: boolean = false;
  editandoId: number | null = null;
  editBuffer: any = {};
  guardando: boolean = false;

  // Actividades state
  cargandoActividades: boolean = false;
  actividades: any[] = [];
  nuevaActividad: any = { usuario_id: '', tipo: '', hora_inicio: '', hora_fin: '', duracion_segundos: '' };
  editandoActividadId: number | null = null;
  editBufferActividad: any = {};
  guardandoActividad: boolean = false;

  // Dispositivos state
  cargandoDispositivos: boolean = false;
  dispositivos: any[] = [];
  nuevoDispositivo: any = { usuario_id: '', serial: '', marca: '', modelo: '', fecha_vinculacion: '' };
  editandoDispositivoId: number | null = null;
  editBufferDispositivo: any = {};
  guardandoDispositivo: boolean = false;

  // Reportes state
  generandoReporte: boolean = false;
  reportes: any[] = [
    { titulo: 'Últimos 10 Usuarios Registrados', dificultad: 'Simple' },
    { titulo: 'Última Lectura de Sensor de Frecuencia Cardíaca', dificultad: 'Simple' },
    { titulo: 'Cantidad de Sensores por Dispositivo', dificultad: 'Simple' },
    { titulo: 'Promedio Diario de Lecturas por Sensor (7 días)', dificultad: 'Intermedio' },
    { titulo: 'Listado Completo de Sensores con Dispositivo y Usuario', dificultad: 'Intermedio' },
    { titulo: 'Usuarios en Retos Activos con Progreso', dificultad: 'Intermedio' },
    { titulo: 'Resumen Diario Actualizado (UPSERT)', dificultad: 'Intermedio' },
    { titulo: 'Usuarios con Lecturas Sobre el Umbral (30 días)', dificultad: 'Complejo' },
    { titulo: 'Media Móvil de 7 Días para Lecturas', dificultad: 'Complejo' },
    { titulo: 'Top 5 Usuarios con Mayor Incremento en Lecturas', dificultad: 'Complejo' },
  ];

  nuevoUsuario: Usuario = {
    cedula: '',
    nombre: '',
    email: '',
    fecha_nacimiento: '',
    consentimiento_privacidad: false
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  selectTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'usuarios') {
      this.cargarUsuarios();
    } else if (tab === 'perfiles') {
      this.cargarPerfiles();
    } else if (tab === 'actividades') {
      this.cargarActividades();
    } else if (tab === 'dispositivos') {
      this.cargarDispositivos();
    } else if (tab === 'reportes') {
      // No se necesita cargar nada al seleccionar la pestaña
    }
  }

  cargarUsuarios(): void {
    this.cargandoUsuarios = true;
    this.http.get<UsuarioResponse[]>(`${this.API_URL}/api/usuarios`).subscribe({
      next: (response) => {
        console.log('Usuarios cargados:', response);
        this.usuarios = response;
        this.cargandoUsuarios = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        const { titulo, mensaje } = this.obtenerMensajeError(error);
        this.mostrarNotificacion('error', titulo, mensaje);
        this.cargandoUsuarios = false;
      }
    });
  }

  crearUsuario(): void {
    this.enviando = true;
    this.mensaje = '';

    console.log('Enviando datos:', this.nuevoUsuario);

    this.http.post(`${this.API_URL}/api/usuarios`, this.nuevoUsuario).subscribe({
      next: (response) => {
        console.log('Usuario creado exitosamente:', response);
        this.mostrarNotificacion('success', 'Usuario creado', `El usuario ${this.nuevoUsuario.nombre} ha sido registrado exitosamente.`);
        this.enviando = false;
        // Limpiar formulario
        this.nuevoUsuario = {
          cedula: '',
          nombre: '',
          email: '',
          fecha_nacimiento: '',
          consentimiento_privacidad: false
        };
        // Recargar la tabla
        this.cargarUsuarios();
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
        const { titulo, mensaje } = this.obtenerMensajeError(error);
        this.mostrarNotificacion('error', titulo, mensaje);
        this.enviando = false;
      }
    });
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '-';
    const date = new Date(fecha);
    if (isNaN(date.getTime())) return fecha;
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  iniciarEdicion(usuario: UsuarioResponse): void {
    this.mensaje = '';
    this.mensajeError = false;
    this.editandoId = usuario.id;
    this.editBuffer = {
      cedula: usuario.cedula || '',
      nombre: usuario.nombre || '',
      email: usuario.email || '',
      fecha_nacimiento: usuario.fecha_nacimiento || '',
      consentimiento_privacidad: usuario.consentimiento_privacidad === 1
    };
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.editBuffer = {};
  }

  guardarEdicion(id: number): void {
    if (this.editandoId !== id) return;
    // Validaciones básicas
    if (!this.editBuffer.nombre || !this.editBuffer.email) {
      this.mostrarNotificacion('warning', 'Campos requeridos', 'Nombre y Email son obligatorios para actualizar el usuario.');
      return;
    }
    const emailPattern = /.+@.+\..+/;
    if (!emailPattern.test(this.editBuffer.email)) {
      this.mostrarNotificacion('warning', 'Email inválido', 'El formato del email no es válido. Ejemplo: usuario@dominio.com');
      return;
    }
    this.guardando = true;
    this.http.put(`${this.API_URL}/api/usuarios/${id}`, {
      cedula: this.editBuffer.cedula || null,
      nombre: this.editBuffer.nombre,
      email: this.editBuffer.email,
      fecha_nacimiento: this.editBuffer.fecha_nacimiento || null,
      consentimiento_privacidad: this.editBuffer.consentimiento_privacidad
    }).subscribe({
      next: () => {
        this.mostrarNotificacion('success', 'Usuario actualizado', `Los cambios en ${this.editBuffer.nombre} se guardaron correctamente.`);
        this.guardando = false;
        this.editandoId = null;
        this.editBuffer = {};
        this.cargarUsuarios();
      },
      error: (error) => {
        console.error('Error actualizando usuario:', error);
        const { titulo, mensaje } = this.obtenerMensajeError(error);
        this.mostrarNotificacion('error', titulo, mensaje);
        this.guardando = false;
      }
    });
  }

  eliminarUsuario(id: number): void {
    const confirmado = confirm('¿Seguro que deseas eliminar este usuario? Esta acción no se puede deshacer.');
    if (!confirmado) return;
    this.guardando = true;
    this.http.delete(`${this.API_URL}/api/usuarios/${id}`).subscribe({
      next: () => {
        this.mostrarNotificacion('success', 'Usuario eliminado', 'El usuario ha sido eliminado del sistema.');
        this.guardando = false;
        // Si se estaba editando esta fila, cancelar
        if (this.editandoId === id) this.cancelarEdicion();
        // Refrescar lista
        this.cargarUsuarios();
      },
      error: (error) => {
        console.error('Error eliminando usuario:', error);
        const { titulo, mensaje } = this.obtenerMensajeError(error);
        this.mostrarNotificacion('error', titulo, mensaje);
        this.guardando = false;
      }
    });
  }

  // -------- PERFILES ---------
  cargarPerfiles(): void {
    this.cargandoPerfiles = true;
    this.http.get<any[]>(`${this.API_URL}/api/perfiles`).subscribe({
      next: (rows) => {
        this.perfiles = rows;
        this.cargandoPerfiles = false;
      },
      error: (error) => {
        console.error('Error cargando perfiles:', error);
        const { titulo, mensaje } = this.obtenerMensajeError(error);
        this.mostrarNotificacion('error', titulo, mensaje);
        this.cargandoPerfiles = false;
      }
    });
  }

  crearPerfil(): void {
    if (!this.nuevoPerfil.usuario_id) {
      this.mostrarNotificacion('warning', 'Campo requerido', 'El ID de usuario es obligatorio para crear un perfil.');
      return;
    }
    this.guardandoPerfil = true;
    this.http.post(`${this.API_URL}/api/perfiles`, {
      usuario_id: Number(this.nuevoPerfil.usuario_id),
      objetivo: this.nuevoPerfil.objetivo || null,
      sexo: this.nuevoPerfil.sexo || null,
      altura: this.nuevoPerfil.altura ? Number(this.nuevoPerfil.altura) : null,
      estado: this.nuevoPerfil.estado || null
    }).subscribe({
      next: () => {
        this.mostrarNotificacion('success', 'Perfil creado', 'El perfil de salud ha sido creado exitosamente.');
        this.guardandoPerfil = false;
        this.nuevoPerfil = { usuario_id: '', objetivo: '', sexo: '', altura: '', estado: '' };
        this.cargarPerfiles();
      },
      error: (error) => {
        console.error('Error creando perfil:', error);
        const { titulo, mensaje } = this.obtenerMensajeError(error);
        this.mostrarNotificacion('error', titulo, mensaje);
        this.guardandoPerfil = false;
      }
    });
  }

  iniciarEdicionPerfil(perfil: any): void {
    this.editandoPerfilId = perfil.id;
    this.editBufferPerfil = {
      usuario_id: perfil.usuario_id,
      objetivo: perfil.objetivo || '',
      sexo: perfil.sexo || '',
      altura: perfil.altura ?? '',
      estado: perfil.estado || ''
    };
  }

  cancelarEdicionPerfil(): void {
    this.editandoPerfilId = null;
    this.editBufferPerfil = {};
  }

  guardarPerfil(perfilId: number): void {
    if (this.editandoPerfilId !== perfilId) return;
    if (!this.editBufferPerfil.usuario_id) {
      this.mostrarNotificacion('warning', 'Campo requerido', 'El ID de usuario es obligatorio para actualizar el perfil.');
      return;
    }
    this.guardandoPerfil = true;
    this.http.put(`${this.API_URL}/api/perfiles/${perfilId}`, {
      usuario_id: Number(this.editBufferPerfil.usuario_id),
      objetivo: this.editBufferPerfil.objetivo || null,
      sexo: this.editBufferPerfil.sexo || null,
      altura: this.editBufferPerfil.altura !== '' ? Number(this.editBufferPerfil.altura) : null,
      estado: this.editBufferPerfil.estado || null
    }).subscribe({
      next: () => {
        this.mostrarNotificacion('success', 'Perfil actualizado', 'Los cambios en el perfil se guardaron correctamente.');
        this.guardandoPerfil = false;
        this.cancelarEdicionPerfil();
        this.cargarPerfiles();
      },
      error: (error) => {
        console.error('Error actualizando perfil:', error);
        const { titulo, mensaje } = this.obtenerMensajeError(error);
        this.mostrarNotificacion('error', titulo, mensaje);
        this.guardandoPerfil = false;
      }
    });
  }

  eliminarPerfil(perfilId: number): void {
    const confirmado = confirm('¿Eliminar este perfil?');
    if (!confirmado) return;
    this.guardandoPerfil = true;
    this.http.delete(`${this.API_URL}/api/perfiles/${perfilId}`).subscribe({
      next: () => {
        this.mostrarNotificacion('success', 'Perfil eliminado', 'El perfil de salud ha sido eliminado del sistema.');
        this.guardandoPerfil = false;
        if (this.editandoPerfilId === perfilId) this.cancelarEdicionPerfil();
        this.cargarPerfiles();
      },
      error: (error) => {
        console.error('Error eliminando perfil:', error);
        const { titulo, mensaje } = this.obtenerMensajeError(error);
        this.mostrarNotificacion('error', titulo, mensaje);
        this.guardandoPerfil = false;
      }
    });
  }

  // -------- ACTIVIDADES ---------
  cargarActividades(): void {
    this.cargandoActividades = true;
    this.http.get<any[]>(`${this.API_URL}/api/actividades`).subscribe({
      next: (rows) => {
        this.actividades = rows;
        this.cargandoActividades = false;
      },
      error: (error) => {
        console.error('Error cargando actividades:', error);
        const { titulo, mensaje } = this.obtenerMensajeError(error);
        this.mostrarNotificacion('error', titulo, mensaje);
        this.cargandoActividades = false;
      }
    });
  }

  crearActividad(): void {
    if (!this.nuevaActividad.usuario_id) {
      this.mostrarNotificacion('warning', 'Campo requerido', 'El ID de usuario es obligatorio para crear una actividad.');
      return;
    }
    this.guardandoActividad = true;
    this.http.post(`${this.API_URL}/api/actividades`, {
      usuario_id: Number(this.nuevaActividad.usuario_id),
      tipo: this.nuevaActividad.tipo || null,
      hora_inicio: this.nuevaActividad.hora_inicio || null,
      hora_fin: this.nuevaActividad.hora_fin || null,
      duracion_segundos: this.nuevaActividad.duracion_segundos ? Number(this.nuevaActividad.duracion_segundos) : null
    }).subscribe({
      next: () => {
        this.mostrarNotificacion('success', 'Actividad creada', 'La actividad física ha sido registrada exitosamente.');
        this.guardandoActividad = false;
        this.nuevaActividad = { usuario_id: '', tipo: '', hora_inicio: '', hora_fin: '', duracion_segundos: '' };
        this.cargarActividades();
      },
      error: (error) => {
        console.error('Error creando actividad:', error);
        const { titulo, mensaje } = this.obtenerMensajeError(error);
        this.mostrarNotificacion('error', titulo, mensaje);
        this.guardandoActividad = false;
      }
    });
  }

  iniciarEdicionActividad(actividad: any): void {
    this.editandoActividadId = actividad.id;
    this.editBufferActividad = {
      usuario_id: actividad.usuario_id,
      tipo: actividad.tipo || '',
      hora_inicio: actividad.hora_inicio ? this.formatDateTime(actividad.hora_inicio) : '',
      hora_fin: actividad.hora_fin ? this.formatDateTime(actividad.hora_fin) : '',
      duracion_segundos: actividad.duracion_segundos ?? ''
    };
  }

  cancelarEdicionActividad(): void {
    this.editandoActividadId = null;
    this.editBufferActividad = {};
  }

  guardarActividad(actividadId: number): void {
    if (this.editandoActividadId !== actividadId) return;
    if (!this.editBufferActividad.usuario_id) {
      this.mostrarNotificacion('warning', 'Campo requerido', 'El ID de usuario es obligatorio para actualizar la actividad.');
      return;
    }
    this.guardandoActividad = true;
    this.http.put(`${this.API_URL}/api/actividades/${actividadId}`, {
      usuario_id: Number(this.editBufferActividad.usuario_id),
      tipo: this.editBufferActividad.tipo || null,
      hora_inicio: this.editBufferActividad.hora_inicio || null,
      hora_fin: this.editBufferActividad.hora_fin || null,
      duracion_segundos: this.editBufferActividad.duracion_segundos !== '' ? Number(this.editBufferActividad.duracion_segundos) : null
    }).subscribe({
      next: () => {
        this.mostrarNotificacion('success', 'Actividad actualizada', 'Los cambios en la actividad se guardaron correctamente.');
        this.guardandoActividad = false;
        this.cancelarEdicionActividad();
        this.cargarActividades();
      },
      error: (error) => {
        console.error('Error actualizando actividad:', error);
        const { titulo, mensaje } = this.obtenerMensajeError(error);
        this.mostrarNotificacion('error', titulo, mensaje);
        this.guardandoActividad = false;
      }
    });
  }

  eliminarActividad(actividadId: number): void {
    const confirmado = confirm('¿Eliminar esta actividad?');
    if (!confirmado) return;
    this.guardandoActividad = true;
    this.http.delete(`${this.API_URL}/api/actividades/${actividadId}`).subscribe({
      next: () => {
        this.mostrarNotificacion('success', 'Actividad eliminada', 'La actividad ha sido eliminada del registro.');
        this.guardandoActividad = false;
        if (this.editandoActividadId === actividadId) this.cancelarEdicionActividad();
        this.cargarActividades();
      },
      error: (error) => {
        console.error('Error eliminando actividad:', error);
        const { titulo, mensaje } = this.obtenerMensajeError(error);
        this.mostrarNotificacion('error', titulo, mensaje);
        this.guardandoActividad = false;
      }
    });
  }

  // -------- DISPOSITIVOS ---------
  cargarDispositivos(): void {
    this.cargandoDispositivos = true;
    this.http.get<any[]>(`${this.API_URL}/api/dispositivos`).subscribe({
      next: (rows) => {
        this.dispositivos = rows;
        this.cargandoDispositivos = false;
      },
      error: (error) => {
        console.error('Error cargando dispositivos:', error);
        const { titulo, mensaje } = this.obtenerMensajeError(error);
        this.mostrarNotificacion('error', titulo, mensaje);
        this.cargandoDispositivos = false;
      }
    });
  }

  crearDispositivo(): void {
    if (!this.nuevoDispositivo.usuario_id || !this.nuevoDispositivo.serial) {
      this.mostrarNotificacion('warning', 'Campos requeridos', 'El ID de usuario y el serial son obligatorios para crear un dispositivo.');
      return;
    }
    this.guardandoDispositivo = true;
    this.http.post(`${this.API_URL}/api/dispositivos`, {
      usuario_id: Number(this.nuevoDispositivo.usuario_id),
      serial: this.nuevoDispositivo.serial,
      marca: this.nuevoDispositivo.marca || null,
      modelo: this.nuevoDispositivo.modelo || null,
      fecha_vinculacion: this.nuevoDispositivo.fecha_vinculacion || null
    }).subscribe({
      next: () => {
        this.mostrarNotificacion('success', 'Dispositivo creado', `El dispositivo ${this.nuevoDispositivo.serial} ha sido vinculado exitosamente.`);
        this.guardandoDispositivo = false;
        this.nuevoDispositivo = { usuario_id: '', serial: '', marca: '', modelo: '', fecha_vinculacion: '' };
        this.cargarDispositivos();
      },
      error: (error) => {
        console.error('Error creando dispositivo:', error);
        const { titulo, mensaje } = this.obtenerMensajeError(error);
        this.mostrarNotificacion('error', titulo, mensaje);
        this.guardandoDispositivo = false;
      }
    });
  }

  iniciarEdicionDispositivo(dispositivo: any): void {
    this.editandoDispositivoId = dispositivo.id;
    this.editBufferDispositivo = {
      usuario_id: dispositivo.usuario_id,
      serial: dispositivo.serial || '',
      marca: dispositivo.marca || '',
      modelo: dispositivo.modelo || '',
      fecha_vinculacion: dispositivo.fecha_vinculacion || ''
    };
  }

  cancelarEdicionDispositivo(): void {
    this.editandoDispositivoId = null;
    this.editBufferDispositivo = {};
  }

  guardarDispositivo(dispositivoId: number): void {
    if (this.editandoDispositivoId !== dispositivoId) return;
    if (!this.editBufferDispositivo.usuario_id || !this.editBufferDispositivo.serial) {
      this.mostrarNotificacion('warning', 'Campos requeridos', 'El ID de usuario y el serial son obligatorios para actualizar el dispositivo.');
      return;
    }
    this.guardandoDispositivo = true;
    this.http.put(`${this.API_URL}/api/dispositivos/${dispositivoId}`, {
      usuario_id: Number(this.editBufferDispositivo.usuario_id),
      serial: this.editBufferDispositivo.serial,
      marca: this.editBufferDispositivo.marca || null,
      modelo: this.editBufferDispositivo.modelo || null,
      fecha_vinculacion: this.editBufferDispositivo.fecha_vinculacion || null
    }).subscribe({
      next: () => {
        this.mostrarNotificacion('success', 'Dispositivo actualizado', 'Los cambios en el dispositivo se guardaron correctamente.');
        this.guardandoDispositivo = false;
        this.cancelarEdicionDispositivo();
        this.cargarDispositivos();
      },
      error: (error) => {
        console.error('Error actualizando dispositivo:', error);
        const { titulo, mensaje } = this.obtenerMensajeError(error);
        this.mostrarNotificacion('error', titulo, mensaje);
        this.guardandoDispositivo = false;
      }
    });
  }

  eliminarDispositivo(dispositivoId: number): void {
    const confirmado = confirm('¿Eliminar este dispositivo?');
    if (!confirmado) return;
    this.guardandoDispositivo = true;
    this.http.delete(`${this.API_URL}/api/dispositivos/${dispositivoId}`).subscribe({
      next: () => {
        this.mostrarNotificacion('success', 'Dispositivo eliminado', 'El dispositivo ha sido desvinculado del sistema.');
        this.guardandoDispositivo = false;
        if (this.editandoDispositivoId === dispositivoId) this.cancelarEdicionDispositivo();
        this.cargarDispositivos();
      },
      error: (error) => {
        console.error('Error eliminando dispositivo:', error);
        const { titulo, mensaje } = this.obtenerMensajeError(error);
        this.mostrarNotificacion('error', titulo, mensaje);
        this.guardandoDispositivo = false;
      }
    });
  }

  // Helper para formatear datetime-local input
  formatDateTime(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // -------- SISTEMA DE NOTIFICACIONES ---------
  mostrarNotificacion(tipo: 'success' | 'error' | 'warning' | 'info', titulo: string, mensaje: string): void {
    const id = ++this.notificacionIdCounter;
    const notif: Notificacion = { id, tipo, titulo, mensaje };
    this.notificaciones.push(notif);
    
    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
      this.cerrarNotificacion(id);
    }, 5000);
  }

  cerrarNotificacion(id: number): void {
    const notif = this.notificaciones.find(n => n.id === id);
    if (notif) {
      notif.closing = true;
      setTimeout(() => {
        this.notificaciones = this.notificaciones.filter(n => n.id !== id);
      }, 300);
    }
  }

  // Helper para parsear errores del backend
  private obtenerMensajeError(error: any): { titulo: string, mensaje: string } {
    let titulo = 'Error en la operación';
    let mensaje = 'Ocurrió un error inesperado.';

    if (error.status === 0) {
      titulo = 'Error de conexión';
      mensaje = 'No se puede conectar con el servidor. Verifica que el backend esté ejecutándose en el puerto 4000.';
    } else if (error.status === 400) {
      titulo = 'Datos inválidos';
      mensaje = error.error?.message || 'Los datos enviados no son válidos. Revisa los campos del formulario.';
    } else if (error.status === 404) {
      titulo = 'No encontrado';
      mensaje = error.error?.message || 'El recurso solicitado no existe.';
    } else if (error.status === 409) {
      titulo = 'Conflicto';
      mensaje = error.error?.message || 'Ya existe un registro con esos datos. Revisa campos únicos como email o serial.';
    } else if (error.status === 500) {
      titulo = 'Error del servidor';
      mensaje = 'El servidor encontró un error al procesar la solicitud. Contacta al administrador.';
    } else if (error.error?.message) {
      mensaje = error.error.message;
    } else if (error.message) {
      mensaje = error.message;
    }

    return { titulo, mensaje };
  }

  // -------- REPORTES ---------
  generarReportePDF(): void {
    this.generandoReporte = true;
    this.http.get(`${this.API_URL}/api/reportes/generar`, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        this.generandoReporte = false;
        this.mostrarNotificacion('success', 'Reporte Generado', 'El PDF se ha descargado exitosamente.');
        
        // Crear un enlace para descargar el archivo
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte_vitaltrack.pdf';
        document.body.appendChild(a);
        a.click();
        
        // Limpiar
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (error) => {
        this.generandoReporte = false;
        console.error('Error generando el reporte:', error);
        const { titulo, mensaje } = this.obtenerMensajeError(error);
        this.mostrarNotificacion('error', titulo, 'No se pudo generar el reporte PDF. ' + mensaje);
      }
    });
  }
}
