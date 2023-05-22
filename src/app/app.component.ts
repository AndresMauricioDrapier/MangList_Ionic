import { CommonModule } from '@angular/common';
import { Component, EnvironmentInjector } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule, NavController, Platform, ToastController } from '@ionic/angular';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink],
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  menuDisabled = true;

  public appPages = [
    { title: 'Comics Page', url: '/', icon: 'mail' },
    { title: 'Auth', url: '/auth/login', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(
    public environmentInjector: EnvironmentInjector,
    // private authService: AuthService,
    private nav: NavController,
    private platform: Platform,
    private toast: ToastController
  ) {

  }

  async logout() {
    // await this.authService.logout();
    // this.nav.navigateRoot(['/auth/login']);
  }
}
