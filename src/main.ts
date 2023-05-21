import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  provideRouter,
  withPreloading,
  PreloadAllModules,
  RouteReuseStrategy,
} from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { authTokenInterceptor } from './app/interceptors/auth-token.interceptor';
import { baseUrlInterceptor } from './app/interceptors/base-url.interceptor';

import { APP_ROUTES } from './app/routes';


if (environment.production) {
  enableProdMode();
}


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([baseUrlInterceptor, authTokenInterceptor])
    ),
    provideRouter(APP_ROUTES, withPreloading(PreloadAllModules)),
    importProvidersFrom(IonicModule.forRoot()),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
});
