import { HttpInterceptorFn } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  return from(Preferences.get({ key: 'fs-token' })).pipe(
    switchMap((token) => {
      if (!token.value) {
        return next(req);
      }

      const authReq = req.clone({
        headers: req.headers.set('Authorization', `bearer ${token.value}`),
      });
      // Pass on the cloned request instead of the original request.
      return next(authReq);
    })
  );
};
