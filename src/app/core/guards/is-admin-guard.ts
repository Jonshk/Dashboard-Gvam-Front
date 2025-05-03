// src/core/guards/is-admin-guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StoreService } from '../services/store/store.service';
import { Role } from '../enums/role';
import { environment } from '../../../environments/environment';

export const isAdminGuard: CanActivateFn = (route, state) => {
  if (environment.bypassAuthGuards) {
    return true;
  }
  
  const router = inject(Router);
  const storeService = inject(StoreService);
  const role = storeService.get('role') as Role | null;

  if (role === null) {
    storeService.clear();
    router.navigate(['/login']);
    location.reload();
    return false;
  }
  if (role !== Role.ADMIN) {
    router.navigate(['/']);
    return false;
  }
  return true;
};
