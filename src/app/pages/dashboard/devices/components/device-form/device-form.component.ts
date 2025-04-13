import { Component, effect, inject, input, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EnrollDeviceRequest } from '../../../../../core/models/request/enroll-device.model';
import { DeviceUser } from '../../../../../core/models/response/device-user.model';
import { Device } from '../../../../../core/models/response/device.model';
import { EnrollDeviceResponse } from '../../../../../core/models/response/enroll-device-response.model';
import { Group } from '../../../../../core/models/response/group.model';
import { Response } from '../../../../../core/models/response/response.model';
import { DeviceService } from '../../../../../core/services/device/device.service';
import { LoadingService } from '../../../../../core/services/loading/loading.service';

@Component({
  selector: 'app-device-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './device-form.component.html',
  styleUrl: './device-form.component.scss',
})
export class DeviceFormComponent {
  readonly groupId = input.required<number>();
  readonly groups = input.required<Group[]>();
  readonly visible = input.required<boolean>();
  readonly deviceUsers = input.required<DeviceUser[]>();
  readonly editDevice = input<Device | null>(null);

  readonly editedDevice = output<Device>();
  readonly deviceCreated = output<boolean>();

  private deviceService = inject(DeviceService);
  private domSanitizer = inject(DomSanitizer);
  readonly loadingService = inject(LoadingService);

  deviceName: string = '';
  pin: string | null = null;
  registerQr: SafeResourceUrl = '';

  deviceForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    user: new FormControl(-1),
    group: new FormControl(-1),
  });

  private clearView = effect(() => {
    if (this.visible()) {
      this.resetForm();
      this.deviceName = '';
      this.pin = null;
      this.registerQr = '';
    }
  });

  private setDeviceForm = effect(() => {
    this.resetForm();
    if (this.editDevice()) {
      this.deviceName = '';
      this.pin = null;
      this.registerQr = '';
      this.deviceForm.controls.name.setValue(this.editDevice()!.deviceName);
      this.deviceForm.controls.user.setValue(
        this.editDevice()!.deviceUserId ?? -1,
      );
      this.deviceForm.controls.group.setValue(
        this.groupId() ?? this.editDevice()?.groupId,
      );
    }
  });

  private resetForm() {
    this.deviceForm.reset({ name: '', user: -1, group: -1 });
  }

  onSubmit() {
    if (this.deviceForm.invalid) return;

    this.loadingService.setLoading();

    const device: EnrollDeviceRequest = {
      deviceName: this.deviceForm.value.name!,
      deviceUserId:
        this.deviceForm.value.user !== undefined &&
        this.deviceForm.value.user !== null &&
        this.deviceForm.value.user > -1
          ? Number(this.deviceForm.value.user)
          : null,
      groupId: this.groupId()
        ? this.groupId()
        : this.deviceForm.value.group !== undefined &&
            this.deviceForm.value.group !== null &&
            this.deviceForm.value.group > -1
          ? Number(this.deviceForm.value.group)
          : null,
    };

    this.deviceName = device.deviceName;

    if (this.editDevice()) {
      this.editCurrentDevice(device);
      return;
    }

    this.enrollDevice(device);
  }

  private enrollDevice(registerDevice: EnrollDeviceRequest) {
    this.deviceService.enroll(registerDevice).subscribe({
      next: ({ data }: Response<EnrollDeviceResponse>) => {
        this.pin = data.pin;
        this.registerQr = this.domSanitizer.bypassSecurityTrustResourceUrl(
          `data:image/png;base64,${data.qrCode}`,
        );
        this.resetForm();
        this.loadingService.dismissLoading();
        this.deviceCreated.emit(true);
      },
      error: (err: any) => {
        console.error('error:', err);
        this.loadingService.dismissLoading();
      },
    });

    // this.registerQr = this.domSanitizer.bypassSecurityTrustResourceUrl(
    //   'data:image/png;base64,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',
    // );
    // this.pin = '000000';
    // this.resetForm();
    // this.loadingService.dismissLoading();
  }

  private editCurrentDevice(editedDevice: EnrollDeviceRequest) {
    this.deviceService
      .update(this.editDevice()!.deviceId, editedDevice)
      .subscribe({
        next: ({ data }: Response<Device>) => {
          this.editedDevice.emit(data);
          this.loadingService.dismissLoading();
        },
        error: (err: any) => {
          console.error('error:', err);
          this.loadingService.dismissLoading();
        },
      });
  }

  protected createNewDevice() {
    this.resetForm();
    this.pin = null;
    this.deviceName = '';
    this.registerQr = '';
  }
}
