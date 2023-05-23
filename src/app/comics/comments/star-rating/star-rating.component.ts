import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
    selector: "ml-star-rating",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./star-rating.component.html",
    styleUrls: ["./star-rating.component.scss"],
})
export class StarRatingComponent implements OnInit, OnChanges {
    @Input() rating!: number;
    @Input() edit!: boolean;
    @Output() changed = new EventEmitter<number>();
    auxRating!: number;

    ngOnInit(): void {
        this.auxRating = this.rating;
    }

    ngOnChanges(): void {
        this.auxRating = this.rating;
    }

    setRating(newRating: number): void {
        this.changed.emit(newRating);
    }
}
