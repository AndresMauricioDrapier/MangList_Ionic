import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";

@Component({
    selector: "ml-footer",
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: "./footer.component.html",
    styleUrls: ["./footer.component.scss"],
})
export class FooterComponent {
    constructor(private readonly router: Router) {}

    goToInstagram() {
        window.open("https://www.instagram.com/nestorespuch/?hl=es", "_blank");
        window.open("https://www.instagram.com/andresuqui18/?hl=es", "_blank");
    }

    goToLinkedIn() {
        window.open("https://www.linkedin.com/in/nestorespuch/", "_blank");
        window.open(
            "https://www.linkedin.com/in/andrés-mauricio-drapier-25ab7a164/",
            "_blank"
        );
    }

    goTogitHub() {
        window.open("https://github.com/NestorEspuch", "_blank");
        window.open("https://github.com/xWriteDoge", "_blank");
    }
}
