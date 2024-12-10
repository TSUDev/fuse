import { HttpInterceptorFn } from '@angular/common/http';

export const loggerInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(`[loggerInterceptor] Request is on the way ${req.url}`);
  return next(req);
};
