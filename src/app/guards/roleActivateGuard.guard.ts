import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { UsersService } from "../users/services/users.service";

export const roleActivateGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(UsersService)
    .hasRoleToRead() ?  router.createUrlTree(['/subscriptions/type']) : true;
};
