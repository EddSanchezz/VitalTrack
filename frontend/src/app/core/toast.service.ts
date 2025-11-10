import { Injectable, signal } from '@angular/core';

export type ToastLevel = 'info' | 'success' | 'warning' | 'error';
export interface Toast {
  id: number;
  level: ToastLevel;
  message: string;
  createdAt: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = signal<Toast[]>([]);
  toasts = this._toasts.asReadonly();
  private idSeq = 1;

  private push(level: ToastLevel, message: string, timeoutMs = 4000) {
    const toast: Toast = { id: this.idSeq++, level, message, createdAt: Date.now() };
    this._toasts.update(list => [toast, ...list]);
    if (timeoutMs > 0) {
      setTimeout(() => this.dismiss(toast.id), timeoutMs);
    }
  }

  info(msg: string) { this.push('info', msg); }
  success(msg: string) { this.push('success', msg); }
  warning(msg: string) { this.push('warning', msg, 6000); }
  error(msg: string) { this.push('error', msg, 8000); }

  dismiss(id: number) {
    this._toasts.update(list => list.filter(t => t.id !== id));
  }
}
