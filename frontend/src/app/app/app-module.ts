import { Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';


export const routes: Routes = [
  { path: '', loadChildren: () => import('../features/users/users-module').then(m => m.UsersModule) },
  { path: '**', redirectTo: '' }
];