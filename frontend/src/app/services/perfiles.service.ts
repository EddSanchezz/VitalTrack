import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Perfil } from '../models/perfil.model';

@Injectable({
  providedIn: 'root'
})
export class PerfilesService {
  private http = inject(HttpClient);
  private baseUrl = '/api/perfiles';

  getAll(): Observable<Perfil[]> {
    return this.http.get<Perfil[]>(this.baseUrl);
  }

  getById(id: number): Observable<Perfil> {
    return this.http.get<Perfil>(`${this.baseUrl}/${id}`);
  }

  create(perfil: Partial<Perfil>): Observable<Perfil> {
    return this.http.post<Perfil>(this.baseUrl, perfil);
  }

  update(id: number, perfil: Partial<Perfil>): Observable<Perfil> {
    return this.http.put<Perfil>(`${this.baseUrl}/${id}`, perfil);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
