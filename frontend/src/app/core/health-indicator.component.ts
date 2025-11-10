import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthService } from './health.service';

@Component({
  selector: 'vt-health-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="health" [title]="label()">
      <span class="dot" [class.up]="state()==='up'" [class.down]="state()==='down'" [class.unknown]="state()==='unknown'"></span>
      <span class="text">API: {{ label() }}</span>
    </span>
  `,
  styles: [`
    .health { display:inline-flex; align-items:center; gap:.4rem; margin-left:.75rem; font-size:.85rem; color:#e5e7eb; }
    .dot { width:10px; height:10px; border-radius:50%; background:#9ca3af; box-shadow:0 0 0 2px rgba(255,255,255,.1) inset; }
    .dot.up { background:#34d399; }
    .dot.down { background:#ef4444; }
    .dot.unknown { background:#9ca3af; }
    .text { opacity:.9; }
  `]
})
export class HealthIndicatorComponent {
  private health = inject(HealthService);
  state = this.health.state;
  label = computed(() => this.state()==='up' ? 'ok' : this.state()==='down' ? 'down' : '…');
}
