import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'vt-home',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="home">
      <div class="tabs">
        <a class="tab" routerLink="/home/usuarios" routerLinkActive="active">Usuarios</a>
        <a class="tab" routerLink="/home/perfiles" routerLinkActive="active">Perfiles</a>
        <a class="tab" routerLink="/home/dispositivos" routerLinkActive="active">Dispositivos</a>
        <a class="tab" routerLink="/home/actividades" routerLinkActive="active">Actividades</a>
      </div>
      <section class="tab-content">
        <router-outlet />
      </section>
    </div>
  `,
  styles: [`
    .tabs{ display:flex; gap:.5rem; border-bottom:1px solid var(--gray-200); margin-bottom:1rem; }
    .tab{ padding:.5rem .75rem; border-radius:.5rem .5rem 0 0; text-decoration:none; color:inherit; }
    .tab.active{ background: var(--primary-50); color: var(--primary-800); border: 1px solid var(--primary-100); border-bottom: none; }
    .tab-content{ padding:.5rem 0; }
  `]
})
export class HomeComponent {}
