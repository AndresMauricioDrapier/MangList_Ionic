import { Component, OnInit, ViewChild } from '@angular/core';
import { ComicyRanking } from '../interfaces/comics';
import { Genres } from '../interfaces/categories';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { searchComic } from '../interfaces/responses';
import { ComicsService } from '../services/comics.service';
import { CommonModule } from '@angular/common';
import { ComicCardComponent } from '../comic-card/comic-card.component';
import { ComicsFilterPipe } from '../pipes/comics-filter.pipe';
import { AlertController, IonRefresher, IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-comics-page',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ComicCardComponent,
    ComicsFilterPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './comics-page.component.html',
  styleUrls: ['./comics-page.component.scss'],
})
export class ComicsPageComponent implements OnInit {
  comics: ComicyRanking[] = [];
  // user!: Auth;
  active = true;
  userSearch = false;

  genres = Genres;
  genreValue!: string;

  constructor(
    private readonly comicsService: ComicsService,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder, // private readonly httpUser: UserService,
    private readonly alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['search']) {
        this.comicsService.getComicsString(params['search']).subscribe({
          next: (comics) => {
            this.comics = (comics as unknown as searchComic).data;
            this.userSearch = true;
          },
          error: (e) => {
            this.alertController.create({
              header: 'Error al recoger los comics',
              message: e,
              buttons: ['Ok'],
            });
          },
        });
      } else {
        this.comicsService.getComics().subscribe((comics) => {
          this.comics = comics;
        });
      }
    });
  }

  reloadProducts(refresher: IonRefresher) {
    if (!this.userSearch) {
      this.comicsService.getComics().subscribe({
        next: (comics) => {
          this.comics = comics;
          refresher.complete();
        },
        error: (e) => {
          this.alertController.create({
            header: 'Error al recoger los comics',
            message: e,
            buttons: ['Ok'],
          });
        },
      });
    }
  }

  handleChange(e: any) {
    this.genreValue = e.detail.value;
  }

  @ViewChild('pageTop') pageTop: any;

  public pageScroller() {
    this.pageTop.scrollToTop();
  }
}
