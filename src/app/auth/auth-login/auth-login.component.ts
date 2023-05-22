import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthLogin } from '../interfaces/auth';
import { AlertController, IonicModule } from '@ionic/angular';

@Component({
  selector: 'ml-auth-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, IonicModule],
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss'],
})
export class AuthLoginComponent implements OnInit {
  userForm!: FormGroup;
  emailControl!: FormControl<string>;
  passwordControl!: FormControl<string>;

  userInfo: AuthLogin = {
    email: '',
    password: '',
    token: '',
    userId: '',
  };

  passRecoveryForm!: FormGroup;
  emailRecoveryControl!: FormControl<string>;
  textRecoveryControl!: FormControl<string>;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    // private readonly userService: UsersService,
    private readonly fb: NonNullableFormBuilder,
    private alertCtrl: AlertController
  ) {}

  ngOnInit(): void {
    this.emailControl = this.fb.control('', [
      Validators.required,
      Validators.email,
    ]);
    this.passwordControl = this.fb.control('', [
      Validators.required,
      Validators.pattern('^.{4,}$'),
    ]);
    this.userForm = this.fb.group({
      email: this.emailControl,
      password: this.passwordControl,
    });

    this.emailRecoveryControl = this.fb.control('', [
      Validators.required,
      Validators.email,
    ]);
    this.textRecoveryControl = this.fb.control('', [Validators.required]);
    this.passRecoveryForm = this.fb.group({
      emailRecovery: this.emailRecoveryControl,
      textRecovery: this.textRecoveryControl,
    });
  }

  validClasses(
    ngModel: FormControl,
    validClass = 'is-valid',
    errorClass = 'is-invalid'
  ): object {
    return {
      [validClass]: ngModel.touched && ngModel.valid,
      [errorClass]: ngModel.touched && ngModel.invalid,
    };
  }

  login(): void {
    this.userInfo.email = this.emailControl.value.toLocaleLowerCase();
    this.userInfo.password = this.userForm.controls['password'].value;
    this.authService.login(this.userInfo).subscribe({
      next: async () => {
        this.router.navigate(['/']);
        await this.alertCtrl.create({
          animated: true,
          header: 'Success',
          message: 'Iniciado sesión correctamente',
          buttons: ['Ok'],
        });
      },
      error: async (error) => {
        await this.alertCtrl.create({
          header: 'Login error',
          message: error,
          buttons: ['Ok'],
        });
      },
    });
  }

  // mailPasswordRecovery(): void {
  //     this.userService.passwordRecovery(this.emailRecoveryControl.value).subscribe({
  //       next: () => {
  //         Swal.fire({
  //           icon: "success",
  //           title: "Correo enviado",
  //           text: "Se ha enviado un correo para recuperar la contraseña",
  //         });
  //       },
  //       error: (error) => {
  //         Swal.fire({
  //           icon: "error",
  //           title: "Oops...",
  //           text: error.error.message,
  //         });
  //       },
  //     });
  // }

  goRegister(): void {
    this.router.navigate(['auth/register']);
  }
}
