import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/pages/login/login.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';


  
  bootstrapApplication(LoginComponent, {
    providers:[ provideRouter(routes),provideHttpClient()]
  })
    .catch(err => console.error(err));
  