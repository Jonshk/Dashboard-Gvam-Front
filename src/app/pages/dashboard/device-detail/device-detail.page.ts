import { Component, effect, inject, input } from '@angular/core';
import { DeviceDetail } from '../../../core/models/response/device-detail.model';
import { Response } from '../../../core/models/response/response.model';
import { DeviceService } from '../../../core/services/device/device.service';
import { LoadingService } from '../../../core/services/loading/loading.service';

@Component({
  selector: 'app-device-detail',
  standalone: true,
  imports: [],
  templateUrl: './device-detail.page.html',
  styleUrl: './device-detail.page.scss',
})
export class DeviceDetailPage {
  readonly groupId = input<number>();
  readonly deviceId = input.required<number>();

  private deviceService = inject(DeviceService);
  private loadingService = inject(LoadingService);

  device: DeviceDetail | null = null;

  private getDevice = effect(
    () => {
      this.loadingService.setLoading();
      this.deviceService.find(this.deviceId()).subscribe({
        next: ({ data }: Response<DeviceDetail>) => {
          this.device = data;
          this.loadingService.dismissLoading();
        },
        error: (err: any) => {
          console.error('error:', err);
          this.loadingService.dismissLoading();
        },
      });
    },
    { allowSignalWrites: true },
  );
}
