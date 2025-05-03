import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { hasEnterpriseGuard } from './has-enterprise.guard';

describe('hasEnterpriseGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => hasEnterpriseGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
