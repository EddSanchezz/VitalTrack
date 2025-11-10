import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>VitalTrack - Sistema de Gestión</h1>
      
      <div class="tabs">
        <button 
          class="tab" 
          [class.active]="activeTab === 'usuarios'"
          (click)="selectTab('usuarios')">
          Usuarios
        </button>
        <button 
          class="tab" 
          [class.active]="activeTab === 'perfiles'"
          (click)="selectTab('perfiles')">
          Perfiles
        </button>
        <button 
          class="tab" 
          [class.active]="activeTab === 'actividades'"
          (click)="selectTab('actividades')">
          Actividades
        </button>
        <button 
          class="tab" 
          [class.active]="activeTab === 'dispositivos'"
          (click)="selectTab('dispositivos')">
          Dispositivos
        </button>
      </div>

      <div class="panel" *ngIf="activeTab === 'usuarios'">
        <h2>Gestión de Usuarios</h2>
        <p>Aquí podrás gestionar todos los usuarios del sistema VitalTrack.</p>
        <p>Funcionalidades disponibles: crear, editar, eliminar y visualizar usuarios.</p>
      </div>

      <div class="panel" *ngIf="activeTab === 'perfiles'">
        <h2>Gestión de Perfiles</h2>
        <p>Administra los perfiles de salud de los usuarios.</p>
        <p>Información de altura, peso, tipo de sangre, condiciones médicas y más.</p>
      </div>

      <div class="panel" *ngIf="activeTab === 'actividades'">
        <h2>Registro de Actividades</h2>
        <p>Visualiza y gestiona las actividades físicas registradas.</p>
        <p>Pasos, distancia, calorías, duración y más métricas de actividad.</p>
      </div>

      <div class="panel" *ngIf="activeTab === 'dispositivos'">
        <h2>Dispositivos Conectados</h2>
        <p>Administra los dispositivos wearables vinculados al sistema.</p>
        <p>Smartwatches, pulseras de actividad y otros dispositivos IoT.</p>
      </div>
    </div>
  `,
  styles: []
})
export class AppComponent {
  activeTab: string = 'usuarios';

  selectTab(tab: string): void {
    this.activeTab = tab;
  }
}
