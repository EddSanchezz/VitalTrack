import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ToastService } from './toast.service';

export const httpLoggerInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const toast = inject(ToastService);
  const started = performance.now();
  const method = req.method.toUpperCase();
  const url = req.urlWithParams;
  // Log request
  // eslint-disable-next-line no-console
  console.debug('[HTTP] →', method, url, { body: req.body, headers: req.headers.keys() });

  return next(req).pipe(
    tap({
      next: (event) => {
        // Only log final response events implicitly; angular compiles events; avoid noisy logs
      },
      error: (err) => {
        const took = Math.round(performance.now() - started);
        // eslint-disable-next-line no-console
        console.error(`[HTTP] × ${method} ${url} (${took}ms)`, err);
        toast.error(`Error ${method} ${url}: ${err?.status || ''} ${err?.statusText || ''}`);
      },
      complete: () => {
        const took = Math.round(performance.now() - started);
        // eslint-disable-next-line no-console
        console.debug(`[HTTP] ✓ ${method} ${url} (${took}ms)`);
      }
    })
  );
};
