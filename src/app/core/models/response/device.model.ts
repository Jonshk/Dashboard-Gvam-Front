export interface Device {
  deviceName: string;
  policyName: string;
  deviceId: number;
  imei?: string;
  deviceUserId?: number;
  enrolled: boolean;
  geofenceId: number | null;
  remoteControlActive: boolean;
  groupId: number;
}
