import {
    Directive,
    ElementRef,
    EventEmitter,
    NgZone,
    Output,
} from "@angular/core";
import { LoadGoogleApiService } from "./load-google-api.service";

@Directive({
    selector: "[appGoogleLogin]",
    standalone: true,
})
export class GoogleLoginDirective{
    @Output() loginOk = new EventEmitter<gapi.auth2.GoogleUser>();
    @Output() loginError = new EventEmitter<string>();
    @Output() loadingEnd = new EventEmitter<void>();

    constructor(
        private el: ElementRef,
        private loadService: LoadGoogleApiService,
        private ngZone: NgZone
    ) {}

    ngOnInit(): void {
        this.loadService.getAuthApi().subscribe((auth2) => {
            auth2.attachClickHandler(
                this.el.nativeElement,
                {},
                (user: gapi.auth2.GoogleUser) => {
                    this.ngZone.run(() => this.loginOk.emit(user));
                },
                (error) => this.loginError.emit(error)
            );
            this.loadingEnd.emit();
        });
    }
}
