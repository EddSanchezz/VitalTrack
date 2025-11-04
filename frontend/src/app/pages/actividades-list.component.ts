import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActividadesService } from '../services/actividades.service';
import { Actividad } from '../models/actividad.model';

@Component({
  selector: 'app-actividades-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Actividades</h2>
      <p>Registro de actividades de los usuarios</p>

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
              <th>Tipo</th>
              <th>Hora Inicio</th>
              <th>Hora Fin</th>
              <th>Duración (seg)</th>
            </tr>
          </thead>
          <tbody>
            @for (act of actividades(); track act.id) {
              <tr>
                <td>{{ act.id }}</td>
                <td>{{ act.usuario_id }}</td>
                <td>{{ act.tipo || '-' }}</td>
                <td>{{ act.hora_inicio ? (act.hora_inicio | date:'short') : '-' }}</td>
                <td>{{ act.hora_fin ? (act.hora_fin | date:'short') : '-' }}</td>
                <td>{{ act.duracion_segundos || '-' }}</td>
              </tr>
            } @empty {
              <tr><td colspan="6">No hay actividades</td></tr>
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
export class ActividadesListComponent {
  private service = inject(ActividadesService);

  actividades = signal<Actividad[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    this.service.getAll().subscribe({
      next: (data) => {
        this.actividades.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Error al cargar actividades');
        this.loading.set(false);
      }
    });
  }
}
