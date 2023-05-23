import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormsModule,
  NonNullableFormBuilder,
} from '@angular/forms';
import { Mail } from '../shared/mail/interfaces/mail';
import { MailService } from '../shared/mail/services/mail.service';
import { AlertController, IonicModule } from '@ionic/angular';

@Component({
  selector: 'ml-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  name = '';
  email = '';
  message = '';

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

  validClasses(control: FormControl, validClass: string, errorClass: string) {
    return {
      [validClass]: control.touched && control.valid,
      [errorClass]: control.touched && control.invalid,
    };
  }
}
