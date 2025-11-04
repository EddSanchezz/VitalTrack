import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/usuarios', pathMatch: 'full' },
  { path: 'usuarios', loadChildren: () => import('./features/users/users-module').then(m => m.UsersModule) },
  { path: 'perfiles', loadComponent: () => import('./pages/perfiles-list.component').then(m => m.PerfilesListComponent) },
  { path: 'dispositivos', loadComponent: () => import('./pages/dispositivos-list.component').then(m => m.DispositivosListComponent) },
  { path: 'actividades', loadComponent: () => import('./pages/actividades-list.component').then(m => m.ActividadesListComponent) },
  { path: '**', redirectTo: '/usuarios' }
];
