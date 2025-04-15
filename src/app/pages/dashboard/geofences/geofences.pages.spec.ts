import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeofencesPages } from './geofences.pages';

describe('GeofencesPages', () => {
  let component: GeofencesPages;
  let fixture: ComponentFixture<GeofencesPages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeofencesPages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeofencesPages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
