import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EstadisticasResumen {
  totals: { usuarios: number; perfiles: number; dispositivos: number; actividades: number };
  actividadesPorTipo: { tipo: string; total: number }[];
  promedioDuracionSegundos: number | null;
  dispositivosPorUsuario: { usuario_id: number; total: number }[];
  recientes: any[]; // reuse Actividad shape
}

export interface EstadisticasUsuario {
  usuario_id: number;
  dispositivos: number;
  actividades: number;
  duracionTotalSegundos: number;
  actividadesPorTipo: { tipo: string; total: number }[];
}

@Injectable({ providedIn: 'root' })
export class EstadisticasService {
  private base = '/api/estadisticas';
  constructor(private http: HttpClient) {}
  resumen(): Observable<EstadisticasResumen> { return this.http.get<EstadisticasResumen>(this.base); }
  usuario(id: number): Observable<EstadisticasUsuario> { return this.http.get<EstadisticasUsuario>(`${this.base}/usuario/${id}`); }
  formatDuration(seconds: number | null | undefined): string {
    if (!seconds || seconds <= 0) return '-';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h) return `${h}h ${m}m`;
    if (m) return `${m}m`;
    return `${seconds}s`;
  }
}
