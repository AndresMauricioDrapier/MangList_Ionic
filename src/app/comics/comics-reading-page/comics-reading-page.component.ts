import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ml-comics-reading-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comics-reading-page.component.html',
  styleUrls: ['./comics-reading-page.component.scss']
})
export class ComicsReadingPageComponent {

  images = [
    'assets/utiles/panelManga.png',
    'assets/utiles/panelManga.png',
    'assets/utiles/panelManga.png',
    'assets/utiles/panelManga.png',
    'assets/utiles/panelManga.png',
    'assets/utiles/panelManga.png',
    'assets/utiles/panelManga.png',
    'assets/utiles/panelManga.png',
    'assets/utiles/panelManga.png',
    'assets/utiles/panelManga.png',
    'assets/utiles/panelManga.png',
    'assets/utiles/panelManga.png',
    'assets/utiles/panelManga.png',
    'assets/utiles/panelManga.png',
  ];

  goBack() {
    console.log('goBack');
  }

  goNext() {
    console.log('goNext');
  }
}
