import { Routes } from "@angular/router";
import { leavePageGuard } from "../guards/leavePageGuard.guard";

export const SUBSCRIPTIONS_ROUTES: Routes = [
    {
        path: "type",
        loadComponent: () =>
            import("./subscriptions.component").then(
                (m) => m.SubscriptionsComponent
            ),
    },
    {
        path: "cart",
        loadComponent: () =>
            import("./cart/cart.component").then((m) => m.CartComponent),
        canDeactivate: [leavePageGuard],
    },
    { path: "**", redirectTo: "manglist/" },
];
