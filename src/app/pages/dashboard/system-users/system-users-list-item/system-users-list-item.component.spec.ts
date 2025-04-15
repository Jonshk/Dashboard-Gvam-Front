import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemUsersListItemComponent } from './system-users-list-item.component';

describe('SystemUsersListItemComponent', () => {
  let component: SystemUsersListItemComponent;
  let fixture: ComponentFixture<SystemUsersListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemUsersListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemUsersListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
