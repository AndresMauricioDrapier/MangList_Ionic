import { Routes } from "@angular/router";
import { leavePageGuard } from "../guards/leavePageGuard.guard";

export const AUTH_ROUTES: Routes = [
    {
        path: "login",
        loadComponent: () =>
            import("./auth-login/auth-login.component").then(
                (m) => m.AuthLoginComponent
            ),
    },
    {
        path: "register",
        loadComponent: () =>
            import("./auth-register/auth-register.component").then(
                (m) => m.AuthRegisterComponent
            ),
        canDeactivate: [leavePageGuard],
    },
];
