/* import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../user.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'vt-users-list',
  standalone:false,
  templateUrl: './users-list.component.html'
})
export class UsersListComponent implements OnInit {
  users: User[] = [];

  constructor(private svc: UsersService, private router: Router) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.svc.list().subscribe((r: User[]) => (this.users = r));
  }

  create() {
    this.router.navigate(['/users/create']);
  }

  edit(id: string) {
    this.router.navigate(['/users', id]);
  }

  remove(id: string) {
    if (confirm('Eliminar usuario?')) {
      this.svc.remove(id).subscribe(() => this.load());
    }
  }
} */
import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../user.service';
import { User } from '../../models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './users-list.component.html',
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  form: any = { id: null, nombre: '', email: '', cedula: '', consentimiento_privacidad: true };

  constructor(private usersSvc: UsersService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.usersSvc.getUsers().subscribe((data) => (this.users = data));
  }

  edit(u: User) {
    this.form = {
      id: u.id,
      nombre: u.nombre,
      email: u.email,
      cedula: u.cedula ?? '',
      consentimiento_privacidad: u.consentimiento_privacidad ?? true
    };
  }

  reset() {
    this.form = { id: null, nombre: '', email: '', cedula: '', consentimiento_privacidad: true };
  }

  save() {
    const payload: any = {
      nombre: this.form.nombre,
      email: this.form.email,
      cedula: this.form.cedula || null,
      consentimiento_privacidad: !!this.form.consentimiento_privacidad,
    };

    if (this.form.id) {
      this.usersSvc.update(this.form.id, payload).subscribe(() => {
        this.reset();
        this.load();
      });
    } else {
      this.usersSvc.create(payload).subscribe(() => {
        this.reset();
        this.load();
      });
    }
  }

  remove(u: User) {
    if (!confirm('Eliminar usuario?')) return;
    this.usersSvc.delete(u.id).subscribe(() => this.load());
  }
}

