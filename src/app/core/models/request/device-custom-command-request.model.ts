import { DeviceCustomCommand } from '../../enums/device-custom-command';

export interface DeviceCustomCommandRequest {
  deviceCustomCommand: DeviceCustomCommand;
  value: number;
}
