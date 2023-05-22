import { HttpInterceptorFn } from "@angular/common/http";

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem("auth-token");
    if (token) {
        // Clone the request to add the new header.
        const authReq = req.clone({
            headers: req.headers.set("auth-token",token),
        });

        // Pass on the cloned request instead of the original request.
        return next(authReq);
    }
    return next(req);
};
