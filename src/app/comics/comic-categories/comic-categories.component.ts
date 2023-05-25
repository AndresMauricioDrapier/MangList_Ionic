import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ComicsService } from '../services/comics.service';
import { ActivatedRoute } from '@angular/router';
import { ComicCardComponent } from '../comic-card/comic-card.component';
import { Genres, Order, StartDate, Status } from '../interfaces/categories';
import { ComicyRanking } from '../interfaces/comics';
import { ComicsFilterCategoryPipe } from '../pipes/comics-filter-category.pipe';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'ml-comic-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ComicCardComponent,
    ReactiveFormsModule,
    ComicsFilterCategoryPipe,
    IonicModule,
  ],
  templateUrl: './comic-categories.component.html',
  styleUrls: ['./comic-categories.component.scss'],
})
export class ComicCategoriesComponent implements OnInit {
  filterAll: FormGroup;

  genres = Genres;
  startDate = StartDate;
  status = Status;
  order = Order;

  genreFilter = '';
  startDateFilter = '';
  statusFilter = '';
  orderFilter = '';

  comics: ComicyRanking[] = [];
  constructor(
    private readonly comicsService: ComicsService,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder // private readonly httpUser: UserService
  ) {
    this.filterAll = this.fb.group({
      genres: [this.genres, Validators.required],
      startDate: [this.startDate, Validators.required],
      status: [this.status, Validators.required],
      order: [this.order, Validators.required],
    });
    this.filterAll.controls['genres'].setValue('Genero:', {
      onlySelf: true,
    });
    this.filterAll.controls['startDate'].setValue('Año:', {
      onlySelf: true,
    });
    this.filterAll.controls['status'].setValue('Estado:', {
      onlySelf: true,
    });
    this.filterAll.controls['order'].setValue('Orden:', {
      onlySelf: true,
    });
  }

  handleChangeGenre(e: any) {
    this.genreFilter =  e.detail.value.value;
  }
  handleChangeDate(e: any) {
    this.startDateFilter =  e.detail.value.value;

  }
  handleChangeStatus(e: any) {
    this.statusFilter =  e.detail.value.value;

  }
  handleChangeOrder(e: any) {
    this.orderFilter =  e.detail.value.value;
  }

  ngOnInit(): void {
    this.comicsService.getComicsCategorias().subscribe((comics) => {
      this.comics = comics;
    });
    this.route.queryParams.subscribe((params) => {
      if (params['filtro']) {
        this.filterAll
          .get('genres')!
          .setValue(this.genres.find((g) => g.value === params['filtro']));
      }
    });
  }


  @ViewChild('pageTop') pageTop: any;

  public pageScroller() {
    this.pageTop.scrollToTop();
  }
}
