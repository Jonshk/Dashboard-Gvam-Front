import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupListItemComponent } from './group-list-item.component';

describe('GroupListItemComponent', () => {
  let component: GroupListItemComponent;
  let fixture: ComponentFixture<GroupListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
