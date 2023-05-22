import { Inject, Injectable, Optional } from "@angular/core";
import { ReplaySubject, fromEvent, Observable } from "rxjs";
import { CLIENT_ID } from "./google-login.config";

@Injectable({
    providedIn: "root",
})
export class LoadGoogleApiService {
    private initialized = false;
    // Similar to EventEmitter and also replays the last emitted value (1)
    private loader$ = new ReplaySubject<gapi.auth2.GoogleAuth>(1);

    constructor(
        @Optional() @Inject(CLIENT_ID) private readonly clientId: string
    ) {
        if (!clientId) {
            throw new Error(
                "LoadGoogleApiService: You must call provideGoogleId in your providers array"
            );
        }
    }

    getAuthApi(): Observable<gapi.auth2.GoogleAuth> {
        if (!this.initialized) {
            // Initialization not started
            this.initialized = true;
            this.loadApi();
        }
        return this.loader$; // Return observable (emits auth API when loaded)
    }

    private loadApi(): void {
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/api:client.js";
        script.setAttribute("async", "");
        script.setAttribute("defer", "");
        document.body.appendChild(script);
        fromEvent(script, "load").subscribe(() => {
            gapi.load("auth2", () => {
                const gauth: gapi.auth2.GoogleAuth = gapi.auth2.init({
                    client_id: this.clientId,
                    cookie_policy: "single_host_origin",
                });
                this.loader$.next(gauth);
                this.loader$.complete();
            });
        });
    }
}
