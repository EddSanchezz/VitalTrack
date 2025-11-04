import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DispositivosService } from '../services/dispositivos.service';
import { Dispositivo } from '../models/dispositivo.model';

@Component({
  selector: 'app-dispositivos-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Dispositivos</h2>
      <p>Dispositivos vinculados a usuarios</p>

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
              <th>Serial</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Fecha Vinculación</th>
            </tr>
          </thead>
          <tbody>
            @for (disp of dispositivos(); track disp.id) {
              <tr>
                <td>{{ disp.id }}</td>
                <td>{{ disp.usuario_id }}</td>
                <td>{{ disp.serial }}</td>
                <td>{{ disp.marca || '-' }}</td>
                <td>{{ disp.modelo || '-' }}</td>
                <td>{{ disp.fecha_vinculacion || '-' }}</td>
              </tr>
            } @empty {
              <tr><td colspan="6">No hay dispositivos</td></tr>
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
export class DispositivosListComponent {
  private service = inject(DispositivosService);

  dispositivos = signal<Dispositivo[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    this.service.getAll().subscribe({
      next: (data) => {
        this.dispositivos.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Error al cargar dispositivos');
        this.loading.set(false);
      }
    });
  }
}
