import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { StoreService } from '../../services/store/store.service';
import { AuthService } from '../../services/auth/auth.service';
import { Response } from '../../models/response/response.model';
import { TokenResponse } from '../../models/response/token-response.model';

let isRefreshing = false;
let refreshTokenSubject = new BehaviorSubject<any>(null);

export const sessionInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const storeService = inject(StoreService);
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== HttpStatusCode.Unauthorized) {
        return throwError(() => err);
      }

      if (req.url.includes('/api/login') || req.url.includes('/api/register')) {
        return throwError(() => err);
      }

      if (req.url.includes('/api/refresh-token') || !authService.hasTokens()) {
        clearStorageAndNavigateToLogin(storeService, router);
        return throwError(() => 'Error al refrescar');
      }

      return handleRefreshToken(req, next, storeService, authService, router);
    }),
  );
};

function clearStorageAndNavigateToLogin(
  storeService: StoreService,
  router: Router,
) {
  storeService.clear();
  router.navigate(['/login']);
}

function handleRefreshToken(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  storeService: StoreService,
  authService: AuthService,
  router: Router,
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const tokens = authService.getTokens()!;
    return authService.refreshToken(tokens.refreshToken).pipe(
      switchMap(({ data }: Response<TokenResponse>) => {
        isRefreshing = false;
        authService.saveTokens(data);
        const authRequest = addAuthHeader(req, data.accessToken);
        refreshTokenSubject.next(data.accessToken);

        return next(authRequest);
      }),
      catchError((err: any) => {
        isRefreshing = false;
        clearStorageAndNavigateToLogin(storeService, router);
        return throwError(() => err);
      }),
    );
  }

  return refreshTokenSubject.pipe(
    filter((token) => token !== null),
    take(1),
    switchMap((token) => next(addAuthHeader(req, token))),
  );
}

function addAuthHeader(req: HttpRequest<unknown>, accessToken: string) {
  return req.clone({
    headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
  });
}
