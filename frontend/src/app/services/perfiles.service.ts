import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Perfil {
	id?: number;
	usuario_id: number;
	objetivo?: string | null;
	sexo?: 'M' | 'F' | 'O' | null;
	altura?: number | null;
	estado?: string | null;
}

@Injectable({ providedIn: 'root' })
export class PerfilesService {
	private base = '/api/perfiles';
	constructor(private http: HttpClient) {}

	list(): Observable<Perfil[]> { return this.http.get<Perfil[]>(this.base); }
	get(id: number): Observable<Perfil> { return this.http.get<Perfil>(`${this.base}/${id}`); }
	create(payload: Partial<Perfil>): Observable<Perfil> { return this.http.post<Perfil>(this.base, payload); }
	update(id: number, payload: Partial<Perfil>): Observable<Perfil> { return this.http.put<Perfil>(`${this.base}/${id}`, payload); }
	remove(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/${id}`); }
}

