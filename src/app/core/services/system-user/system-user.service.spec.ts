import { TestBed } from '@angular/core/testing';

import { SystemUserService } from './system-user.service';

describe('SystemUserService', () => {
  let service: SystemUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
