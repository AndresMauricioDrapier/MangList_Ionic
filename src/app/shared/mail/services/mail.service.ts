import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Mail } from "../interfaces/mail";

@Injectable({
    providedIn: "root",
})
export class MailService {
    constructor(
        private readonly http: HttpClient,
    ) {}

    send(mail: Mail): Observable<void> {
        return this.http.post<void>("mail", mail);
    }
}
