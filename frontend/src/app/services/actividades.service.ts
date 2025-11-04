import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Actividad {
	id?: number;
	usuario_id: number;
	tipo?: string | null;
	hora_inicio?: string | null; // ISO datetime
	hora_fin?: string | null;    // ISO datetime
	duracion_segundos?: number | null;
}

@Injectable({ providedIn: 'root' })
export class ActividadesService {
	private base = '/api/actividades';
	constructor(private http: HttpClient) {}

	list(usuario_id?: number): Observable<Actividad[]> {
		const url = usuario_id ? `${this.base}?usuario_id=${usuario_id}` : this.base;
		return this.http.get<Actividad[]>(url);
	}
	get(id: number): Observable<Actividad> { return this.http.get<Actividad>(`${this.base}/${id}`); }
	create(payload: Partial<Actividad>): Observable<Actividad> { return this.http.post<Actividad>(this.base, payload); }
	update(id: number, payload: Partial<Actividad>): Observable<Actividad> { return this.http.put<Actividad>(`${this.base}/${id}`, payload); }
	remove(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/${id}`); }
}

