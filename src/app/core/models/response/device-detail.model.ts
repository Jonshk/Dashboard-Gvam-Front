export interface DeviceDetail {
  deviceName: string;
  deviceManufacturer?: string;
  deviceModel?: string;
  pin: string;
  androidVersion: string;
  batteryLevel?: string;
  installedApps?: string[];
  policyName?: string;
  serialNumber: string;
  imei: string;
  mac: string;
  location?: string;
}
