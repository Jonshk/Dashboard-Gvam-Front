import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicySelectionFormComponent } from './policy-selection-form.component';

describe('PolicySelectionFormComponent', () => {
  let component: PolicySelectionFormComponent;
  let fixture: ComponentFixture<PolicySelectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicySelectionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicySelectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
