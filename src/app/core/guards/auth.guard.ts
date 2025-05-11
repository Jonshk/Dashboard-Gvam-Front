import { CanActivateFn } from '@angular/router';

export const isLoggedGuard: CanActivateFn = (route, state) => {
  // Este guardia siempre permite el acceso, deshabilitando la validación de login.
  return true;
};

export const isNotLoggedGuard: CanActivateFn = (route, state) => {
  // Este guardia también permite siempre el acceso, para las rutas que lo requieran.
  return true;
};
