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
    { title: 'Inicio', url: '/', icon: 'home' },
    { title: 'Categorias', url: '/categorias', icon: 'apps' },
    { title: 'Contacto', url: '/contact', icon: 'mail' },
    { title: 'Sobre nosotros', url: '/folder/archived', icon: 'business' },
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
