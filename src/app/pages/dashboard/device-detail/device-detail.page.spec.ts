import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceDetailPage } from './device-detail.page';

describe('DeviceDetailPage', () => {
  let component: DeviceDetailPage;
  let fixture: ComponentFixture<DeviceDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceDetailPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
