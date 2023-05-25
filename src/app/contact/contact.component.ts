import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormsModule,
  NonNullableFormBuilder,
} from '@angular/forms';
import { Mail } from '../shared/mail/interfaces/mail';
import { MailService } from '../shared/mail/services/mail.service';
import { AlertController, IonicModule } from '@ionic/angular';
import { CanDeactivateComponent } from '../guards/leavePageGuard.guard';
import { Observable } from 'rxjs';

@Component({
  selector: 'ml-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit, CanDeactivateComponent {
  name = '';
  email = '';
  message = '';

  exit = false;

  newMail: Mail = {
    from: 'info.manglist@gmail.com',
    subject: '',
    to: 'info.manglist@gmail.com',
    message: '',
  };

  constructor(
    private readonly mailServices: MailService,
    private readonly fb: NonNullableFormBuilder,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {}

  sendMail(): void {
    this.exit = true;
    this.newMail.subject = 'MangList: ' + this.name;
    this.newMail.message = 'Contacto: ' + this.email + '\n' + this.message;

    this.mailServices.send(this.newMail).subscribe({
      next: async () => {
        const alert = await this.alertController.create({
          header: '¡Mensaje enviado!',
          message: 'El mensaje ha sido enviado correctamente.',
          buttons: ['Aceptar'],
        });

        await alert.present();
      },
      error: async () => {
        const alert = await this.alertController.create({
          header: '¡Error al enviar el mensaje!',
          message: 'El mensaje no podido enviarse.',
          buttons: ['Aceptar'],
        });

        await alert.present();
      },
    });
  }
  canDeactivate(): Promise<boolean> | Observable<boolean> | boolean {
    if (this.exit) return true;
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
}
