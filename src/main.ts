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
import { APP_ROUTES } from './app/routes';
import { baseUrlInterceptor } from './app/interceptors/base-url.interceptor';
import { tokenInterceptor } from './app/interceptors/token.interceptor';
import { UserInterceptor } from './app/interceptors/user.interceptor';
import "hammerjs";

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([baseUrlInterceptor,tokenInterceptor,UserInterceptor])
    ),
    provideRouter(APP_ROUTES, withPreloading(PreloadAllModules)),
    importProvidersFrom(IonicModule.forRoot()),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
});
