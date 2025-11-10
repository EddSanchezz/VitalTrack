import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
        <p>Administra los perfiles de salud de los usuarios.</p>
        <p>Información de altura, peso, tipo de sangre, condiciones médicas y más.</p>
      </div>

      <div class="panel" *ngIf="activeTab === 'actividades'">
        <h2>Registro de Actividades</h2>
        <p>Visualiza y gestiona las actividades físicas registradas.</p>
        <p>Pasos, distancia, calorías, duración y más métricas de actividad.</p>
      </div>

      <div class="panel" *ngIf="activeTab === 'dispositivos'">
        <h2>Dispositivos Conectados</h2>
        <p>Administra los dispositivos wearables vinculados al sistema.</p>
        <p>Smartwatches, pulseras de actividad y otros dispositivos IoT.</p>
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
  editandoId: number | null = null;
  editBuffer: any = {};
  guardando: boolean = false;

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
        this.mensaje = '❌ Error cargando usuarios: ' + (error.error?.message || error.message);
        this.mensajeError = true;
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
        this.mensaje = '✅ Usuario creado exitosamente';
        this.mensajeError = false;
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
        this.mensaje = '❌ Error al crear usuario: ' + (error.error?.message || error.message);
        this.mensajeError = true;
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
      this.mensaje = '❌ Nombre y Email son obligatorios';
      this.mensajeError = true;
      return;
    }
    const emailPattern = /.+@.+\..+/;
    if (!emailPattern.test(this.editBuffer.email)) {
      this.mensaje = '❌ Formato de email inválido';
      this.mensajeError = true;
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
        this.mensaje = '✅ Usuario actualizado';
        this.mensajeError = false;
        this.guardando = false;
        this.editandoId = null;
        this.editBuffer = {};
        this.cargarUsuarios();
      },
      error: (error) => {
        console.error('Error actualizando usuario:', error);
        this.mensaje = '❌ Error al actualizar: ' + (error.error?.message || error.message);
        this.mensajeError = true;
        this.guardando = false;
      }
    });
  }

  eliminarUsuario(id: number): void {
    const confirmado = confirm('¿Seguro que deseas eliminar este usuario? Esta acción no se puede deshacer.');
    if (!confirmado) return;
    this.guardando = true;
    this.mensaje = '';
    this.mensajeError = false;
    this.http.delete(`${this.API_URL}/api/usuarios/${id}`).subscribe({
      next: () => {
        this.mensaje = '✅ Usuario eliminado';
        this.guardando = false;
        // Si se estaba editando esta fila, cancelar
        if (this.editandoId === id) this.cancelarEdicion();
        // Refrescar lista
        this.cargarUsuarios();
      },
      error: (error) => {
        console.error('Error eliminando usuario:', error);
        this.mensaje = '❌ Error al eliminar: ' + (error.error?.message || error.message);
        this.mensajeError = true;
        this.guardando = false;
      }
    });
  }
}
