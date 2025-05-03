import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { isIdNumberGuard } from './is-id-number.guard';

describe('isIdNumberGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isIdNumberGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
