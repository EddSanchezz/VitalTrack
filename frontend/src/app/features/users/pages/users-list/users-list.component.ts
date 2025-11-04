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
import { UsersService} from '../../user.service';
import { User } from '../../models/user.model';


@Component({
  selector: 'app-user-list',
  standalone:false,
  templateUrl: './users-list.component.html',
})
export class UsersListComponent implements OnInit {
  users: User[] = [];

  constructor(private UsersService: UsersService) {}

  ngOnInit() {
    this.UsersService.getUsers().subscribe(data => {
      this.users = data;
    });
  }
}

