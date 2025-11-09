/* import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersListComponent } from './pages/users-list/users-list.component';
import { UsersEditComponent } from './pages/users-edit/users-edit.component';
import { UserCreate } from './pages/user-create/user-create';
import { UserDelete } from './pages/user-delete/user-delete';

const routes: Routes = [
  { path: '', component: UsersListComponent },
  { path: 'create', component: UserCreate },
  { path: 'edit/:id', component: UsersEditComponent },
  { path: 'delete/:id', component: UserDelete }


];

@NgModule({
  declarations: [UsersListComponent, UsersEditComponent, UserCreate, UserDelete],
  imports: [HttpClientModule, CommonModule, ReactiveFormsModule, RouterModule.forChild(routes)]
})
export class UsersModule {} */

//v 1.1
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UsersListComponent } from './pages/users-list/users-list.component';
import { UsersEditComponent } from './pages/users-edit/users-edit.component';
import { UserCreate } from './pages/user-create/user-create';
import { UserDelete } from './pages/user-delete/user-delete';

const routes: Routes = [
  { path: '', component: UsersListComponent },
  { path: 'create', component: UserCreate },
  { path: 'edit/:id', component: UsersEditComponent },
  { path: 'delete/:id', component: UserDelete }
];

@NgModule({
  declarations: [
    UsersListComponent,
    UsersEditComponent,
    UserCreate,
    UserDelete
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class UsersModule {}
