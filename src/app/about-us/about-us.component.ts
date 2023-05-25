import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MailService } from '../shared/mail/services/mail.service';
import { Mail } from '../shared/mail/interfaces/mail';
import { AlertController, IonicModule } from '@ionic/angular';
import { validateEmail } from '../shared/validators/emailValidator';
import { CanDeactivateComponent } from '../guards/leavePageGuard.guard';
import { Observable } from 'rxjs';

@Component({
  selector: 'ml-about-us',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent implements CanDeactivateComponent {
  newMail: Mail = {
    from: 'info.manglist@gmail.com',
    subject: 'Subscripción al newsletter',
    to: '',
    message: '¡Gracias por subscribirte a nuestro newsletter!',
  };
  exit = false;

  public alertButtons = [
    {
      text: 'Guardar',
      role: true,
    },
    {
      text: 'Cerrar',
      role: false,
    },
  ];
  public alertProfileInputs = [
    {
      type: 'email',
      placeholder: 'Email',
    },
  ];

  constructor(
    private readonly mailService: MailService,
    private alertController: AlertController
  ) {}

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

  async addToNewsletter(email: any): Promise<void> {
    this.exit=true;
    if (email.detail.role) {
      console.log(validateEmail(email.detail.data.values[0]))
      if (validateEmail(email.detail.data.values[0])) {
        this.newMail = email.detail.data.values[0];
        this.mailService.send(this.newMail).subscribe({
          next: async () => {
            const alert = await this.alertController.create({
              header: '¡Subscrito al newsletter!',
              message: 'Recibiras un correo verificando tu subscripción.',
              buttons: ['Aceptar'],
            });
            await alert.present();
          },
          error: async () => {
            const alert = await this.alertController.create({
              header: '¡Ha habido un error!',
              message: 'No has podido subscribirte al newsletter.',
              buttons: ['Aceptar'],
            });
            await alert.present();
          },
        });
      } else {
        const alert = await this.alertController.create({
          header: '¡Ha habido un error!',
          message: 'El formato del email no es correcto.',
          buttons: ['Aceptar'],
        });
        await alert.present();
      }
    }
  }
}
