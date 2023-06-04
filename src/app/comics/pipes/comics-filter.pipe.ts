import { Pipe, PipeTransform, inject } from '@angular/core';
import { ComicyRanking } from '../interfaces/comics';
import { ComicsService } from '../services/comics.service';
import { Comic } from '../interfaces/comics';

@Pipe({
  name: 'comicsFilter',
  standalone: true,
})
export class ComicsFilterPipe implements PipeTransform {
  transform(comics: ComicyRanking[], genero: string): ComicyRanking[] {
    if (genero != 'Filtrar' && genero) {
      const filteredComicRankings: ComicyRanking[] = [];

      comics.forEach((comicRanking) => {
        if (
          comicRanking.node.genres &&
          comicRanking.node.genres.some((g) => g.name === genero)
        ) {
          filteredComicRankings.push(comicRanking);
        }
      });
      return filteredComicRankings;
    } else {
      return comics;
    }
  }
}
