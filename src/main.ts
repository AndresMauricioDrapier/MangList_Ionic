import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideRouter,
  withPreloading,
  PreloadAllModules,
  RouteReuseStrategy,
} from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { baseUrlInterceptor } from './app/interceptors/base-url.interceptor';

import { APP_ROUTES } from '../src/routes';
import { UserInterceptor } from './app/interceptors/user.interceptor';
import { tokenInterceptor } from './app/interceptors/token.interceptor';
import { provideGoogleId } from './app/auth/auth-login/google-login/google-login.config';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([baseUrlInterceptor, tokenInterceptor, UserInterceptor])
    ),
    provideRouter(APP_ROUTES, withPreloading(PreloadAllModules)),
    provideGoogleId(
      '746820501392-nc4pet9ffnm8gq8hg005re9e6ho65nua.apps.googleusercontent.com'
    ),
    importProvidersFrom(IonicModule.forRoot()),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
});
