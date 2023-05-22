import { inject } from "@angular/core";
import { CanActivateFn, ActivatedRouteSnapshot, Router } from "@angular/router";

export const comicIdGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot
) => {
    const id = +route.params["id"];

    if (isNaN(id)) {
        return inject(Router).createUrlTree(["/manglist"]);
    }
    return true;
};
