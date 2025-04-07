import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StoreService } from '../services/store/store.service';
import { AuthService } from '../services/auth/auth.service';

export const isLoggedGuard: CanActivateFn = (route, state) => {
  const storeService = inject(StoreService);
  if (!inject(AuthService).hasTokens()) {
    storeService.clear();
    inject(Router).navigate(['/login']);
    return false;
  }

  return true;
};

export const isNotLoggedGuard: CanActivateFn = (route, state) =>
  !inject(AuthService).hasTokens();
