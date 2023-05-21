import { Routes } from '@angular/router';
import { loginActivateGuard } from './guards/login-activate.guard';
import { logoutActivateGuard } from './guards/logout-activate.guard';
export const APP_ROUTES: Routes = [
  // {
  //   path: 'auth',
  //   loadChildren: () => import('./auth/routes').then((m) => m.AUTH_ROUTES),
  //   canActivate: [logoutActivateGuard],
  // },
  // {
  //   path: 'restaurants',
  //   loadChildren: () =>
  //     import('./restaurants/Restaurant.routes').then((m) => m.APP_ROUTES),
  //   canActivate: [loginActivateGuard],
  // },
  // {
  //   path: 'user',
  //   loadChildren: () =>
  //     import('./users/user.routes').then((m) => m.APP_ROUTES),
  //   canActivate: [loginActivateGuard],
  // },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/auth/login',
  },
];
