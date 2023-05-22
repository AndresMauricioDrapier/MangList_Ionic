import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/services/auth.service';

export const logoutActivateGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(AuthService)
    .isLogged()
    .pipe(
      map((logged) => {
        if (logged) {
          return router.createUrlTree(['/']);
        }
        return true;
      })
    );
};
