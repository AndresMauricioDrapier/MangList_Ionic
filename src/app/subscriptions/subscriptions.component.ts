import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";

@Component({
    selector: "ml-subscriptions",
    standalone: true,
    imports: [CommonModule, RouterModule, IonicModule],
    templateUrl: "./subscriptions.component.html",
    styleUrls: ["./subscriptions.component.scss"],
})
export class SubscriptionsComponent {

}
