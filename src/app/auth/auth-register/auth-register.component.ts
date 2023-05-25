import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { Auth, AuthLogin } from '../interfaces/auth';
import { AuthService } from '../services/auth.service';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { MailService } from 'src/app/shared/mail/services/mail.service';
import { Mail } from 'src/app/shared/mail/interfaces/mail';
import { MatchValidator } from 'src/app/shared/validators/match.validator';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { CanDeactivateComponent } from 'src/app/guards/leavePageGuard.guard';
import { Observable } from 'rxjs';

@Component({
  selector: 'ml-auth-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonicModule,
    MatchValidator,
  ],
  templateUrl: './auth-register.component.html',
  styleUrls: ['./auth-register.component.scss'],
})
export class AuthRegisterComponent implements OnInit, CanDeactivateComponent {
  exit = false;

  imageChangedEvent: any = '';
  croppedImage: any = '';

  newUser: Auth = {
    name: '',
    email: '',
    avatar: '',
    password: '',
  };

  userInfo: AuthLogin = {
    email: '',
    password: '',
    token: '',
    userId: '',
  };

  newMail: Mail = {
    from: 'info.manglist@gmail.com',
    subject: '¡Gracias por registrate!',
    to: '',
    message:
      'Muchas gracias por registrarte en MangList. \n Esperamos que disfrutes de nuestra aplicación ya puedes empezar a ver a otros usuarios',
  };

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly mailServices: MailService,
    private alertCtrl: AlertController,
    private toast: ToastController
  ) {}
  ngOnInit(): void {}

  canDeactivate(): Promise<boolean> | Observable<boolean> | boolean {
    if (this.exit || this.newUser) return true;
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

  addUser(): void {
    this.newUser.email = this.newUser.email.toLocaleLowerCase();

    this.authService.register(this.newUser).subscribe({
      next: async () => {
        this.sendMail();
        this.exit = true;
        (
          await this.toast.create({
            duration: 4000,
            position: 'bottom',
            message: '¡Bienvenido ' + this.newUser.name + '!',
          })
        ).present();
        this.userInfo.email = this.newUser.email;
        this.authService.login(this.userInfo).subscribe({
          next: () => {
            this.exit = true;
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.error(error);
          },
        });
      },
      error: async (error) => {
        const alert = await this.alertCtrl.create({
          animated: true,
          header: 'Error',
          subHeader: 'Ops...',
          message: 'No se ha podido registrar: ' + error.error.message,
          buttons: ['Ok'],
        });
        alert.present();
      },
    });
  }

  sendMail(): void {
    this.newMail.to = this.newUser.email;

    this.mailServices.send(this.newMail).subscribe({
      error: (e) => {
        console.error('Error al enviar el mail' + e);
      },
    });
  }

  resetForm() {
    this.newUser = {
      name: '',
      email: '',
      avatar: '',
      password: '',
    };
  }
  async takePhoto() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Camera,
      quality: 90,
      height: 640,
      width: 640,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
    });

    this.newUser.avatar = photo.dataUrl as string;
  }

  async pickFromGallery() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Photos,
      height: 640,
      width: 640,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
    });

    this.newUser.avatar = photo.dataUrl as string;
  }
}
