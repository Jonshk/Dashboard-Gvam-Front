import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemUsersFormComponent } from './system-users-form.component';

describe('SystemUsersFormComponent', () => {
  let component: SystemUsersFormComponent;
  let fixture: ComponentFixture<SystemUsersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemUsersFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemUsersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
