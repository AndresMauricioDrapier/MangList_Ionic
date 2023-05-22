import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, of, ReplaySubject } from "rxjs";
import { TokenResponse } from "../interfaces/responses";
import { Auth, AuthLogin } from "../interfaces/auth";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    logged = false;
    loginChange$ = new ReplaySubject<boolean>();

    constructor(
        private readonly http: HttpClient,
        private readonly router: Router
    ) {}

    login(userLogin: AuthLogin): Observable<TokenResponse> {
        const login = this.http.post<TokenResponse>("auth/login", userLogin);

        login.subscribe((data: TokenResponse) => {
            this.logged = true;
            this.loginChange$.next(true);
            this.putToken((data as unknown as TokenResponse).data.token);
            this.putUserID((data as unknown as TokenResponse).data.id);
        });

        return login;
    }

    loginGoogle(userLogin: AuthLogin): Observable<TokenResponse> {
        const login = this.http.post<TokenResponse>("auth/google", userLogin);

        login.subscribe((data: TokenResponse) => {
          this.logged = true;
          this.loginChange$.next(true);
            // this.putToken((data as unknown as TokenResponse).data.token);
            // this.putUserID((data as unknown as TokenResponse).data.id);
        });

        return login;
    }

    register(userInfo: Auth): Observable<void> {
        return this.http.post<void>("auth/register", userInfo);
    }

    validateToken(): Observable<TokenResponse> {
        return this.http.get<TokenResponse>("auth/validate");
    }

    putToken(token?: string): void {
        if (token) localStorage.setItem("auth-token", token);
    }

    putUserID(user_id: string): void {
        if (user_id) localStorage.setItem("user-id", user_id);
    }

    isLogged(): Observable<boolean> {
        if (!this.logged && !localStorage.getItem("auth-token")) {
            this.logged = false;
            this.loginChange$.next(false);
            return of(false);
        } else if (this.logged && localStorage.getItem("auth-token")) {
            this.logged = true;
            this.loginChange$.next(true);
            return of(true);
        } else {
            if (this.validateToken()) {
                this.logged = true;
                this.loginChange$.next(true);
                return of(true);
            } else {
                localStorage.removeItem("auth-token");
                localStorage.removeItem("user-id");
                return of(false);
            }
        }
    }

    logout(): void {
        this.loginChange$.next(false);
        this.logged = false;

        localStorage.removeItem("auth-token");
        localStorage.removeItem("user-id");
        this.router.navigate(["/"]);
    }
}
