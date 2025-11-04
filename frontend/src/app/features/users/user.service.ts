/* // src/app/features/users/users.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './models/user.model';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private base = 'http://localhost:3000/api/users'; // ajusta URL según backend

  constructor(private http: HttpClient) {}

  list(params?: any): Observable<User[]> {
    return this.http.get<User[]>(this.base);
  }

  get(id: string): Observable<User> {
    return this.http.get<User>(`${this.base}/${id}`);
  }

private mockUsers: User[] = [
  { id: "1", name: 'Juan Pérez', email: 'juan@correo.com' },
  { id: "2", name: 'María Gómez', email: 'maria@correo.com' },
  { id: "3", name: 'Carlos López', email: 'carlos@correo.com' }
];
  getUsers(): Observable<User[]> {
  return of(this.mockUsers);
}

  create(payload: Partial<User>): Observable<User> {
    return this.http.post<User>(this.base, payload);
  }

  update(id: string, payload: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.base}/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
this version is 1.0 of the changes
*/
//1.1
// src/app/features/users/users.service.ts
/////////////////////////////////////////////////////
/* import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private base = 'http://localhost:3000/api/users'; // URL del backend
  private useMock = true; // 👈 cambia esto a false cuando ya tengas backend

  private mockUsers: User[] = [
    { id: '1', name: 'Juan Pérez', email: 'juan@correo.com' },
    { id: '2', name: 'María Gómez', email: 'maria@correo.com' },
    { id: '3', name: 'Carlos López', email: 'carlos@correo.com' }
  ];

  constructor(private http: HttpClient) {}

  /* Listar usuarios
  list(): Observable<User[]> {
    if (this.useMock) {
      console.log('🧩 Usando datos simulados');
      return of(this.mockUsers);
    }
    return this.http.get<User[]>(this.base);
  }

  /** Obtener un usuario
  get(id: string): Observable<User> {
    if (this.useMock) {
      const found = this.mockUsers.find(u => u.id === id);
      return of(found as User);
    }
    return this.http.get<User>(`${this.base}/${id}`);
  }

  getUsers(): Observable<User[]> {
  return of(this.mockUsers);
}

  /** Crear usuario
  create(payload: Partial<User>): Observable<User> {
    if (this.useMock) {
      const newUser: User = { id: Date.now().toString(), ...payload } as User;
      this.mockUsers.push(newUser);
      return of(newUser);
    }
    return this.http.post<User>(this.base, payload);
  }

  /** Actualizar usuario
  update(id: string, payload: Partial<User>): Observable<User> {
    if (this.useMock) {
      const index = this.mockUsers.findIndex(u => u.id === id);
      if (index > -1) {
        this.mockUsers[index] = { ...this.mockUsers[index], ...payload };
      }
      return of(this.mockUsers[index]);
    }
    return this.http.put<User>(`${this.base}/${id}`, payload);
  }

  /** Eliminar usuario
  remove(id: string): Observable<void> {
    if (this.useMock) {
      this.mockUsers = this.mockUsers.filter(u => u.id !== id);
      return of(void 0);
    }
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
 */
//v 1.2 sin backend
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './models/user.model';


// Definimos una interfaz para los usuarios


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private base = '/api/usuarios';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.base);
  }

  get(id: number): Observable<User> {
    return this.http.get<User>(`${this.base}/${id}`);
  }

  create(newUser: Partial<User & { cedula?: string; consentimiento_privacidad?: boolean }>): Observable<User> {
    return this.http.post<User>(this.base, newUser);
  }

  update(id: number, updated: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.base}/${id}`, updated);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
