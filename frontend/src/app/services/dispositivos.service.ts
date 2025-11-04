import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dispositivo } from '../models/dispositivo.model';

@Injectable({
  providedIn: 'root'
})
export class DispositivosService {
  private http = inject(HttpClient);
  private baseUrl = '/api/dispositivos';

  getAll(): Observable<Dispositivo[]> {
    return this.http.get<Dispositivo[]>(this.baseUrl);
  }

  getById(id: number): Observable<Dispositivo> {
    return this.http.get<Dispositivo>(`${this.baseUrl}/${id}`);
  }

  create(dispositivo: Partial<Dispositivo>): Observable<Dispositivo> {
    return this.http.post<Dispositivo>(this.baseUrl, dispositivo);
  }

  update(id: number, dispositivo: Partial<Dispositivo>): Observable<Dispositivo> {
    return this.http.put<Dispositivo>(`${this.baseUrl}/${id}`, dispositivo);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
