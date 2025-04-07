import {
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { Device } from '../../../../../core/models/response/device.model';
import { Policy } from '../../../../../core/models/response/policy.model';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DeviceService } from '../../../../../core/services/device/device.service';
import { SuccessResponse } from '../../../../../core/models/response/success-response.model';
import { Response } from '../../../../../core/models/response/response.model';
import { ApplyDevicePolicyRequest } from '../../../../../core/models/request/apply-device-policy-request.model';
import { LoadingService } from '../../../../../core/services/loading/loading.service';
import {
  DeviceCommand,
  DeviceCommandDescription,
} from '../../../../../core/enums/device-command';
import { DeviceCommandRequest } from '../../../../../core/models/request/device-command-request.model';
import { RouterModule } from '@angular/router';
import { Group } from '../../../../../core/models/response/group.model';
import { MigrateDeviceRequest } from '../../../../../core/models/request/migrate-device-request';
import { DeviceUser } from '../../../../../core/models/response/device-user.model';
import CobrowseAPI from 'cobrowse-agent-sdk';
import { CobrowseToken } from '../../../../../core/models/response/cobrowse-token.model';
import { ErrorService } from '../../../../../core/services/error/error.service';
import { FeathericonComponent } from '../../../../../shared/component/feathericon/feathericon.component';

@Component({
  selector: '[app-device-list-item]',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, FeathericonComponent],
  templateUrl: './device-list-item.component.html',
  styleUrl: './device-list-item.component.scss',
})
export class DeviceListItemComponent {
  readonly groupId = input.required<number>();
  readonly device = model.required<SelectableDevice>();
  readonly policies = input.required<Policy[]>();
  readonly groups = input.required<Group[]>();
  readonly deviceUser = input<DeviceUser | undefined>(undefined);

  readonly onEditDevice = output<Device>();
  readonly onDeleteDevice = output<DeleteDevice>();
  readonly onConfigDevice = output<Device>();

  private deviceService = inject(DeviceService);
  readonly loadingService = inject(LoadingService);
  private errorService = inject(ErrorService);

  groupPolicies = computed(() => {
    if (this.groupId()) return this.policies();
    return this.policies().filter((p) =>
      p.groupIds?.some((g) => g === this.device().groupId),
    );
  });

  applyPolicyForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  readonly DeviceCommand = DeviceCommand;
  readonly DeviceCommandDescription = DeviceCommandDescription;
  readonly deviceCommandKeys = Object.keys(DeviceCommand) as [
    keyof typeof DeviceCommand,
  ];

  sendCommandForm = new FormGroup({
    command: new FormControl(DeviceCommand.LOCK, [Validators.required]),
  });

  migrateForm = new FormGroup({
    groupId: new FormControl(-1, [Validators.required]),
  });

  private setDefaultPolicy = effect(() => {
    this.applyPolicyForm.controls.name.setValue(this.device().policyName);
  });

  private setCurrentGroup = effect(() => {
    const groupId = this.groupId() ?? this.device().groupId;
    this.migrateForm.controls.groupId.setValue(groupId);
  });

  getGroupName(groupId: number): string {
    return (
      this.groups().find((g) => g.groupId === groupId)?.groupName ??
      groupId.toString()
    );
  }

  editDevice() {
    this.onEditDevice.emit(this.device());
  }

  configDevice() {
    this.onConfigDevice.emit(this.device());
  }

  deleteDevice(confirm: boolean = true) {
    const deleteDevice: DeleteDevice = {
      device: this.device(),
      confirm: confirm,
    };

    this.onDeleteDevice.emit(deleteDevice);
  }

  applyPolicy() {
    if (this.applyPolicyForm.invalid) return;

    this.loadingService.setLoading();

    const devicePolicyRequest: ApplyDevicePolicyRequest = {
      policyName: this.applyPolicyForm.value.name!,
    };

    const groupId = this.groupId() ?? this.device().groupId;
    this.deviceService
      .applyPolicy(groupId, this.device().deviceId, devicePolicyRequest)
      .subscribe({
        next: ({ data }: Response<SuccessResponse>) => {
          if (data.success) {
            console.log('Política actualizada');
            this.device().policyName = devicePolicyRequest.policyName;
          }
          this.loadingService.dismissLoading();
        },
        error: (err: any) => {
          console.error('error:', err);
          this.loadingService.dismissLoading();
        },
      });
  }

  sendCommand() {
    if (this.sendCommandForm.invalid) return;

    this.loadingService.setLoading();

    const deviceCommandRequest: DeviceCommandRequest = {
      deviceCommand: this.sendCommandForm.value.command!,
    };

    this.deviceService
      .sendCommand(this.device().deviceId, deviceCommandRequest)
      .subscribe({
        next: ({ data }: Response<SuccessResponse>) => {
          if (data.success) {
            console.log('Comando enviado');
          }
          this.loadingService.dismissLoading();
        },
        error: (err: any) => {
          console.error('error:', err);
          this.loadingService.dismissLoading();
        },
      });
  }

  migrate() {
    if (this.migrateForm.invalid) return;

    const groupId = this.groupId() ?? this.device().groupId;
    if (groupId === this.migrateForm.value.groupId) return;

    this.loadingService.setLoading();

    const migrateDeviceRequest: MigrateDeviceRequest = {
      groupId: this.migrateForm.value.groupId!,
    };

    this.deviceService
      .migrate(this.device().deviceId, migrateDeviceRequest)
      .subscribe({
        next: ({ data }: Response<SuccessResponse>) => {
          if (data.success) {
            console.log('Dispositivo migrado');
            if (this.groupId()) {
              this.deleteDevice(false);
            } else {
              this.device.update((d) => {
                d.groupId = migrateDeviceRequest.groupId;
                return d;
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

  toggleSelected(event: Event) {
    const checkbox = event.currentTarget as HTMLInputElement;

    this.device.update((device) => {
      return {
        ...device,
        selected: checkbox.checked,
      };
    });
  }

  async connect() {
    this.loadingService.setLoading();
    this.deviceService.getCowbroseToken(this.device().deviceId).subscribe({
      next: async ({ data }: Response<CobrowseToken>) => {
        try {
          const cobrowse = new CobrowseAPI();
          cobrowse.token = data.token;
          const devices = await cobrowse.devices.list();
          const device = devices.find(
            (d) => d.custom_data['device_id'] === this.device().deviceId,
          );

          if (device) {
            window.open(
              `${cobrowse.api}/connect/device/${device.id}?token=${cobrowse.token}&end_action=none`,
            );
          }
        } catch (error) {
          this.errorService.setError(
            'Ha ocurrido un error al conectarse con Cobrowse, inténtelo de nuevo más tarde.',
          );
        } finally {
          this.loadingService.dismissLoading();
        }
      },
      error: (err: any) => {
        console.error('error:', err);
        this.loadingService.dismissLoading();
      },
    });
  }
}

export interface DeleteDevice {
  device: Device;
  confirm: boolean;
}

export interface SelectableDevice extends Device {
  selected?: boolean;
}
