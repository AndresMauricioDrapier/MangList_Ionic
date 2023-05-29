import { Component, OnInit, inject } from '@angular/core';
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
import { CanDeactivateComponent } from 'src/app/guards/leavePageGuard.guard';
import { Observable } from 'rxjs';

@Component({
  selector: 'ml-auth-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, IonicModule],
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss'],
})
export class AuthLoginComponent implements OnInit, CanDeactivateComponent{
  userInfo: AuthLogin = {
    email: '',
    password: '',
  };

  exit = false;

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
  canDeactivate(): Promise<boolean> | Observable<boolean> | boolean {
    if(this.exit) return true;
    return new Promise<boolean>(async (resolve) => {
      const alert = await inject(AlertController).create({
        header: 'Confirmación',
        message:
          '¿Estás seguro de que quieres abandonar esta página? No se guardaran los cambios',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              // El usuario ha cancelado la navegación, así que se queda en la página actual
              resolve(false);
            },
          },
          {
            text: 'Aceptar',
            handler: () => {
              // El usuario ha aceptado la navegación, así que se permite la salida de la página
              resolve(true);
            },
          },
        ],
      });

      await alert.present();
    });
  }

  login(): void {
    this.exit=true;
    this.authService.login(this.userInfo).subscribe({
      next: async () => {
        (
          await this.toast.create({
            duration: 3000,
            position: 'bottom',
            message: '¡Inicio de sesión correctamente!',
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
    this.exit = true;
    this.nav.navigateRoot(['auth/register']);
  }
}
