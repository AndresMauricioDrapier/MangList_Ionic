import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Payment } from "../interfaces/payment";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class PaymentService {
    private readonly PAYMENT_URL = "payments";
    constructor(
        private readonly http: HttpClient,
        private readonly router: Router
    ) {}

    paySubscription(payment: Payment): Observable<Payment> {
        return this.http.post<Payment>(`${this.PAYMENT_URL}`, payment);
    }
}
