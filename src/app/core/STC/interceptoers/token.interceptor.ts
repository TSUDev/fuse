import { HttpInterceptorFn } from '@angular/common/http';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {

  let token: string = '';

  const authToken = localStorage.getItem('accessToken');

  if (localStorage.getItem('accessToken') && authToken !== null && authToken !== '') {
    token = authToken;
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};

