import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeofenceFormComponent } from './geofence-form.component';

describe('GeofenceFormComponent', () => {
  let component: GeofenceFormComponent;
  let fixture: ComponentFixture<GeofenceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeofenceFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeofenceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
