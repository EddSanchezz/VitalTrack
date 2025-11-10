import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
  loadComponent: () => import('./pages/home.component').then(m => m.HomeComponent),
    children: [
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
      { path: 'usuarios', loadChildren: () => import('./features/users/users-module').then(m => m.UsersModule) },
      { path: 'perfiles', loadComponent: () => import('./pages/perfiles-list.component').then(m => m.default) },
      { path: 'dispositivos', loadComponent: () => import('./pages/dispositivos-list.component').then(m => m.default) },
      { path: 'actividades', loadComponent: () => import('./pages/actividades-list.component').then(m => m.default) }
    ]
  },
  { path: '**', redirectTo: '/home' }
];
