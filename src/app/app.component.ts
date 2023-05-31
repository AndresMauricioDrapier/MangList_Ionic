import { CommonModule } from '@angular/common';
import { Component, EnvironmentInjector, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonicModule,
  NavController,
} from '@ionic/angular';
import { AuthService } from './auth/services/auth.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink],
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  menuDisabled = true;

  loggedIn!: boolean;
  userId: string = localStorage.getItem('user-id') || '';

  public appPages = [
    { title: 'Inicio', url: '/', icon: 'home' },
    { title: 'Categorias', url: '/categorias', icon: 'apps' },
    { title: 'Contacto', url: '/contact', icon: 'mail' },
    { title: 'Sobre nosotros', url: '/about', icon: 'business' },
  ];

  constructor(
    public environmentInjector: EnvironmentInjector,
    private authService: AuthService,
    private nav: NavController
  ) {}

  ngOnInit(): void {
    this.authService.isLogged();
    this.authService.loginChange$.subscribe((t) => (this.loggedIn = t));
  }

  logout() {
    this.authService.logout();
    this.nav.navigateRoot(['/auth/login']);
  }

  goToProfile() {
    this.nav.navigateRoot(['/users/me']);
  }
}
