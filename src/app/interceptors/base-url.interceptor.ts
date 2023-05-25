import { HttpInterceptorFn } from "@angular/common/http";
import { isDevMode } from "@angular/core";
import { environment } from "src/environments/environment";

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  let serverUrl: string;

  const reqClone = req.clone({
    url: `${environment.baseUrl}/${req.url}`,
  });
  return next(reqClone);
};
