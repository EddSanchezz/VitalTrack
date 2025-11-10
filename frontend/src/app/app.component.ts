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
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let usuario of usuarios">
                  <td>{{ usuario.id }}</td>
                  <td>{{ usuario.cedula }}</td>
                  <td>{{ usuario.nombre }}</td>
                  <td>{{ usuario.email }}</td>
                  <td>{{ usuario.fecha_nacimiento }}</td>
                  <td>{{ formatearFecha(usuario.fecha_registro) }}</td>
                  <td>
                    <span class="badge" [class.badge-success]="usuario.consentimiento_privacidad === 1" [class.badge-warning]="usuario.consentimiento_privacidad !== 1">
                      {{ usuario.consentimiento_privacidad === 1 ? '✓' : '✗' }}
                    </span>
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
}
