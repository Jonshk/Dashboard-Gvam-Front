import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemUsersPage } from './system-users.page';

describe('SystemUsersPage', () => {
  let component: SystemUsersPage;
  let fixture: ComponentFixture<SystemUsersPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemUsersPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemUsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
