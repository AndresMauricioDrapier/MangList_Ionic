import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CanDeactivateComponent } from "src/app/guards/leavePageGuard.guard";
import { Router, RouterModule, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import {
    FormControl,
    FormGroup,
    FormsModule,
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { Auth, AuthLogin } from "../interfaces/auth";
import { isTheSame } from "src/app/shared/validators/isTheSame";
import { AuthService } from "../services/auth.service";
import Swal from "sweetalert2";
import { ImageCroppedEvent, ImageCropperModule } from "ngx-image-cropper";
import { Mail } from "src/app/shared/mail/interfaces/mail";
import { MailService } from "src/app/shared/mail/services/mail.service";

@Component({
    selector: "ml-auth-register",
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        ImageCropperModule,
    ],
    templateUrl: "./auth-register.component.html",
    styleUrls: ["./auth-register.component.scss"],
})
export class AuthRegisterComponent implements OnInit, CanDeactivateComponent {
    userForm!: FormGroup;
    nameControl!: FormControl<string>;
    emailControl!: FormControl<string>;
    passwordControl!: FormControl<string>;
    password2Control!: FormControl<string>;
    imageControl!: FormControl<string>;
    exit = false;

    imageChangedEvent: any = "";
    croppedImage: any = "";

    newUser: Auth = {
        name: "",
        email: "",
        avatar: "",
    };

    userInfo: AuthLogin = {
        email: "",
        password: "",
        token: "",
        userId: "",
    };

    newMail: Mail = {
        from: "info.manglist@gmail.com",
        subject: "¡Gracias por registrate!",
        to: "",
        message:
            "Muchas gracias por registrarte en MangList. \n Esperamos que disfrutes de nuestra aplicación ya puedes empezar a ver a otros usuarios",
    };

    constructor(
        private readonly authService: AuthService,
        private readonly router: Router,
        private readonly fb: NonNullableFormBuilder,
        private readonly mailServices: MailService
    ) {}

    ngOnInit(): void {
        this.nameControl = this.fb.control("", [
            Validators.required,
            Validators.pattern("[a-zA-Z ]+"),
        ]);
        this.emailControl = this.fb.control("", [
            Validators.required,
            Validators.email,
        ]);

        this.passwordControl = this.fb.control("", [
            Validators.required,
            Validators.pattern(
                "^(?=.*[!@#$%&/.()=+?\\[\\]~\\-^0-9])[a-zA-Z0-9!@#$%&./()=+?\\[\\]~\\-^]{8,}$"
            ),
        ]);
        this.password2Control = this.fb.control("", [
            Validators.required,
            isTheSame(this.passwordControl),
        ]);
        this.imageControl = this.fb.control("", [Validators.required]);
        this.userForm = this.fb.group({
            name: this.nameControl,
            email: this.emailControl,
            password: this.passwordControl,
            password2: this.password2Control,
            avatar: this.imageControl,
        });
    }

    canDeactivate():
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        if (this.exit || this.userForm.pristine) {
            return true;
        } else {
            return Swal.fire({
                title: "Si sales perderas los datos de registro",
                showDenyButton: true,
                confirmButtonText: "Salir",
                denyButtonText: "Quedarme",
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire("Los cambios no se han guardado", "", "info");
                    return true;
                } else {
                    return false;
                }
            });
        }
    }

    sendMail(): void {
        this.newMail.to = this.newUser.email;

        this.mailServices.send(this.newMail).subscribe({
            error: (e) => {
                console.error("Error al enviar el mail" + e);
            },
        });
    }

    addUser(): void {
        this.newUser.name = this.nameControl.value;
        this.newUser.email = this.emailControl.value.toLocaleLowerCase();
        this.newUser.password = this.passwordControl.value;

        this.authService.register(this.newUser).subscribe({
            next: () => {
                this.sendMail();
                this.exit = true;
                Swal.fire({
                    icon: "success",
                    title: "¡Usuario registrado!",
                    text: "¡Bienvenido " + this.newUser.name + "!",
                });
                this.userInfo.email = this.newUser.email;
                this.userInfo.password = this.newUser.password;
                this.authService.login(this.userInfo).subscribe({
                    next: () => {
                        this.router.navigate(["/"]);
                    },
                    error: (error) => {
                        console.error(error);
                    },
                });
            },
            error: (error) => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "No se ha podido registrar: " + error.error.message,
                });
            },
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

    fileChangeEvent(event: unknown): void {
        this.imageChangedEvent = event;
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
    }

    saveImage() {
        this.newUser.avatar = this.croppedImage;
    }

    closeModal() {
        this.imageChangedEvent = "";
        this.croppedImage = "";
    }

    resetForm() {
        this.userForm.reset();
        this.newUser.avatar = "";
    }
}
