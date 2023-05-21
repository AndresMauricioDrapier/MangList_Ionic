import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot
} from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

export const loginActivateGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  return inject(AuthService)
    .isLogged()
    .pipe(
      map((logged) => {
        if (!logged) {
          return router.createUrlTree(['/auth/login']);
        }
        return true;
      })
    );
};
