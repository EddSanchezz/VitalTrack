import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from './toast.service';

@Component({
  selector: 'vt-toasts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="vt-toasts">
      <div class="toast" *ngFor="let t of list" [class.info]="t.level==='info'" [class.success]="t.level==='success'" [class.warning]="t.level==='warning'" [class.error]="t.level==='error'">
        <span class="dot"></span>
        <span class="msg">{{t.message}}</span>
        <button class="close" (click)="dismiss(t.id)">×</button>
      </div>
    </div>
  `,
  styles: [`
    .vt-toasts { position: fixed; top: 12px; right: 12px; display: flex; flex-direction: column; gap: 8px; z-index: 9999; }
    .toast { display:flex; align-items:center; gap:.5rem; padding:.5rem .75rem; border-radius:.5rem; background:#222; color:#fff; box-shadow: 0 2px 8px rgba(0,0,0,.2); }
    .toast .dot { display:inline-block; width:10px; height:10px; border-radius:50%; background:#888; }
    .toast.info .dot { background:#60a5fa; }
    .toast.success .dot { background:#34d399; }
    .toast.warning .dot { background:#f59e0b; }
    .toast.error .dot { background:#ef4444; }
    .toast .close { background:transparent; border:none; color:#fff; font-size:16px; cursor:pointer; }
  `]
})
export class ToastContainerComponent {
  list: Toast[] = [];
  constructor(private toasts: ToastService){
    effect(() => {
      this.list = this.toasts.toasts();
    });
  }
  dismiss(id: number){ this.toasts.dismiss(id); }
}
