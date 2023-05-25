import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'ml-comics-reading-page',
  standalone: true,
  imports: [CommonModule, IonicModule],
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

  @ViewChild('pageTop') pageTop: any;

  pageScroller() {
    this.pageTop.scrollToTop();
  }
}
