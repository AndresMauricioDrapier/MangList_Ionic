import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
    selector: "ml-cookies",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./cookies.component.html",
    styleUrls: ["./cookies.component.scss"],
})
export class CookiesComponent {
    closeModal(): void {
        const modal = document.getElementById("cookiesBanner")!;
        modal.style.display = "none";
    }
}
