import { Injectable, DestroyRef, effect, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';

export interface HealthResponse {
  status: 'ok' | 'error';
  db?: 'connected' | 'unknown';
  message?: string;
}

type HealthState = 'up' | 'down' | 'unknown';

@Injectable({ providedIn: 'root' })
export class HealthService {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  private _state = signal<HealthState>('unknown');
  state = this._state.asReadonly();

  private sub?: Subscription;

  constructor(){
    // Start polling every 10s
    this.start();
    this.destroyRef.onDestroy(() => this.stop());
  }

  async checkOnce(): Promise<HealthState> {
    try {
      // Call directly to backend health without proxy; CORS is enabled server-side
      const res = await this.http.get<HealthResponse>('http://localhost:4000/health').toPromise();
      const ok = res?.status === 'ok';
      const state: HealthState = ok ? 'up' : 'down';
      this._state.set(state);
      return state;
    } catch {
      this._state.set('down');
      return 'down';
    }
  }

  start(){
    if (this.sub) return;
    // initial ping immediately
    this.checkOnce();
    this.sub = interval(10000).subscribe(() => this.checkOnce());
  }

  stop(){
    this.sub?.unsubscribe();
    this.sub = undefined;
  }
}
