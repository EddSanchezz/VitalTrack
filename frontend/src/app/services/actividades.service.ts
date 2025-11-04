import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Actividad } from '../models/actividad.model';

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {
  private http = inject(HttpClient);
  private baseUrl = '/api/actividades';

  getAll(usuario_id?: number): Observable<Actividad[]> {
    const url = usuario_id ? `${this.baseUrl}?usuario_id=${usuario_id}` : this.baseUrl;
    return this.http.get<Actividad[]>(url);
  }

  getById(id: number): Observable<Actividad> {
    return this.http.get<Actividad>(`${this.baseUrl}/${id}`);
  }

  create(actividad: Partial<Actividad>): Observable<Actividad> {
    return this.http.post<Actividad>(this.baseUrl, actividad);
  }

  update(id: number, actividad: Partial<Actividad>): Observable<Actividad> {
    return this.http.put<Actividad>(`${this.baseUrl}/${id}`, actividad);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
