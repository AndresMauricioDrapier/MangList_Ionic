import { HttpInterceptorFn } from "@angular/common/http";

export const UserInterceptor: HttpInterceptorFn = (req, next) => {
    const user_id = localStorage.getItem("user-id");
    if (user_id) {
        // Clone the request to add the new header.
        const authReq = req.clone({
            headers: req.headers.set("user-id",user_id),
        });

        // Pass on the cloned request instead of the original request.
        return next(authReq);
    }
    return next(req);
};
