import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Mail } from '../shared/mail/interfaces/mail';
import { MailService } from '../shared/mail/services/mail.service';
import { AlertController, IonicModule } from '@ionic/angular';

@Component({
  selector: 'ml-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  nameControl!: FormControl<string>;
  emailControl!: FormControl<string>;
  messageControl!: FormControl<string>;

  newMail: Mail = {
    from: '',
    subject: '',
    to: '',
    message: '',
  };

  constructor(
    private readonly mailServices: MailService,
    private readonly fb: NonNullableFormBuilder,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.nameControl = this.fb.control('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]+'),
    ]);
    this.emailControl = this.fb.control('', [
      Validators.required,
      Validators.email,
    ]);
    this.messageControl = this.fb.control('', [Validators.required]);
    this.contactForm = this.fb.group({
      name: this.nameControl,
      email: this.emailControl,
      message: this.messageControl,
    });
  }

  sendMail(): void {
    this.newMail.from = 'info.manglist@gmail.com';
    this.newMail.subject = 'MangList: ' + this.nameControl.value;
    this.newMail.to = 'info.manglist@gmail.com';
    this.newMail.message =
      'Contacto: ' + this.emailControl.value + '\n' + this.messageControl.value;

    this.mailServices.send(this.newMail).subscribe({
      next: async () => {
        const alert = await this.alertController.create({
          header: 'Success',
          subHeader: '¡Mensaje enviado!',
          message: 'El mensaje ha sido enviado correctamente.',
          buttons: ['Aceptar'],
        });

        await alert.present();
      },
      error: async () => {
        const alert = await this.alertController.create({
          header: 'Error',
          subHeader: '¡Error al enviar el mensaje!',
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
