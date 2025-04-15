import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

export const jwtHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.includes('/api/enterprises')) {
    return next(req);
  }

  const authRequest = addAuthHeader(req);

  return next(authRequest ?? req);
};

function addAuthHeader(req: HttpRequest<unknown>) {
  const tokens = inject(AuthService).getTokens();

  if (tokens != null) {
    return req.clone({
      headers: req.headers.set('Authorization', `Bearer ${tokens.accessToken}`),
    });
  }

  return null;
}
