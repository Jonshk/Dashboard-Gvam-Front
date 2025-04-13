import { CanActivateFn } from '@angular/router';

export const hasEnterpriseGuard: CanActivateFn = (route, state) => {
  // Se desactiva la comprobación de "enterprise" en esta aplicación de inventario
  return true;
};
