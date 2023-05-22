import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Comic } from "../interfaces/comics";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

@Component({
    selector: "ml-comic-card",
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: "./comic-card.component.html",
    styleUrls: ["./comic-card.component.scss"],
})
export class ComicCardComponent implements OnInit {
    @Input() comic!: Comic;

    ngOnInit(): void {
        this.isNew();
    }

    isNew(): boolean {
        const fechaActualMes = this.underTenAddCero(
            (new Date().getMonth() + 1).toString()
        );
        const fechaActualMes1 = this.underTenAddCero(
            new Date().getMonth().toString()
        );
        const fechaActualMes2 = this.underTenAddCero(
            new Date().getMonth() === 0
                ? "12"
                : (new Date().getMonth() - 1).toString()
        );

        const fechaActualAño = new Date().getFullYear();
        const fechaActualAño2 =
            fechaActualMes2 === "12"
                ? new Date().getFullYear() - 1
                : new Date().getFullYear();

        if (
            this.comic.start_date?.includes(
                fechaActualAño + "-" + fechaActualMes + "-"
            ) ||
            this.comic.start_date?.includes(
                fechaActualAño + "-" + fechaActualMes1 + "-"
            ) ||
            this.comic.start_date?.includes(
                fechaActualAño2 + "-" + fechaActualMes2 + "-"
            )
        ) {
            return true;
        } else {
            return false;
        }
    }

    underTenAddCero(fecha: string): string {
        return fecha.length === 1 ? "0" + fecha : fecha;
    }

    returnNameComic(): string {
        if (this.comic.title.length > 35) {
            return this.comic.title.substring(0, 35) + " ...";
        } else {
            return this.comic.title;
        }
    }
}
