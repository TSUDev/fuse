import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, switchMap, throwError, tap } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { SweetAlertService } from '../services/sweetAlert.service';
import { Router } from '@angular/router';


export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  const authService = inject(AuthService);
  const sweetAlertService = inject(SweetAlertService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!error) return throwError(() => error);

      switch (error.status) {
        case 400:
          handleBadRequest(error);
          break;

        case 401:
          return handleUnauthorized(req, next);

        case 403:
          authService.signOut();
          router.navigate(['/sign-in']);
          break;

        case 404:
          toastr.error('Not Found', '404');
          break;

        case 500:
          toastr.error('Server error', '500');
          break;

        case 0:
          sweetAlertService.alertConnection({});
          break;

        default:
          toastr.error('Unexpected error', 'Check Connection');
      }

      return throwError(() => error);
    })
  );

  function handleBadRequest(error: HttpErrorResponse): void {
    if (error.error.errors) {
      const errors = Object.values(error.error.errors).flat();
      throw errors;
    } else {
      toastr.error(error.error, '400');
    }
  }

  function handleUnauthorized(req: HttpRequest<any>, next: any): Observable<any> {
    // const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    // const token = user.token;

    if (req!.url!.indexOf('Auth/login') > 0) {
      return throwError(() => req);
    }

    return authService.getNewAccessTokenUsingRefreshToken().pipe(
      tap((newTokens: any) => {
        if (newTokens && newTokens.token && newTokens.refreshToken) {

          localStorage.setItem('accessToken', newTokens.token)
          localStorage.setItem('refreshToken', newTokens.refreshToken)

          const clonedReq = req.clone({
            setHeaders: { Authorization: `Bearer ${newTokens.token}` },
          });

          return next.handle(clonedReq);
        }
        return throwError(() => new HttpErrorResponse({ status: 401 }));
      })
    );
  }
};
