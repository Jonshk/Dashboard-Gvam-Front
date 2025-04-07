import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { EnterpriseService } from '../services/enterprise/enterprise.service';
import { StoreService } from '../services/store/store.service';
import { Role } from '../enums/role';

export const isAdminGuard: CanActivateFn = (route, state) => {
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
