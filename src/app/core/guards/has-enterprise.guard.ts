import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { EnterpriseService } from '../services/enterprise/enterprise.service';
import { StoreService } from '../services/store/store.service';

export const hasEnterpriseGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const storeService = inject(StoreService);
  const enterpriseId = inject(EnterpriseService).getEnterpriseId();

  if (enterpriseId === null) {
    storeService.clear();
    router.navigate(['/login']);
    return false;
  }

  if (state.url === '/enterprises' && enterpriseId !== false) {
    router.navigate(['/groups']);
    return false;
  }

  if (state.url !== '/enterprises' && enterpriseId === false) {
    router.navigate(['/enterprises']);
    return false;
  }

  return true;
};
