import { CommonModule } from '@angular/common';
import { Component, EnvironmentInjector } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import {
  IonicModule,
  NavController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { AuthService } from './auth/services/auth.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink, RouterLinkActive],
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  // menuDisabled = true;

  // public appPages = [
  //   {
  //     title: 'Profile',
  //     url: '/user',
  //     icon: 'person-circle',
  //   },
  //   {
  //     title: 'Restaurants',
  //     url: '/restaurants',
  //     icon: 'restaurant',
  //   },
  //   {
  //     title: 'Add restaurant',
  //     url: '/restaurants/add',
  //     icon: 'add-circle',
  //   },
  // ];

  // constructor(
  //   public environmentInjector: EnvironmentInjector,
  //   private authService: AuthService,
  //   private nav: NavController,
  //   private platform: Platform,
  //   private toast: ToastController
  // ) {
  //   this.initializeApp();
  //   this.authService.loginChange$.subscribe(
  //     (logged) => (this.menuDisabled = !logged)
  //   );
  // }
  // initializeApp() {
  //   if (this.platform.is('capacitor')) {
  //     this.platform.ready().then(() => {
  //       SplashScreen.hide();
  //       StatusBar.setBackgroundColor({ color: '#3880ff' });
  //       StatusBar.setStyle({ style: Style.Dark });
  //       GoogleAuth.initialize();
  //     });
  //   }
  // }

  // async logout() {
  //   await this.authService.logout();
  //   this.nav.navigateRoot(['/auth/login']);
  // }
}
