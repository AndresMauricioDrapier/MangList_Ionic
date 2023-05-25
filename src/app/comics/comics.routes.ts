import { Routes } from '@angular/router';
import { comicResolve } from './resolvers/comic.resolver';
import { loginActivateGuard } from '../guards/loginActivateGuard.guard';
import { roleActivateGuard } from '../guards/roleActivateGuard.guard';
import { leavePageGuard } from '../guards/leavePageGuard.guard';
// import { loginActivateGuard } from "../guards/loginActivateGuard.guard";
// import { roleActivateGuard } from "../guards/roleActivateGuard.guard";

export const COMICS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./comics-page/comics-page.component').then(
        (m) => m.ComicsPageComponent
      ),
  },
  {
    path: 'categorias',
    loadComponent: () =>
      import('./comic-categories/comic-categories.component').then(
        (m) => m.ComicCategoriesComponent
      ),
  },
  {
    path: 'comics/add',
    loadComponent: () =>
      import('./comic-form/comic-form.component').then(
        (m) => m.ComicFormComponent
      ),
    canActivate: [loginActivateGuard, leavePageGuard],
  },
  {
    path: 'comics/:id',
    loadComponent: () =>
      import('./comic-details/comic-details.component').then(
        (m) => m.ComicDetailsComponent
      ),
    resolve: {
      comic: comicResolve,
    },
  },
  {
    path: 'comics/:id/reading',
    loadComponent: () =>
      import('./comics-reading-page/comics-reading-page.component').then(
        (m) => m.ComicsReadingPageComponent
      ),
    canActivate: [loginActivateGuard, roleActivateGuard],
    resolve: {
      comic: comicResolve,
    },
  },
  { path: '**', redirectTo: 'manglist/' },
];
