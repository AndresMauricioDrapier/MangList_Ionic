import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Observable } from "rxjs";
import { UsersService } from "../users/services/users.service";

@Injectable()
export class addComicRoleActivateGuard implements CanActivate {
    constructor(private userService: UsersService, private router: Router) {}

    canActivate(): Observable<boolean> {
        return new Observable<boolean>((observer) => {
            this.userService.hasRoleToAdd().subscribe((hasRoleToAdd) => {
                if (!hasRoleToAdd) {
                    this.router.navigate(["/"]); // Redirige a la página principal
                    observer.next(false);
                } else {
                    observer.next(true);
                }
                observer.complete();
            });
        });
    }
}
