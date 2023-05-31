import { Routes } from '@angular/router';
import { userResolve } from './resolvers/user.resolver';
import { leavePageGuard } from '../guards/leavePageGuard.guard';
import { loginActivateGuard } from '../guards/loginActivateGuard.guard';

export const USER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./users.component').then((m) => m.UsersComponent),
  },
  {
    path: 'me',
    loadComponent: () =>
      import('./users.component').then((m) => m.UsersComponent),
    canActivate: [loginActivateGuard],
  },
  {
    path: 'all',
    loadComponent: () =>
      import('./users-page/users-page.component').then(
        (m) => m.UsersPageComponent
      ),
    canActivate: [loginActivateGuard],
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./users.component').then((m) => m.UsersComponent),
    canActivate: [loginActivateGuard],
    resolve: { user: userResolve },
  },
  { path: '**', redirectTo: 'manglist/' },
];
