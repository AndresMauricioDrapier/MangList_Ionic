import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Commentary } from '../interfaces/comment';
import { RouterModule } from '@angular/router';
import { StarRatingComponent } from './star-rating/star-rating.component';
import { CommentsService } from '../services/comments.service';
import { AlertController, IonicModule, IonRefresher } from '@ionic/angular';
import { UsersService } from 'src/app/users/services/users.service';
import { Auth } from 'src/app/auth/interfaces/auth';

@Component({
  selector: 'ml-comments',
  standalone: true,
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  imports: [CommonModule, RouterModule, IonicModule, StarRatingComponent],
})
export class CommentsComponent implements OnInit, OnChanges {
  @Input() comicId!: string;
  @Input() user!: Auth;
  @Input() comment!: Commentary;

  comments!: Commentary[];
  haveComment = false;
  idUser = "";

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
    private readonly commentsServices: CommentsService,
    private alertController: AlertController,
    private userServices: UsersService,
  ) {}

  ngOnInit(): void {
    this.loadComments();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.comments)
      this.comments.push(changes['comment'].currentValue);
  }

  loadComments(refresher?: IonRefresher): void {
    this.userServices.getUser("0", true).subscribe((user) => {
      this.idUser = user._id?.toString() || "";
    });
    this.commentsServices.getComments(this.comicId).subscribe((comments) => {
      comments.result.forEach(c =>{
        if(c.user._id?.toString() == this.idUser.toString()) this.haveComment = true;
      })
      this.comments = comments.result;
      refresher?.complete();
    });
  }

  async addComment() {
    const alert = await this.alertController.create({
      header: 'Nuevo comentario',
      inputs: [
        {
          name: 'comment',
          type: 'text',
          placeholder: 'Escribe tu comentario',
        },
        {
          name: 'stars',
          type: 'number',
          placeholder: 'Estrellas (0-5)',
          min: 0,
          max: 5,
        },
      ],
      buttons: [
        {
          text: 'Añadir',
          role: 'ok',
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
    });

    await alert.present();
    const result = await alert.onDidDismiss();

    if (result.role === 'ok') {
      this.newComment.stars = +result.data.values.stars;
      this.newComment.text = result.data.values.comment;
      this.newComment.comicId = this.comicId;
      this.newComment.user = this.user;

      this.commentsServices
        .addComment(this.newComment)
        .subscribe(async (comment) => {
          this.comments.push(comment.result);
          const alert = await this.alertController.create({
            header: '¡Comentario creado!',
            message: 'El comentario ha sido creado correctamente.',
            buttons: ['Aceptar'],
          });

          await alert.present();
        });
    }else{
      const alert = await this.alertController.create({
        header: '¡Comentario desechado!',
        message: 'El comentario no ha podido crearse.',
        buttons: ['Aceptar'],
      });

      await alert.present();
    }
  }
}
