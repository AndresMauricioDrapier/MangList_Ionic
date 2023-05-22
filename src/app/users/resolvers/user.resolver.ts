import { inject } from "@angular/core";
import { ResolveFn, Router } from "@angular/router";
import { catchError, EMPTY} from "rxjs";
import { UsersService } from "../services/users.service";
import { Auth } from "src/app/auth/interfaces/auth";


export const userResolve: ResolveFn<Auth> = (route) => {
    return inject(UsersService)
        .getUser(route.params["id"])
        .pipe(
            catchError(() => {
                inject(Router).navigate(["/login"]);
                return EMPTY;
            })
        );
};
