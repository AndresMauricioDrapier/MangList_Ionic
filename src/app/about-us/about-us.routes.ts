import { Routes } from "@angular/router";

export const ABOUT_ROUTES: Routes = [
    {
        path: "",
        loadComponent: () =>
            import("./about-us.component").then(
                (m) => m.AboutUsComponent
            ),
        // canDeactivate: [leavePageGuard],
    },
    { path: "**", redirectTo: "manglist/" },
];
