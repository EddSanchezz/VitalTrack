/* import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/users'; // URL temporal, luego conectaremos con backend

  constructor(private http: HttpClient) { }

  // Crear usuario
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // Obtener todos los usuarios
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Obtener un usuario por ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Actualizar usuario
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // Eliminar usuario
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
 */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // 🔹 Simulamos una lista local de usuarios
  private mockUsers: User[] = [
    { id: 1, name: 'Santiago Arrubla', email: 'santiago@vitaltrack.com', role: 'Admin' },
    { id: 2, name: 'Ana López', email: 'ana@vitaltrack.com', role: 'Editor' },
    { id: 3, name: 'Carlos Torres', email: 'carlos@vitaltrack.com', role: 'Viewer' }
  ];

  constructor() {}

  getUsers(): Observable<User[]> {
    return of(this.mockUsers);
  }

  getUserById(id: number): Observable<User | undefined> {
    return of(this.mockUsers.find(u => u.id === id));
  }

  addUser(user: User): Observable<User> {
    user.id = this.mockUsers.length + 1;
    this.mockUsers.push(user);
    return of(user);
  }

  updateUser(updated: User): Observable<User> {
    const index = this.mockUsers.findIndex(u => u.id === updated.id);
    if (index !== -1) {
      this.mockUsers[index] = updated;
    }
    return of(updated);
  }

  deleteUser(id: number): Observable<boolean> {
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      this.mockUsers.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}