import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
    FormControl,
    FormGroup,
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { MailService } from "../shared/mail/services/mail.service";
import { Mail } from "../shared/mail/interfaces/mail";

@Component({
    selector: "ml-about-us",
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: "./about-us.component.html",
    styleUrls: ["./about-us.component.scss"],
})
export class AboutUsComponent implements OnInit {
    newsletterForm!: FormGroup;
    emailControl!: FormControl<string>;

    newMail: Mail = {
        from: "info.manglist@gmail.com",
        subject: "Subscripción al newsletter",
        to: "",
        message: "¡Gracias por subscribirte a nuestro newsletter!",
    };

    constructor(
        private readonly router: Router,
        private readonly fb: NonNullableFormBuilder,
        private readonly mailService: MailService
    ) {}

    ngOnInit(): void {
        this.emailControl = this.fb.control("", [
            Validators.required,
            Validators.email,
        ]);

        this.newsletterForm = this.fb.group({
            email: this.emailControl,
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

    addToNewsletter(): void {
        this.newMail.to = this.emailControl.value;

        this.mailService.send(this.newMail).subscribe({
            next: () => {
                Swal.fire({
                    icon: "success",
                    title: "¡Subscrito al newsletter!",
                    text: "Recibiras un correo verificando tu subscripción",
                });
            },
            error: () => {
                Swal.fire({
                    icon: "error",
                    title: "Ha habido un error",
                    text: "No has podido subscribirte al newsletter",
                });
            },
        });
    }
}
