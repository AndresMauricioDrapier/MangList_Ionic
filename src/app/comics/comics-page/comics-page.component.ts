import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComicyRanking } from "../interfaces/comics";
import { ActivatedRoute } from "@angular/router";
import { Auth } from "src/app/auth/interfaces/auth";
import { ComicsService } from "../services/comics.service";
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from "@angular/forms";
import { ComicCardComponent } from "../comic-card/comic-card.component";
import { MenuComponent } from "src/app/shared/menu/menu.component";
import { ComicsFilterPipe } from "../pipes/comics-filter.pipe";
import { searchComic } from "../interfaces/responses";
import { Genres } from "../interfaces/categories";

@Component({
    selector: "ml-comics-page",
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ComicCardComponent,
        MenuComponent,
        ComicsFilterPipe,
        ReactiveFormsModule,
    ],
    providers: [{ provide: MenuComponent, useValue: {} }],
    templateUrl: "./comics-page.component.html",
    styleUrls: ["./comics-page.component.scss"],
})
export class ComicsPageComponent implements OnInit {
    comics: ComicyRanking[] = [];
    user!: Auth;
    active = true;
    userCreated = false;

    genres = Genres;
    filterGenres: FormGroup;

    constructor(
        private readonly comicsService: ComicsService,
        private readonly route: ActivatedRoute,
        private readonly fb: FormBuilder, // private readonly httpUser: UserService
    ) {
        this.filterGenres = this.fb.group({
            genres: this.genres,
        });
        this.filterGenres.controls["genres"].setValue("Todos", {
            onlySelf: true,
        });
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            if (params["search"]) {
                this.comicsService
                    .getComicsString(params["search"])
                    .subscribe((comics) => {
                        this.comics = (comics as unknown as searchComic).data;
                    });
            } else {
                this.comicsService.getComics().subscribe((comics) => {
                    this.comics = comics;
                });
            }
        });
    }
}
