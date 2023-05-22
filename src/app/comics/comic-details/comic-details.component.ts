import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { Comic } from "../interfaces/comics";
import { CommentsComponent } from "../comments/comments.component";
import { Auth } from "src/app/auth/interfaces/auth";
import { UsersService } from "src/app/users/services/users.service";
import { CreateCommentComponent } from "../comments/create-comment/create-comment.component";
import { TranslateService } from "../services/translate.service";
import Swal from "sweetalert2";
import { Commentary } from "../interfaces/comment";

@Component({
    selector: "ml-comic-details",
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        CommentsComponent,
        CreateCommentComponent,
    ],
    templateUrl: "./comic-details.component.html",
    styleUrls: ["./comic-details.component.scss"],
})
export class ComicDetailsComponent implements OnInit {
    comic!: Comic;
    user!: Auth;
    comment: Commentary;
    inFav = false;
    haveRoleToEditComic!: boolean;
    comicId: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private usersService: UsersService,
        private readonly translateService: TranslateService
    ) {}

    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            this.comic = data["comic"];
            this.comicId = this.comic.id
                ? this.comic.id.toString()
                : this.comic._id;
        });

        if (this.comic && localStorage.getItem("user-id")) {
            this.usersService
                .getUser(localStorage.getItem("user-id")!)
                .subscribe((user) => {
                    this.user = user;
                    this.containsFavorite();
                });
        }

        this.usersService.hasRoleToAdd().subscribe((bool) => {
          this.haveRoleToEditComic = bool;
        });
        this.comic.synopsis = this.comic.synopsis.substring(0, this.comic.synopsis.length - 24);
        this.comic.genres = this.comic.genres.slice(0, 4);
        this.translateService
            .translate(this.comic.synopsis)
            .then(
                (r) => (this.comic.synopsis = r.data[0].translations[0].text)
            );

        this.comic.start_date = this.formatDate(this.comic.start_date);
    }

    addComment(comment: Commentary) {
        this.comment = comment;
    }

    addToFavorites(): void {
        this.usersService.addFavorites(this.comicId, this.user._id).subscribe({
            next: () => {
                this.inFav = true;
                Swal.fire({
                    icon: "success",
                    title: "¡Comic añadido a favoritos!",
                });
            },
            error: () => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Comic no añadido a favoritos",
                });
            },
        });
    }

    deleteFronFavorites(): void {
        this.usersService
            .deleteFavorite(this.comicId, this.user._id)
            .subscribe({
                next: () => {
                    this.inFav = false;
                    Swal.fire({
                        icon: "success",
                        title: "¡Comic eliminado de favoritos!",
                    });
                },
                error: () => {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Comic no eliminado de favoritos",
                    });
                },
            });
    }

    containsFavorite(): void {
        let boolean = false;
        this.user.favorites?.map((r) =>
            r.toString() === this.comicId ? (boolean = true) : boolean
        );
        this.inFav = boolean;
    }

    goToReadingPage(): void {
        if (this.usersService.isLogged()) {
            if (this.user.role !== "user" && this.user.role !== "api") {
                this.router.navigate(["/comics", this.comicId, "reading"]);
            } else {
                this.router.navigate(["/subscriptions/type"]);
            }
        } else {
            this.router.navigate(["/auth/login"]);
        }
    }

    formatDate(fecha: string): string {
        const date = new Date(fecha);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return (
            (day < 10 ? "0" + day : day) +
            "/" +
            (month < 10 ? "0" + month : month) +
            "/" +
            year
        );
    }

    goToEditComic(): void {
        this.router.navigate(["/comics/add"], {
            queryParams: { comicId: this.comic._id },
        });
    }
}
