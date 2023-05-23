import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthLogin } from '../interfaces/auth';
import { AlertController, IonicModule, NavController, ToastController } from '@ionic/angular';
import { UsersService } from 'src/app/users/services/users.service';

@Component({
  selector: 'ml-auth-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, IonicModule],
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss'],
})
export class AuthLoginComponent implements OnInit {
  userInfo: AuthLogin = {
    email: '',
    password: '',
  };

  passRecoveryForm!: FormGroup;
  emailRecoveryControl!: FormControl<string>;
  textRecoveryControl!: FormControl<string>;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private alertCtrl: AlertController,
    private toast: ToastController,
    private nav: NavController
  ) {}

  ngOnInit(): void {
    console.log('Formulario Login');
  }

  login(): void {
    this.authService.login(this.userInfo).subscribe({
      next: async () => {
        (
          await this.toast.create({
            duration: 3000,
            position: 'bottom',
            message: 'User registered!',
          })
        ).present();
        this.nav.navigateRoot(['/']);
      },
      error: async (error) => {
        const alert = await this.alertCtrl.create({
          header: 'Login error',
          message: error,
          buttons: ['Ok'],
        });
        await alert.present();
      },
    });
  }

  mailPasswordRecovery(): void {
    this.userService.passwordRecovery(this.emailRecoveryControl.value).subscribe({
      next: async () => {
        const alert = await this.alertCtrl.create({
          header: 'Correo enviado',
          message: "Se ha enviado un correo para recuperar la contraseña",
          buttons: ['Ok'],
        });
        await alert.present();
      },
      error: async (error) => {
        const alert = await this.alertCtrl.create({
          header: 'Oops...',
          message: error.error.message,
          buttons: ['Ok'],
        });
        await alert.present();
      },
    });
  }

  goRegister(): void {
    this.nav.navigateRoot(['auth/register']);
  }
}
