import { Routes } from "@angular/router";

export const CONTACT_ROUTES: Routes = [
    {
        path: "",
        loadComponent: () =>
            import("./contact.component").then(
                (m) => m.ContactComponent
            ),
        // canDeactivate: [leavePageGuard],
    },
    { path: "**", redirectTo: "manglist/" },
];
