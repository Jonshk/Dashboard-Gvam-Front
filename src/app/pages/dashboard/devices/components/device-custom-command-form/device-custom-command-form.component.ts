import { Component, computed, inject, input, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoadingService } from '../../../../../core/services/loading/loading.service';
import {
  DeviceCustomCommand,
  DeviceCustomCommandDescription,
} from '../../../../../core/enums/device-custom-command';
import { DeviceService } from '../../../../../core/services/device/device.service';
import { DeviceCustomCommandRequest } from '../../../../../core/models/request/device-custom-command-request.model';
import { SuccessResponse } from '../../../../../core/models/response/success-response.model';
import { Response } from '../../../../../core/models/response/response.model';
import { Device } from '../../../../../core/models/response/device.model';
import { GeofenceService } from '../../../../../core/services/geofence/geofence.service';
import { Geofence } from '../../../../../core/models/response/geofence.model';

@Component({
  selector: 'app-device-custom-command-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './device-custom-command-form.component.html',
  styleUrl: './device-custom-command-form.component.scss',
})
export class DeviceCustomCommandFormComponent {
  readonly groupId = input.required<number>();
  readonly device = input.required<Device | null>();
  readonly geofences = input.required<Geofence[]>();

  readonly onDeviceChange = output<Device>();

  readonly loadingService = inject(LoadingService);
  private readonly deviceService = inject(DeviceService);
  private readonly geofenceService = inject(GeofenceService);

  groupGeofences = computed(() => {
    if (this.groupId()) return this.geofences();
    return this.geofences().filter((g) => g.groupId === this.device()?.groupId);
  });

  customCommandForm = new FormGroup({
    command: new FormControl(
      DeviceCustomCommand.ADJUST_VOLUME,
      Validators.required,
    ),
    value: new FormControl(0, [Validators.min(0), Validators.required]),
  });

  sendCustomCommandForm() {
    if (this.customCommandForm.invalid) return;

    this.loadingService.setLoading();

    const deviceCustomCommandRequest: DeviceCustomCommandRequest = {
      deviceCustomCommand: this.customCommandForm.value.command!,
      value: this.customCommandForm.value.value!,
    };

    if (
      deviceCustomCommandRequest.deviceCustomCommand ===
        DeviceCustomCommand.DEACTIVATE_GEOFENCE &&
      this.device()!.geofenceId !== null
    ) {
      deviceCustomCommandRequest.value = this.device()!.geofenceId!;
    }

    this.deviceService
      .sendCustomCommand(this.device()!.deviceId, deviceCustomCommandRequest)
      .subscribe({
        next: ({ data }: Response<SuccessResponse>) => {
          if (data.success) {
            console.log('Comando enviado');
            if (
              deviceCustomCommandRequest.deviceCustomCommand ===
              DeviceCustomCommand.ACTIVATE_GEOFENCE
            ) {
              this.onDeviceChange.emit({
                ...this.device()!,
                geofenceId: Number(deviceCustomCommandRequest.value),
              });
            } else if (
              deviceCustomCommandRequest.deviceCustomCommand ===
              DeviceCustomCommand.DEACTIVATE_GEOFENCE
            ) {
              this.onDeviceChange.emit({
                ...this.device()!,
                geofenceId: null,
              });
            } else if (
              deviceCustomCommandRequest.deviceCustomCommand ===
              DeviceCustomCommand.ACTIVATE_REMOTE_CONTROL
            ) {
              this.onDeviceChange.emit({
                ...this.device()!,
                remoteControlActive: true,
              });
            } else if (
              deviceCustomCommandRequest.deviceCustomCommand ===
              DeviceCustomCommand.DEACTIVATE_REMOTE_CONTROL
            ) {
              this.onDeviceChange.emit({
                ...this.device()!,
                remoteControlActive: false,
              });
            }
          }
          this.loadingService.dismissLoading();
        },
        error: (err: any) => {
          console.error('error:', err);
          this.loadingService.dismissLoading();
        },
      });
  }

  getActiveGeofenceName() {
    const activeGeofence = this.groupGeofences().find(
      (g) => g.geofenceId === this.device()?.geofenceId,
    );
    if (activeGeofence) {
      return activeGeofence.geofenceName;
    }

    return '';
  }

  readonly DeviceCustomCommand = DeviceCustomCommand;
  readonly DeviceCustomCommandDescription = DeviceCustomCommandDescription;
  readonly deviceCustomCommandKeys = Object.keys(DeviceCustomCommand) as [
    keyof typeof DeviceCustomCommand,
  ];
}
