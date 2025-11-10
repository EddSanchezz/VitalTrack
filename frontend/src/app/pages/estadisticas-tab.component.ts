import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstadisticasService, EstadisticasResumen, EstadisticasUsuario } from '../services/estadisticas.service';

@Component({
  selector: 'vt-estadisticas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fade-in">
      <div class="flex justify-between items-center mb-4">
        <h1>📊 Estadísticas</h1>
        <div class="flex items-center gap-2">
          <input class="form-input" type="number" [(ngModel)]="usuarioId" placeholder="Usuario ID" />
          <button class="btn btn-secondary" (click)="loadUsuario()">Ver Usuario</button>
        </div>
      </div>

      <div class="grid" style="grid-template-columns: repeat(4, minmax(0,1fr)); gap: 1rem;">
        <div class="card center"><div class="muted">Usuarios</div><div class="kpi">{{resumen?.totals?.usuarios ?? '-'}} </div></div>
        <div class="card center"><div class="muted">Perfiles</div><div class="kpi">{{resumen?.totals?.perfiles ?? '-'}} </div></div>
        <div class="card center"><div class="muted">Dispositivos</div><div class="kpi">{{resumen?.totals?.dispositivos ?? '-'}} </div></div>
        <div class="card center"><div class="muted">Actividades</div><div class="kpi">{{resumen?.totals?.actividades ?? '-'}} </div></div>
      </div>

      <div class="grid" style="grid-template-columns: repeat(2, minmax(0,1fr)); gap: 1rem; margin-top: 1rem;">
        <div class="card">
          <h3>Actividades por Tipo</h3>
          <table class="table">
            <thead><tr><th>Tipo</th><th>Total</th></tr></thead>
            <tbody>
              <tr *ngFor="let t of resumen?.actividadesPorTipo">
                <td>{{t.tipo || '(sin tipo)'}} </td>
                <td>{{t.total}}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="card">
          <h3>Top Dispositivos por Usuario</h3>
          <table class="table">
            <thead><tr><th>Usuario</th><th>Dispositivos</th></tr></thead>
            <tbody>
              <tr *ngFor="let r of resumen?.dispositivosPorUsuario">
                <td>#{{r.usuario_id}}</td>
                <td>{{r.total}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="grid" style="grid-template-columns: repeat(2, minmax(0,1fr)); gap: 1rem; margin-top: 1rem;">
        <div class="card">
          <h3>Promedio de duración de actividad</h3>
          <p style="font-size:1.1rem">{{svc.formatDuration(resumen?.promedioDuracionSegundos || 0)}}</p>
        </div>

        <div class="card">
          <h3>Últimas Actividades</h3>
          <table class="table">
            <thead><tr><th>ID</th><th>Usuario</th><th>Tipo</th><th>Inicio</th><th>Duración</th></tr></thead>
            <tbody>
              <tr *ngFor="let a of resumen?.recientes">
                <td>#{{a.id}}</td>
                <td>#{{a.usuario_id}}</td>
                <td>{{a.tipo}}</td>
                <td>{{a.hora_inicio ? (a.hora_inicio | date:'short') : '-'}} </td>
                <td>{{svc.formatDuration(a.duracion_segundos)}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card" *ngIf="detalle">
        <h3>Usuario #{{detalle?.usuario_id}} – Resumen</h3>
        <div class="grid" style="grid-template-columns: repeat(3, minmax(0,1fr)); gap: 1rem;">
          <div class="center"><div class="muted">Dispositivos</div><div class="kpi">{{detalle?.dispositivos}}</div></div>
          <div class="center"><div class="muted">Actividades</div><div class="kpi">{{detalle?.actividades}}</div></div>
          <div class="center"><div class="muted">Duración Total</div><div class="kpi">{{svc.formatDuration(detalle?.duracionTotalSegundos)}}</div></div>
        </div>
        <h4 style="margin-top:1rem">Actividades por tipo</h4>
        <table class="table">
          <thead><tr><th>Tipo</th><th>Total</th></tr></thead>
          <tbody>
            <tr *ngFor="let t of detalle?.actividadesPorTipo">
              <td>{{t.tipo || '(sin tipo)'}} </td>
              <td>{{t.total}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .center{ display:flex; flex-direction:column; align-items:center; }
    .kpi{ font-size:1.6rem; font-weight:600; }
    .muted{ color: var(--gray-500); }
  `]
})
export default class EstadisticasTabComponent implements OnInit {
  resumen?: EstadisticasResumen;
  detalle?: EstadisticasUsuario;
  usuarioId: number | null = null;
  constructor(public svc: EstadisticasService) {}
  ngOnInit(){ this.loadResumen(); }
  loadResumen(){ this.svc.resumen().subscribe(r => this.resumen = r); }
  loadUsuario(){ if (this.usuarioId) this.svc.usuario(this.usuarioId).subscribe(d => this.detalle = d); }
}
