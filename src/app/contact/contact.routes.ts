import { Routes } from "@angular/router";
import { leavePageGuard } from "../guards/leavePageGuard.guard";

export const CONTACT_ROUTES: Routes = [
    {
        path: "",
        loadComponent: () =>
            import("./contact.component").then(
                (m) => m.ContactComponent
            ),
        canDeactivate: [leavePageGuard],
    },
    { path: "**", redirectTo: "manglist/" },
];
