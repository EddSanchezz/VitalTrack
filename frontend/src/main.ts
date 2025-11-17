import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { AppPrimeComponent } from './app/app.prime.component';

bootstrapApplication(AppPrimeComponent, {
  providers: [
    provideHttpClient(),
    provideAnimations()
  ]
}).catch(err => console.error(err));
