import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeofenceListItemComponent } from './geofence-list-item.component';

describe('GeofenceListItemComponent', () => {
  let component: GeofenceListItemComponent;
  let fixture: ComponentFixture<GeofenceListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeofenceListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeofenceListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
