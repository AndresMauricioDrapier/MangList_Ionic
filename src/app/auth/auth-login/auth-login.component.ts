import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
    FormControl,
    FormGroup,
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { GoogleLoginDirective } from "./google-login/google-login.directive";
import { AuthService } from "../services/auth.service";
import { AuthLogin } from "../interfaces/auth";
import Swal from "sweetalert2";
import { UsersService } from "src/app/users/services/users.service";
import { IonicModule } from "@ionic/angular";

@Component({
    selector: "ml-auth-login",
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        GoogleLoginDirective,
        ReactiveFormsModule,
        IonicModule
    ],
    templateUrl: "./auth-login.component.html",
    styleUrls: ["./auth-login.component.scss"],
})
export class AuthLoginComponent implements OnInit {
    userForm!: FormGroup;
    emailControl!: FormControl<string>;
    passwordControl!: FormControl<string>;

    userInfo: AuthLogin = {
        email: "",
        password: "",
        token: "",
        userId: "",
    };

    passRecoveryForm!: FormGroup;
    emailRecoveryControl!: FormControl<string>;
    textRecoveryControl!: FormControl<string>;

    constructor(
        private readonly router: Router,
        private readonly authService: AuthService,
        private readonly userService: UsersService,
        private readonly fb: NonNullableFormBuilder,
    ) {}

    ngOnInit(): void {
        this.emailControl = this.fb.control("", [
            Validators.required,
            Validators.email,
        ]);
        this.passwordControl = this.fb.control("", [
            Validators.required,
            Validators.pattern("^.{4,}$"),
        ]);
        this.userForm = this.fb.group({
            email: this.emailControl,
            password: this.passwordControl,
        });

        this.emailRecoveryControl = this.fb.control("", [
          Validators.required,
          Validators.email,
        ]);
        this.textRecoveryControl = this.fb.control("", [
          Validators.required,
        ]);
        this.passRecoveryForm = this.fb.group({
          emailRecovery: this.emailRecoveryControl,
          textRecovery: this.textRecoveryControl,
        });
    }

    validClasses(
        ngModel: FormControl,
        validClass = "is-valid",
        errorClass = "is-invalid"
    ): object {
        return {
            [validClass]: ngModel.touched && ngModel.valid,
            [errorClass]: ngModel.touched && ngModel.invalid,
        };
    }

    loggedGoogle(user: gapi.auth2.GoogleUser): void {
        this.userInfo.token = user.getAuthResponse().id_token;

        this.authService.loginGoogle(this.userInfo).subscribe({
            next: () => this.router.navigate(["/restaurants"]),
        });
    }


    login(): void {
        this.userInfo.email = this.emailControl.value.toLocaleLowerCase();
        this.userInfo.password = this.userForm.controls["password"].value;
        this.authService.login(this.userInfo).subscribe({
            next: () => {
                this.router.navigate(["/"]);
                Swal.fire({
                  icon: "success",
                  title: "Inicio sesión",
                  text: "Iniciado sesión correctamente",
              });
            },
            error: (error) => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error.error.message,
                });
            },
        });
    }

    mailPasswordRecovery(): void {
        this.userService.passwordRecovery(this.emailRecoveryControl.value).subscribe({
          next: () => {
            Swal.fire({
              icon: "success",
              title: "Correo enviado",
              text: "Se ha enviado un correo para recuperar la contraseña",
            });
          },
          error: (error) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.error.message,
            });
          },
        });
    }

    goRegister(): void {
        this.router.navigate(["auth/register"]);
    }
}
