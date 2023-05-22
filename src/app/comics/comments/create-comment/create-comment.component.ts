import { Component, Input,OnInit, Output,EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Commentary } from "../../interfaces/comment";
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { UsersService } from "src/app/users/services/users.service";
import { CommentsService } from "../../services/comments.service";
import { StarRatingComponent } from "../star-rating/star-rating.component";
import { Auth } from "src/app/auth/interfaces/auth";

@Component({
    selector: "ml-create-comment",
    standalone: true,
    imports: [CommonModule,StarRatingComponent,ReactiveFormsModule],
    templateUrl: "./create-comment.component.html",
    styleUrls: ["./create-comment.component.scss"],
})
export class CreateCommentComponent implements OnInit {
    @Input() user!: Auth;
    @Input() comicId:string;
    @Output() comentary = new EventEmitter<Commentary>();

    formComment!: FormGroup;
    commentControl!: FormControl<string>;

    commentAgain:boolean;

    newComment: Commentary = {
        user: {
            _id: 0,
            name: "",
            email: "",
            avatar: "",
        },
        comicId: "",
        stars: 0,
        text: "",
        date: new Date().toLocaleString(),
    };

    constructor(
        private readonly userServices: UsersService,
        private readonly commentsServices: CommentsService,
        private fb: NonNullableFormBuilder
    ) {}

    ngOnInit(): void {
      this.newComment.user = this.user;
      this.newComment.comicId = this.comicId;

      this.commentControl = this.fb.control("", [
        Validators.required,
    ]);
      this.formComment = this.fb.group({
        comment: this.commentControl,
      });
    }

    addComment() {
        this.newComment.text = this.commentControl.value;
        this.commentsServices.addComment(this.newComment).subscribe({
            next: (resp) => {
                this.comentary.emit(resp.result);
            },
            error: (e) => {
                console.error(e);
            },
        });
    }

    setRating(newRating: number): void {
        this.newComment.stars = newRating;
    }

    validClasses(control: FormControl, validClass: string, errorClass: string) {
        return {
            [validClass]: control.touched && control.valid,
            [errorClass]: control.touched && control.invalid,
        };
    }
}
