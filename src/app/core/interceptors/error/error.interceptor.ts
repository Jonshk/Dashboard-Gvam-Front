import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpStatusCode,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Response } from '../../models/response/response.model';
import { inject } from '@angular/core';
import { ErrorService } from '../../services/error/error.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const apiError = err.error as Response<null>;
      if (isApiError(apiError)) {
        errorService.setError(apiError.message);
        return throwError(() => err);
      }

      if (err.status !== HttpStatusCode.Unauthorized) {
        errorService.setError('Ha ocurrido un error');
      }

      return throwError(() => err);
    }),
  );
};

function isApiError(apiError: Response<null>): apiError is Response<null> {
  if (!apiError) {
    return false;
  }

  if (apiError.code && apiError.message && apiError.data === null) {
    return true;
  }

  return false;
}
