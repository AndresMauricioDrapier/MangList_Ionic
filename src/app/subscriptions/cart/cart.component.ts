import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from '../interfaces/subscription';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Payment } from '../interfaces/payment';
import { Mail } from 'src/app/shared/mail/interfaces/mail';
import { MailService } from 'src/app/shared/mail/services/mail.service';
import { Auth } from 'src/app/auth/interfaces/auth';
import { UsersService } from 'src/app/users/services/users.service';
import { enviarPDFyCorreo } from '../../shared/downloadPDF';
import { PaymentService } from '../services/payment.service';
import { AlertController, IonicModule } from '@ionic/angular';
import { PdfMakeService } from 'src/app/shared/pdf/pdf-make.service';

@Component({
  selector: 'ml-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, IonicModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  subscription!: Subscription | undefined;
  id!: string;
  exclusiveVAT!: number;
  vat!: number;

  paymentForm!: FormGroup;
  nameControl!: FormControl<string>;
  cardControl!: FormControl<string>;
  expirationControl!: FormControl<string>;
  cvvControl!: FormControl<string>;
  exit = false;

  user!: Auth;
  userId: string = localStorage.getItem('user-id') || '';

  subscriptions: Subscription[] = [
    {
      id: 1,
      type: 'Basico',
      content: {
        acces: 'limitado',
        activeUsers: 1,
      },
      price: 9.99,
      icon: 'assets/Iconos/cart/icono_Basic.png',
    },
    {
      id: 2,
      type: 'Estandard',
      content: {
        acces: 'limitado',
        activeUsers: 2,
      },
      price: 14.99,
      icon: 'assets/Iconos/cart/icono_Standart.png',
    },
    {
      id: 3,
      type: 'Premium',
      content: {
        acces: 'ilimitado',
        activeUsers: 4,
      },
      price: 19.99,
      icon: 'assets/Iconos/cart/icono_Premium.png',
    },
  ];

  newPayment: Payment = {
    id: 0,
    userId: '0',
    mailUser: '',
    type: '',
    method: 'Visa',
    amount: 0,
    date: '',
    name: '',
  };

  newMail: Mail = {
    from: 'info.manglist@gmail.com',
    subject: '¡Gracias por tu subscripción!',
    to: '',
    message:
      'Muchas gracias por haber confiado en MangList, no te decepcionaremos.',
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: NonNullableFormBuilder,
    private readonly mailServices: MailService,
    private readonly userService: UsersService,
    private readonly paymentService: PaymentService,
    private alertController: AlertController,
    private pdfService: PdfMakeService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => (this.id = params['id']));

    this.subscription = this.subscriptions.find(
      (s) => s.id.toString() === this.id
    );

    this.userService.getUser(this.userId).subscribe((u) => (this.user = u));

    this.vat = +(this.subscription!.price * 0.21).toFixed(2);
    this.exclusiveVAT = +(this.subscription!.price - this.vat).toFixed(2);

    this.nameControl = this.fb.control('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]+'),
    ]);
    this.cardControl = this.fb.control('', [
      Validators.required,
      Validators.pattern('^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$'),
    ]);
    this.expirationControl = this.fb.control('', [
      Validators.required,
      Validators.pattern('/^(0[1-9]|1[0-2])?([0-9]{4}|[0-9]{2})$/'),
    ]);
    this.cvvControl = this.fb.control('', [
      Validators.required,
      Validators.pattern('^[0-9]{3, 4}$'),
    ]);
    this.paymentForm = this.fb.group({
      name: this.nameControl,
      card: this.cardControl,
      expiration: this.expirationControl,
      cvv: this.cvvControl,
    });
  }

  sendMail(): void {
    this.newMail.to = this.user.email;

    this.mailServices.send(this.newMail).subscribe({
      error: (e) => {
        console.error('Error al enviar el mail' + e);
      },
    });
  }

  alertButtons = [
    {
      text: 'Cancelar',
      role: false,
    },
    {
      text: 'Aceptar',
      role: true,
    },
  ];

  onPurchase(paymentEvent: any): void {
    this.newPayment.userId = this.user._id?.toString() || '';
    this.newPayment.mailUser = this.user.email;
    this.newPayment.type = this.subscription!.type;
    this.newPayment.amount = this.subscription!.price;
    this.newPayment.date = new Date().toLocaleDateString();
    this.newPayment.name = this.user.name;

    this.paymentService.paySubscription(this.newPayment).subscribe({
      next: async () => {
        if (paymentEvent.detail.role) {
          const alert = await this.alertController.create({
            header: '¡Gracias por la compra!',
            message: 'Te has subscrito correctamente',
            buttons: ['Aceptar'],
          });
          await alert.present();
        } else {
          const alert = await this.alertController.create({
            header: '¡Gracias por la compra!',
            message: 'Te has subscrito correctamente',
            buttons: ['Aceptar'],
          });
          await alert.present();
          this.pdfService.generatePdf(this.newPayment, this.subscription);
          this.router.navigate(['/']);
        }
      },
      error: async (e) => {
        const alert = await this.alertController.create({
          header: '¡Error de compra!',
          message: 'No se ha podido realizar la compra',
          buttons: ['Aceptar'],
        });
        await alert.present();
      },
    });
  }
}
