import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  AlertController,
  IonicModule,
  NavController,
  Platform,
} from '@ionic/angular';
import { UserLogin } from '../interfaces/user.interface';
import { AuthService } from '../services/auth.service';
import { User, GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { FacebookLogin } from '@capacitor-community/facebook-login';
import { FacebookLoginResponse } from '@capacitor-community/facebook-login/dist/esm/definitions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user: UserLogin = {
    email: '',
    password: '',
    lat: 0,
    lng: 0,
    token: '',
    image: '',
    userId: '',
  };
  userGoogle!: User;
  accessToken = '';

  constructor(
    private platform: Platform,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    const resp =
      (await FacebookLogin.getCurrentAccessToken()) as FacebookLoginResponse;
    if (resp.accessToken) {
      this.accessToken = resp.accessToken.token;
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      this.user.lat = pos.coords.latitude;
      this.user.lng = pos.coords.longitude;
    });
  }

  async loginFaceebok() {
    const resp = (await FacebookLogin.login({
      permissions: ['email'],
    })) as FacebookLoginResponse;

    if (resp.accessToken) {
      this.authService.loginFaceebok(resp.accessToken.token,this.user.lat,this.user.lng).subscribe({
        next: () => this.navCtrl.navigateRoot(['/restaurants']),
        error: async (err) => {
          (
            await this.alertCtrl.create({
              header: 'Login error',
              message: err.error,
              buttons: ['Ok'],
            })
          ).present();
        },
      });
    }
  }

  login() {
    this.authService
      .login(this.user)
      .subscribe({
        next: () => this.navCtrl.navigateRoot(['/restaurants']),
        error: async (error) => {
          (
            await this.alertCtrl.create({
              header: 'Login error',
              message: error.error,
              buttons: ['Ok'],
            })
          ).present();
        },
      });
  }
  async loggedGoogle() {
    try {
      await GoogleAuth.signIn().then((user) => {
        this.authService.loginGoogle(user).subscribe({
          next: () => this.navCtrl.navigateRoot(['/restaurants']),
          error: async (err) => {
            (
              await this.alertCtrl.create({
                header: 'Login error',
                message: err.error,
                buttons: ['Ok'],
              })
            ).present();
          },
        });
      });
    } catch (err) {
      console.error(err);
    }
  }
}
