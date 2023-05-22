import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
    FormControl,
    FormGroup,
    FormsModule,
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { Mail } from "../shared/mail/interfaces/mail";
import { MailService } from "../shared/mail/services/mail.service";
import Swal from "sweetalert2";

@Component({
    selector: "ml-contact",
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: "./contact.component.html",
    styleUrls: ["./contact.component.scss"],
})
export class ContactComponent implements OnInit {
    contactForm!: FormGroup;
    nameControl!: FormControl<string>;
    emailControl!: FormControl<string>;
    messageControl!: FormControl<string>;

    newMail: Mail = {
        from: "",
        subject: "",
        to: "",
        message: "",
    };

    constructor(
        private readonly mailServices: MailService,
        private readonly fb: NonNullableFormBuilder
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
        this.messageControl = this.fb.control("", [Validators.required]);
        this.contactForm = this.fb.group({
            name: this.nameControl,
            email: this.emailControl,
            message: this.messageControl,
        });
    }

    sendMail(): void {
        this.newMail.from = "info.manglist@gmail.com";
        this.newMail.subject = "MangList: " + this.nameControl.value;
        this.newMail.to = "info.manglist@gmail.com";
        this.newMail.message =
            "Contacto: " +
            this.emailControl.value +
            "\n" +
            this.messageControl.value;

        this.mailServices.send(this.newMail).subscribe({
            next: () => {
                Swal.fire({
                    title: "¡Mensaje enviado!",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                });
            },
            error: () => {
                Swal.fire({
                    title: "¡Error al enviar el mensaje!",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                });
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
