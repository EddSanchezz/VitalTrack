import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ToastContainerComponent } from './core/toast-container.component';
import { HealthIndicatorComponent } from './core/health-indicator.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, ToastContainerComponent, HealthIndicatorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
