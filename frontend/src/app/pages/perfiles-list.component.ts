import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilesService } from '../services/perfiles.service';
import { Perfil } from '../models/perfil.model';

@Component({
  selector: 'app-perfiles-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Perfiles</h2>
      <p>Gestión de perfiles de usuarios</p>

      @if (loading()) {
        <p>Cargando...</p>
      } @else if (error()) {
        <div class="error">Error: {{ error() }}</div>
      } @else {
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario ID</th>
              <th>Objetivo</th>
              <th>Sexo</th>
              <th>Altura (cm)</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            @for (perfil of perfiles(); track perfil.id) {
              <tr>
                <td>{{ perfil.id }}</td>
                <td>{{ perfil.usuario_id }}</td>
                <td>{{ perfil.objetivo }}</td>
                <td>{{ perfil.sexo }}</td>
                <td>{{ perfil.altura }}</td>
                <td>{{ perfil.estado }}</td>
              </tr>
            } @empty {
              <tr><td colspan="6">No hay perfiles</td></tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; }
    h2 { margin-top: 0; color: #333; }
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f5f5f5; font-weight: 600; }
    .error { padding: 1rem; background: #fee; color: #c00; border-radius: 4px; }
  `]
})
export class PerfilesListComponent {
  private service = inject(PerfilesService);

  perfiles = signal<Perfil[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    this.service.getAll().subscribe({
      next: (data) => {
        this.perfiles.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Error al cargar perfiles');
        this.loading.set(false);
      }
    });
  }
}
