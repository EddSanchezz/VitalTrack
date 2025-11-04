import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Dispositivo {
	id?: number;
	usuario_id: number;
	serial: string;
	marca?: string | null;
	modelo?: string | null;
	fecha_vinculacion?: string | null; // YYYY-MM-DD
}

@Injectable({ providedIn: 'root' })
export class DispositivosService {
	private base = '/api/dispositivos';
	constructor(private http: HttpClient) {}

	list(): Observable<Dispositivo[]> { return this.http.get<Dispositivo[]>(this.base); }
	get(id: number): Observable<Dispositivo> { return this.http.get<Dispositivo>(`${this.base}/${id}`); }
	create(payload: Partial<Dispositivo>): Observable<Dispositivo> { return this.http.post<Dispositivo>(this.base, payload); }
	update(id: number, payload: Partial<Dispositivo>): Observable<Dispositivo> { return this.http.put<Dispositivo>(`${this.base}/${id}`, payload); }
	remove(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/${id}`); }
}

