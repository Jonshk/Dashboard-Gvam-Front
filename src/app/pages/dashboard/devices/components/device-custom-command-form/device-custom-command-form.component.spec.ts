import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceCustomCommandFormComponent } from './device-custom-command-form.component';

describe('DeviceCustomCommandFormComponent', () => {
  let component: DeviceCustomCommandFormComponent;
  let fixture: ComponentFixture<DeviceCustomCommandFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceCustomCommandFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceCustomCommandFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
