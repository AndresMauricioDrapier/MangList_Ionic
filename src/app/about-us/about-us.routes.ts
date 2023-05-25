import { Routes } from '@angular/router';
import { leavePageGuard } from '../guards/leavePageGuard.guard';

export const ABOUT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./about-us.component').then((m) => m.AboutUsComponent),
  },
  { path: '**', redirectTo: 'manglist/' },
];
