import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MailService } from '../shared/mail/services/mail.service';
import { Mail } from '../shared/mail/interfaces/mail';
import { AlertController, IonicModule } from '@ionic/angular';
import { validateEmail } from '../shared/validators/emailValidator';

@Component({
  selector: 'ml-about-us',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent {
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
